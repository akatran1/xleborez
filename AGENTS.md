# AGENTS.md — xleborez.ru

## Коротко

**xleborez.ru** — сайт-витрина ООО «Фитфуд» по продаже ножей для хлеборезок (рамные ножи). Статика (HTML/CSS/JS) + PHP-обработчики. Корзина на LocalStorage, заказы через Telegram + email. Хостинг — FTP на Orange Pi, тестовый dev-сервер на порту 8900.

## Структура проекта

```
/DATA/Progi/xleborez-new/
├── AGENTS.md                     ← этот файл
├── index.html                    ← главная (hero, преимущества, хиты, бренды)
├── catalog/
│   └── nozhi/
│       ├── index.html            ← каталог: табы Стальные / Тефлоновые
│       ├── hrm-11/               ← отдельная страница для HRM-11
│       ├── stal-*/               ← 19 стальных ножей (каждый в своей папке)
│       └── teflon-*/             ← 14 тефлоновых ножей (каждый в своей папке)
├── cart/index.html               ← корзина
├── checkout/index.html           ← оформление заказа
├── contacts/index.html           ← контакты, реквизиты, форма обратной связи
├── api/
│   ├── send-order.php            ← обработчик заказа → email + Telegram
│   └── send-callback.php         ← обработчик обратного звонка → email + Telegram
├── css/style.css                 ← вся стилизация (1235 строк)
├── js/app.js                     ← корзина, навигация, тосты (490 строк)
├── vidget/
│   ├── messenger-widget.js       ← плавающий виджет мессенджеров (Telegram + Max)
│   └── messenger-widget.css      ← стили виджета (dark glassmorphism)
├── skills/
│   └── messenger-widget/         ← навык для генерации виджета
├── img/
│   ├── logo.svg                  ← логотип (SVG)
│   ├── logo-old.png              ← PNG-версия (508×200, для хедера)
│   ├── logo-white.svg            ← белый логотип для подвала
│   ├── products/                 ← ~60 картинок товаров (jpg/png/webp)
│   └── bg-img/                   ← фоновые изображения для блоков
├── assets/catalog.json           ← каталог товаров (JSON, 33+ позиции)
├── robots.txt
├── sitemap.xml                   ← карта сайта
├── favicon.ico
├── google0478a762fd13fafc.html   ← верификация Google
├── yandex_c6dee67ccaab4a88.html  ← верификация Яндекс
├── .env                          ← токены Telegram, email, пароли БД (не коммитить)
├── Прайс ФФ Ножи рамные 20260709.xlsx  ← исходный прайс-лист
├── generate_catalog.py           ← генератор страниц товаров из Excel
└── check_images.py               ← проверка наличия картинок
```

## Технологии

- **Чистый HTML5** — каждая страница отдельным файлом (не SPA)
- **CSS3** — кастомные свойства, CSS Grid, Flexbox, без фреймворков
- **JavaScript (vanilla ES6)** — корзина через LocalStorage, табы, бургер-меню, тосты
- **PHP 8** — бэкенд для заказов (curl в Telegram API, mail())
- **Schema.org** — JSON-LD разметка товаров для SEO
- **Шрифты**: Inter (основной) + Russo One (заголовки) через Google Fonts
- **Чистые URL**: `/catalog/nozhi/teflon-250-05-120-штифт-3-мм/`
- **Favicon**: `favicon.ico` (квадрат со скруглённым ножом)

## Цветовая схема

| Назначение | Цвет |
|---|---|
| Золотой (акцент, кнопки) | `#fbb710` |
| Тёмный (фон хедера/футера) | `#131212` |
| Красный (акцент) | `#dc0647` |
| Фон карточек | `#f5f7fa` |
| Текст | `#1a1a1a` / `#8a8a8a` |

## Ключевые страницы

### Главная (index.html)
- Hero с заголовком и CTA «Перейти в каталог»
- Блок преимуществ (3 колонки)
- Популярные товары (слайдер из 4 карточек)
- Блок «О компании»
- Бренды (Holly, National, Daub, Jac, Arpo, Wabama, Ibonhart, СЭМЗ)
- Форма «Получить консультацию»
- Подвал с логотипом, навигацией, контактами

### Каталог (catalog/nozhi/index.html)
- Заголовок + описание
- Табы: «Стальные (19)» / «Тефлоновые (14)»
- Сетка товаров (product-card) с:
  - Картинкой
  - Бейджем «Сталь» / «Тефлон»
  - Названием бренда
  - Ссылкой на товар
  - Ценой
  - Кнопкой «В корзину»
