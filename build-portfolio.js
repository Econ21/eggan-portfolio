const fs = require('fs');
const path = require('path');
const { LANGS, UI, EDUCATION, EXPERIENCE, COURSES, ACHIEVEMENTS, SKILLS, PROJECTS, MINISTRIES, SHOWCASE, LEADERSHIP, GALLERY, RESEARCH, CONTACT } = require('./data.js');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');

// ── i18n helper ──────────────────────────────────────────────────────────────
// t(field, lang) resolves a {nl,en,id} object to a string for that language,
// or passes a plain string through unchanged (some content — names, stacks —
// is language-neutral).
function t(field, lang) {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  return field[lang] ?? field.nl ?? '';
}

const PATHS = {
  home: { file: 'index.html', slug: '' },
  education: { file: 'education.html', slug: 'education' },
  work: { file: 'work.html', slug: 'work' },
  showcase: { file: 'creative-work.html', slug: 'creative-work' },
  research: { file: 'research.html', slug: 'research' },
  leadership: { file: 'leadership.html', slug: 'leadership' },
  contact: { file: 'contact.html', slug: 'contact' },
};

// Language-prefixed URL for a given page key + lang. nl lives at the site
// root (default); en/id live under /en/ and /id/.
function urlFor(pageKey, lang) {
  const slug = PATHS[pageKey].slug;
  const prefix = lang === 'nl' ? '' : `/${lang}`;
  return (prefix + '/' + slug).replace(/\/+/g, '/').replace(/\/$/, '') || '/';
}

function assetUrl(relPath) {
  // Pages live at root or one level down (/en/, /id/) — assets are always
  // referenced from site root so both depths resolve the same path.
  return '/assets/' + relPath;
}

