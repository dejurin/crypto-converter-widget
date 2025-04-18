#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import math
import requests
import sys
from pathlib import Path

API_URL = "https://data-api.coindesk.com/asset/v1/summary/list?asset_lookup_priority=SYMBOL"
PAGE_SIZE = 1000
OUTPUT_DIR = Path("../list")

def fetch_assets(url):
    """Fetch JSON data and return list of assets."""
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    return resp.json().get("Data", {}).get("LIST", [])

def make_nav_links(page_num, total_pages):
    """Generate markdown navigation links appropriate to page location."""
    links = []
    # previous link
    if page_num > 1:
        if page_num == 2:
            prev_target = "../list.md"
        else:
            prev_target = f"./list{page_num-1}.md"
        links.append(f"[← Prev]({prev_target})")
    # next link
    if page_num < total_pages:
        if page_num == 1:
            next_target = "./list/list2.md"
        else:
            next_target = f"./list{page_num+1}.md"
        links.append(f"[Next →]({next_target})")
    return " | ".join(links)

def get_img_md(symbol, page_num):
    prefix = "./" if page_num == 1 else "../"

    img_path = f"{prefix}assets/{symbol}.png"

    if Path("../" if page_num == 1 else "./" + img_path).exists():
        return f'<img src="{img_path}" width="32" height="32">'
    return ""

def write_page(assets_slice, page_num, total_pages):
    """Write one markdown page with a 32×32 logo table and pagination."""
    # determine output path
    if page_num == 1:
        path = Path("../list.md")
    else:
        path = OUTPUT_DIR / f"list{page_num}.md"

    # ensure output directory exists for nested pages
    if page_num == 2:
        OUTPUT_DIR.mkdir(exist_ok=True)

    header = "| Logo | ID | Symbol | Name |\n|:----:|:--:|:------:|:-----|\n"
    nav = make_nav_links(page_num, total_pages)

    with path.open("w", encoding="utf-8") as f:
        # top navigation
        if nav:
            f.write(f"# Cryptocurrency list \#{page_num}\n")
            f.write("\n")
            f.write(nav + "\n\n")

        # table header
        f.write(header)
        for asset in assets_slice:
            logo = asset.get("LOGO_URL", "")

            sym = asset.get("SYMBOL", "")
            img_md = get_img_md(sym, page_num)

            
            f.write(f"| {img_md} | {asset.get('ID', '')} | {asset.get('SYMBOL', '')} | {asset.get('NAME', '')} |\n")

        # bottom navigation
        if nav:
            f.write("\n---\n\n" + nav + "\n")

    print(f"Created {path}")

def main():
    try:
        assets = fetch_assets(API_URL)
        if not assets:
            print("Assets list is empty", file=sys.stderr)
            sys.exit(1)

        total = len(assets)
        pages = math.ceil(total / PAGE_SIZE)

        for i in range(pages):
            start = i * PAGE_SIZE
            end = start + PAGE_SIZE
            write_page(assets[start:end], i+1, pages)

    except requests.RequestException as e:
        print(f"HTTP error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
