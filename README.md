# Digital Visuals

Digital billboard advertising across Johannesburg & Soweto — connecting local businesses, artists, and entrepreneurs with high-traffic advertising space at prices that make sense for a business just starting out.

**Live site:** [digital-visuals-jhb.netlify.app](https://digital-visuals-jhb.netlify.app)

## About

Digital Visuals gives small businesses and individuals access to digital billboard advertising in high-traffic locations — Chris Hani Road, Maponya Mall, Bara Mall, Johannesburg CBD, and the N1 Highway Corridor — without the pricing or minimums of a traditional big-brand agency.

## Tech stack

Plain, dependency-free static HTML/CSS/JS — no framework, no build step required to run it.

- **HTML** — one file per page (`index.html`, `about.html`, `services.html`, `locations.html`, `reserve.html`, `contact.html`, plus `privacy.html`, `terms.html`, `thank-you.html`, `404.html`)
- **CSS** — a single hand-maintained design system in [`assets/style.css`](assets/style.css) (design tokens, spacing scale, components)
- **JS** — [`assets/main.js`](assets/main.js): mobile nav, scroll-reveal animations, hero stat count-up, and AJAX form submission with inline validation
- **Forms** — [Netlify Forms](https://docs.netlify.com/forms/setup/) (`data-netlify="true"`) with a honeypot field and a required privacy-policy consent checkbox
- **Hosting** — [Netlify](https://www.netlify.com/), auto-deploying from `main`

## Project structure

```
.
├── index.html            Home
├── about.html             About / founder story
├── services.html          Packages, FAQs
├── locations.html         Advertising locations
├── reserve.html           Waitlist form
├── contact.html           Contact / quote form
├── thank-you.html         No-JS form fallback landing page
├── privacy.html           Privacy Policy (POPIA-oriented)
├── terms.html             Terms of Use
├── 404.html                Not-found page
├── sitemap.xml / robots.txt
├── netlify.toml            Build + security headers (CSP, HSTS, etc.)
└── assets/
    ├── style.css           Design system + components
    ├── main.js             Nav, scroll-reveal, stat count-up, form handling
    ├── favicon-*.png, apple-touch-icon.png, android-chrome-*.png
    ├── site.webmanifest
    └── og-image.png        Social share image
```

## Running locally

No build step — any static file server works:

```bash
python3 -m http.server 8080
# or
npx serve .
```

Then open `http://localhost:8080`.

## Deployment

Netlify watches `main` and deploys automatically on every push — nothing manual to trigger. `netlify.toml` sets security headers (CSP, `Referrer-Policy`, `Permissions-Policy`, HSTS) and publishes from the repo root.

## Editing content

The HTML pages here are generated from shared templates (shared header/footer, location list, FAQ list, etc.) kept in a separate local project, so that things like the nav links or footer only need to change in one place. If you're editing copy or structure, check with the maintainer for the template source rather than hand-editing the `.html` files directly — direct edits will be overwritten the next time the site is regenerated. `assets/style.css` and `assets/main.js` are maintained directly in this repo.

## Accessibility & performance

- Skip-to-content link, `<main>` landmark, visible focus states
- Scroll-reveal and hero animations respect `prefers-reduced-motion`
- JSON-LD structured data (`AdvertisingAgency`, `FAQPage`) for search
- Inline SVG icons and hero illustration — no external image requests for UI chrome

## Contact

Johannesburg & Soweto, South Africa — reach out via the [contact form](https://digital-visuals-jhb.netlify.app/contact.html).

---

© Digital Visuals. All rights reserved.