// ── Shared design system (CSS) ──────────────────────────────────────────────
const CSS = `
:root {
  /* Warm Ivory — light theme */
  --black: #242321; --off-white: #F7F3EB; --white: #FFFFFF;
  --gray-light: #EFE6D6; --gray-dark: #2A2118;
  --accent: #A88443; --accent-light: #C8A65A; --accent-soft: #D8C18A; --accent-dark: #8A6D36;
  --ink: #242321; --ink-soft: #55524A;
  --text-muted: #6F6A60; --border: rgba(168,132,67,0.20); --border-dark: rgba(168,132,67,0.30);
  /* "Strong surface" — navbar, hero, footer, leadership grid, modals: the
     always-branded sections. Theme-aware: warm ivory + organic depth in light,
     black + gold + metallic veins in dark. */
  --surface-strong:
    radial-gradient(circle at 80% 10%, rgba(200,174,125,0.16) 0%, transparent 32%),
    radial-gradient(circle at 10% 85%, rgba(255,255,255,0.55) 0%, transparent 35%),
    linear-gradient(135deg, #F7F3EB 0%, #EFE6D6 55%, #F7F3EB 100%);
  --surface-text: #242321; --surface-text-soft: #55524A; --surface-text-muted: #6F6A60;
  --surface-border: rgba(168,132,67,0.28); --surface-card: #FBF7EF;
  --accent-contrast: #1A1610;
  --serif: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --theme-transition: background-color 400ms ease, background-image 400ms ease, color 300ms ease, border-color 300ms ease, box-shadow 300ms ease;
}
html[data-theme="dark"] {
  /* Black & Gold — dark theme */
  --off-white: #080909; --white: #0D0F10; --gray-light: #141414; --gray-dark: #1C1C1C;
  --accent: #D4AF37; --accent-light: #F2C35B; --accent-soft: #E6C978; --accent-dark: #A8843A;
  --ink: #F5F3EE; --ink-soft: #B8B6AF;
  --text-muted: #77766F; --border: rgba(212,175,55,0.14); --border-dark: rgba(212,175,55,0.18);
  --surface-strong:
    radial-gradient(circle at 75% 15%, rgba(212,175,55,0.07) 0%, transparent 28%),
    radial-gradient(circle at 15% 75%, rgba(255,255,255,0.03) 0%, transparent 25%),
    linear-gradient(120deg, transparent 40%, rgba(212,175,55,0.035) 48%, transparent 55%),
    linear-gradient(135deg, #080909 0%, #0D0F10 45%, #080909 100%);
  --surface-text: #F5F3EE; --surface-text-soft: #B8B6AF; --surface-text-muted: #77766F;
  --surface-border: rgba(212,175,55,0.20); --surface-card: #141414;
}
@media (prefers-color-scheme: dark) {
  html:not([data-theme="light"]) {
    --off-white: #080909; --white: #0D0F10; --gray-light: #141414; --gray-dark: #1C1C1C;
    --accent: #D4AF37; --accent-light: #F2C35B; --accent-soft: #E6C978; --accent-dark: #A8843A;
    --ink: #F5F3EE; --ink-soft: #B8B6AF;
    --text-muted: #77766F; --border: rgba(212,175,55,0.14); --border-dark: rgba(212,175,55,0.18);
    --surface-strong:
      radial-gradient(circle at 75% 15%, rgba(212,175,55,0.07) 0%, transparent 28%),
      radial-gradient(circle at 15% 75%, rgba(255,255,255,0.03) 0%, transparent 25%),
      linear-gradient(120deg, transparent 40%, rgba(212,175,55,0.035) 48%, transparent 55%),
      linear-gradient(135deg, #080909 0%, #0D0F10 45%, #080909 100%);
    --surface-text: #F5F3EE; --surface-text-soft: #B8B6AF; --surface-text-muted: #77766F;
    --surface-border: rgba(212,175,55,0.20); --surface-card: #141414;
  }
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0; background: var(--off-white); color: var(--ink);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  line-height: 1.55; -webkit-font-smoothing: antialiased;
  display: flex; flex-direction: column; min-height: 100vh;
  transition: var(--theme-transition);
  position: relative;
}
.page-main { flex: 1 0 auto; display: flex; flex-direction: column; }
.page-main > section:last-of-type { flex: 1 0 auto; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
::selection { background: var(--accent); color: var(--accent-contrast); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.font-display { font-family: 'Inter', -apple-system, sans-serif; font-weight: 800; letter-spacing: -0.02em; }
.wrap { max-width: 1260px; margin: 0 auto; padding: 0 48px; }
@media (max-width: 720px) { .wrap { padding: 0 22px; } }
.label { font-size: 11.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
.label-blue { color: var(--accent); }
.rule-blue { display: inline-block; width: 22px; height: 2px; background: var(--accent); margin-right: 10px; vertical-align: middle; }

/* Navbar */
.navbar { position: sticky; top: 0; z-index: 100; background: var(--surface-strong); border-bottom: 1px solid transparent; transition: border-color .2s ease, background-image .4s ease, background-color .4s ease; backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
.navbar.scrolled { border-bottom-color: var(--surface-border); }
.nav-inner { display: flex; align-items: center; justify-content: space-between; height: 68px; }
.nav-brand { font-weight: 800; letter-spacing: 0.02em; font-size: 14px; color: var(--surface-text); transition: color .3s ease; }
.nav-links { display: flex; align-items: center; gap: 30px; }
.nav-link { font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--surface-text-muted); transition: color .15s ease; }
.nav-link:hover, .nav-link.active { color: var(--surface-text); }
.nav-link.active { color: var(--accent); position: relative; }
.nav-link.active::after { content: ''; position: absolute; left: 0; right: 0; bottom: -22px; height: 1px; background: var(--accent); }
.lang-switch { position: relative; }
.lang-btn { font-size: 12px; font-weight: 700; color: var(--surface-text); background: none; border: 1px solid var(--surface-border); padding: 7px 12px; border-radius: 3px; cursor: pointer; letter-spacing: 0.05em; transition: border-color .2s ease; }
.lang-btn:hover { border-color: var(--accent); }
.lang-menu { display: none; position: absolute; right: 0; top: calc(100% + 6px); background: var(--surface-card); border: 1px solid var(--surface-border); min-width: 160px; border-radius: 3px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.25); }
.lang-switch.open .lang-menu { display: block; }
.lang-menu a { display: block; padding: 10px 14px; font-size: 12.5px; color: var(--surface-text-soft); }
.lang-menu a:hover { background: var(--surface-border); color: var(--surface-text); }
.lang-menu a.active { color: var(--accent); font-weight: 700; }
.theme-btn { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--surface-border); background: none; color: var(--surface-text); cursor: pointer; font-size: 13px; position: relative; transition: border-color .2s ease; }
.theme-btn:hover { border-color: var(--accent); }
.theme-icon { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; transition: opacity .15s ease, transform .15s ease; }
.theme-icon-moon { opacity: 0; transform: scale(0.6); }
html[data-theme="dark"] .theme-icon-sun { opacity: 0; transform: scale(0.6); }
html[data-theme="dark"] .theme-icon-moon { opacity: 1; transform: scale(1); }
.nav-burger { display: none; background: none; border: none; color: var(--surface-text); font-size: 22px; cursor: pointer; }
@media (max-width: 860px) {
  .nav-links { position: fixed; inset: 68px 0 0 0; background: var(--surface-strong); flex-direction: column; align-items: flex-start; padding: 28px 22px; gap: 22px; display: none; }
  .nav-links.open { display: flex; }
  .nav-burger { display: block; }
}

/* Hero */
.hero { background: var(--surface-strong); color: var(--surface-text); padding: 64px 0 0; transition: background-image .4s ease; }
.hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 40px; align-items: center; min-height: 76vh; }
@media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr; min-height: auto; } }
.hero-eyebrow { color: var(--accent); margin-bottom: 22px; }
.hero-headline { font-size: clamp(32px, 4.6vw, 58px); line-height: 1.05; margin: 0 0 22px; text-wrap: balance; color: var(--surface-text); }
.hero-sub { font-size: 16px; color: var(--surface-text-soft); max-width: 46ch; margin: 0 0 32px; text-align: justify; }
.text-accent { background: linear-gradient(110deg, var(--accent-dark), var(--accent-light), var(--accent-dark)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.btn { display: inline-flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 15px 26px; border-radius: 3px; border: none; cursor: pointer; transition: all .18s ease; }
.btn-primary { background: linear-gradient(135deg, var(--accent-dark) 0%, var(--accent) 45%, var(--accent-light) 70%, var(--accent-dark) 100%); color: var(--accent-contrast); }
.btn-primary:hover { filter: brightness(1.08); box-shadow: 0 8px 24px rgba(212,175,55,0.18); }
.btn-outline { border: 1px solid var(--surface-border); color: var(--surface-text); }
.btn-outline:hover { border-color: var(--accent); }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 48px; }
.hero-photo { aspect-ratio: 1/1.08; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; position: relative; }
.hero-photo img { width: 100%; height: 100%; object-fit: contain; object-position: bottom; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.35)); }
.hero-meta { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; border-top: 1px solid var(--surface-border); padding: 26px 0 40px; }
@media (max-width: 720px) { .hero-meta { grid-template-columns: repeat(2,1fr); } }
.hero-meta-label { color: var(--surface-text-muted); margin-bottom: 6px; }
.hero-meta-val { font-size: 13.5px; font-weight: 700; color: var(--surface-text); line-height: 1.35; }

/* Section header */
.section { padding: 90px 0; position: relative; }
.section-dark { background: var(--surface-strong); color: var(--surface-text); transition: background-image .4s ease; }
.section-off { background: var(--off-white); }
.section-white { background: var(--white); }
/* Content sections (off-white/white) get their own subtle ambient depth, distinct
   from --surface-strong — gold veins + grain in dark, warm organic glow in light. */
html[data-theme="dark"] .section-off,
html[data-theme="dark"] .section-white {
  background-image:
    radial-gradient(65% 120% at 6% 0%, rgba(212,175,55,0.05) 0%, transparent 60%),
    radial-gradient(55% 100% at 100% 100%, rgba(212,175,55,0.035) 0%, transparent 58%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
}
@media (prefers-color-scheme: dark) {
  html:not([data-theme="light"]) .section-off,
  html:not([data-theme="light"]) .section-white {
    background-image:
      radial-gradient(65% 120% at 6% 0%, rgba(212,175,55,0.05) 0%, transparent 60%),
      radial-gradient(55% 100% at 100% 100%, rgba(212,175,55,0.035) 0%, transparent 58%),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  }
}
html:not([data-theme="dark"]) .section-off,
html:not([data-theme="dark"]) .section-white {
  background-image:
    radial-gradient(60% 110% at 92% 0%, rgba(200,174,125,0.13) 0%, transparent 60%),
    radial-gradient(55% 100% at 4% 100%, rgba(255,255,255,0.6) 0%, transparent 55%);
}
@media (prefers-color-scheme: dark) {
  html[data-theme="light"] .section-off,
  html[data-theme="light"] .section-white {
    background-image:
      radial-gradient(60% 110% at 92% 0%, rgba(200,174,125,0.13) 0%, transparent 60%),
      radial-gradient(55% 100% at 4% 100%, rgba(255,255,255,0.6) 0%, transparent 55%);
  }
}
.section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 44px; flex-wrap: wrap; }
.section-title { font-size: clamp(24px, 3vw, 36px); margin: 10px 0 0; text-wrap: balance; }
.section-link { font-size: 12.5px; font-weight: 700; letter-spacing: 0.04em; }
.section-note { color: var(--text-muted); font-size: 14.5px; max-width: 60ch; margin: 14px 0 0; text-align: justify; }
.section-dark .section-note { color: var(--surface-text-muted); }

/* Cards: work */
.projects-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); }
@media (max-width: 820px) { .projects-grid { grid-template-columns: 1fr; } }
.project-card { background: var(--white); padding: 0; display: flex; flex-direction: column; cursor: pointer; border: none; text-align: left; font-family: inherit; color: inherit; width: 100%; position: relative; transition: box-shadow .3s ease; }
.project-card:hover { box-shadow: 0 20px 60px rgba(0,0,0,0.10), 0 0 0 1px var(--border); z-index: 1; }
.project-thumb { aspect-ratio: 16/10; overflow: hidden; background: var(--gray-light); }
.project-thumb img { width: 100%; height: 100%; object-fit: cover; object-position: top; transition: transform .3s ease; }
.project-card:hover .project-thumb img { transform: scale(1.02); }
.project-body { padding: 28px 30px 32px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
.project-num { color: var(--accent); font-weight: 700; font-size: 12px; letter-spacing: 0.06em; }
.project-name { font-size: 19px; font-weight: 800; margin: 0; }
.project-tag { font-size: 12.5px; color: var(--text-muted); margin: -4px 0 0; }
.project-desc { font-size: 14px; color: var(--ink-soft); margin: 4px 0 0; text-align: justify; }
.tag-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.tag { font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-muted); border: 1px solid var(--border); padding: 4px 9px; border-radius: 2px; }
.project-links { display: flex; align-items: center; gap: 16px; margin-top: 8px; flex-wrap: wrap; }
.project-cta { font-size: 12px; font-weight: 700; color: var(--accent); }
.project-cta-secondary { background: none; border: none; padding: 0; cursor: pointer; font-family: inherit; color: var(--text-muted); }
.project-cta-secondary:hover { color: var(--accent); }

/* Modal */
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.88); z-index: 200; padding: 24px; overflow-y: auto; }
.modal-overlay.open { display: flex; align-items: flex-start; justify-content: center; }
.modal { background: var(--surface-strong); color: var(--surface-text); max-width: 880px; width: 100%; margin: auto; border-radius: 4px; overflow: hidden; box-shadow: 0 0 0 1px var(--surface-border), 0 30px 80px rgba(0,0,0,0.4); }
.modal-top { display: flex; align-items: center; justify-content: space-between; padding: 20px 26px; border-bottom: 1px solid var(--surface-border); }
.modal-eyebrow { font-size: 11px; color: var(--surface-text-muted); letter-spacing: 0.08em; }
.modal-name { font-size: 17px; font-weight: 800; margin-top: 2px; }
.modal-close { background: none; border: 1px solid var(--surface-border); color: var(--surface-text-soft); font-size: 11px; font-weight: 700; letter-spacing: 0.06em; padding: 8px 14px; border-radius: 3px; cursor: pointer; transition: border-color .2s ease; }
.modal-close:hover { border-color: var(--accent); }
.carousel { position: relative; aspect-ratio: 16/10; background: #000; }
.carousel .slide { position: absolute; inset: 0; opacity: 0; transition: opacity .25s ease; }
.carousel .slide.active { opacity: 1; }
.carousel .slide img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.car-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 38px; height: 38px; border-radius: 50%; border: none; background: rgba(0,0,0,0.55); color: #fff; cursor: pointer; font-size: 16px; }
.car-prev { left: 12px; } .car-next { right: 12px; }
.car-counter { position: absolute; top: 12px; right: 12px; font-size: 11px; font-weight: 700; color: #fff; background: rgba(0,0,0,0.55); padding: 4px 10px; border-radius: 999px; }
.modal-body { padding: 22px 26px 28px; }
.modal-desc { font-size: 14px; color: var(--surface-text-soft); margin: 0; text-align: justify; }
.modal-highlights { list-style: none; margin: 18px 0 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
.modal-highlights li { font-size: 13px; color: var(--surface-text-soft); line-height: 1.55; padding-left: 18px; position: relative; }
.modal-highlights li::before { content: ''; position: absolute; left: 0; top: 7px; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }

/* About / education */
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
@media (max-width: 860px) { .about-grid { grid-template-columns: 1fr; gap: 32px; } }
.about-photo { aspect-ratio: 4/3.1; overflow: hidden; border-radius: 2px; box-shadow: 0 0 0 1px var(--border), 0 20px 50px rgba(0,0,0,0.18); transition: box-shadow .3s ease; }
.about-photo:hover { box-shadow: 0 0 0 1px var(--accent), 0 25px 60px rgba(212,175,55,0.10); }
.about-photo img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease, filter .4s ease; }
.about-photo:hover img { transform: scale(1.015); }
.about-body p { font-size: 15.5px; color: var(--ink-soft); margin: 0 0 16px; text-align: justify; }
.pullquote { font-size: 19px; font-weight: 700; color: var(--accent); border-left: 3px solid var(--accent); padding-left: 16px; margin: 26px 0 0; text-wrap: balance; }
.timeline { border-top: 1px solid var(--border); margin-top: 60px; padding-top: 40px; }
.timeline-item { display: grid; grid-template-columns: 130px 20px 1fr; gap: 6px; padding: 22px 0; border-bottom: 1px solid var(--border); align-items: start; transition: padding-left .25s ease; }
.timeline-item.has-logo { grid-template-columns: 130px 20px 44px 1fr; }
.timeline-item:last-child { border-bottom: none; }
.timeline-item:hover { padding-left: 4px; }
.timeline-period { font-size: 12.5px; font-weight: 700; color: var(--text-muted); }
.timeline-dot-col { display: flex; justify-content: center; }
.timeline-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); margin-top: 4px; box-shadow: 0 0 10px rgba(212,175,55,0.35); transition: transform .2s ease; }
.timeline-item:hover .timeline-dot { transform: scale(1.3); }
html:not([data-theme="dark"]) .timeline-dot { box-shadow: 0 0 8px rgba(168,132,67,0.25); }
.timeline-logo { display: flex; align-items: center; justify-content: center; }
.timeline-logo img { max-width: 40px; max-height: 40px; object-fit: contain; }
/* Some institution logos (e.g. Lübeck's seal) are solid black on a transparent
   background — invisible against the dark theme's near-black surface. A soft
   light backing plate keeps every logo legible regardless of its own colors. */
html[data-theme="dark"] .timeline-logo img,
html[data-theme="light"] .timeline-logo img { transition: background-color .3s ease; }
html[data-theme="dark"] .timeline-logo img { background: #F0EAD9; border-radius: 50%; padding: 5px; box-sizing: border-box; }
@media (prefers-color-scheme: dark) {
  html:not([data-theme="light"]) .timeline-logo img { background: #F0EAD9; border-radius: 50%; padding: 5px; box-sizing: border-box; }
}
.timeline-school { font-size: 16px; font-weight: 800; margin: 0; }
.timeline-degree { font-size: 14px; color: var(--text-muted); margin: 3px 0 0; }
.timeline-place { font-size: 12.5px; color: var(--text-muted); margin: 3px 0 0; }
.exp-desc { font-size: 13.5px; color: var(--ink-soft); margin: 8px 0 0; max-width: 62ch; line-height: 1.6; text-align: justify; }
@media (max-width: 600px) {
  .timeline-item { grid-template-columns: 20px 1fr; }
  .timeline-item.has-logo { grid-template-columns: 20px 36px 1fr; }
  .timeline-period { grid-column: 1/-1; margin-bottom: 4px; }
  .timeline-dot-col { grid-row: 2; }
  .timeline-logo { grid-row: 2; }
  .timeline-logo img { max-width: 30px; max-height: 30px; }
}

/* Courses & achievements */
.courses-achievements-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
@media (max-width: 800px) { .courses-achievements-grid { grid-template-columns: 1fr; gap: 40px; } }
.course-item { display: grid; grid-template-columns: 50px 1fr auto; gap: 14px; align-items: baseline; padding: 14px 0; border-bottom: 1px solid var(--border); }
.course-item:first-child { border-top: 1px solid var(--border); }
.course-year { font-size: 12px; font-weight: 700; color: var(--text-muted); }
.course-name { font-size: 14px; font-weight: 700; margin: 0; }
.course-org { font-size: 12.5px; color: var(--text-muted); margin: 2px 0 0; }
.course-score { font-size: 13px; font-weight: 800; color: var(--accent); white-space: nowrap; }
.achievement-item { display: grid; grid-template-columns: 50px 1fr; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border); }
.achievement-item:first-child { border-top: 1px solid var(--border); }
.achievement-year { font-size: 12px; font-weight: 700; color: var(--text-muted); }
.achievement-title { font-size: 14px; font-weight: 700; margin: 0; text-wrap: balance; }
.achievement-desc { font-size: 12.5px; color: var(--ink-soft); margin: 5px 0 0; line-height: 1.55; text-align: justify; }

/* Skills */
.skills-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 32px; }
@media (max-width: 800px) { .skills-grid { grid-template-columns: 1fr 1fr; } }
.skill-col-label { color: var(--accent); margin-bottom: 14px; display: block; }
.skill-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
.skill-list li { font-size: 14px; color: var(--ink-soft); }

/* Services */
.services-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); margin-top: 30px; }
@media (max-width: 800px) { .services-grid { grid-template-columns: 1fr 1fr; } }
.service-card { background: var(--white); padding: 26px 22px; }
.service-num { font-size: 12px; color: var(--accent); font-weight: 700; }
.service-name { font-size: 14.5px; font-weight: 800; margin: 10px 0 6px; }
.service-desc { font-size: 12.5px; color: var(--text-muted); text-align: justify; }

/* Leadership timeline */
.lead-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--border-dark); border: 1px solid var(--border-dark); }
@media (max-width: 820px) { .lead-grid { grid-template-columns: 1fr; } }
.lead-card { background: var(--surface-strong); padding: 26px 26px 28px; display: flex; flex-direction: column; gap: 10px; position: relative; transition: box-shadow .3s ease; }
.lead-card:hover { box-shadow: 0 20px 60px rgba(0,0,0,0.35); z-index: 1; }
.lead-card.has-img { padding: 0; }
.lead-img { aspect-ratio: 4/3; overflow: hidden; position: relative; background: var(--surface-strong); transition: aspect-ratio .25s ease; cursor: zoom-in; }
.lead-img img { width: 100%; height: 100%; object-fit: contain; transition: transform .3s ease; }
.lead-card:hover .lead-img:not(.lead-carousel) img { transform: scale(1.02); }
.lead-ig-link { position: absolute; bottom: 10px; right: 10px; z-index: 2; display: flex; align-items: center; gap: 5px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; color: #fff; background: rgba(0,0,0,0.55); padding: 6px 11px; border-radius: 999px; text-decoration: none; transition: background .15s ease; }
.lead-ig-link:hover { background: rgba(0,0,0,0.8); }
.lead-card:not(.has-img) .lead-ig-link { position: static; align-self: flex-start; margin-top: 4px; color: var(--surface-text); background: var(--surface-border); }
.lead-card:not(.has-img) .lead-ig-link:hover { background: var(--accent); color: var(--accent-contrast); }
.lead-carousel .lead-slide { position: absolute; inset: 0; opacity: 0; transition: opacity .25s ease; }
.lead-carousel .lead-slide.active { opacity: 1; }
.lead-car-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 34px; height: 34px; border-radius: 50%; border: none; background: rgba(0,0,0,0.55); color: #fff; cursor: pointer; font-size: 15px; z-index: 2; }
.lead-car-prev { left: 10px; } .lead-car-next { right: 10px; }
.lead-car-counter { position: absolute; top: 10px; right: 10px; font-size: 10.5px; font-weight: 700; color: #fff; background: rgba(0,0,0,0.55); padding: 3px 9px; border-radius: 999px; z-index: 2; }
.lead-card-body { padding: 22px 24px 26px; }

/* Ministries (home) */
.ministries-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; }
@media (max-width: 860px) { .ministries-grid { grid-template-columns: 1fr; } }
.ministry-card { border: 1px solid var(--border); border-radius: 3px; overflow: hidden; background: var(--white); transition: box-shadow .3s ease, border-color .3s ease; }
.ministry-card:hover { box-shadow: 0 20px 60px rgba(0,0,0,0.10); border-color: var(--accent-soft); }
.ministry-photo { aspect-ratio: 4/3; overflow: hidden; background: var(--gray-light); cursor: zoom-in; }
.ministry-photo img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.ministry-body { padding: 24px 26px 28px; }
.ministry-logos { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
.ministry-logo-img { height: 34px; width: auto; max-width: 120px; object-fit: contain; }
.ministry-logo-text { font-family: var(--serif); font-weight: 700; font-size: 13.5px; color: var(--ink-soft); border: 1px solid var(--border); border-radius: 3px; padding: 6px 10px; }
.ministry-name { font-size: 17px; font-weight: 800; margin: 0 0 10px; text-wrap: balance; }
.ministry-desc { font-size: 13.5px; color: var(--ink-soft); line-height: 1.65; margin: 0 0 20px; text-align: justify; }
.ministry-links { display: flex; flex-wrap: wrap; gap: 10px; }
.ministry-link.btn-outline { color: var(--ink); border-color: var(--border); }
.ministry-link.btn-outline:hover { border-color: var(--ink); }
.lead-year { font-size: 11px; color: var(--surface-text-muted); font-weight: 700; letter-spacing: 0.06em; }
.lead-org { font-size: 17px; font-weight: 800; margin: 6px 0 2px; color: var(--surface-text); }
.lead-role { font-size: 12.5px; color: var(--surface-text-muted); margin-bottom: 10px; }
.lead-stat { font-size: 24px; font-weight: 800; color: var(--accent); }
.lead-stat-label { font-size: 11px; color: var(--surface-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
.lead-desc { font-size: 13.5px; color: var(--surface-text-soft); line-height: 1.55; text-align: justify; }

/* Gallery — big single-photo slideshow (matches the project-modal carousel
   language) with a thumbnail strip underneath so every photo is visible at
   a glance, not just reachable by clicking into a lightbox. */
.gallery-main { position: relative; aspect-ratio: 16/9.5; background: #000; border-radius: 2px; overflow: hidden; transition: aspect-ratio .25s ease; }
.gallery-slide { position: absolute; inset: 0; opacity: 0; transition: opacity .3s ease; }
.gallery-slide.active { opacity: 1; }
.gallery-slide img { width: 100%; height: 100%; object-fit: contain; object-position: center; cursor: zoom-in; }
.gallery-main .car-btn { width: 44px; height: 44px; font-size: 18px; }
.gallery-caption-bar { position: absolute; left: 0; right: 0; bottom: 0; padding: 34px 20px 16px; background: linear-gradient(to top, rgba(0,0,0,.75), transparent); color: #fff; font-size: 13px; font-weight: 600; }
.gallery-thumbs { display: flex; gap: 10px; overflow-x: auto; padding: 4px 2px 8px; margin-top: 16px; }
.gallery-thumbs::-webkit-scrollbar { height: 6px; }
.gallery-thumbs::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
.gallery-thumb { flex: 0 0 92px; aspect-ratio: 4/3; border-radius: 2px; overflow: hidden; cursor: pointer; opacity: .5; border: 2px solid transparent; transition: opacity .15s ease, border-color .15s ease; background: none; padding: 0; }
.gallery-thumb img { width: 100%; height: 100%; object-fit: cover; }
.gallery-thumb.active { opacity: 1; border-color: var(--accent); }
@media (max-width: 640px) { .gallery-thumb { flex-basis: 68px; } }

/* Showcase (creative work grid) */
.showcase-teaser { padding-top: 64px; padding-bottom: 64px; }
.showcase-teaser-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
@media (max-width: 820px) { .showcase-teaser-grid { grid-template-columns: 1fr; gap: 32px; } }
.showcase-teaser-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.showcase-teaser-thumb { aspect-ratio: 1/1; overflow: hidden; border-radius: 3px; border: 1px solid var(--surface-border); }
.showcase-teaser-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
.showcase-teaser-thumb:hover img { transform: scale(1.06); }
.showcase-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
.showcase-filter-btn { font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-muted); background: none; border: 1px solid var(--border); padding: 8px 16px; border-radius: 999px; cursor: pointer; font-family: inherit; transition: all .2s ease; }
.showcase-filter-btn:hover { color: var(--ink); border-color: var(--accent); }
.showcase-filter-btn.active { color: var(--accent-contrast); background: var(--accent); border-color: var(--accent); }
.showcase-grid { columns: 2; column-gap: 14px; }
@media (min-width: 640px) { .showcase-grid { columns: 3; } }
@media (min-width: 1024px) { .showcase-grid { columns: 4; } }
.showcase-card { position: relative; display: block; width: 100%; margin: 0 0 14px; break-inside: avoid; overflow: hidden; border-radius: 4px; border: 1px solid var(--border); cursor: zoom-in; background: var(--gray-light); }
.showcase-card img, .showcase-card video { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s ease; }
.showcase-card:hover img, .showcase-card:hover video { transform: scale(1.035); }
.showcase-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%); opacity: .7; transition: opacity .25s ease; pointer-events: none; }
.showcase-card:hover::after { opacity: .9; }
.showcase-badge { position: absolute; left: 10px; bottom: 10px; font-size: 10px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #fff; background: rgba(0,0,0,0.55); backdrop-filter: blur(4px); padding: 4px 9px; border-radius: 999px; z-index: 1; }
.lightbox { display: none; position: fixed; inset: 0; background: #000; z-index: 300; align-items: center; justify-content: center; }
.lightbox.open { display: flex; }
.lightbox img { max-width: 90vw; max-height: 80vh; object-fit: contain; }
.lightbox-close { position: absolute; top: 20px; right: 24px; color: #fff; background: none; border: none; font-size: 14px; font-weight: 700; letter-spacing: 0.06em; cursor: pointer; }
.lightbox-counter { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); color: #fff; font-size: 12px; font-weight: 700; }
.lightbox-btn { position: absolute; top: 50%; transform: translateY(-50%); background: none; border: none; color: #fff; font-size: 30px; cursor: pointer; padding: 10px 16px; }
.lightbox-prev { left: 6px; } .lightbox-next { right: 6px; }

/* Research reader */
.research-list { display: flex; flex-direction: column; gap: 1px; background: var(--border); border: 1px solid var(--border); margin-top: 10px; }
.research-item { background: var(--white); padding: 28px 30px; display: grid; grid-template-columns: 1fr auto; gap: 18px; align-items: center; cursor: pointer; }
@media (max-width: 700px) { .research-item { grid-template-columns: 1fr; } }
.research-badge { display: inline-block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.05em; color: var(--accent); border: 1px solid var(--accent); padding: 3px 9px; border-radius: 999px; margin-bottom: 10px; }
.research-title { font-size: 17px; font-weight: 800; margin: 0 0 6px; text-wrap: balance; }
.research-meta { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
.research-abstract { font-size: 13.5px; color: var(--ink-soft); max-width: 62ch; text-align: justify; }
.reader-overlay { display: none; position: fixed; inset: 0; background: #000; z-index: 300; flex-direction: column; }
.reader-overlay.open { display: flex; }
.reader-top { display: flex; align-items: center; justify-content: space-between; padding: 16px 22px; color: #fff; }
.reader-body { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.reader-body img { max-width: 92vw; max-height: 82vh; object-fit: contain; }
.reader-btn { background: rgba(255,255,255,0.1); border: none; color: #fff; width: 46px; height: 46px; border-radius: 50%; font-size: 20px; cursor: pointer; }
.reader-nav { display: flex; align-items: center; justify-content: center; gap: 26px; padding: 18px; color: #fff; font-size: 12.5px; font-weight: 700; }

/* Contact */
.contact-section { display: flex; align-items: center; }
.contact-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 50px; align-items: end; }
@media (max-width: 800px) { .contact-grid { grid-template-columns: 1fr; } }
.contact-title { font-size: clamp(28px, 4vw, 42px); margin: 0 0 16px; text-wrap: balance; color: var(--surface-text); }
.contact-body { color: var(--surface-text-soft); font-size: 15px; max-width: 46ch; margin-bottom: 30px; text-align: justify; }
.contact-cta-row { display: flex; flex-wrap: wrap; gap: 12px; }
.contact-block { margin-bottom: 20px; }
.contact-block .label { color: var(--surface-text-muted); margin-bottom: 6px; display: block; }
.contact-val { font-size: 14.5px; font-weight: 700; color: var(--surface-text); }
.contact-val a:hover { color: var(--accent); }

/* Motion — restrained scroll-reveal, respects prefers-reduced-motion */
.reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1); }
.reveal.in { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }

/* Footer */
.footer { background: var(--surface-strong); color: var(--surface-text-muted); padding: 26px 0; border-top: 1px solid var(--surface-border); }
.footer-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; font-size: 12px; }
.footer-brand { color: var(--surface-text); font-weight: 800; }
`;

