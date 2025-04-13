import math
import json
import time
import os
import requests

# API URL template with placeholders for page number and page size.
API_URL_TEMPLATE = (
    "https://data-api.coindesk.com/asset/v1/top/list?"
    "page={page}&page_size=100&sort_by=CIRCULATING_MKT_CAP_USD&"
    "sort_direction=DESC&groups=ID,BASIC,SUPPLY,PRICE,MKT_CAP,CHANGE,TOPLIST_RANK&"
    "toplist_quote_asset=USD"
)

# Delay constants
DELAY_BETWEEN_PAGES = 1        # seconds to wait between pages
RETRY_DELAY = 5                # seconds to wait before retry on error
MAX_RETRIES = 3                # maximum number of retries per page

def fetch_total_assets():
    """
    Fetch the first page and extract the total number of assets.
    """
    try:
        response = requests.get(API_URL_TEMPLATE.format(page=1), timeout=10)
        response.raise_for_status()
    except requests.RequestException as error:
        print(f"Error fetching initial data: {error}")
        return 0

    data = response.json()
    total_assets = data.get("Data", {}).get("STATS", {}).get("TOTAL_ASSETS", 0)
    return total_assets

def fetch_assets_page(page, max_retries=MAX_RETRIES):
    """
    Fetch a single page of asset data and return the parsed asset list.
    Implements retry logic on request errors.
    """
    attempts = 0
    while attempts < max_retries:
        try:
            response = requests.get(API_URL_TEMPLATE.format(page=page), timeout=10)
            response.raise_for_status()
            data = response.json()
            asset_list = data.get("Data", {}).get("LIST", [])
            # Extract required fields for each asset
            return [
                {
                    "SYMBOL": asset.get("SYMBOL"),
                    "URI": asset.get("URI"),
                    "NAME": asset.get("NAME"),
                    "LOGO": (asset.get("LOGO_URL") or "").replace("https://resources.cryptocompare.com/asset-management", ""),
                    "TOTAL_MKT_CAP_USD": asset.get("TOTAL_MKT_CAP_USD")
                }
                for asset in asset_list
            ]
        except requests.RequestException as error:
            attempts += 1
            print(f"Error fetching page {page} on attempt {attempts}: {error}")
            if attempts < max_retries:
                print(f"Retrying page {page} after {RETRY_DELAY} seconds...")
                time.sleep(RETRY_DELAY)
            else:
                print(f"Failed fetching page {page} after {max_retries} attempts.")
    return []

def fetch_all_assets():
    """
    Fetch all assets by iterating through pages.
    """
    total_assets = fetch_total_assets()
    if total_assets == 0:
        print("No assets found or error in fetching total assets.")
        return []

    # Calculate total pages (ceil division)
    total_pages = math.ceil(total_assets / 100)
    print(f"Total assets: {total_assets}, Total pages: {total_pages}")

    all_assets = []
    for page in range(1, total_pages + 1):
        print(f"Fetching page {page}...")
        assets_page = fetch_assets_page(page)
        all_assets.extend(assets_page)
        # Delay between requests to ease API load
        time.sleep(DELAY_BETWEEN_PAGES)
    return all_assets

if __name__ == '__main__':
    # Retrieve all assets
    assets = fetch_all_assets()

    # Define output directory and file path in project root /public folder
    output_dir = "public"
    os.makedirs(output_dir, exist_ok=True)  # Create 'public' folder if it doesn't exist
    output_file = os.path.join(output_dir, "assets.json")
    
    # Save assets to JSON file
    with open(output_file, "w", encoding="utf-8") as file:
        json.dump(assets, file, indent=4, ensure_ascii=False)
    
    print(f"Saved {len(assets)} assets to {output_file}")
