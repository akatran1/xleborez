#!/usr/bin/env python3
"""Обновление каталога и sitemap.xml после добавления страниц ножей."""

import os
import re

BASE = '/DATA/Progi/xleborez-new'
NOZHI = os.path.join(BASE, 'catalog', 'nozhi')

def read_file(p):
    with open(p, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(p, content):
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)

# =============================
# PART 1: Update catalog index
# =============================
CATALOG_PATH = os.path.join(NOZHI, 'index.html')
catalog_html = read_file(CATALOG_PATH)

# New product cards for steel copies
steel_cards = """
        <div class="product-card" data-id="stal-350-05-120-штифт-3-мм-matas" data-price="276">
          <a href="/catalog/nozhi/stal-350-05-120-штифт-3-мм-matas/" class="product-card__image">
            <img src="/img/products/stal-350-05-120-shtift-3-mm.webp" alt="350 × 0,5 × 12,0 штифт 3 мм" loading="lazy">
            <span class="product-card__badge">Сталь</span>
          </a>
          <div class="product-card__body">
            <div class="product-card__brand">Matas</div>
            <a href="/catalog/nozhi/stal-350-05-120-штифт-3-мм-matas/" class="product-card__title">Ножи для хлеборезки Matas 350 × 0,5 × 12,0 штифт 3 мм</a>
            <div class="product-card__price">276 ₽</div>
            <button class="product-card__btn add-to-cart"
              data-id="stal-350-05-120-штифт-3-мм-matas"
              data-name="350 × 0,5 × 12,0 штифт 3 мм"
              data-price="276"
              data-image="/img/products/stal-350-05-120-shtift-3-mm.webp">В корзину</button>
          </div>
        </div>
        <div class="product-card" data-id="stal-358-05-120-штифт-6-мм-national" data-price="316">
          <a href="/catalog/nozhi/stal-358-05-120-штифт-6-мм-national/" class="product-card__image">
            <img src="/img/products/6x6.webp" alt="358 × 0,5 × 12,0 штифт 6 мм" loading="lazy">
            <span class="product-card__badge">Сталь</span>
          </a>
          <div class="product-card__body">
            <div class="product-card__brand">National</div>
            <a href="/catalog/nozhi/stal-358-05-120-штифт-6-мм-national/" class="product-card__title">Ножи для хлеборезки National 358 × 0,5 × 12,0 штифт 6 мм</a>
            <div class="product-card__price">316 ₽</div>
            <button class="product-card__btn add-to-cart"
              data-id="stal-358-05-120-штифт-6-мм-national"
              data-name="358 × 0,5 × 12,0 штифт 6 мм"
              data-price="316"
              data-image="/img/products/6x6.webp">В корзину</button>
          </div>
        </div>
        <div class="product-card" data-id="stal-358-05-120-штифт-6-мм-ibonhart" data-price="316">
          <a href="/catalog/nozhi/stal-358-05-120-штифт-6-мм-ibonhart/" class="product-card__image">
            <img src="/img/products/6x6.webp" alt="358 × 0,5 × 12,0 штифт 6 мм" loading="lazy">
            <span class="product-card__badge">Сталь</span>
          </a>
          <div class="product-card__body">
            <div class="product-card__brand">Ibonhart</div>
            <a href="/catalog/nozhi/stal-358-05-120-штифт-6-мм-ibonhart/" class="product-card__title">Ножи для хлеборезки Ibonhart 358 × 0,5 × 12,0 штифт 6 мм</a>
            <div class="product-card__price">316 ₽</div>
            <button class="product-card__btn add-to-cart"
              data-id="stal-358-05-120-штифт-6-мм-ibonhart"
              data-name="358 × 0,5 × 12,0 штифт 6 мм"
              data-price="316"
              data-image="/img/products/6x6.webp">В корзину</button>
          </div>
        </div>
        <div class="product-card" data-id="stal-400-05-120-отверстие-ø3-мм-штифт-national" data-price="316">
          <a href="/catalog/nozhi/stal-400-05-120-отверстие-ø3-мм-штифт-national/" class="product-card__image">
            <img src="/img/products/3x0.webp" alt="400 × 0,5 × 12,0 отверстие Ø3 мм / штифт 3 мм" loading="lazy">
            <span class="product-card__badge">Сталь</span>
          </a>
          <div class="product-card__body">
            <div class="product-card__brand">National</div>
            <a href="/catalog/nozhi/stal-400-05-120-отверстие-ø3-мм-штифт-national/" class="product-card__title">Ножи для хлеборезки National 400 × 0,5 × 12,0 отверстие Ø3 мм / штифт 3 мм</a>
            <div class="product-card__price">316 ₽</div>
            <button class="product-card__btn add-to-cart"
              data-id="stal-400-05-120-отверстие-ø3-мм-штифт-national"
              data-name="400 × 0,5 × 12,0 отверстие Ø3 мм / штифт 3 мм"
              data-price="316"
              data-image="/img/products/3x0.webp">В корзину</button>
          </div>
        </div>
        <div class="product-card" data-id="stal-400-05-120-отверстие-ø3-мм-штифт-ibonhart" data-price="316">
          <a href="/catalog/nozhi/stal-400-05-120-отверстие-ø3-мм-штифт-ibonhart/" class="product-card__image">
            <img src="/img/products/3x0.webp" alt="400 × 0,5 × 12,0 отверстие Ø3 мм / штифт 3 мм" loading="lazy">
            <span class="product-card__badge">Сталь</span>
          </a>
          <div class="product-card__body">
            <div class="product-card__brand">Ibonhart</div>
            <a href="/catalog/nozhi/stal-400-05-120-отверстие-ø3-мм-штифт-ibonhart/" class="product-card__title">Ножи для хлеборезки Ibonhart 400 × 0,5 × 12,0 отверстие Ø3 мм / штифт 3 мм</a>
            <div class="product-card__price">316 ₽</div>
            <button class="product-card__btn add-to-cart"
              data-id="stal-400-05-120-отверстие-ø3-мм-штифт-ibonhart"
              data-name="400 × 0,5 × 12,0 отверстие Ø3 мм / штифт 3 мм"
              data-price="316"
              data-image="/img/products/3x0.webp">В корзину</button>
          </div>
        </div>
        <div class="product-card" data-id="stal-127-04-358-штифт-6-мм-national" data-price="158">
          <a href="/catalog/nozhi/stal-127-04-358-штифт-6-мм-national/" class="product-card__image">
            <img src="/img/products/6x6.webp" alt="12,7 × 0,4 × 358 штифт 6 мм" loading="lazy">
            <span class="product-card__badge">Сталь</span>
          </a>
          <div class="product-card__body">
            <div class="product-card__brand">National</div>
            <a href="/catalog/nozhi/stal-127-04-358-штифт-6-мм-national/" class="product-card__title">Ножи для хлеборезки National 12,7 × 0,4 × 358 штифт 6 мм</a>
            <div class="product-card__price">158 ₽</div>
            <button class="product-card__btn add-to-cart"
              data-id="stal-127-04-358-штифт-6-мм-national"
              data-name="12,7 × 0,4 × 358 штифт 6 мм"
              data-price="158"
              data-image="/img/products/6x6.webp">В корзину</button>
          </div>
        </div>
        <div class="product-card" data-id="stal-127-04-358-штифт-6-мм-ibonhart" data-price="158">
          <a href="/catalog/nozhi/stal-127-04-358-штифт-6-мм-ibonhart/" class="product-card__image">
            <img src="/img/products/6x6.webp" alt="12,7 × 0,4 × 358 штифт 6 мм" loading="lazy">
            <span class="product-card__badge">Сталь</span>
          </a>
          <div class="product-card__body">
            <div class="product-card__brand">Ibonhart</div>
            <a href="/catalog/nozhi/stal-127-04-358-штифт-6-мм-ibonhart/" class="product-card__title">Ножи для хлеборезки Ibonhart 12,7 × 0,4 × 358 штифт 6 мм</a>
            <div class="product-card__price">158 ₽</div>
            <button class="product-card__btn add-to-cart"
              data-id="stal-127-04-358-штифт-6-мм-ibonhart"
              data-name="12,7 × 0,4 × 358 штифт 6 мм"
              data-price="158"
              data-image="/img/products/6x6.webp">В корзину</button>
          </div>
        </div>"""