// ── Nav / footer / shell ─────────────────────────────────────────────────────
function navbar(lang, activeKey) {
  const items = ['home', 'education', 'work', 'research', 'leadership', 'contact'];
  const labelKeys = { home: 'navHome', education: 'navEducation', work: 'navWork', research: 'navResearch', leadership: 'navLeadership', contact: 'navContact' };
  const links = items.map(k => `<a class="nav-link${k === activeKey ? ' active' : ''}" href="${urlFor(k, lang)}">${t(UI[labelKeys[k]], lang)}</a>`).join('');
  const langLabels = { nl: 'NL', en: 'EN', id: 'ID' };
  const langMenu = LANGS.map(l => `<a class="${l === lang ? 'active' : ''}" href="${urlFor(activeKey, l)}">${l === 'nl' ? 'Nederlands' : l === 'en' ? 'English' : 'Bahasa Indonesia'}</a>`).join('');
  return `
  <nav class="navbar" id="navbar">
    <div class="wrap nav-inner">
      <a class="nav-brand" href="${urlFor('home', lang)}">EGGAN NACHSON SILUETA</a>
      <div style="display:flex;align-items:center;gap:22px">
        <div class="nav-links" id="navLinks">${links}</div>
        <div class="lang-switch" id="langSwitch">
          <button class="lang-btn" id="langBtn">${langLabels[lang]} ▾</button>
          <div class="lang-menu">${langMenu}</div>
        </div>
        <button class="theme-btn" id="themeBtn" type="button" aria-label="Toggle light/dark theme">
          <span class="theme-icon theme-icon-sun">☀</span><span class="theme-icon theme-icon-moon">☾</span>
        </button>
        <button class="nav-burger" id="navBurger">☰</button>
      </div>
    </div>
  </nav>`;
}

