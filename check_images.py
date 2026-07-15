#!/usr/bin/env python3
"""Generate placeholder images for all products that don't have one"""

import os
from PIL import Image, ImageDraw, ImageFont

products_dir = '/DATA/Progi/xleborez-new/img/products'
catalog_file = '/DATA/Progi/xleborez-new/catalog/nozhi/assets/catalog.json'

import json
with open(catalog_file) as f:
    products = json.load(f)

# Get existing images
existing = set(os.listdir(products_dir))
print(f"Existing images: {len(existing)}")

# Find products without images
for p in products:
    pid = p['id']
    # Check any image format
    has_img = any(f"{pid}.{ext}" in existing for ext in ['jpg', 'jpeg', 'png', 'webp', 'svg'])
    if not has_img:
        print(f"Missing image for: {pid} — {p['brand']} {p['name'][:40]}")

print("\nDone checking")
