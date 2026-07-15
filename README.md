# Lumina — public site

The public marketing site for [Lumina](https://luminamornings.com), a calm morning voice experience delivered through Telegram.

This repository intentionally contains only the public web surface:

- Static landing page
- Public privacy and terms pages
- Public brand assets
- Lightweight, privacy-conscious marketing analytics

The production application, bot logic, customer data, internal automation, and business logic are kept in a separate private repository and are not included here.

## Live site

[**luminamornings.com**](https://luminamornings.com)

## Stack

- Static HTML, CSS, and JavaScript
- GitHub Pages
- Cloudflare DNS/CDN
- Telegram as the product entry point

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Scope note

This is a deliberately small public surface, not the Lumina production codebase.
