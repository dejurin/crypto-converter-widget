#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import math
import requests
import sys
from pathlib import Path

API_URL = "https://data-api.coindesk.com/asset/v1/summary/list?asset_lookup_priority=SYMBOL"
PAGE_SIZE = 1000

def fetch_assets(url):
    """Fetch JSON data and return list of assets."""
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    return resp.json().get("Data", {}).get("LIST", [])

def write_page(assets_slice, page_num, total_pages):
    """Write one markdown page with table and pagination."""
    # determine filename: first page → list.md, далее list2.md, list3.md...
    name = f"../list{page_num if page_num > 1 else ''}.md"
    path = Path(name)
    header = "| Logo | ID | Symbol | Name |\n|:----:|:--:|:------:|:-----|\n"

    with path.open("w", encoding="utf-8") as f:
        f.write(header)
        for a in assets_slice:
            logo = a.get("LOGO_URL", "")
            img = f'<img src="{logo}" width="32" height="32">' if logo else ""
            f.write(f"| {img} | {a.get('ID','')} | {a.get('SYMBOL','')} | {a.get('NAME','')} |\n")

        # pagination
        f.write("\n---\n")
        parts = []
        # previous
        if page_num > 1:
            prev_name = f"list{page_num-1 if page_num-1 > 1 else ''}.md"
            parts.append(f"[← Prev](./{prev_name})")
        # next
        if page_num < total_pages:
            next_name = f"list{page_num+1}.md"
            parts.append(f"[Next →](./{next_name})")
        f.write(" | ".join(parts) + "\n")

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