function footer(lang) {
  return `
  <footer class="footer">
    <div class="wrap footer-row">
      <span class="footer-brand">EGGAN NACHSON SILUETA</span>
      <span>${t(UI.footerTagline, lang)}</span>
      <span>© 2026 ${t(UI.footerRights, lang)}</span>
    </div>
  </footer>`;
}

const SHARED_JS = `
document.addEventListener('DOMContentLoaded', function () {
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  });
  var burger = document.getElementById('navBurger');
  var navLinks = document.getElementById('navLinks');
  if (burger) burger.addEventListener('click', function () { navLinks.classList.toggle('open'); });
  var langSwitch = document.getElementById('langSwitch');
  var langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.addEventListener('click', function (e) { e.stopPropagation(); langSwitch.classList.toggle('open'); });
  document.addEventListener('click', function () { if (langSwitch) langSwitch.classList.remove('open'); });

  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('cap_portfolio_theme', next); } catch (e) {}
  });

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }
});

var GL_IMGS = []; var GL_IDX = 0;
function openGlobalLightbox(imgs, startIdx) {
  GL_IMGS = imgs; GL_IDX = startIdx || 0;
  glRender();
  document.getElementById('globalLightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeGlobalLightbox() {
  document.getElementById('globalLightbox').classList.remove('open');
  document.body.style.overflow = '';
  var v = document.getElementById('glVideo'); if (v) v.pause();
}
function glRender() {
  var url = GL_IMGS[GL_IDX];
  var isVideo = /\\.(mp4|webm|mov)(\\?|$)/i.test(url);
  var img = document.getElementById('glImg'), vid = document.getElementById('glVideo');
  if (isVideo) {
    img.style.display = 'none'; vid.style.display = 'block';
    vid.src = url; vid.currentTime = 0; vid.play().catch(function () {});
  } else {
    vid.pause(); vid.style.display = 'none'; img.style.display = 'block';
    img.src = url;
  }
  document.getElementById('glCounter').textContent = (GL_IDX + 1) + ' / ' + GL_IMGS.length;
  document.getElementById('glCounter').style.display = GL_IMGS.length > 1 ? 'block' : 'none';
  var prevBtn = document.getElementById('glPrevBtn'), nextBtn = document.getElementById('glNextBtn');
  var show = GL_IMGS.length > 1 ? 'flex' : 'none';
  if (prevBtn) prevBtn.style.display = show;
  if (nextBtn) nextBtn.style.display = show;
}
function glNext() { GL_IDX = (GL_IDX + 1) % GL_IMGS.length; glRender(); }
function glPrev() { GL_IDX = (GL_IDX - 1 + GL_IMGS.length) % GL_IMGS.length; glRender(); }
document.addEventListener('keydown', function (e) {
  var gl = document.getElementById('globalLightbox');
  if (!gl || !gl.classList.contains('open')) return;
  if (e.key === 'Escape') closeGlobalLightbox();
  if (e.key === 'ArrowRight') glNext();
  if (e.key === 'ArrowLeft') glPrev();
});
`;

