#!/usr/bin/env python3
"""
Main Task:
This script fetches cryptocurrency asset data from multiple API endpoints,
processes and organizes the assets according to the specified priority order:
    HEAD:
        - 5 top blockchains
        - 10 top tokens
        - 10 top currencies (G10)
        - 1 commodity (gold)
    Others:
        - blockchain
        - tokens
        - currencies
        - commodity
The final ordered data is then saved into a JSON file at 'public/assets.json'.

Safety and GitHub Actions:
If the guaranteed minimum number of assets is not met, the script will not overwrite
the existing output file and will log the errors to an 'error.log' file. The script exits
with a non-zero status code to signal a failure in GitHub Actions.
"""

import requests
import json
import os
import time
import sys
from datetime import datetime

# Global pause delay (in seconds) to mitigate API load
PAUSE_DELAY = 3
API_URL = "https://data-api.coindesk.com/asset/v1/"

def fetch_data(url, max_retries=3, pause=2):
    """
    Performs an HTTP GET request with retries and a pause between attempts.

    Parameters:
        url (str): The URL to fetch the data from.
        max_retries (int): Maximum number of retry attempts if the request fails.
        pause (int): Pause time in seconds between retries.

    Returns:
        dict or None: The JSON response as a dictionary if successful, or None if all attempts fail.
    """
    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"[Warning] Attempt {attempt+1}: Received status code {response.status_code} for URL: {url}")
        except Exception as e:
            print(f"[Error] Attempt {attempt+1}: Exception occurred: {e}")
        time.sleep(pause)
    return None

def format_asset(asset):
    """
    Formats the asset dictionary to match the required structure.

    Parameters:
        asset (dict): The original asset data.

    Returns:
        dict: A dictionary containing only the required fields.
    """
    return {
        #"NAME": asset.get("NAME", ""),
        "SYMBOL": asset.get("SYMBOL", ""),
        "ASSET_TYPE": asset.get("ASSET_TYPE", ""),
        #"LOGO": asset.get("LOGO_URL", "").replace("https://resources.cryptocompare.com/asset-management/", "")
    }

def get_assets(url_func, pages, asset_type_name=""):
    """
    Retrieves assets from multiple pages by generating URLs using the provided function.

    Parameters:
        url_func (callable): A function that takes the page number as an argument and returns a URL string.
        pages (int): The number of pages to retrieve.
        asset_type_name (str): The type of asset being fetched (for logging purposes).

    Returns:
        list: A list of formatted asset dictionaries.
    """
    assets = []
    for page in range(1, pages + 1):
        print(f"[Progress] Fetching {asset_type_name} data: page {page} of {pages}...")
        url = url_func(page)
        data = fetch_data(url)
        if data:
            for asset in data.get("Data", {}).get("LIST", []):
                assets.append(format_asset(asset))
        else:
            print(f"[Warning] No data returned for {asset_type_name} page {page}.")
        time.sleep(PAUSE_DELAY)
    print(f"[Progress] Completed fetching {asset_type_name} data.")
    return assets

def remove_duplicates(assets_list):
    """
    Removes duplicate assets from the list while preserving the original order.
    Duplicate identification is based on a tuple key of (ASSET_TYPE, SYMBOL).

    Parameters:
        assets_list (list): The list of asset dictionaries.

    Returns:
        list: A list with duplicate assets removed.
    """
    unique = {}
    result = []
    for asset in assets_list:
        key = (asset["ASSET_TYPE"], asset["SYMBOL"])
        if key not in unique:
            unique[key] = asset
            result.append(asset)
    return result

def log_error(errors, log_filename="error.log"):
    """
    Logs error messages with a timestamp to the specified log file.

    Parameters:
        errors (list): A list of error messages (strings) to log.
        log_filename (str): The filename for the error log.
    """
    timestamp = datetime.now().isoformat()
    with open(log_filename, "a", encoding="utf-8") as log_file:
        log_file.write(f"--- Error Log at {timestamp} ---\n")
        for err in errors:
            log_file.write(err + "\n")
        log_file.write("\n")
    print(f"[Error] {len(errors)} error(s) encountered. See {log_filename} for details.")

