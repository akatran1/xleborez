# Messenger Icon Patterns

## Next.js / React

Use shared components when available. For App Router projects, header/footer links usually belong in `app/layout.tsx` or a reusable component.

If the target project has no messenger icons, copy these bundled files from the skill into the site's `public/` folder:

- `assets/Telegram_Logo.svg` -> `public/Telegram_Logo.svg`
- `assets/Max_Logo.svg` -> `public/Max_Logo.svg`

```tsx
const MESSENGERS = {
  telegram: "https://t.me/akatran1",
  max: "https://max.ru/u/f9LHodD0cOKSzHGEQIX3HAhXGwgQALr4CxadoVlHiQKQ9ug17KGfP-cbEMU",
};

export function MessengerLinks() {
  return (
    <div className="flex items-center gap-3">
      <a href={MESSENGERS.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
        <img src="/Telegram_Logo.svg" alt="" className="h-8 w-8" />
      </a>
      <a href={MESSENGERS.max} target="_blank" rel="noopener noreferrer" aria-label="MAX">
        <img src="/Max_Logo.svg" alt="" className="h-8 w-8" />
      </a>
    </div>
  );
}
```

If TypeScript complains about image paths, keep simple public-folder `img` paths or use `next/image` only when the project already uses it.

## Static HTML

If the target project has no messenger icons, copy the bundled SVG files into the same public assets folder used by the site's other images, then update `src` paths below if needed.

```html
<div class="messenger-links">
  <a href="https://t.me/akatran1" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
    <img src="/Telegram_Logo.svg" alt="" width="32" height="32">
  </a>
  <a href="https://max.ru/u/f9LHodD0cOKSzHGEQIX3HAhXGwgQALr4CxadoVlHiQKQ9ug17KGfP-cbEMU" target="_blank" rel="noopener noreferrer" aria-label="MAX">
    <img src="/Max_Logo.svg" alt="" width="32" height="32">
  </a>
</div>
```

```css
.messenger-links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.messenger-links a {
  display: inline-flex;
  width: 32px;
  height: 32px;
}

.messenger-links img {
  width: 100%;
  height: 100%;
  display: block;
}
```

## Floating Widget

Use a floating widget only when it fits the site. Put scripts before `</body>` or in the framework's client-side mount point.

```html
<script src="/vidget/messenger-widget.js"></script>
<script>
  window.MessengerWidget && window.MessengerWidget.init({
    telegram: { username: "akatran1", link: "https://t.me/akatran1" },
    max: {
      username: "MAX",
      link: "https://max.ru/u/f9LHodD0cOKSzHGEQIX3HAhXGwgQALr4CxadoVlHiQKQ9ug17KGfP-cbEMU"
    }
  });
</script>
```

Do not duplicate widget initialization if the site already has it.

## WordPress / PHP Theme

If the active theme has no messenger icons, copy the bundled SVG files into the theme's `assets/` folder:

- `assets/Telegram_Logo.svg`
- `assets/Max_Logo.svg`

```php
<div class="messenger-links">
  <a href="https://t.me/akatran1" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/Telegram_Logo.svg'); ?>" alt="">
  </a>
  <a href="https://max.ru/u/f9LHodD0cOKSzHGEQIX3HAhXGwgQALr4CxadoVlHiQKQ9ug17KGfP-cbEMU" target="_blank" rel="noopener noreferrer" aria-label="MAX">
    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/Max_Logo.svg'); ?>" alt="">
  </a>
</div>
```

Use escaping helpers. Do not hardcode local filesystem paths into rendered HTML.