// Blocking, pre-paint theme read — avoids a flash of the wrong theme on load.
const THEME_INIT_JS = `(function(){try{var t=localStorage.getItem('cap_portfolio_theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

const SITE_URL = 'https://eggan.vercel.app';

function pageShell({ lang, activeKey, title, description, bodyHtml, extraJs = '' }) {
  const path = urlFor(activeKey, lang);
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>${THEME_INIT_JS}</script>
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${SITE_URL}${path}">
<link rel="icon" type="image/png" href="${assetUrl('favicon-32.png')}" sizes="32x32">
<link rel="icon" type="image/png" href="${assetUrl('favicon-16.png')}" sizes="16x16">
<link rel="apple-touch-icon" href="${assetUrl('apple-touch-icon.png')}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE_URL}${path}">
<meta property="og:image" content="${SITE_URL}${assetUrl('og-image.jpg')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${SITE_URL}${assetUrl('og-image.jpg')}">
<style>${CSS}</style>
</head>
<body>
${navbar(lang, activeKey)}
<main class="page-main">
${bodyHtml}
</main>
${footer(lang)}
<div class="lightbox" id="globalLightbox">
  <button class="lightbox-close" onclick="closeGlobalLightbox()">${t(UI.close, lang)} ✕</button>
  <button class="lightbox-btn lightbox-prev" id="glPrevBtn" onclick="glPrev()">‹</button>
  <img id="glImg" alt="" />
  <video id="glVideo" controls playsinline style="display:none;max-width:90vw;max-height:80vh"></video>
  <button class="lightbox-btn lightbox-next" id="glNextBtn" onclick="glNext()">›</button>
  <span class="lightbox-counter" id="glCounter">1 / 1</span>
</div>
<script>${SHARED_JS}${extraJs}</script>
</body>
</html>`;
}

// ── Page builders ────────────────────────────────────────────────────────────
function buildHome(lang) {
  const title = 'Eggan Nachson Silueta — Technology, Strategy & Leadership';
  const desc = 'Eggan Nachson Silueta is a technology consultant, product builder and community leader working across digital products, AI, data and public impact.';
  const meta = [
    [t(UI.metaBasedIn, lang), t(UI.metaBasedInVal, lang)],
    [t(UI.metaEducation, lang), t(UI.metaEducationVal, lang)],
    [t(UI.metaBuilt, lang), t(UI.metaBuiltVal, lang)],
    [t(UI.metaCommunity, lang), t(UI.metaCommunityVal, lang)],
  ].map(([l, v]) => `<div><p class="label hero-meta-label">${l}</p><p class="hero-meta-val">${v}</p></div>`).join('');

  const topProjects = PROJECTS.slice(0, 2).map(p => projectCardHtml(p, lang)).join('');
  const topLeadership = LEADERSHIP.slice(0, 4).map((l, i) => leadershipCardHtml(l, lang, 'home-' + i)).join('');
  const ministriesHtml = MINISTRIES.map(m => {
    const logos = m.logos.map(l => l.img
      ? `<img src="${assetUrl('logos/' + l.img)}" alt="${l.name}" title="${l.name}" class="ministry-logo-img" />`
      : `<span class="ministry-logo-text" title="${l.name}">${l.text}</span>`).join('');
    const links = [
      m.org ? `<a class="btn btn-outline ministry-link" href="${m.org.url}" target="_blank" rel="noopener noreferrer">${t(UI.viewOrg, lang)} ↗</a>` : '',
      `<a class="btn btn-primary ministry-link" href="${m.product.url}" target="_blank" rel="noopener noreferrer">${t(UI.visitSite, lang)} — ${m.product.name} ↗</a>`,
    ].join('');
    return `
    <div class="ministry-card reveal">
      <div class="ministry-photo" style="aspect-ratio:${ratioToCss(m.photoRatio)}" onclick="openGlobalLightbox([${JSON.stringify(assetUrl('ministries/' + m.photo))}], 0)"><img src="${assetUrl('ministries/' + m.photo)}" alt="${t(m.ministryName, lang)}" loading="lazy" /></div>
      <div class="ministry-body">
        <div class="ministry-logos">${logos}</div>
        <p class="ministry-name">${t(m.ministryName, lang)}</p>
        <p class="ministry-desc">${t(m.desc, lang)}</p>
        <div class="ministry-links">${links}</div>
      </div>
    </div>`;
  }).join('');

  const body = `
  <section class="hero">
    <div class="wrap hero-grid">
      <div>
        <p class="label hero-eyebrow">${t(UI.heroEyebrow, lang)}</p>
        <h1 class="font-display hero-headline">${t(UI.heroHeadline, lang)}</h1>
        <p class="hero-sub">${t(UI.heroSub, lang)}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${urlFor('work', lang)}">${t(UI.heroCtaWork, lang)} ↓</a>
          <a class="btn btn-outline" href="${urlFor('contact', lang)}">${t(UI.heroCtaContact, lang)} ↗</a>
          <a class="btn btn-outline" href="${assetUrl('Eggan-Nachson-Silueta-CV.pdf')}" target="_blank" rel="noopener noreferrer">${t(UI.heroCtaCv, lang)} ↓</a>
        </div>
      </div>
      <div class="hero-photo"><img src="${assetUrl('profile-nobg.png')}" alt="Eggan Nachson Silueta" /></div>
    </div>
    <div class="wrap hero-meta">${meta}</div>
  </section>

  <section class="section section-white">
    <div class="wrap">
      <p class="label label-blue"><span class="rule-blue"></span>${t(UI.ministriesEyebrow, lang)}</p>
      <h2 class="font-display section-title" style="margin-top:10px">${t(UI.ministriesTitle, lang)}</h2>
      <p class="section-note">${t(UI.ministriesNote, lang)}</p>
      <div class="ministries-grid" style="margin-top:30px">${ministriesHtml}</div>
    </div>
  </section>

  <section class="section section-off">
    <div class="wrap">
      <div class="section-head">
        <div><p class="label label-blue"><span class="rule-blue"></span>${t(UI.homeSectionWork, lang)}</p><h2 class="font-display section-title">${t(UI.workPageEyebrow, lang)}</h2></div>
        <a class="section-link" href="${urlFor('work', lang)}">${t(UI.viewAll, lang)} →</a>
      </div>
      <div class="projects-grid">${topProjects}</div>
    </div>
  </section>

  <section class="section section-dark">
    <div class="wrap">
      <div class="section-head">
        <div><p class="label label-blue"><span class="rule-blue"></span>${t(UI.homeSectionLeadership, lang)}</p><h2 class="font-display section-title">${t(UI.leadershipPageTitle, lang)}</h2></div>
        <a class="section-link" style="color:var(--surface-text)" href="${urlFor('leadership', lang)}">${t(UI.viewAll, lang)} →</a>
      </div>
      <div class="lead-grid">${topLeadership}</div>
    </div>
  </section>
  ${projectModals(lang)}`;

  return pageShell({ lang, activeKey: 'home', title, description: desc, bodyHtml: body, extraJs: LEAD_CAROUSEL_JS + PROJECT_MODAL_JS });
}

function timelineHtml(lang) {
  return EDUCATION.map(e => `
    <div class="timeline-item reveal${e.logo ? ' has-logo' : ''}">
      <p class="timeline-period">${e.period}${e.periodSuffix ? ' ' + t(e.periodSuffix, lang) : ''}</p>
      <div class="timeline-dot-col"><span class="timeline-dot"></span></div>
      ${e.logo ? `<div class="timeline-logo"><img src="${assetUrl('logos/' + e.logo)}" alt="${e.school}" loading="lazy" /></div>` : ''}
      <div>
        <p class="timeline-school">${e.school}</p>
        <p class="timeline-degree">${t(e.degree, lang)}</p>
        <p class="timeline-place">${t(e.place, lang)}</p>
      </div>
    </div>`).join('');
}

function experienceHtml(lang) {
  return EXPERIENCE.map(e => `
    <div class="timeline-item reveal">
      <p class="timeline-period">${e.period}${e.periodSuffix ? ' ' + t(e.periodSuffix, lang) : ''}</p>
      <div class="timeline-dot-col"><span class="timeline-dot"></span></div>
      <div>
        <p class="timeline-school">${e.org}</p>
        <p class="timeline-degree">${t(e.role, lang)}</p>
        <p class="exp-desc">${t(e.desc, lang)}</p>
      </div>
    </div>`).join('');
}

function coursesHtml(lang) {
  return COURSES.map(c => `
    <div class="course-item reveal">
      <span class="course-year">${c.year}</span>
      <div class="course-body"><p class="course-name">${t(c.name, lang)}</p><p class="course-org">${c.org}</p></div>
      <span class="course-score">${c.score}</span>
    </div>`).join('');
}

function achievementsHtml(lang) {
  return ACHIEVEMENTS.map(a => `
    <div class="achievement-item reveal">
      <span class="achievement-year">${a.year}</span>
      <div><p class="achievement-title">${t(a.title, lang)}</p><p class="achievement-desc">${t(a.desc, lang)}</p></div>
    </div>`).join('');
}

function skillsHtml(lang) {
  const cols = [
    [UI.skillBuild, SKILLS.build],
    [UI.skillAi, SKILLS.ai],
    [UI.skillData, SKILLS.data],
    [UI.skillStrategy, SKILLS.strategy],
  ];
  return cols.map(([label, items]) => `
    <div>
      <span class="label skill-col-label">${t(label, lang)}</span>
      <ul class="skill-list">${items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>`).join('');
}

