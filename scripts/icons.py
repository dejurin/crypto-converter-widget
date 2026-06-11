#!/usr/bin/env python3
"""
Download missing CoinLore icons referenced by generated markdown list pages.

This is intentionally separate from public/assets.json. The JSON manifest is a
compatibility contract for external consumers; icons are repository CDN assets.
"""

from __future__ import annotations

import argparse
import re
import sys
import time
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json


COINLORE_INFO_URL = "https://api.coinlore.net/api/coin/info/"
ASSETS_DIR = Path("assets")
REQUEST_TIMEOUT = 20
MAX_ICON_BYTES = 2 * 1024 * 1024
DEFAULT_DELAY = 1.0
USER_AGENT = "crypto-converter-widget-icons/1.0"
ROW_RE = re.compile(
    r"^\|\s*(?P<logo>.*?)\s*\|\s*(?P<id>[^|]+?)\s*\|\s*(?P<symbol>[^|]+?)\s*\|"
)


def request_json(url: str) -> Any:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=REQUEST_TIMEOUT) as response:
        return json.load(response)


def request_bytes(url: str) -> tuple[bytes, str]:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=REQUEST_TIMEOUT) as response:
        content_type = response.headers.get("content-type", "").split(";")[0].lower()
        payload = response.read(MAX_ICON_BYTES + 1)

    if len(payload) > MAX_ICON_BYTES:
        raise ValueError("icon payload is too large")

    return payload, content_type


def get_logo_url(coin_id: str) -> str | None:
    url = f"{COINLORE_INFO_URL}?{urlencode({'id': coin_id})}"
    payload = request_json(url)

    if not isinstance(payload, list) or not payload or not isinstance(payload[0], dict):
        return None

    logo = payload[0].get("logo")
    return str(logo) if logo else None


def is_safe_symbol(symbol: str) -> bool:
    return bool(symbol) and "/" not in symbol and "\\" not in symbol and "\0" not in symbol


def iter_missing_icons(paths: list[Path]) -> list[tuple[str, str]]:
    missing: list[tuple[str, str]] = []
    seen: set[str] = set()

    for path in paths:
        for line in path.read_text(encoding="utf-8").splitlines():
            match = ROW_RE.match(line)
            if not match:
                continue

            logo = match.group("logo").strip()
            coin_id = match.group("id").strip()
            symbol = match.group("symbol").strip()

            if "<img " in logo or symbol in seen or not coin_id.isdigit():
                continue

            if not is_safe_symbol(symbol):
                print(f"[Skip] Unsafe symbol for filename: {symbol}", file=sys.stderr)
                continue

            target = ASSETS_DIR / f"{symbol}.png"
            if not target.exists():
                missing.append((coin_id, symbol))
                seen.add(symbol)

    return missing


def list_pages(page_args: list[str]) -> list[Path]:
    if page_args:
        return [Path(page) for page in page_args]

    pages = [Path("list.md")]
    pages.extend(
        sorted(
            Path("list").glob("list*.md"),
            key=lambda path: int(path.stem.removeprefix("list")),
        )
    )
    return [page for page in pages if page.exists()]


def download_missing_icons(
    missing: list[tuple[str, str]],
    delay: float,
    limit: int | None,
) -> tuple[int, int]:
    downloaded = 0
    skipped = 0
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)

    for index, (coin_id, symbol) in enumerate(missing[:limit], start=1):
        target = ASSETS_DIR / f"{symbol}.png"

        try:
            logo_url = get_logo_url(coin_id)
            if not logo_url:
                print(f"[Skip] {symbol} ({coin_id}) has no CoinLore logo")
                skipped += 1
                continue

            payload, content_type = request_bytes(logo_url)
            if content_type != "image/png":
                print(
                    f"[Skip] {symbol} ({coin_id}) logo is {content_type or 'unknown'}",
                    file=sys.stderr,
                )
                skipped += 1
                continue

            target.write_bytes(payload)
            downloaded += 1
            print(f"[Done] {index}/{len(missing[:limit])} {symbol} -> {target}")
        except (HTTPError, URLError, TimeoutError, ValueError, OSError) as error:
            skipped += 1
            print(f"[Skip] {symbol} ({coin_id}): {error}", file=sys.stderr)

        if delay > 0 and index < len(missing[:limit]):
            time.sleep(delay)

    return downloaded, skipped


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--page", action="append", default=[])
    parser.add_argument("--delay", type=float, default=DEFAULT_DELAY)
    parser.add_argument("--limit", type=int)
    args = parser.parse_args()

    pages = list_pages(args.page)
    missing = iter_missing_icons(pages)

    print(f"[Start] Found {len(missing)} missing icons across {len(pages)} page(s)")
    downloaded, skipped = download_missing_icons(missing, args.delay, args.limit)
    print(f"[Done] Downloaded {downloaded}, skipped {skipped}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
