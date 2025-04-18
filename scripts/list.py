#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import sys

API_URL = "https://data-api.coindesk.com/asset/v1/summary/list?asset_lookup_priority=SYMBOL"
OUTPUT_FILE = "../list.md"

def fetch_assets(url):
    """Fetch JSON data from the API and return the list of assets."""
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    return resp.json().get("Data", {}).get("LIST", [])

def generate_markdown(assets, out_path):
    """Generate a Markdown table with 32×32 logo, ID, symbol and name."""
    header = (
        "| Logo | ID | Symbol | Name |\n"
        "|:----:|:--:|:------:|:-----|\n"
    )
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(header)
        for a in assets:
            logo = a.get("LOGO_URL", "")
            img_md = f'<img src="{logo}" width="32" height="32">' if logo else ""
            f.write(f"| {img_md} | {a.get('ID','')} | {a.get('SYMBOL','')} | {a.get('NAME','')} |\n")
    print(f"Saved → {out_path}")

def main():
    try:
        assets = fetch_assets(API_URL)
        if not assets:
            print("No assets found.", file=sys.stderr)
            sys.exit(1)
        generate_markdown(assets, OUTPUT_FILE)
    except requests.RequestException as e:
        print(f"HTTP error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
