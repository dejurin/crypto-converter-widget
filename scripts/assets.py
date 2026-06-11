#!/usr/bin/env python3
"""
Generate the public CDN asset manifest for Crypto Converter Widget.

The public contract is intentionally legacy-compatible:

- output path: public/assets.json
- JSON shape: [{ "SYMBOL": "...", "ASSET_TYPE": "..." }]
- external users still configure symbols such as BTC, ETH, USD, EUR

CoinLore is used as the canonical expanded crypto source. Existing
public/assets.json is used as the legacy compatibility layer for:

- known BLOCKCHAIN/TOKEN classifications
- fiat currencies
- commodities
- crypto symbols that are not present in CoinLore anymore
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
OUTPUT_FILE = Path("public/assets.json")
MIN_COINLORE_RAW_ASSETS = 10_000
MIN_FINAL_ASSETS = 10_000
TOP_CRYPTO_BEFORE_LEGACY_QUOTES = 15
REQUEST_TIMEOUT = 20
MAX_RETRIES = 3
RETRY_DELAY = 5
VALID_ASSET_TYPES = {"BLOCKCHAIN", "TOKEN", "FIAT", "COMMODITY"}


def normalize_symbol(value: Any) -> str:
    return str(value or "").strip().upper()


def normalize_asset_type(value: Any, fallback: str = "TOKEN") -> str:
    value = str(value or "").strip().upper()
    return value if value in VALID_ASSET_TYPES else fallback


def rank_value(value: Any) -> int:
    try:
        rank = int(value)
    except (TypeError, ValueError):
        return sys.maxsize
    return rank if rank >= 0 else sys.maxsize


def fetch_json(url: str) -> Any:
    last_error: Exception | None = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            request = Request(
                url,
                headers={"User-Agent": "crypto-converter-widget-assets/1.0"},
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
        return []

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


def normalize_coinlore_assets(
    items: list[dict[str, Any]],
    type_by_symbol: dict[str, str],
) -> list[dict[str, Any]]:
    by_symbol: dict[str, dict[str, Any]] = {}

    for item in items:
        symbol = normalize_symbol(item.get("symbol") or item.get("SYMBOL"))
        if not symbol:
            continue

        asset = {
            "SYMBOL": symbol,
            "ASSET_TYPE": type_by_symbol.get(symbol, "TOKEN"),
            "RANK": rank_value(item.get("rank") or item.get("RANK")),
        }
        current = by_symbol.get(symbol)

        if current is None or (asset["RANK"], symbol) < (
            current["RANK"],
            current["SYMBOL"],
        ):
            by_symbol[symbol] = asset

    return sorted(
        by_symbol.values(),
        key=lambda asset: (asset["RANK"], asset["SYMBOL"]),
    )


def to_public_shape(assets: list[dict[str, Any]]) -> list[dict[str, str]]:
    return [
        {
            "SYMBOL": asset["SYMBOL"],
            "ASSET_TYPE": normalize_asset_type(asset["ASSET_TYPE"]),
        }
        for asset in assets
    ]


def merge_assets(
    coinlore_assets: list[dict[str, Any]],
    legacy_assets: list[dict[str, str]],
) -> list[dict[str, str]]:
    coinlore_public = to_public_shape(coinlore_assets)
    legacy_quote_symbols = {
        asset["SYMBOL"]
        for asset in legacy_assets
        if asset["ASSET_TYPE"] in {"FIAT", "COMMODITY"}
    }
    coinlore_symbols = {asset["SYMBOL"] for asset in coinlore_public}
    legacy_only = [
        asset for asset in legacy_assets if asset["SYMBOL"] not in coinlore_symbols
    ]

    legacy_quotes = [
        asset
        for asset in legacy_assets
        if asset["ASSET_TYPE"] in {"FIAT", "COMMODITY"}
    ]
    legacy_fallback_crypto = [
        asset
        for asset in legacy_only
        if asset["ASSET_TYPE"] not in {"FIAT", "COMMODITY"}
    ]
    coinlore_without_legacy_quotes = [
        asset for asset in coinlore_public if asset["SYMBOL"] not in legacy_quote_symbols
    ]

    return [
        *coinlore_without_legacy_quotes[:TOP_CRYPTO_BEFORE_LEGACY_QUOTES],
        *legacy_quotes,
        *coinlore_without_legacy_quotes[TOP_CRYPTO_BEFORE_LEGACY_QUOTES:],
        *legacy_fallback_crypto,
    ]


def validate_assets(assets: list[dict[str, str]]) -> None:
    errors: list[str] = []
    symbols = [asset["SYMBOL"] for asset in assets]
    counts = Counter(asset["ASSET_TYPE"] for asset in assets)

    if len(assets) < MIN_FINAL_ASSETS:
        errors.append(f"Expected at least {MIN_FINAL_ASSETS} assets, got {len(assets)}")

    duplicate_symbols = len(symbols) - len(set(symbols))
    if duplicate_symbols:
        errors.append(f"Found {duplicate_symbols} duplicate symbols")

    for symbol in ["BTC", "ETH", "USD", "EUR", "UAH", "XAU", "XAG", "XPD", "XPT"]:
        if symbol not in symbols:
            errors.append(f"Missing required symbol {symbol}")

    if counts["FIAT"] < 100:
        errors.append(f"Expected at least 100 FIAT assets, got {counts['FIAT']}")

    if counts["COMMODITY"] < 4:
        errors.append(
            f"Expected at least 4 COMMODITY assets, got {counts['COMMODITY']}"
        )

    if errors:
        raise ValueError("; ".join(errors))


def save_assets(path: Path, assets: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(assets, file, separators=(",", ":"), ensure_ascii=False)


def main() -> int:
    print("[Start] Fetching CoinLore asset list...")
    legacy_assets = load_legacy_assets(OUTPUT_FILE)
    type_by_symbol = {
        asset["SYMBOL"]: asset["ASSET_TYPE"] for asset in legacy_assets
    }

    payload = fetch_json(COINLORE_ASSETS_URL)
    coinlore_items = get_coinlore_items(payload)
    if len(coinlore_items) < MIN_COINLORE_RAW_ASSETS:
        raise ValueError(
            f"CoinLore asset count is too low: {len(coinlore_items)} "
            f"(expected at least {MIN_COINLORE_RAW_ASSETS})"
        )

    coinlore_assets = normalize_coinlore_assets(coinlore_items, type_by_symbol)
    final_assets = merge_assets(coinlore_assets, legacy_assets)
    validate_assets(final_assets)
    save_assets(OUTPUT_FILE, final_assets)

    counts = Counter(asset["ASSET_TYPE"] for asset in final_assets)
    print(
        "[Done] Saved "
        f"{len(final_assets)} assets to {OUTPUT_FILE} "
        f"(CoinLore raw: {len(coinlore_items)}, "
        f"CoinLore unique: {len(coinlore_assets)}, "
        f"types: {dict(counts)})"
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"[Error] {error}", file=sys.stderr)
        raise SystemExit(1)
