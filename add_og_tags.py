#!/usr/bin/env python3
"""Add OG meta tags to all category and product pages."""
import os
import re
import sys

BASE = '/DATA/Progi/xleborez-new'

CATEGORY_PAGES = [
    'catalog/nozhi/index.html',
    'catalog/zapchasti/index.html',
    'catalog/hleborezki/index.html',
    'catalog/klipsatory/index.html',
]

def find_all_product_pages():
    """Find all product index.html files (subdirs of catalog categories)."""
    products = []
    catalog_dir = os.path.join(BASE, 'catalog')
    for cat in os.listdir(catalog_dir):
        cat_path = os.path.join(catalog_dir, cat)
        if not os.path.isdir(cat_path):
            continue
        for sub in os.listdir(cat_path):
            idx = os.path.join(cat_path, sub, 'index.html')
            if os.path.isfile(idx) and sub != 'index.html':
                products.append(os.path.relpath(idx, BASE))
    return sorted(products)


def extract_title(html):
    m = re.search(r'<title>(.*?)</title>', html, re.DOTALL)
    return m.group(1).strip() if m else ''


def extract_description(html):
    m = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']*)["\']', html)
    if not m:
        m = re.search(r'<meta\s+content=["\']([^"\']*)["\']\s+name=["\']description["\']', html)
    return m.group(1) if m else ''


def extract_canonical(html):
    m = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']*)["\']', html)
    return m.group(1) if m else ''


def extract_main_image(html):
    m = re.search(r'<img\s+id=["\']main-product-image["\'][^>]*\s+src=["\']([^"\']*)["\']', html)
    return m.group(1) if m else ''


def has_og_tags(html):
    return 'og:title' in html or 'og:description' in html or 'og:url' in html or 'og:image' in html or 'og:type' in html


def add_og_tags_to_category(html, filepath):
    title = extract_title(html)
    description = extract_description(html)
    canonical = extract_canonical(html)
    image = '/img/xleborez_logo.svg'

    og_block = f'''  <meta property="og:type" content="website">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{image}">
'''

    # Insert before </head>
    html = html.replace('</head>', og_block + '</head>', 1)
    return html


def add_og_tags_to_product(html, filepath):
    title = extract_title(html)
    # Try h1 if no title
    if not title:
        m = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL)
        if m:
            title = m.group(1).strip()
    description = extract_description(html)
    canonical = extract_canonical(html)
    image = extract_main_image(html)

    if not image:
        # Fallback to schem.org image
        m = re.search(r'"image"\s*:\s*"([^"]+)"', html)
        if m:
            image = m.group(1)

    og_block = f'''  <meta property="og:type" content="product">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{image}">
'''

    # Insert before </head>
    html = html.replace('</head>', og_block + '</head>', 1)
    return html


def main():
    product_pages = find_all_product_pages()
    all_pages = CATEGORY_PAGES + product_pages

    modified = 0
    skipped = 0
    errors = 0

    for rel_path in all_pages:
        full_path = os.path.join(BASE, rel_path)
        if not os.path.isfile(full_path):
            print(f"SKIP (not found): {rel_path}")
            skipped += 1
            continue

        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                html = f.read()
        except Exception as e:
            print(f"ERROR reading {rel_path}: {e}")
            errors += 1
            continue

        if has_og_tags(html):
            print(f"SKIP (already has OG): {rel_path}")
            skipped += 1
            continue

        if rel_path in CATEGORY_PAGES:
            new_html = add_og_tags_to_category(html, rel_path)
            page_type = 'category'
        else:
            new_html = add_og_tags_to_product(html, rel_path)
            page_type = 'product'

        try:
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(new_html)
            print(f"OK ({page_type:>8}): {rel_path}")
            modified += 1
        except Exception as e:
            print(f"ERROR writing {rel_path}: {e}")
            errors += 1

    print(f"\nDone! Modified: {modified}, Skipped: {skipped}, Errors: {errors}")


if __name__ == '__main__':
    main()
