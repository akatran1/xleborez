---
name: messenger-widget
description: Create and integrate a floating messenger widget with QR codes, Telegram, Max, WhatsApp, and Viber support. Use when the user wants to add a contact widget to a site, needs a messenger popup with QR codes, asks for a floating chat button, or wants to connect Telegram/Max/WhatsApp/Viber to a website. Vanilla JS, no dependencies, dark glassmorphism UI.
---

# Messenger Widget

Floating messenger widget with QR codes and messenger buttons. Dark glassmorphism UI, mobile responsive, accessibility-ready.

## Quick Start

Copy `assets/messenger-widget.js` and `assets/messenger-widget.css` to the project's `vidget/` folder (or any path), then add before `</body>`:

```html
<script src="vidget/messenger-widget.js"></script>
<script>
  MessengerWidget.init({
    telegram: { username: 'youruser', link: 'https://t.me/youruser' },
    max: { username: 'youruser', link: 'https://max.ru/youruser' }
  });
</script>
```

CSS auto-loads from the same directory as JS.

## Configuration

All options passed to `MessengerWidget.init()`:

```js
MessengerWidget.init({
  telegram: { username: '...', link: 'https://t.me/...' },
  max: { username: '...', link: 'https://max.ru/...' },
  texts: {
    title: 'Мы на связи в мессенджерах',
    subtitle: 'Если остались вопросы — пишите в нашу поддержку',
    qrLabel: 'Сканируйте QR с телефона',
    telegramLabel: 'Telegram',
    maxLabel: 'Max'
  },
  position: 'right',          // 'right' | 'left'
  qrSize: 200,                // QR code size in px
  extraMessengers: [],        // additional messenger buttons
  zIndex: 999997
});
```

### Extra Messengers

```js
extraMessengers: [
  { type: 'whatsapp', label: 'WhatsApp', link: 'https://wa.me/79261826820', className: 'mw-button-whatsapp' },
  { type: 'viber', label: 'Viber', link: 'viber://chat?number=79261826820', className: 'mw-button-viber' },
  { type: 'custom', label: 'My Chat', link: 'https://example.com/chat', className: 'mw-button-custom', icon: '<svg>...</svg>' }
]
```

### Color Theme Override

Override CSS custom properties on `:root`:

```css
:root {
  --mw-bg-popup: rgba(30, 30, 40, 0.95);
  --mw-gradient-telegram: linear-gradient(135deg, #2AABEE 0%, #229ED9 100%);
  --mw-gradient-max: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
  --mw-radius-lg: 24px;
}
```

## Programmatic Control

```js
var widget = MessengerWidget.getInstance();
widget.open();
widget.close();
widget.toggle();

document.addEventListener('mw:open', function(e) { /* opened */ });
document.addEventListener('mw:close', function(e) { /* closed */ });
```

## Features

- Floating trigger button with pulse animation
- Dark glassmorphism popup (backdrop blur + saturate)
- QR codes via `api.qrserver.com` (no library needed)
- Messenger buttons with gradients and hover effects
- ESC close, overlay click close
- Body scroll lock when open
- Focus trap with ARIA attributes
- Mobile responsive (vertical layout, full-width buttons)
- All classes isolated with `mw-` prefix
- Zero dependencies — vanilla JS

## File Structure

```
vidget/
├── messenger-widget.js    ← main widget (connect this)
├── messenger-widget.css   ← styles (auto-loaded)
```

## Integration Example (bomagrussia.ru)

```html
<script src="vidget/messenger-widget.js"></script>
<script>
  MessengerWidget.init({
    telegram: { username: 'akatran1', link: 'https://t.me/akatran1' },
    max: { username: 'Андрей', link: 'https://max.ru/u/f9LHodD0cOKSzHGEQIX3HAhXGwgQALr4CxadoVlHiQKQ9ug17KGfP-cbEMU' },
    extraMessengers: [
      { type: 'whatsapp', label: 'WhatsApp', link: 'https://wa.me/79261826820', className: 'mw-button-whatsapp' }
    ]
  });
</script>
```
