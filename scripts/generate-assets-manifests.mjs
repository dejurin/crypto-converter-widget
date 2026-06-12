#!/usr/bin/env node
import { gzipSync } from "node:zlib";
import fs from "node:fs";
import path from "node:path";

const COMPACT_FORMAT = "ccw-assets-compact-v1";
const SCHEMA_VERSION = 3;
const RUNTIME_LIMIT = 1000;

function parseArgs(argv) {
  const args = {
    coinlore: "",
    legacy: "public/assets.json",
    out: "public",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];

    if (arg === "--coinlore" && value) {
      args.coinlore = value;
      index += 1;
    } else if (arg === "--legacy" && value) {
      args.legacy = value;
      index += 1;
    } else if (arg === "--out" && value) {
      args.out = value;
      index += 1;
    }
  }

  if (!args.coinlore) {
    throw new Error("Missing required --coinlore path.");
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizeSymbol(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function toRank(value) {
  const rank = Number(value);
  return Number.isFinite(rank) ? rank : undefined;
}

function getRankSortValue(asset) {
  return asset.rank ?? Number.MAX_SAFE_INTEGER;
}

function getCoinLoreRows(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    if (Array.isArray(payload.data)) {
      return payload.data;
    }
    if (Array.isArray(payload.assets)) {
      return payload.assets;
    }
  }

  return [];
}

function pickFirst(value, ...alternatives) {
  for (const candidate of [value, ...alternatives]) {
    if (candidate !== undefined) {
      return candidate;
    }
  }

  return undefined;
}

function normalizeCoinLoreRows(payload) {
  const bySymbol = new Map();

  for (const item of getCoinLoreRows(payload)) {
    const symbol = normalizeSymbol(pickFirst(item.symbol, item.SYMBOL));
    const rawId = pickFirst(item.id, item.ID);
    const rawName = pickFirst(item.name, item.NAME);
    const rawNameId = pickFirst(item.nameid, item.NAMEID);
    const rawRank = pickFirst(item.rank, item.RANK);

    const id = rawId === undefined ? "" : String(rawId);
    if (!symbol || !id) continue;

    const asset = {
      id,
      symbol,
      name: typeof rawName === "string" ? rawName : undefined,
      nameid: typeof rawNameId === "string" ? rawNameId : undefined,
      rank: toRank(rawRank),
    };
    const current = bySymbol.get(symbol);

    if (!current || getRankSortValue(asset) < getRankSortValue(current)) {
      bySymbol.set(symbol, asset);
    }
  }

  return [...bySymbol.values()].sort(
    (left, right) =>
      getRankSortValue(left) - getRankSortValue(right) ||
      left.symbol.localeCompare(right.symbol),
  );
}

function getLegacyGroups(legacyAssets, coinLoreSymbols) {
  const cryptoTypeBySymbol = new Map();
  const moneyByKey = new Map();
  const fallbackCryptoBySymbol = new Map();

  for (const item of legacyAssets) {
    const symbol = normalizeSymbol(item.SYMBOL);
    const assetType = item.ASSET_TYPE;
    if (!symbol || typeof assetType !== "string") continue;

    if (assetType === "FIAT" || assetType === "COMMODITY") {
      moneyByKey.set(`${assetType}:${symbol}`, [symbol, assetType]);
      continue;
    }

    cryptoTypeBySymbol.set(symbol, assetType);
    if (!coinLoreSymbols.has(symbol) && !fallbackCryptoBySymbol.has(symbol)) {
      fallbackCryptoBySymbol.set(symbol, [symbol, assetType]);
    }
  }

  return {
    cryptoTypeBySymbol,
    fallbackCrypto: [...fallbackCryptoBySymbol.values()],
    money: [...moneyByKey.values()],
  };
}

function toCryptoTuple(asset, legacyType) {
  const tuple = [asset.symbol, asset.id, asset.name, asset.rank];
  const hasNameId = Boolean(asset.nameid);
  const hasLegacyType = legacyType && legacyType !== "TOKEN";

  if (hasNameId || hasLegacyType) {
    tuple.push(asset.nameid ?? "");
  }

  if (hasLegacyType) {
    tuple.push(legacyType);
  }

  return tuple;
}

function createManifest({ crypto, money, fallbackCrypto }) {
  return {
    schemaVersion: SCHEMA_VERSION,
    format: COMPACT_FORMAT,
    crypto,
    money,
    ...(fallbackCrypto.length > 0 ? { legacyCrypto: fallbackCrypto } : {}),
  };
}

function writeJson(filePath, data) {
  const json = `${JSON.stringify(data)}\n`;
  fs.writeFileSync(filePath, json);

  return {
    file: filePath,
    raw: Buffer.byteLength(json),
    gzip: gzipSync(json).byteLength,
  };
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const coinLoreAssets = normalizeCoinLoreRows(readJson(args.coinlore));
  if (coinLoreAssets.length === 0) {
    throw new Error(
      "No coin assets parsed from --coinlore source. Expected at least one valid symbol/id row.",
    );
  }

  const coinLoreSymbols = new Set(coinLoreAssets.map((asset) => asset.symbol));
  const legacyGroups = getLegacyGroups(readJson(args.legacy), coinLoreSymbols);

  const crypto = coinLoreAssets.map((asset) =>
    toCryptoTuple(asset, legacyGroups.cryptoTypeBySymbol.get(asset.symbol)),
  );
  const outDir = path.resolve(args.out);
  fs.mkdirSync(outDir, { recursive: true });

  const runtimeStats = writeJson(
    path.join(outDir, "assets_runtime_V3.json"),
    createManifest({
      crypto: crypto.slice(0, RUNTIME_LIMIT),
      money: legacyGroups.money,
      fallbackCrypto: [],
    }),
  );
  const catalogStats = writeJson(
    path.join(outDir, "assets_catalog_V3.json"),
    createManifest({
      crypto,
      money: legacyGroups.money,
      fallbackCrypto: legacyGroups.fallbackCrypto,
    }),
  );

  console.log(
    [
      `CoinLore unique crypto: ${crypto.length}`,
      `Money assets: ${legacyGroups.money.length}`,
      `Legacy crypto fallback: ${legacyGroups.fallbackCrypto.length}`,
      `${path.basename(runtimeStats.file)}: ${formatKb(runtimeStats.raw)} raw, ${formatKb(runtimeStats.gzip)} gzip`,
      `${path.basename(catalogStats.file)}: ${formatKb(catalogStats.raw)} raw, ${formatKb(catalogStats.gzip)} gzip`,
    ].join("\n"),
  );
}

main();
