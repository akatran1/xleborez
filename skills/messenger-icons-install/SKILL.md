---
name: messenger-icons-install
description: Install Telegram and MAX messenger contact icons on websites using the saved Hydroz links. Use when Codex is asked to add, copy, restore, migrate, audit, or standardize Telegram/MAX icons, floating messenger widgets, header/footer contact buttons, contact-page links, or messenger CTA buttons on any website, including Next.js, React, static HTML, WordPress themes, PHP templates, or CMS frontends.
---

# Messenger Icons Install

## Defaults

Use these Hydroz contact links unless the user gives different links:

- Telegram: `https://t.me/akatran1`
- Telegram username: `akatran1`
- MAX: `https://max.ru/u/f9LHodD0cOKSzHGEQIX3HAhXGwgQALr4CxadoVlHiQKQ9ug17KGfP-cbEMU`
- MAX label: `MAX`

Do not add WhatsApp unless the user explicitly asks.
Do not expose tokens, bot URLs, private chat IDs, or API keys.

## Workflow

1. Inspect the target site stack and existing contact UI.
2. Search for existing messenger links, icon files, shared header/footer components, contact pages, and floating widgets.
3. Prefer the site's current design system, icon library, asset naming, and component style.
4. Add Telegram and MAX links in the smallest shared location that covers the requested pages.
5. Use `target="_blank"` and `rel="noopener noreferrer"` for external links.
6. Add accessible labels: `aria-label="Telegram"` and `aria-label="MAX"`.
7. Verify on desktop and mobile that icons are visible, clickable, and not overlapping other UI.

For implementation patterns, read `references/patterns.md`.

## Placement Rules

For a business website, default placements are:

- header contact area,
- footer contact area,
- contacts page,
- floating widget only if the site already has one or the user asks for one.

Avoid adding the same icons into many page files when a shared layout/component exists.
Avoid decorative-only icons without links.
Avoid inline base64 images unless the project already uses that pattern.

## Icon Source

The skill bundles ready-to-copy SVG assets:

- `assets/Telegram_Logo.svg`
- `assets/Max_Logo.svg`

If the site already has `Telegram_Logo.svg`, `Max_Logo.svg`, or equivalent assets, reuse them.

If no assets exist:

- Copy the bundled SVG files into the target site's public/static/assets folder.
- For React/Next projects, copy them to `public/` or the existing image asset folder.
- For plain HTML/CSS, copy them beside the site's other public image assets.
- For WordPress/PHP themes, copy them under the active theme asset folder and reference with the theme URI helper.

MAX does not always have a standard icon in common icon libraries. If no official/local MAX SVG is available, use the site's existing MAX asset or a simple labeled `MAX` button. Do not invent a misleading logo.

## Verification

After editing:

- Search for old or wrong messenger links.
- Confirm Telegram URL is `https://t.me/akatran1` unless overridden.
- Confirm MAX URL is the saved `max.ru/u/...` link unless overridden.
- Confirm external link security attributes are present.
- Build or typecheck when the project has a cheap local command.
- If a browser is available, inspect at least one desktop and one mobile viewport.

Report exactly where the icons were installed and whether verification passed.
