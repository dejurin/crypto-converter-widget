#!/usr/bin/env python3
"""
Generate public asset counters for Shields dynamic JSON badges.

Input:
- public/assets.json

Output:
- public/assets-stats.json
"""

from __future__ import annotations

import json
from collections import Counter
from datetime import UTC, datetime
from pathlib import Path
from typing import Any


ASSETS_FILE = Path("public/assets.json")
OUTPUT_FILE = Path("public/assets-stats.json")
VALID_ASSET_TYPES = {"BLOCKCHAIN", "TOKEN", "FIAT", "COMMODITY"}


def normalize_asset_type(value: Any) -> str:
    return str(value or "").strip().upper()


def load_assets(path: Path) -> list[dict[str, Any]]:
    with path.open("r", encoding="utf-8") as file:
        payload = json.load(file)

    if not isinstance(payload, list):
        raise ValueError(f"{path} must contain a JSON array")

    assets = [item for item in payload if isinstance(item, dict)]
    if len(assets) != len(payload):
        raise ValueError(f"{path} contains non-object entries")

    return assets


def build_stats(assets: list[dict[str, Any]]) -> dict[str, int | str]:
    counts = Counter(normalize_asset_type(asset.get("ASSET_TYPE")) for asset in assets)
    invalid_types = sorted(asset_type for asset_type in counts if asset_type not in VALID_ASSET_TYPES)

    if invalid_types:
        raise ValueError(f"Unsupported ASSET_TYPE values: {', '.join(invalid_types)}")

    tokens = counts["TOKEN"]
    blockchains = counts["BLOCKCHAIN"]

    return {
        "total": len(assets),
        "crypto": tokens + blockchains,
        "fiat": counts["FIAT"],
        "commodities": counts["COMMODITY"],
        "tokens": tokens,
        "blockchains": blockchains,
        "updatedAt": datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
    }


def save_stats(path: Path, stats: dict[str, int | str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(stats, file, separators=(",", ":"), ensure_ascii=False)


def main() -> int:
    assets = load_assets(ASSETS_FILE)
    stats = build_stats(assets)
    save_stats(OUTPUT_FILE, stats)

    print(
        "[Done] Wrote "
        f"{OUTPUT_FILE}: total={stats['total']}, crypto={stats['crypto']}, "
        f"fiat={stats['fiat']}, commodities={stats['commodities']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