# New product cards for teflon copies
teflon_cards = """
        <div class="product-card" data-id="teflon-350-05-120-штифт-3-мм-matas" data-price="410">
          <a href="/catalog/nozhi/teflon-350-05-120-штифт-3-мм-matas/" class="product-card__image">
            <img src="/img/products/noj_matas1.webp" alt="350 × 0,5 × 12,0 штифт 3 мм" loading="lazy">
            <span class="product-card__badge">Тефлон</span>
          </a>
          <div class="product-card__body">
            <div class="product-card__brand">Matas</div>
            <a href="/catalog/nozhi/teflon-350-05-120-штифт-3-мм-matas/" class="product-card__title">Ножи для хлеборезки Matas 350 × 0,5 × 12,0 штифт 3 мм</a>
            <div class="product-card__price">410 ₽</div>
            <button class="product-card__btn add-to-cart"
              data-id="teflon-350-05-120-штифт-3-мм-matas"
              data-name="350 × 0,5 × 12,0 штифт 3 мм"
              data-price="410"
              data-image="/img/products/noj_matas1.webp">В корзину</button>
          </div>
        </div>
        <div class="product-card" data-id="teflon-358-05-120-штифт-6-мм-national" data-price="451">
          <a href="/catalog/nozhi/teflon-358-05-120-штифт-6-мм-national/" class="product-card__image">
            <img src="/img/products/6x6-teflon.webp" alt="358 × 0,5 × 12,0 штифт 6 мм" loading="lazy">
            <span class="product-card__badge">Тефлон</span>
          </a>
          <div class="product-card__body">
            <div class="product-card__brand">National</div>
            <a href="/catalog/nozhi/teflon-358-05-120-штифт-6-мм-national/" class="product-card__title">Ножи для хлеборезки National 358 × 0,5 × 12,0 штифт 6 мм</a>
            <div class="product-card__price">451 ₽</div>
            <button class="product-card__btn add-to-cart"
              data-id="teflon-358-05-120-штифт-6-мм-national"
              data-name="358 × 0,5 × 12,0 штифт 6 мм"
              data-price="451"
              data-image="/img/products/6x6-teflon.webp">В корзину</button>
          </div>
        </div>
        <div class="product-card" data-id="teflon-358-05-120-штифт-6-мм-ibonhart" data-price="451">
          <a href="/catalog/nozhi/teflon-358-05-120-штифт-6-мм-ibonhart/" class="product-card__image">
            <img src="/img/products/6x6-teflon.webp" alt="358 × 0,5 × 12,0 штифт 6 мм" loading="lazy">
            <span class="product-card__badge">Тефлон</span>
          </a>
          <div class="product-card__body">
            <div class="product-card__brand">Ibonhart</div>
            <a href="/catalog/nozhi/teflon-358-05-120-штифт-6-мм-ibonhart/" class="product-card__title">Ножи для хлеборезки Ibonhart 358 × 0,5 × 12,0 штифт 6 мм</a>
            <div class="product-card__price">451 ₽</div>
            <button class="product-card__btn add-to-cart"
              data-id="teflon-358-05-120-штифт-6-мм-ibonhart"
              data-name="358 × 0,5 × 12,0 штифт 6 мм"
              data-price="451"
              data-image="/img/products/6x6-teflon.webp">В корзину</button>
          </div>
        </div>
        <div class="product-card" data-id="teflon-400-05-120-отверстие-ø3-мм-штифт-national" data-price="451">
          <a href="/catalog/nozhi/teflon-400-05-120-отверстие-ø3-мм-штифт-national/" class="product-card__image">
            <img src="/img/products/3x0.webp" alt="400 × 0,5 × 12,0 отверстие Ø3 мм / штифт 3 мм" loading="lazy">
            <span class="product-card__badge">Тефлон</span>
          </a>
          <div class="product-card__body">
            <div class="product-card__brand">National</div>
            <a href="/catalog/nozhi/teflon-400-05-120-отверстие-ø3-мм-штифт-national/" class="product-card__title">Ножи для хлеборезки National 400 × 0,5 × 12,0 отверстие Ø3 мм / штифт 3 мм</a>
            <div class="product-card__price">451 ₽</div>
            <button class="product-card__btn add-to-cart"
              data-id="teflon-400-05-120-отверстие-ø3-мм-штифт-national"
              data-name="400 × 0,5 × 12,0 отверстие Ø3 мм / штифт 3 мм"
              data-price="451"
              data-image="/img/products/3x0.webp">В корзину</button>
          </div>
        </div>
        <div class="product-card" data-id="teflon-400-05-120-отверстие-ø3-мм-штифт-ibonhart" data-price="451">
          <a href="/catalog/nozhi/teflon-400-05-120-отверстие-ø3-мм-штифт-ibonhart/" class="product-card__image">
            <img src="/img/products/3x0.webp" alt="400 × 0,5 × 12,0 отверстие Ø3 мм / штифт 3 мм" loading="lazy">
            <span class="product-card__badge">Тефлон</span>
          </a>
          <div class="product-card__body">
            <div class="product-card__brand">Ibonhart</div>
            <a href="/catalog/nozhi/teflon-400-05-120-отверстие-ø3-мм-штифт-ibonhart/" class="product-card__title">Ножи для хлеборезки Ibonhart 400 × 0,5 × 12,0 отверстие Ø3 мм / штифт 3 мм</a>
            <div class="product-card__price">451 ₽</div>
            <button class="product-card__btn add-to-cart"
              data-id="teflon-400-05-120-отверстие-ø3-мм-штифт-ibonhart"
              data-name="400 × 0,5 × 12,0 отверстие Ø3 мм / штифт 3 мм"
              data-price="451"
              data-image="/img/products/3x0.webp">В корзину</button>
          </div>
        </div>"""

