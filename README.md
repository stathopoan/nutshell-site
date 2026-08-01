# Nutshell — static site

Plain static HTML/CSS/JS version of the Nutshell landing page. No build step
required to host it: just publish this folder.

## Files

- `index.html` — the whole page (header, hero, products, story, quality, footer)
- `styles.css` — compiled stylesheet (pre-built, no Tailwind needed at runtime)
- `translations.js` — text for all 5 languages (EN, EL, DE, FR, ES)
- `app.js` — language switcher, smooth scrolling, sticky header, mobile menu, toasts
- `assets/` — images
- `.nojekyll` — tells GitHub Pages to serve files as-is

## Host on GitHub Pages

1. Create a repository and copy the **contents of this folder** into its root
   (so `index.html` sits at the top level).
2. Push to the `main` branch.
3. Repository → Settings → Pages → Source: "Deploy from a branch",
   Branch: `main`, Folder: `/ (root)` → Save.
4. The site goes live at `https://<user>.github.io/<repo>/` in a minute or two.

All paths are relative, so it also works from a subdirectory or by simply
opening `index.html` locally.

## Editing

- Text: edit `translations.js` (keys match the `data-i18n` attributes in `index.html`).
- Structure/classes: edit `index.html`. If you add new Tailwind classes, rebuild
  the CSS: `npx tailwindcss@3 -c tailwind.config.cjs -i src/input.css -o styles.css --minify`