function buildEducation(lang) {
  const title = `Eggan Nachson Silueta — ${t(UI.navEducation, lang)}`;
  const body = `
  <section class="section section-off">
    <div class="wrap">
      <p class="label label-blue">${t(UI.eduPageEyebrow, lang)}</p>
      <div class="about-grid" style="margin-top:20px">
        <div class="about-photo"><img src="${assetUrl('about-speaking.jpg')}" alt="Eggan Nachson Silueta speaking" /></div>
        <div class="about-body">
          <span class="rule-blue" style="display:block;width:34px;margin:0 0 18px"></span>
          <h1 class="font-display" style="font-size:clamp(24px,3.2vw,36px);margin:0 0 18px;text-wrap:balance">${t(UI.eduPageTitle, lang)}</h1>
          <p>${t(UI.eduPageBody, lang)}</p>
          <p class="pullquote">${t(UI.eduPagePullquote, lang)}</p>
        </div>
      </div>
    </div>
  </section>
  <section class="section section-white">
    <div class="wrap">
      <p class="label label-blue">${t(UI.experienceTitle, lang)}</p>
      <div class="timeline" style="margin-top:20px">${experienceHtml(lang)}</div>
    </div>
  </section>
  <section class="section section-off">
    <div class="wrap">
      <div class="timeline" style="margin-top:0;border-top:none;padding-top:0">
        <p class="label label-blue" style="margin-bottom:20px">${t(UI.eduTimelineTitle, lang)}</p>
        ${timelineHtml(lang)}
      </div>
    </div>
  </section>
  <section class="section section-white">
    <div class="wrap courses-achievements-grid">
      <div>
        <p class="label label-blue">${t(UI.coursesTitle, lang)}</p>
        <div class="courses-list" style="margin-top:22px">${coursesHtml(lang)}</div>
      </div>
      <div>
        <p class="label label-blue">${t(UI.achievementsTitle, lang)}</p>
        <div class="achievements-list" style="margin-top:22px">${achievementsHtml(lang)}</div>
      </div>
    </div>
  </section>
  <section class="section section-off">
    <div class="wrap">
      <p class="label label-blue">${t(UI.skillsTitle, lang)}</p>
      <div class="skills-grid" style="margin-top:26px">${skillsHtml(lang)}</div>
    </div>
  </section>`;
  return pageShell({ lang, activeKey: 'education', title, description: title, bodyHtml: body });
}

function projectCardHtml(p, lang) {
  const dir = p.dir ? `${p.dir}/` : '';
  // Whole card links straight to the real, live product — that's the primary
  // proof-of-work action. Screenshots stay one click away via a secondary
  // trigger (stopPropagation) instead of eating the main click target.
  return `
  <a class="project-card reveal" href="${p.url}" target="_blank" rel="noopener noreferrer">
    <div class="project-thumb"><img src="${assetUrl('work/' + dir + p.thumb)}" alt="${t(p.name, lang)}" loading="lazy" /></div>
    <div class="project-body">
      <span class="project-num">${p.num}</span>
      <p class="project-name">${t(p.name, lang)}</p>
      <p class="project-tag">${t(p.tag, lang)}</p>
      <p class="project-desc">${t(p.desc, lang)}</p>
      <div class="tag-row">${p.stack.map(s => `<span class="tag">${s}</span>`).join('')}</div>
      <div class="project-links">
        <span class="project-cta">${t(UI.visitSite, lang)} ↗</span>
        <button type="button" class="project-cta project-cta-secondary" onclick="event.preventDefault();event.stopPropagation();openModal('${p.slug}')">${t(UI.viewScreens, lang)} →</button>
      </div>
    </div>
  </a>`;
}