# Update steel tab count
catalog_html = catalog_html.replace(
    'Стальные (19)',
    'Стальные (26)'
)
catalog_html = catalog_html.replace(
    'Всего 19 позиций',
    'Всего 26 позиций'
)

# Update teflon tab count
catalog_html = catalog_html.replace(
    'Тефлоновые (14)',
    'Тефлоновые (19)'
)
# Find the teflon count line - second occurrence of "Всего"
# First find the steek count line replacement was already done
# Now for teflon section count
import re as re_mod

# Find the teflon count
teflon_count_pattern = r'(<div class="catalog-section" id="tab-teflon">\s*<div class="catalog-count">)Всего \d+ позиций'
catalog_html = re_mod.sub(
    teflon_count_pattern,
    r'\1Всего 19 позиций',
    catalog_html
)

# Insert steel cards before the hrm-11 card (last card in steel section)
# Find the closing of steel section - </div>\n      </div>\n      <div class="catalog-section" id="tab-teflon">
insert_point = '</div>\n        </div>\n        </div>\n      </div>\n      <div class="catalog-section" id="tab-teflon">'
catalog_html = catalog_html.replace(
    insert_point,
    steel_cards + '\n        </div>\n        </div>\n      </div>\n      <div class="catalog-section" id="tab-teflon">'
)

