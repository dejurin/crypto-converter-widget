#!/usr/bin/env python3
"""
Generate the v3 public CDN asset manifest for Crypto Converter Widget.

The v3 manifest keeps the legacy symbol-based fields while adding CoinLore
metadata required by the runtime to price crypto assets by provider ID.

- output path: public/assets_v3.json
- legacy-compatible fields: SYMBOL, ASSET_TYPE
- v3 crypto metadata: ID, NAME, NAMEID, RANK, SOURCE
- fiat and commodity entries are preserved from public/assets.json
"""

from __future__ import annotations

import json
import sys
import time
from collections import Counter
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


COINLORE_ASSETS_URL = "https://api.coinlore.net/api/assets/"
LEGACY_FILE = Path("public/assets.json")
OUTPUT_FILE = Path("public/assets_v3.json")
MIN_COINLORE_RAW_ASSETS = 10_000
MIN_FINAL_ASSETS = 10_000
TOP_CRYPTO_BEFORE_LEGACY_QUOTES = 15
REQUEST_TIMEOUT = 20
MAX_RETRIES = 3
RETRY_DELAY = 5
VALID_ASSET_TYPES = {"BLOCKCHAIN", "TOKEN", "FIAT", "COMMODITY"}
QUOTE_ASSET_TYPES = {"FIAT", "COMMODITY"}
PSEUDO_RATE_SYMBOLS = {"DOLARBLUE", "UAHBM", "NGNBM"}
REQUIRED_SYMBOLS = {"BTC", "ETH", "USD", "EUR", "UAH", "XAU", "XAG", "XPD", "XPT"}
REQUIRED_COINLORE_IDS = {"BTC", "ETH"}


def normalize_symbol(value: Any) -> str:
    return str(value or "").strip().upper()


def normalize_asset_type(value: Any, fallback: str = "TOKEN") -> str:
    value = str(value or "").strip().upper()
    return value if value in VALID_ASSET_TYPES else fallback


def int_or_none(value: Any) -> int | None:
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return None
    return parsed if parsed >= 0 else None


def rank_value(value: Any) -> int:
    rank = int_or_none(value)
    return rank if rank is not None else sys.maxsize


def fetch_json(url: str) -> Any:
    last_error: Exception | None = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            request = Request(
                url,
                headers={"User-Agent": "crypto-converter-widget-assets-v3/1.0"},
            )
            with urlopen(request, timeout=REQUEST_TIMEOUT) as response:
                status = response.getcode()
                if status >= 400:
                    raise RuntimeError(f"HTTP {status}")
                return json.load(response)
        except (HTTPError, URLError, TimeoutError, RuntimeError) as error:
            last_error = error
            print(
                f"[Warning] Attempt {attempt}/{MAX_RETRIES} failed for {url}: {error}",
                file=sys.stderr,
            )
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)

    raise RuntimeError(f"Failed to fetch {url}") from last_error


def get_coinlore_items(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]

    if isinstance(payload, dict) and isinstance(payload.get("data"), list):
        return [item for item in payload["data"] if isinstance(item, dict)]

    return []


