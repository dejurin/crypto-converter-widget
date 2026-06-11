#!/usr/bin/env python3
"""
Download missing CoinLore icons referenced by generated markdown list pages.

This is intentionally separate from public/assets.json. The JSON manifest is a
compatibility contract for external consumers; icons are repository CDN assets.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


COINLORE_ASSETS_URL = "https://api.coinlore.net/api/assets/"
COINLORE_INFO_URL = "https://api.coinlore.net/api/coin/info/"
COINLORE_ICON_BASE_URL = "https://c2.coinlore.com/img/50x50"
ASSETS_DIR = Path("assets")
REQUEST_TIMEOUT = 20
MAX_ICON_BYTES = 2 * 1024 * 1024
DEFAULT_DELAY = 0.0
DEFAULT_WORKERS = 8
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


def get_coinlore_items(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]

    if isinstance(payload, dict) and isinstance(payload.get("data"), list):
        return [item for item in payload["data"] if isinstance(item, dict)]

    return []


def load_asset_logo_urls() -> dict[str, str]:
    payload = request_json(COINLORE_ASSETS_URL)
    logo_urls: dict[str, str] = {}

    for item in get_coinlore_items(payload):
        coin_id = str(item.get("id") or "").strip()
        nameid = str(item.get("nameid") or "").strip()

        if coin_id and nameid:
            logo_urls[coin_id] = f"{COINLORE_ICON_BASE_URL}/{nameid}.png"

    return logo_urls


def is_safe_symbol(symbol: str) -> bool:
    return bool(symbol) and "/" not in symbol and "\\" not in symbol and "\0" not in symbol


def symbol_from_asset_path(path: str) -> str | None:
    asset_path = Path(path)

    if asset_path.parent != ASSETS_DIR or asset_path.suffix.lower() != ".png":
        return None

    return asset_path.stem


def git_added_asset_symbols(ref: str) -> set[str]:
    output = subprocess.check_output(
        [
            "git",
            "show",
            "--name-only",
            "--pretty=format:",
            "--diff-filter=A",
            ref,
            "--",
            str(ASSETS_DIR),
        ],
        text=True,
    )
    return {
        symbol
        for line in output.splitlines()
        if (symbol := symbol_from_asset_path(line.strip()))
    }


def git_untracked_asset_symbols() -> set[str]:
    output = subprocess.check_output(
        ["git", "ls-files", "-z", "-o", "--exclude-standard", str(ASSETS_DIR)]
    )
    return {
        symbol
        for item in output.split(b"\0")
        if item and (symbol := symbol_from_asset_path(item.decode()))
    }


def iter_missing_icons(
    paths: list[Path],
    refresh_symbols: set[str] | None,
) -> list[tuple[str, str]]:
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

            should_refresh = refresh_symbols is not None and symbol in refresh_symbols
            should_download_missing = refresh_symbols is None and "<img " not in logo

            if (
                not (should_refresh or should_download_missing)
                or symbol in seen
                or not coin_id.isdigit()
            ):
                continue

            if not is_safe_symbol(symbol):
                print(f"[Skip] Unsafe symbol for filename: {symbol}", file=sys.stderr)
                continue

            target = ASSETS_DIR / f"{symbol}.png"
            if should_refresh or not target.exists():
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
    workers: int,
    force: bool,
) -> tuple[int, int]:
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    selected = missing[:limit]
    logo_urls = load_asset_logo_urls()

    def download_one(index: int, coin_id: str, symbol: str) -> tuple[bool, str]:
        target = ASSETS_DIR / f"{symbol}.png"

        if target.exists() and not force:
            return True, f"[Exists] {symbol} -> {target}"

        try:
            logo_url = logo_urls.get(coin_id) or get_logo_url(coin_id)
            if not logo_url:
                return False, f"[Skip] {symbol} ({coin_id}) has no CoinLore logo"

            payload, content_type = request_bytes(logo_url)
            if content_type != "image/png":
                return (
                    False,
                    f"[Skip] {symbol} ({coin_id}) logo is {content_type or 'unknown'}",
                )

            target.write_bytes(payload)
            return True, f"[Done] {index}/{len(selected)} {symbol} -> {target}"
        except (HTTPError, URLError, TimeoutError, ValueError, OSError) as error:
            return False, f"[Skip] {symbol} ({coin_id}): {error}"

    downloaded = 0
    skipped = 0

    with ThreadPoolExecutor(max_workers=max(1, workers)) as executor:
        futures = [
            executor.submit(download_one, index, coin_id, symbol)
            for index, (coin_id, symbol) in enumerate(selected, start=1)
        ]

        for completed, future in enumerate(as_completed(futures), start=1):
            ok, message = future.result()
            if ok:
                downloaded += 1
            else:
                skipped += 1
                print(message, file=sys.stderr)

            if ok and (downloaded <= 10 or downloaded % 100 == 0):
                print(message)

            if completed % 250 == 0:
                print(
                    f"[Progress] {completed}/{len(selected)} processed "
                    f"({downloaded} downloaded, {skipped} skipped)"
                )

            if delay > 0 and completed < len(selected):
                time.sleep(delay)

    return downloaded, skipped


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--page", action="append", default=[])
    parser.add_argument("--delay", type=float, default=DEFAULT_DELAY)
    parser.add_argument("--limit", type=int)
    parser.add_argument("--workers", type=int, default=DEFAULT_WORKERS)
    parser.add_argument("--refresh-added-by-ref", action="append", default=[])
    parser.add_argument("--refresh-untracked", action="store_true")
    args = parser.parse_args()

    pages = list_pages(args.page)
    refresh_symbols: set[str] | None = None

    if args.refresh_added_by_ref or args.refresh_untracked:
        refresh_symbols = set()
        for ref in args.refresh_added_by_ref:
            refresh_symbols.update(git_added_asset_symbols(ref))
        if args.refresh_untracked:
            refresh_symbols.update(git_untracked_asset_symbols())

        print(f"[Start] Refreshing {len(refresh_symbols)} selected asset icon(s)")

    missing = iter_missing_icons(pages, refresh_symbols)

    print(f"[Start] Found {len(missing)} missing icons across {len(pages)} page(s)")
    downloaded, skipped = download_missing_icons(
        missing,
        args.delay,
        args.limit,
        args.workers,
        refresh_symbols is not None,
    )
    print(f"[Done] Downloaded {downloaded}, skipped {skipped}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