# Insert teflon cards before the closing of teflon section
# Find the end of teflon product grid
teflon_end = '</div>\n      </div>\n    </div>\n  </section>\n\n  <footer class="footer">'
catalog_html = catalog_html.replace(
    teflon_end,
    teflon_cards + '\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <footer class="footer">'
)

write_file(CATALOG_PATH, catalog_html)
print("  ✓ Updated catalog/nozhi/index.html with counts and new cards")


# =============================
# PART 2: Update sitemap
# =============================
SITEMAP_PATH = os.path.join(BASE, 'sitemap.xml')
sitemap = read_file(SITEMAP_PATH)

# New URLs to add (steel copies)
new_urls = """
  <url>
    <loc>https://xleborez.ru/catalog/nozhi/stal-350-05-120-штифт-3-мм-matas/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://xleborez.ru/catalog/nozhi/stal-358-05-120-штифт-6-мм-national/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://xleborez.ru/catalog/nozhi/stal-358-05-120-штифт-6-мм-ibonhart/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://xleborez.ru/catalog/nozhi/stal-400-05-120-отверстие-ø3-мм-штифт-national/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://xleborez.ru/catalog/nozhi/stal-400-05-120-отверстие-ø3-мм-штифт-ibonhart/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://xleborez.ru/catalog/nozhi/stal-127-04-358-штифт-6-мм-national/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://xleborez.ru/catalog/nozhi/stal-127-04-358-штифт-6-мм-ibonhart/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://xleborez.ru/catalog/nozhi/teflon-350-05-120-штифт-3-мм-matas/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://xleborez.ru/catalog/nozhi/teflon-358-05-120-штифт-6-мм-national/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://xleborez.ru/catalog/nozhi/teflon-358-05-120-штифт-6-мм-ibonhart/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://xleborez.ru/catalog/nozhi/teflon-400-05-120-отверстие-ø3-мм-штифт-national/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://xleborez.ru/catalog/nozhi/teflon-400-05-120-отверстие-ø3-мм-штифт-ibonhart/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>"""

# Insert before </urlset>
sitemap = sitemap.replace('</urlset>', new_urls + '\n</urlset>')

write_file(SITEMAP_PATH, sitemap)
print("  ✓ Updated sitemap.xml with 12 new URLs")

print()
print("DONE - catalog and sitemap updated")
