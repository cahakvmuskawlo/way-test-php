# Hrshop

A calm field guide to working together.

Hrshop is an independent English-language editorial magazine about everyday
workplace practices — hiring conversations, onboarding, feedback rituals,
one-to-ones, meetings, remote-work rhythms and the small honest habits that
quietly hold a working team together.

**Nothing is sold here.** Hrshop is a free reading site. There are no products,
no subscriptions, no courses, no coaching, no recruiting service, no HR
software, and no affiliate links. Not now, not planned.

**Not affiliated.** Hrshop is chosen as the name of this editorial publication.
It is not affiliated with, endorsed by, or connected to any real-world HR
company, consultancy, software product or business that may share a similar
name.

**Not advice.** Nothing on Hrshop is legal, employment-law, HR, medical, or
mental-health advice. For your specific situation, consult a qualified
professional in your jurisdiction.

## Project structure

```
hrshop-com/
├── _dev/                Build sources (excluded from deployment ZIP)
│   ├── build.py         Shared data, articles, categories, sections
│   ├── build2.py        Homepage, articles, sections, categories, authors
│   ├── build3.py        About, legal, sitemap, rss, favicon, social-card
│   ├── bodies.py        Article body content (handwritten + spec composer)
│   ├── _header.html     Shared header template
│   └── _footer.html     Shared footer template
├── articles/            12 article pages
├── categories/          6 category pages + index
├── authors/             2 author pages + index
├── images/              Social card and other SVG art
├── css/style.css        Site styles (edit palette variables at top)
├── js/main.js           Progressive-enhancement JavaScript
├── index.html           Homepage
└── (top-level pages, sitemap.xml, robots.txt, rss.xml, etc.)
```

## Building

From the `_dev/` directory:

```bash
cd _dev
python3 build.py    # sanity-check the data model
python3 build2.py   # generate homepage + articles + section/category/author pages
python3 build3.py   # generate about/legal/sitemap/rss/favicon/etc
```

## Deploying

Static HTML — deploy the project root (excluding `_dev/` and any
`__pycache__/`) to any static host. Ensure the server serves `.html` files,
the `.htaccess` file (Apache) if you use Apache, and returns `/404.html`
for 404 errors.

## Editorial contact

- Editor:      editor@hrshop.com
- Pitches:     pitch@hrshop.com
- Corrections: corrections@hrshop.com
- Privacy:     privacy@hrshop.com

© 2026 Hrshop editorial. All rights reserved.