def main():
    print("[Start] Beginning asset data fetching and processing...")
    errors = []
    
    # Fetch summary data for FIAT and COMMODITY assets.
    print("[Progress] Fetching summary data for FIAT and COMMODITY assets...")
    summary_url = f"{API_URL}summary/list?asset_lookup_priority=SYMBOL"
    summary_data = fetch_data(summary_url)
    summary_all = []
    if summary_data:
        for asset in summary_data.get("Data", {}).get("LIST", []):
            if asset.get("ASSET_TYPE") in ("FIAT", "COMMODITY"):
                summary_all.append(format_asset(asset))
        print(f"[Progress] Retrieved {len(summary_all)} FIAT and COMMODITY assets from summary.")
    else:
        error_msg = "Failed to fetch summary data from the summary endpoint."
        print(f"[Error] {error_msg}")
        errors.append(error_msg)
    time.sleep(PAUSE_DELAY)
    
    # Filter fiat assets from the summary data.
    fiat_list = [asset for asset in summary_all if asset["ASSET_TYPE"] == "FIAT"]
    # Filter commodity assets from the summary data.
    commodity_list = [asset for asset in summary_all if asset["ASSET_TYPE"] == "COMMODITY"]

    # Fetch tokens data: 3 pages (should yield at least 10 tokens).
    token_url_func = lambda page: (
        f"{API_URL}top/list?page={page}&page_size=100"
        "&sort_by=CIRCULATING_MKT_CAP_USD&sort_direction=DESC&groups=ID,BASIC,MKT_CAP"
        "&toplist_quote_asset=USD&asset_type=TOKEN"
    )
    tokens = get_assets(token_url_func, pages=10, asset_type_name="TOKEN")
    if len(tokens) < 10:
        error_msg = f"Insufficient tokens data: expected at least 10 tokens, got {len(tokens)}."
        print(f"[Error] {error_msg}")
        errors.append(error_msg)
    
    # Fetch blockchains data: 2 pages (should yield at least 5 blockchains).
    blockchain_url_func = lambda page: (
        f"{API_URL}top/list?page={page}&page_size=100"
        "&sort_by=CIRCULATING_MKT_CAP_USD&sort_direction=DESC&groups=ID,BASIC,MKT_CAP"
        "&toplist_quote_asset=USD&asset_type=BLOCKCHAIN"
    )
    blockchains = get_assets(blockchain_url_func, pages=5, asset_type_name="BLOCKCHAIN")
    if len(blockchains) < 5:
        error_msg = f"Insufficient blockchains data: expected at least 5 blockchains, got {len(blockchains)}."
        print(f"[Error] {error_msg}")
        errors.append(error_msg)
    
    # Create head section
    print("[Progress] Creating head section of the asset list...")
    head_blockchains = blockchains[:5]  # Top 5 blockchains.
    head_tokens = tokens[:10]           # Top 10 tokens.
    
    # Predefined list of G10 fiat currency symbols (10 currencies).
    g10_fiat = ["USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CNY", "NOK", "NZD"]
    head_currencies = []
    for currency in g10_fiat:
        asset = next((a for a in fiat_list if a["SYMBOL"].upper() == currency), None)
        if asset:
            head_currencies.append(asset)
        else:
            error_msg = f"Fiat asset for currency {currency} not found."
            print(f"[Error] {error_msg}")
            errors.append(error_msg)
    
    if len(head_currencies) < len(g10_fiat):
        error_msg = f"Insufficient fiat data: expected {len(g10_fiat)} currencies, got {len(head_currencies)}."
        print(f"[Error] {error_msg}")
        errors.append(error_msg)
    
    # Select 1 commodity - gold. Search by SYMBOL 'XAU' or NAME containing 'gold' (case insensitive).
    head_commodity = next(
        (a for a in commodity_list if a["SYMBOL"].upper() == "XAU" or "gold" in a["NAME"].lower()), 
        None
    )
    if head_commodity is None:
        error_msg = "Commodity asset for gold (XAU) not found."
        print(f"[Error] {error_msg}")
        errors.append(error_msg)
    
    head = head_blockchains + head_tokens + head_currencies + ([head_commodity] if head_commodity else [])
    print(f"[Progress] Head section created: {len(head_blockchains)} blockchains, {len(head_tokens)} tokens, {len(head_currencies)} currencies, and {'1 commodity' if head_commodity else '0 commodity'}.")
    
    # Combine all assets from summary, tokens, and blockchains; then remove duplicates.
    print("[Progress] Combining all assets and removing duplicates...")
    combined = summary_all + tokens + blockchains
    combined = remove_duplicates(combined)
    
    # Exclude assets already in the head section from the combined list.
    head_keys = {(asset["ASSET_TYPE"], asset["SYMBOL"]) for asset in head}
    rest_assets = [asset for asset in combined if (asset["ASSET_TYPE"], asset["SYMBOL"]) not in head_keys]
    
    # Sort remaining assets in the order: blockchain, tokens, currencies, commodity.
    order_dict = {"BLOCKCHAIN": 0, "TOKEN": 1, "FIAT": 2, "COMMODITY": 3}
    rest_assets = sorted(rest_assets, key=lambda a: order_dict.get(a["ASSET_TYPE"], 4))
    
    # Final ordered asset list: head first, then the sorted remaining assets.
    final_assets = head + rest_assets
    total_final = len(final_assets)
    print(f"[Progress] Final asset list prepared with {total_final} total assets.")
    
    # Verify that the head section is complete (5 + 10 + 10 + 1 = 26 assets).
    planned_head_count = 5 + 10 + 10 + 1  # 26
    if len(head) < planned_head_count:
        error_msg = f"Head section incomplete: expected {planned_head_count} assets, got {len(head)}."
        print(f"[Error] {error_msg}")
        errors.append(error_msg)
    
    # If errors exist, log them and do not overwrite the existing file.
    if errors:
        log_error(errors, log_filename="error.log")
        print("[Abort] Data verification failed. Existing assets file was not overwritten.")
        sys.exit(1)
    
    # Save the final assets list to a JSON file in the 'public' directory.
    print("[Progress] Saving final asset list to file...")
    output_dir = "public"
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "assets.json")
    
    with open(output_file, "w", encoding="utf-8") as file:
        json.dump(final_assets, file)
    
    print(f"[Done] Saved {len(final_assets)} assets to {output_file}")

if __name__ == "__main__":
    main()
