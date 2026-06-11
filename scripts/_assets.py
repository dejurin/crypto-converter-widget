#!/usr/bin/env python3
"""
Backward-compatible entrypoint for the asset manifest generator.

Use scripts/assets.py directly for new automation. This file is kept so older
manual commands that call scripts/_assets.py still generate the same
CoinLore-backed public/assets.json contract.
"""

from assets import main


if __name__ == "__main__":
    raise SystemExit(main())
