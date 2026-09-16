# Fawaz Eltahir — Bilingual GitHub Pages Portfolio

Arabic + English portfolio in one responsive, privacy-respecting static website.
No framework, no build step, no third-party scripts.

**Live:** https://fawaztahir79.github.io/fawaz-portfolio/
**Repository:** `fawaztahir79/fawaz-portfolio`

## Structure
| Path | Purpose |
|---|---|
| `index.html` | Bilingual page (semantic HTML, security meta headers, JSON-LD, Open Graph) |
| `style.css` | Responsive design, RTL support, light/dark theme, print stylesheet |
| `lang-init.js` | Tiny inline-loaded script: sets `lang`/`dir` before first paint (no RTL flash) |
| `script.js` | Language switcher, theme toggle, mobile menu, obfuscated contact reveal |
| `assets/` | Profile photo, SVG favicon |
| `cv/` | Visual CV (PDF) |
| `scripts/check.js` | CI check: i18n key parity + security markers |
| `.github/workflows/quality.yml` | Runs the check and a secret/external-script scan on every push |
| `_headers` | HTTP security headers (used automatically if hosted on Netlify / Cloudflare Pages) |
| `.well-known/security.txt` | RFC 9116 vulnerability-disclosure contact |
| `robots.txt`, `sitemap.xml` | Search-engine hints (CV folder excluded from indexing) |

## Features
- **Language:** English default; auto-detects Arabic browsers; `?lang=ar` / `?lang=en` deep links; choice saved locally.
- **Theme:** follows system light/dark, with a manual toggle that is remembered.
- **Accessibility:** skip link, focus rings, ARIA on menu/buttons, `<time>`, `<article>`, `<address>`, reduced-motion support.
- **Mobile:** hamburger menu, fluid grids, back-to-top button.
- **SEO:** canonical + `hreflang`, Open Graph, `Person` structured data, sitemap.

## Security & privacy design
| Control | What it does |
|---|---|
| Content-Security-Policy (`default-src 'none'`, `script-src 'self'`) | Blocks any injected or third-party script, inline handlers, frames and form posts |
| `frame-ancestors 'none'` + `X-Frame-Options: DENY` | Prevents clickjacking |
| `Referrer-Policy: strict-origin-when-cross-origin` | Doesn't leak page URLs to other sites |
| `rel="noopener noreferrer"` on every external link | Stops tab-nabbing via `window.opener` |
| Text-node-only rendering (`textContent`, no `innerHTML`) + language whitelist | Translation layer can't become an XSS vector; tampered `?lang=`/localStorage is ignored |
| Contact details assembled client-side from split `data-*` fragments (readable via `<noscript>`) | Reduces automated phone/e-mail harvesting; JSON-LD deliberately omits them |
| No cookies, no analytics, no CDNs, no fonts fetched | Nothing to consent to, nothing to leak; only two `localStorage` keys (language, theme) |
| `robots.txt` disallows `/cv/` | Keeps the PDF out of search indexes (it stays linked from the page) |
| CI scan for secrets / external `<script src>` | Guards against accidental future regressions |
| `security.txt` | Standard channel for responsible disclosure |

> GitHub Pages can't send custom HTTP headers, so CSP/Referrer policy are delivered via `<meta>`.
> `_headers` is ready for a host that supports real headers (HSTS, `nosniff`, Permissions-Policy, COOP/CORP).

## Deploy on GitHub Pages
1. Commit to `main`.
2. **Settings → Pages → Deploy from a branch** → `main` / `/(root)` → Save.
3. `.nojekyll` is included so `.well-known/` and `_headers` are published as-is.

## Local development
```bash
python3 -m http.server 8000     # then open http://localhost:8000
node scripts/check.js           # verify translations & security markers
```

LinkedIn: https://www.linkedin.com/in/fawazatiatallah