def load_legacy_assets(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        raise FileNotFoundError(f"{path} is required to preserve legacy quote assets")

    with path.open("r", encoding="utf-8") as file:
        payload = json.load(file)

    if not isinstance(payload, list):
        raise ValueError(f"{path} must contain a JSON array")

    legacy_assets: list[dict[str, str]] = []
    seen_symbols: set[str] = set()

    for item in payload:
        if not isinstance(item, dict):
            continue

        symbol = normalize_symbol(item.get("SYMBOL"))
        if not symbol or symbol in seen_symbols:
            continue

        legacy_assets.append(
            {
                "SYMBOL": symbol,
                "ASSET_TYPE": normalize_asset_type(item.get("ASSET_TYPE")),
            }
        )
        seen_symbols.add(symbol)

    return legacy_assets


def clean_text(value: Any) -> str:
    return str(value or "").strip()


def build_coinlore_asset(
    item: dict[str, Any],
    legacy_crypto_type_by_symbol: dict[str, str],
) -> dict[str, Any] | None:
    symbol = normalize_symbol(item.get("symbol") or item.get("SYMBOL"))
    if not symbol:
        return None

    coinlore_id = clean_text(item.get("id") or item.get("ID"))
    rank = int_or_none(item.get("rank") or item.get("RANK"))
    name = clean_text(item.get("name") or item.get("NAME"))
    nameid = clean_text(item.get("nameid") or item.get("NAMEID"))

    asset: dict[str, Any] = {
        "SYMBOL": symbol,
        "ASSET_TYPE": legacy_crypto_type_by_symbol.get(symbol, "TOKEN"),
        "SOURCE": "coinlore",
    }

    if coinlore_id:
        asset["ID"] = coinlore_id
    if name:
        asset["NAME"] = name
    if nameid:
        asset["NAMEID"] = nameid
    if rank is not None:
        asset["RANK"] = rank

    return asset


def normalize_coinlore_assets(
    items: list[dict[str, Any]],
    legacy_assets: list[dict[str, str]],
) -> list[dict[str, Any]]:
    legacy_crypto_type_by_symbol = {
        asset["SYMBOL"]: asset["ASSET_TYPE"]
        for asset in legacy_assets
        if asset["ASSET_TYPE"] not in QUOTE_ASSET_TYPES
    }
    legacy_quote_symbols = {
        asset["SYMBOL"]
        for asset in legacy_assets
        if asset["ASSET_TYPE"] in QUOTE_ASSET_TYPES
    }
    by_symbol: dict[str, dict[str, Any]] = {}

    for item in items:
        asset = build_coinlore_asset(item, legacy_crypto_type_by_symbol)
        if asset is None:
            continue

        symbol = asset["SYMBOL"]
        if symbol in legacy_quote_symbols:
            continue

        current = by_symbol.get(symbol)
        if current is None or asset_sort_key(asset) < asset_sort_key(current):
            by_symbol[symbol] = asset

    return sorted(by_symbol.values(), key=asset_sort_key)


def asset_sort_key(asset: dict[str, Any]) -> tuple[int, int, str]:
    coinlore_id = int_or_none(asset.get("ID"))
    return (
        rank_value(asset.get("RANK")),
        coinlore_id if coinlore_id is not None else sys.maxsize,
        asset["SYMBOL"],
    )


def to_legacy_v3_asset(asset: dict[str, str]) -> dict[str, str]:
    return {
        "SYMBOL": asset["SYMBOL"],
        "ASSET_TYPE": asset["ASSET_TYPE"],
        "SOURCE": "legacy",
    }


def merge_assets(
    coinlore_assets: list[dict[str, Any]],
    legacy_assets: list[dict[str, str]],
) -> list[dict[str, Any]]:
    coinlore_symbols = {asset["SYMBOL"] for asset in coinlore_assets}
    legacy_quotes = [
        to_legacy_v3_asset(asset)
        for asset in legacy_assets
        if asset["ASSET_TYPE"] in QUOTE_ASSET_TYPES
    ]
    legacy_fallback = [
        to_legacy_v3_asset(asset)
        for asset in legacy_assets
        if asset["ASSET_TYPE"] not in QUOTE_ASSET_TYPES
        and asset["SYMBOL"] not in coinlore_symbols
    ]

    return [
        *coinlore_assets[:TOP_CRYPTO_BEFORE_LEGACY_QUOTES],
        *legacy_quotes,
        *coinlore_assets[TOP_CRYPTO_BEFORE_LEGACY_QUOTES:],
        *legacy_fallback,
    ]


def validate_assets(
    assets: list[dict[str, Any]],
    legacy_assets: list[dict[str, str]],
) -> None:
    errors: list[str] = []
    symbols = [asset["SYMBOL"] for asset in assets]
    counts = Counter(asset["ASSET_TYPE"] for asset in assets)
    by_symbol = {asset["SYMBOL"]: asset for asset in assets}

    if len(assets) < MIN_FINAL_ASSETS:
        errors.append(f"Expected at least {MIN_FINAL_ASSETS} assets, got {len(assets)}")

    duplicate_symbols = len(symbols) - len(set(symbols))
    if duplicate_symbols:
        errors.append(f"Found {duplicate_symbols} duplicate symbols")

    for symbol in sorted(REQUIRED_SYMBOLS):
        if symbol not in by_symbol:
            errors.append(f"Missing required symbol {symbol}")

    for symbol in sorted(REQUIRED_COINLORE_IDS):
        if not by_symbol.get(symbol, {}).get("ID"):
            errors.append(f"Missing CoinLore ID for {symbol}")

    for symbol in sorted(PSEUDO_RATE_SYMBOLS):
        if symbol in by_symbol:
            errors.append(f"Pseudo-rate symbol must not be present: {symbol}")

    legacy_quote_by_symbol = {
        asset["SYMBOL"]: asset["ASSET_TYPE"]
        for asset in legacy_assets
        if asset["ASSET_TYPE"] in QUOTE_ASSET_TYPES
    }
    for symbol, asset_type in legacy_quote_by_symbol.items():
        if by_symbol.get(symbol, {}).get("ASSET_TYPE") != asset_type:
            errors.append(f"Legacy quote asset was not preserved: {symbol}")

    if counts["FIAT"] < 100:
        errors.append(f"Expected at least 100 FIAT assets, got {counts['FIAT']}")

    if counts["COMMODITY"] < 4:
        errors.append(
            f"Expected at least 4 COMMODITY assets, got {counts['COMMODITY']}"
        )

    if errors:
        raise ValueError("; ".join(errors))


def save_assets(path: Path, assets: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(assets, file, separators=(",", ":"), ensure_ascii=False)


def main() -> int:
    print("[Start] Loading legacy assets...")
    legacy_assets = load_legacy_assets(LEGACY_FILE)
    print(f"[Info] Loaded {len(legacy_assets)} legacy assets from {LEGACY_FILE}")

    print("[Start] Fetching CoinLore asset list...")
    payload = fetch_json(COINLORE_ASSETS_URL)
    coinlore_items = get_coinlore_items(payload)

    if len(coinlore_items) < MIN_COINLORE_RAW_ASSETS:
        raise RuntimeError(
            f"CoinLore returned {len(coinlore_items)} raw assets, "
            f"expected at least {MIN_COINLORE_RAW_ASSETS}"
        )

    print(f"[Info] CoinLore raw assets: {len(coinlore_items)}")

    coinlore_assets = normalize_coinlore_assets(coinlore_items, legacy_assets)
    merged_assets = merge_assets(coinlore_assets, legacy_assets)
    validate_assets(merged_assets, legacy_assets)
    save_assets(OUTPUT_FILE, merged_assets)

    counts = Counter(asset["ASSET_TYPE"] for asset in merged_assets)
    btc_id = next(asset["ID"] for asset in merged_assets if asset["SYMBOL"] == "BTC")
    eth_id = next(asset["ID"] for asset in merged_assets if asset["SYMBOL"] == "ETH")

    print(f"[Done] Wrote {len(merged_assets)} assets to {OUTPUT_FILE}")
    print(f"[Done] Asset types: {dict(sorted(counts.items()))}")
    print(f"[Done] BTC.ID={btc_id}; ETH.ID={eth_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