function projectModals(lang) {
  return PROJECTS.map(p => {
    const dir = p.dir;
    const imgs = dir ? fs.readdirSync(path.join(ROOT, 'shots', dir)).filter(f => /\.(jpg|jpeg|png)$/i.test(f)).sort() : [p.thumb];
    const slides = imgs.map((f, i) => `<div class="slide${i === 0 ? ' active' : ''}"><img src="${assetUrl('work/' + (dir ? dir + '/' : '') + f)}" alt="${t(p.name, lang)}" /></div>`).join('');
    return `
    <div class="modal-overlay" id="modal-${p.slug}" onclick="if(event.target===this) closeModal('${p.slug}')">
      <div class="modal">
        <div class="modal-top">
          <div><p class="modal-eyebrow">${t(UI.projectLabel, lang)} ${p.num}</p><p class="modal-name">${t(p.name, lang)}</p></div>
          <button class="modal-close" onclick="closeModal('${p.slug}')">${t(UI.close, lang)} ✕</button>
        </div>
        <div class="carousel" id="car-${p.slug}">
          ${slides}
          ${imgs.length > 1 ? `<button class="car-btn car-prev" onclick="prevSlide('${p.slug}')">‹</button><button class="car-btn car-next" onclick="nextSlide('${p.slug}')">›</button><span class="car-counter" id="counter-${p.slug}">1 / ${imgs.length}</span>` : ''}
        </div>
        <div class="modal-body">
          <p class="modal-desc">${t(p.desc, lang)}</p>
          ${p.highlights ? `<ul class="modal-highlights">${(p.highlights[lang] || p.highlights.nl).map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
          <div class="tag-row" style="margin-top:16px">${p.stack.map(s => `<span class="tag">${s}</span>`).join('')}</div>
          <a class="btn btn-primary" style="margin-top:20px" href="${p.url}" target="_blank" rel="noopener noreferrer">${t(UI.visitSite, lang)} ↗</a>
        </div>
      </div>
    </div>`;
  }).join('') + `<script>var SLIDE_COUNTS = {${PROJECTS.map(p => {
    const imgs = p.dir ? fs.readdirSync(path.join(ROOT, 'shots', p.dir)).filter(f => /\.(jpg|jpeg|png)$/i.test(f)) : [1];
    return `'${p.slug}': ${imgs.length}`;
  }).join(',')}}; var current = {${PROJECTS.map(p => `'${p.slug}': 0`).join(',')}};</script>`;
}

const PROJECT_MODAL_JS = `
function openModal(id) { document.getElementById('modal-' + id).classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById('modal-' + id).classList.remove('open'); document.body.style.overflow = ''; }
function renderSlide(id) {
  var idx = current[id]; var car = document.getElementById('car-' + id);
  car.querySelectorAll('.slide').forEach(function (s, i) { s.classList.toggle('active', i === idx); });
  var counter = document.getElementById('counter-' + id);
  if (counter) counter.textContent = (idx + 1) + ' / ' + SLIDE_COUNTS[id];
}
function nextSlide(id) { current[id] = (current[id] + 1) % SLIDE_COUNTS[id]; renderSlide(id); }
function prevSlide(id) { current[id] = (current[id] - 1 + SLIDE_COUNTS[id]) % SLIDE_COUNTS[id]; renderSlide(id); }
document.addEventListener('keydown', function (e) {
  var openId = null;
  Object.keys(SLIDE_COUNTS).forEach(function (id) { var m = document.getElementById('modal-' + id); if (m && m.classList.contains('open')) openId = id; });
  if (!openId) return;
  if (e.key === 'Escape') closeModal(openId);
  if (e.key === 'ArrowRight') nextSlide(openId);
  if (e.key === 'ArrowLeft') prevSlide(openId);
});
`;

function buildWork(lang) {
  const title = `Eggan Nachson Silueta — ${t(UI.navWork, lang)}`;
  const services = [
    { name: { nl: 'Digitale Productontwikkeling', en: 'Digital Product Development', id: 'Pengembangan Produk Digital' }, desc: { nl: 'Van idee tot productieklare webapplicatie.', en: 'From idea to production-ready web application.', id: 'Dari ide hingga aplikasi web siap produksi.' } },
    { name: { nl: 'AI-integratie', en: 'AI Integration', id: 'Integrasi AI' }, desc: { nl: 'AI-gedreven automatisering en intelligente ervaringen.', en: 'AI-driven automation and intelligent experiences.', id: 'Otomasi berbasis AI dan pengalaman cerdas.' } },
    { name: { nl: 'Business & data-systemen', en: 'Business & Data Systems', id: 'Sistem Bisnis & Data' }, desc: { nl: 'Dashboards en systemen voor betere besluitvorming.', en: 'Dashboards and systems for better decision-making.', id: 'Dashboard dan sistem untuk pengambilan keputusan lebih baik.' } },
    { name: { nl: 'Beveiliging & technische audit', en: 'Security & Technical Audit', id: 'Audit Keamanan & Teknis' }, desc: { nl: 'Zorg dat je systemen veilig en betrouwbaar zijn.', en: 'Ensure your systems are secure, reliable and scalable.', id: 'Pastikan sistem Anda aman, andal, dan skalabel.' } },
  ];
  const body = `
  <section class="section section-off">
    <div class="wrap">
      <p class="label label-blue">${t(UI.workPageEyebrow, lang)}</p>
      <p class="section-note">${t(UI.workPageNote, lang)}</p>
      <div class="projects-grid" style="margin-top:34px">${PROJECTS.map(p => projectCardHtml(p, lang)).join('')}</div>
    </div>
  </section>
  <section class="section section-dark showcase-teaser">
    <div class="wrap showcase-teaser-grid">
      <div>
        <p class="label" style="color:var(--accent)">${t(UI.showcaseTeaserLabel, lang)}</p>
        <h2 class="font-display section-title" style="margin-top:10px">${t(UI.showcaseTeaserTitle, lang)}</h2>
        <p class="section-note" style="color:var(--surface-text-soft)">${t(UI.showcaseTeaserNote, lang)}</p>
        <a class="btn btn-primary" style="margin-top:24px" href="${urlFor('showcase', lang)}">${t(UI.showcaseTeaserCta, lang)} →</a>
      </div>
      <div class="showcase-teaser-strip">${SHOWCASE.filter(s => s.type === 'image').slice(0, 6).map(s => `
        <div class="showcase-teaser-thumb"><img src="${s.poster}" alt="" loading="lazy" /></div>
      `).join('')}</div>
    </div>
  </section>
  <section class="section section-white">
    <div class="wrap">
      <p class="label label-blue">${t(UI.skillsTitle, lang)}</p>
      <div class="skills-grid" style="margin-top:26px">${skillsHtml(lang)}</div>
      <p class="label label-blue" style="margin-top:60px">${t(UI.servicesTitle, lang)}</p>
      <div class="services-grid">${services.map((s, i) => `
        <div class="service-card reveal"><p class="service-num">0${i + 1}</p><p class="service-name">${t(s.name, lang)}</p><p class="service-desc">${t(s.desc, lang)}</p></div>
      `).join('')}</div>
    </div>
  </section>
  ${projectModals(lang)}`;
  return pageShell({ lang, activeKey: 'work', title, description: title, bodyHtml: body, extraJs: PROJECT_MODAL_JS });
}

function ratioToCss(r) { return (r || '1:1').replace(':', '/'); }

function showcaseCardHtml(item, idx) {
  const isVideo = item.type === 'video';
  const badgeKey = isVideo ? 'showcaseBadgeVideo' : 'showcaseBadgeImage';
  return `
  <div class="showcase-card" data-type="${item.type}" style="aspect-ratio:${ratioToCss(item.ratio)}"
    onmouseenter="${isVideo ? `this.querySelector('video').play().catch(()=>{})` : ''}"
    onmouseleave="${isVideo ? `var v=this.querySelector('video');v.pause();v.currentTime=0` : ''}"
    onclick="openGlobalLightbox(SC_URLS, ${idx})">
    ${isVideo
      ? `<video src="${item.file}" poster="${item.poster}" muted loop playsinline preload="metadata"></video>`
      : `<img src="${item.poster}" alt="CAP creation" loading="lazy" />`}
    <span class="showcase-badge">SC_BADGE_${badgeKey}</span>
  </div>`;
}

function buildShowcase(lang) {
  const title = `Eggan Nachson Silueta — ${t(UI.showcasePageTitle, lang)}`;
  const cards = SHOWCASE.map((item, i) => showcaseCardHtml(item, i))
    .join('')
    .replace(/SC_BADGE_showcaseBadgeVideo/g, t(UI.showcaseBadgeVideo, lang))
    .replace(/SC_BADGE_showcaseBadgeImage/g, t(UI.showcaseBadgeImage, lang));
  const body = `
  <section class="section section-off">
    <div class="wrap">
      <p class="label label-blue">${t(UI.showcasePageEyebrow, lang)}</p>
      <h1 class="font-display section-title">${t(UI.showcasePageTitle, lang)}</h1>
      <p class="section-note">${t(UI.showcasePageNote, lang)}</p>
      <div class="showcase-filters">
        <button type="button" class="showcase-filter-btn active" data-filter="all" onclick="scFilter('all',this)">${t(UI.showcaseFilterAll, lang)}</button>
        <button type="button" class="showcase-filter-btn" data-filter="video" onclick="scFilter('video',this)">${t(UI.showcaseFilterVideo, lang)}</button>
        <button type="button" class="showcase-filter-btn" data-filter="image" onclick="scFilter('image',this)">${t(UI.showcaseFilterImage, lang)}</button>
      </div>
      <div class="showcase-grid" id="showcaseGrid" style="margin-top:26px">${cards}</div>
    </div>
  </section>`;
  const js = `
  var SC_URLS = ${JSON.stringify(SHOWCASE.map(s => s.type === 'video' ? s.file : (s.poster || s.file)))};
  function scFilter(type, btn) {
    document.querySelectorAll('.showcase-filter-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.querySelectorAll('.showcase-card').forEach(function (c) {
      c.style.display = (type === 'all' || c.dataset.type === type) ? '' : 'none';
    });
  }`;
  return pageShell({ lang, activeKey: 'work', title, description: title, bodyHtml: body, extraJs: js });
}

function leadershipCardHtml(l, lang, idx) {
  const yearText = l.year + (l.yearSuffix ? ' ' + t(l.yearSuffix, lang) : '');
  const igLink = l.link ? `<a class="lead-ig-link" href="${l.link}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${t(UI.viewInstagram, lang)} ↗</a>` : '';
  const inner = `
    <p class="lead-year">${yearText}</p>
    <p class="lead-org">${l.org}</p>
    <p class="lead-role">${t(l.role, lang)}</p>
    ${l.stat ? `<p class="lead-stat">${l.stat}</p><p class="lead-stat-label">${t(l.statLabel, lang)}</p>` : ''}
    <p class="lead-desc">${t(l.desc, lang)}</p>
    ${!l.images && !l.img ? igLink : ''}`;
  const images = l.images || (l.img ? [l.img] : []);
  if (images.length > 1) {
    const id = 'lead-' + idx;
    const urls = JSON.stringify(images.map(img => assetUrl('leadership/' + img))).replace(/"/g, '&quot;');
    const slides = images.map((img, i) => `<div class="lead-slide${i === 0 ? ' active' : ''}"><img src="${assetUrl('leadership/' + img)}" alt="${l.org}" loading="lazy" onload="leadSyncRatio(this)" /></div>`).join('');
    return `<div class="lead-card has-img reveal">
      <div class="lead-img lead-carousel" id="${id}" onclick="openGlobalLightbox(JSON.parse(this.dataset.imgs), this.dataset.idx|0)" data-imgs="${urls}">
        ${slides}
        <button type="button" class="lead-car-btn lead-car-prev" onclick="event.preventDefault();event.stopPropagation();leadPrev('${id}',${images.length})">‹</button>
        <button type="button" class="lead-car-btn lead-car-next" onclick="event.preventDefault();event.stopPropagation();leadNext('${id}',${images.length})">›</button>
        <span class="lead-car-counter" id="${id}-counter">1 / ${images.length}</span>
        ${igLink}
      </div>
      <div class="lead-card-body">${inner}</div>
    </div>`;
  }
  if (images.length === 1) {
    const urls = JSON.stringify([assetUrl('leadership/' + images[0])]).replace(/"/g, '&quot;');
    return `<div class="lead-card has-img reveal">
      <div class="lead-img" onclick="openGlobalLightbox(${urls}, 0)"><img src="${assetUrl('leadership/' + images[0])}" alt="${l.org}" loading="lazy" onload="leadSyncRatio(this)" />${igLink}</div>
      <div class="lead-card-body">${inner}</div>
    </div>`;
  }
  return `<div class="lead-card reveal">${inner}</div>`;
}

const LEAD_CAROUSEL_JS = `
function leadSyncRatio(img) {
  var box = img.closest('.lead-img');
  if (!box || !img.naturalWidth) return;
  if (box.classList.contains('lead-carousel') && !img.closest('.lead-slide').classList.contains('active')) return;
  box.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight;
}
function leadShow(id, idx) {
  var car = document.getElementById(id);
  if (!car) return;
  var slides = car.querySelectorAll('.lead-slide');
  slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
  car.dataset.idx = idx;
  var counter = document.getElementById(id + '-counter');
  if (counter) counter.textContent = (idx + 1) + ' / ' + slides.length;
  var activeImg = slides[idx].querySelector('img');
  if (activeImg.complete) leadSyncRatio(activeImg);
}
function leadNext(id, count) { var car = document.getElementById(id); var idx = ((car.dataset.idx | 0) + 1) % count; leadShow(id, idx); }
function leadPrev(id, count) { var car = document.getElementById(id); var idx = ((car.dataset.idx | 0) - 1 + count) % count; leadShow(id, idx); }
document.querySelectorAll('.lead-img img').forEach(function (img) { if (img.complete) leadSyncRatio(img); });
`;

function buildLeadership(lang) {
  const title = `Eggan Nachson Silueta — ${t(UI.navLeadership, lang)}`;
  const gallerySlides = GALLERY.map((g, i) => `
    <div class="gallery-slide${i === 0 ? ' active' : ''}" data-idx="${i}">
      <img src="${assetUrl('gallery/' + g.img)}" alt="${t(g.caption, lang)}" loading="lazy" onclick="openLightbox(galIdx)" onload="if(+this.closest('.gallery-slide').dataset.idx===galIdx)galSyncRatio(this)" />
    </div>`).join('');
  const galleryThumbs = GALLERY.map((g, i) => `
    <button type="button" class="gallery-thumb${i === 0 ? ' active' : ''}" data-idx="${i}" onclick="goGallery(${i})">
      <img src="${assetUrl('gallery/' + g.img)}" alt="${t(g.caption, lang)}" loading="lazy" />
    </button>`).join('');
  const lightboxSlides = GALLERY.map((g, i) => `<img class="lb-slide" data-idx="${i}" src="${assetUrl('gallery/' + g.img)}" style="display:${i === 0 ? 'block' : 'none'}" alt="${t(g.caption, lang)}" />`).join('');

  const body = `
  <section class="section section-dark">
    <div class="wrap">
      <p class="label label-blue" style="color:var(--accent)">${t(UI.leadershipPageEyebrow, lang)}</p>
      <h1 class="font-display section-title">${t(UI.leadershipPageTitle, lang)}</h1>
      <div class="lead-grid" style="margin-top:40px">${LEADERSHIP.map((l, i) => leadershipCardHtml(l, lang, i)).join('')}</div>
    </div>
  </section>
  <section class="section section-off">
    <div class="wrap">
      <p class="label label-blue">${t(UI.galleryTitle, lang)}</p>
      <p class="section-note">${t(UI.galleryNote, lang)}</p>
      <div class="gallery-main" id="galleryMain" style="margin-top:24px">
        ${gallerySlides}
        <button class="car-btn car-prev" onclick="galNav(-1)">‹</button>
        <button class="car-btn car-next" onclick="galNav(1)">›</button>
        <span class="car-counter" id="galCounter">1 / ${GALLERY.length}</span>
        <div class="gallery-caption-bar" id="galCaption">${t(GALLERY[0].caption, lang)}</div>
      </div>
      <div class="gallery-thumbs" id="galleryThumbs">${galleryThumbs}</div>
    </div>
  </section>
  <div class="lightbox" id="lightbox">
    <button class="lightbox-close" onclick="closeLightbox()">${t(UI.close, lang)} ✕</button>
    <button class="lightbox-btn lightbox-prev" onclick="lbNav(-1)">‹</button>
    ${lightboxSlides}
    <button class="lightbox-btn lightbox-next" onclick="lbNav(1)">›</button>
    <span class="lightbox-counter" id="lbCounter">1 / ${GALLERY.length}</span>
  </div>`;

  const js = LEAD_CAROUSEL_JS + `
  var GAL_CAPTIONS = ${JSON.stringify(GALLERY.map(g => t(g.caption, lang)))};
  var galIdx = 0; var GAL_COUNT = ${GALLERY.length};
  function galSyncRatio(img) {
    var box = document.getElementById('galleryMain');
    if (!box || !img.naturalWidth) return;
    box.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight;
  }
  function renderGallery() {
    document.querySelectorAll('.gallery-slide').forEach(function (s) { s.classList.toggle('active', +s.dataset.idx === galIdx); });
    document.querySelectorAll('.gallery-thumb').forEach(function (t) { t.classList.toggle('active', +t.dataset.idx === galIdx); });
    document.getElementById('galCounter').textContent = (galIdx + 1) + ' / ' + GAL_COUNT;
    document.getElementById('galCaption').textContent = GAL_CAPTIONS[galIdx];
    var thumb = document.querySelector('.gallery-thumb[data-idx="' + galIdx + '"]');
    if (thumb) thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    var activeImg = document.querySelector('.gallery-slide[data-idx="' + galIdx + '"] img');
    if (activeImg && activeImg.complete) galSyncRatio(activeImg);
  }
  document.querySelectorAll('.gallery-slide.active img').forEach(function (img) { if (img.complete) galSyncRatio(img); });
  function galNav(dir) { galIdx = (galIdx + dir + GAL_COUNT) % GAL_COUNT; renderGallery(); }
  function goGallery(i) { galIdx = i; renderGallery(); }

  var lbIdx = 0; var LB_COUNT = ${GALLERY.length};
  function openLightbox(i) { lbIdx = i; renderLb(); document.getElementById('lightbox').classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); document.body.style.overflow = ''; }
  function renderLb() {
    document.querySelectorAll('.lb-slide').forEach(function (s) { s.style.display = (+s.dataset.idx === lbIdx) ? 'block' : 'none'; });
    document.getElementById('lbCounter').textContent = (lbIdx + 1) + ' / ' + LB_COUNT;
  }
  function lbNav(dir) { lbIdx = (lbIdx + dir + LB_COUNT) % LB_COUNT; renderLb(); }
  document.addEventListener('keydown', function (e) {
    if (document.getElementById('lightbox').classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') lbNav(1);
      if (e.key === 'ArrowLeft') lbNav(-1);
      return;
    }
    if (e.key === 'ArrowRight') galNav(1);
    if (e.key === 'ArrowLeft') galNav(-1);
  });`;
  return pageShell({ lang, activeKey: 'leadership', title, description: title, bodyHtml: body, extraJs: js });
}

function buildResearch(lang) {
  const title = `Eggan Nachson Silueta — ${t(UI.navResearch, lang)}`;
  const items = RESEARCH.map(r => `
    <div class="research-item reveal" onclick="openReader('${r.slug}')">
      <div>
        <span class="research-badge">${t(r.badge, lang)}</span>
        <p class="research-title">${r.title}</p>
        <p class="research-meta">${t(r.meta, lang)} — ${r.authors}</p>
        <p class="research-abstract">${t(r.abstract, lang)}</p>
      </div>
      <span class="project-cta">${t(UI.openReader, lang)} →</span>
    </div>`).join('');

  const readers = RESEARCH.map(r => {
    const dir = r.slug;
    const imgs = Array.from({ length: r.pages }, (_, i) => `${dir}-${String(i + 1).padStart(2, '0')}.jpg`);
    return `<div class="reader-overlay" id="reader-${r.slug}" data-count="${r.pages}">
      <div class="reader-top">
        <span>${r.title}</span>
        <button class="reader-btn" style="width:auto;border-radius:3px;padding:8px 16px;font-size:11px;font-weight:700" onclick="closeReader('${r.slug}')">${t(UI.close, lang)} ✕</button>
      </div>
      <div class="reader-body">
        ${imgs.map((f, i) => `<img class="reader-page" data-idx="${i}" src="${assetUrl('research/' + dir + '/' + f)}" style="display:${i === 0 ? 'block' : 'none'}" />`).join('')}
      </div>
      <div class="reader-nav">
        <button class="reader-btn" onclick="readerNav('${r.slug}',-1)">‹</button>
        <span id="readerCounter-${r.slug}">1 / ${r.pages}</span>
        <button class="reader-btn" onclick="readerNav('${r.slug}',1)">›</button>
      </div>
    </div>`;
  }).join('');

  const body = `
  <section class="section section-off">
    <div class="wrap">
      <p class="label label-blue">${t(UI.researchPageEyebrow, lang)}</p>
      <p class="section-note">${t(UI.researchPageNote, lang)}</p>
      <div class="research-list">${items}</div>
    </div>
  </section>
  ${readers}`;

  const js = `
  var readerIdx = {${RESEARCH.map(r => `'${r.slug}': 0`).join(',')}};
  function openReader(slug) {
    document.getElementById('reader-' + slug).classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeReader(slug) { document.getElementById('reader-' + slug).classList.remove('open'); document.body.style.overflow = ''; }
  function readerNav(slug, dir) {
    var overlay = document.getElementById('reader-' + slug);
    var count = +overlay.dataset.count;
    readerIdx[slug] = (readerIdx[slug] + dir + count) % count;
    overlay.querySelectorAll('.reader-page').forEach(function (p) { p.style.display = (+p.dataset.idx === readerIdx[slug]) ? 'block' : 'none'; });
    document.getElementById('readerCounter-' + slug).textContent = (readerIdx[slug] + 1) + ' / ' + count;
  }
  document.addEventListener('keydown', function (e) {
    var open = document.querySelector('.reader-overlay.open');
    if (!open) return;
    var slug = open.id.replace('reader-', '');
    if (e.key === 'Escape') closeReader(slug);
    if (e.key === 'ArrowRight') readerNav(slug, 1);
    if (e.key === 'ArrowLeft') readerNav(slug, -1);
  });`;
  return pageShell({ lang, activeKey: 'research', title, description: title, bodyHtml: body, extraJs: js });
}

function buildContact(lang) {
  const title = `Eggan Nachson Silueta — ${t(UI.navContact, lang)}`;
  const body = `
  <section class="section section-dark contact-section">
    <div class="wrap contact-grid">
      <div>
        <h1 class="font-display contact-title">${t(UI.contactTitle, lang)}</h1>
        <p class="contact-body">${t(UI.contactBody, lang)}</p>
        <div class="contact-cta-row">
          <a class="btn btn-primary" href="${CONTACT.waIndonesia.link}" target="_blank" rel="noopener noreferrer">${t(CONTACT.waIndonesia.label, lang)} ↗</a>
          <a class="btn btn-primary" href="${CONTACT.waNetherlands.link}" target="_blank" rel="noopener noreferrer">${t(CONTACT.waNetherlands.label, lang)} ↗</a>
        </div>
      </div>
      <div>
        <div class="contact-block"><span class="label">${t(UI.contactLocation, lang)}</span><p class="contact-val">${t(CONTACT.location, lang)}</p></div>
        <div class="contact-block"><span class="label">${t(UI.contactEmail, lang)}</span><p class="contact-val"><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></p></div>
        <div class="contact-block"><span class="label">${t(CONTACT.waIndonesia.label, lang)}</span><p class="contact-val"><a href="${CONTACT.waIndonesia.link}" target="_blank" rel="noopener noreferrer">${CONTACT.waIndonesia.phone}</a></p></div>
        <div class="contact-block"><span class="label">${t(CONTACT.waNetherlands.label, lang)}</span><p class="contact-val"><a href="${CONTACT.waNetherlands.link}" target="_blank" rel="noopener noreferrer">${CONTACT.waNetherlands.phone}</a></p></div>
      </div>
    </div>
  </section>`;
  return pageShell({ lang, activeKey: 'contact', title, description: title, bodyHtml: body });
}

// ── Write everything ─────────────────────────────────────────────────────────
function writeFile(lang, key, html) {
  const dir = lang === 'nl' ? OUT : path.join(OUT, lang);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, PATHS[key].file), html);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name), d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
copyDir(path.join(ROOT, 'assets'), path.join(OUT, 'assets'));

fs.writeFileSync(path.join(OUT, 'vercel.json'), JSON.stringify({ cleanUrls: true, trailingSlash: false }, null, 2));

for (const lang of LANGS) {
  writeFile(lang, 'home', buildHome(lang));
  writeFile(lang, 'education', buildEducation(lang));
  writeFile(lang, 'work', buildWork(lang));
  writeFile(lang, 'showcase', buildShowcase(lang));
  writeFile(lang, 'leadership', buildLeadership(lang));
  writeFile(lang, 'research', buildResearch(lang));
  writeFile(lang, 'contact', buildContact(lang));
}

console.log('Built', LANGS.length * Object.keys(PATHS).length, 'pages into', OUT);
