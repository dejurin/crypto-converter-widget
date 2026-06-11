#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate the markdown cryptocurrency list from CoinLore.

This script is separate from public/assets.json. It produces human-readable
list.md/list/listN.md pages for the repository README links.
"""

from __future__ import annotations

import json
import math
import sys
import time
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


COINLORE_ASSETS_URL = "https://api.coinlore.net/api/assets/"
PAGE_SIZE = 1000
OUTPUT_DIR = Path("list")
MIN_COINLORE_RAW_ASSETS = 10_000
MIN_COINLORE_UNIQUE_ASSETS = 10_000
REQUEST_TIMEOUT = 20
MAX_RETRIES = 3
RETRY_DELAY = 5


def normalize_symbol(value: Any) -> str:
    return str(value or "").strip().upper()


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


def normalize_assets(items: list[dict[str, Any]]) -> list[dict[str, str]]:
    by_symbol: dict[str, dict[str, Any]] = {}

    for item in items:
        symbol = normalize_symbol(item.get("symbol"))
        if not symbol:
            continue

        asset = {
            "ID": str(item.get("id") or ""),
            "SYMBOL": symbol,
            "NAME": str(item.get("name") or ""),
            "RANK": rank_value(item.get("rank")),
        }
        current = by_symbol.get(symbol)

        if current is None or (asset["RANK"], symbol) < (
            current["RANK"],
            current["SYMBOL"],
        ):
            by_symbol[symbol] = asset

    normalized = sorted(
        by_symbol.values(),
        key=lambda asset: (asset["RANK"], asset["SYMBOL"]),
    )
    return [
        {
            "ID": asset["ID"],
            "SYMBOL": asset["SYMBOL"],
            "NAME": asset["NAME"],
        }
        for asset in normalized
    ]


def make_nav_links(page_num: int, total_pages: int) -> str:
    links = []

    if page_num > 1:
        prev_target = "../list.md" if page_num == 2 else f"./list{page_num - 1}.md"
        links.append(f"[← Prev]({prev_target})")

    if page_num < total_pages:
        next_target = "./list/list2.md" if page_num == 1 else f"./list{page_num + 1}.md"
        links.append(f"[Next →]({next_target})")

    return " | ".join(links)


def escape_cell(value: str) -> str:
    return value.replace("|", "\\|")


def get_img_md(symbol: str, page_num: int) -> str:
    prefix = "./" if page_num == 1 else "../"
    img_path = f"{prefix}assets/{symbol}.png"
    local_path = Path("assets") / f"{symbol}.png"

    if local_path.exists():
        return f'<img src="{img_path}" width="32" height="32">'

    return ""


def write_page(
    assets_slice: list[dict[str, str]],
    page_num: int,
    total_pages: int,
) -> None:
    path = Path("list.md") if page_num == 1 else OUTPUT_DIR / f"list{page_num}.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    nav = make_nav_links(page_num, total_pages)

    with path.open("w", encoding="utf-8") as file:
        if nav:
            file.write(f"# Cryptocurrency list \\#{page_num}\n\n")
            file.write(nav + "\n\n")

        file.write("| Logo | ID | Symbol | Name |\n|:----:|:--:|:------:|:-----|\n")

        for asset in assets_slice:
            symbol = asset["SYMBOL"]
            file.write(
                f"| {get_img_md(symbol, page_num)} | {escape_cell(asset['ID'])} | "
                f"{escape_cell(symbol)} | {escape_cell(asset['NAME'])} |\n"
            )

        if nav:
            file.write("\n---\n\n" + nav + "\n")

    print(f"Created {path}")


def remove_stale_pages(total_pages: int) -> None:
    if not OUTPUT_DIR.exists():
        return

    for path in OUTPUT_DIR.glob("list*.md"):
        stem = path.stem.removeprefix("list")
        if not stem.isdigit():
            continue

        page_num = int(stem)
        if page_num > total_pages:
            path.unlink()
            print(f"Removed stale {path}")


def main() -> int:
    payload = fetch_json(COINLORE_ASSETS_URL)
    items = get_coinlore_items(payload)
    if len(items) < MIN_COINLORE_RAW_ASSETS:
        raise ValueError(
            f"CoinLore asset count is too low: {len(items)} "
            f"(expected at least {MIN_COINLORE_RAW_ASSETS})"
        )

    assets = normalize_assets(items)

    if len(assets) < MIN_COINLORE_UNIQUE_ASSETS:
        raise ValueError(
            f"CoinLore unique asset count is too low: {len(assets)} "
            f"(expected at least {MIN_COINLORE_UNIQUE_ASSETS})"
        )

    pages = math.ceil(len(assets) / PAGE_SIZE)

    for index in range(pages):
        start = index * PAGE_SIZE
        end = start + PAGE_SIZE
        write_page(assets[start:end], index + 1, pages)

    remove_stale_pages(pages)

    print(f"Saved {len(assets)} assets across {pages} markdown pages")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"[Error] {error}", file=sys.stderr)
        raise SystemExit(1)