- Каждая секция: `<div class="catalog-section" id="tab-{steel,teflon}">`
- Переключение табов через встроенный JS

### Страница товара (catalog/nozhi/<slug>/index.html)
- Сетка 2fr 1fr: галерея (слева), описание (справа)
- Картинка 100% ширины колонки
- Название, цена, характеристики
- Кнопка «В корзину» (data-id, data-name, data-price, data-image)
- Похожие товары (product-grid внизу)
- Schema.org Product (JSON-LD)

### Корзина (cart/index.html)
- Динамическая таблица товаров из LocalStorage
- Изменение количества, удаление
- Итоговая сумма с НДС
- Кнопка «Оформить заказ»

### Оформление заказа (checkout/index.html)
- Форма: имя, телефон, email, способ доставки, адрес, комментарий
- Сводка заказа
- Отправка через `api/send-order.php`

## JavaScript (app.js)

- **Cart Module** — LocalStorage CRUD, badge-счётчик
- **Toast Module** — уведомления (3 сек, авто-исчезание)
- **DOMContentLoaded** — init корзины, кнопки «В корзину», обновление бейджа
- **Табы каталога** — встроены в `catalog/nozhi/index.html` (отдельный `<script>`)
- **Бургер-меню** — на мобильных

## Messenger Widget (vidget/)

Плавающий виджет мессенджеров (dark glassmorphism, vanilla JS, 0 зависимостей).

**Конфигурация на сайте:**
```js
MessengerWidget.init({
  telegram: { username: 'andresemykin', link: 'https://t.me/andresemykin' },
  max: { username: 'ООО Фитфуд', link: 'https://max.ru/u/f9LHodD0cOKSzHGEQIX3HAhXGwgQALr4CxadoVlHiQKQ9ug17KGfP-cbEMU' }
});
```

**Интеграция:** виджет добавлен на все 39 HTML-страниц (index, contacts, checkout, cart, каталог, все товары). Скрипт подключается перед `</body>`:
```html
<script src="vidget/messenger-widget.js"></script>
```
CSS загружается автоматически из той же директории.

**Генератор** (`generate_catalog.py`) тоже добавляет виджет на новые страницы товаров.

**Изменение конфигурации:** править `MessengerWidget.init({...})` в каждой странице + шаблон в `generate_catalog.py`.

## PHP-обработчики

### api/send-order.php
- POST, Content-Type: application/json
- Принимает: name, phone, email, delivery (self|delivery), address, comment, items[{id,name,price,qty}], total
- Формирует письмо: `xleborez@yandex.ru`
- Отправляет в Telegram: `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` (из .env)
- Валидация: name, phone, items — обязательны

### api/send-callback.php
- POST, JSON
- Принимает: name, phone, comment
- Отправляет уведомление в Telegram и на email

## Товары

- **33 позиции**: 19 стальных, 14 тефлоновых
- **Диапазон цен**: 158 — 10 176 ₽ (с НДС)
- **Картинки**: каждая модель имеет уникальную картинку (jpg/png)
- **Тефлоновые** — заглушка `noj-matas-teflon.webp` (временная)
- Данные из Excel: `Прайс ФФ Ножи рамные 20260709.xlsx` (столбцы: размеры, сталь/тефлон, цена)

## Разработка

### Dev-сервер
```bash
cd /DATA/Progi/xleborez-new && python3 -m http.server 8900 --bind 0.0.0.0
```
Доступен: `http://192.168.19.221:8900/`

### Генерация страниц из Excel
```bash
python3 generate_catalog.py
```
Читает xlsx, создаёт/обновляет HTML-страницы товаров.

### Проверка картинок
```bash
python3 check_images.py
```

### Деплой
FTP на Orange Pi. Текущая сборка в `/DATA/Progi/xleborez-new/`.

## Контакты (на сайте)
- Телефон: 8 995 222-68-02
- Email: xleborez@yandex.ru
- Адрес: г. Ногинск, ул. Гаражная, д. 1
- ИНН: 5031114200 / КПП: 503101001 / ОГРН: 1235000119922
- Банк: ПАО Сбербанк, р/с 40702810640120000976, БИК 044525225

## Известные проблемы
- Табы каталога (Steel/Teflon) — inline-скрипт в catalog/nozhi/index.html
- Картинка на странице товара — квадратная 1254×1254, отображается 100% ширины колонки
- Нет адаптации для IE (legacy браузеры)
- Файлы `.png` оригиналов не удаляются при замене на webp
