# Design Brief — Eggan Nachson Portfolio Redesign

Status: **REFERENCE ONLY — DO NOT BUILD YET.** User explicitly said (2026-08-14) he still needs to
walk through this point-by-point before implementation starts, and more asset folders are still
coming. This file exists so the direction survives across sessions — read it, but treat the actual
go-ahead to start coding as a separate, later instruction.

## Origin

User generated this brief himself using ChatGPT, paired with a mockup/reference screenshot (image,
not saved as a file here — described below from what was visible). He pasted both into this session
and asked me to save it to memory/this repo before any building starts, since he has more to explain
and more files to add first.

## Reference mockup (screenshot description)

Black sticky navbar: "EGGAN NACHSON" left, nav links (WORK / LEADERSHIP / ABOUT / CONTACT) +
language dropdown ("EN ▾" → English / Nederlands / Bahasa Indonesia) right, blue active-state text.
Hero: split ~50/50, left = small blue eyebrow label "TECHNOLOGY × STRATEGY × LEADERSHIP", huge bold
headline "I BUILD SYSTEMS THAT ACTUALLY WORK.", subhead paragraph, two CTAs (solid blue primary +
outlined secondary), a 4-column metadata row (Based In / Education / Built / Community) with tiny
icons; right = his actual red-backdrop portrait, uncropped, full-bleed. Below: white "About" split
section (photo left of him speaking at a podium, headline + copy + blue highlighted pull-quote
right) with a vertical dotted education timeline (blue dots) along the right edge. Then "SELECTED
WORK" — 2-column project grid, each card numbered (01–04), screenshot thumbnail, tags, "View case
study →". Then a full-black "BEYOND THE CODE / LEADERSHIP & COMMUNITY" section: horizontal
timeline (years above a thin blue line) with 6 photo cards below it, each org/role/stat/description,
white text on black, blue accents on stats. Then off-white "FIELD NOTES / MOMENTS FROM THE FIELD"
horizontal photo strip with manual ← → arrows. Then white "SKILLS & EXPERTISE" (4 plain-text columns:
Build / AI / Data / Strategy) beside a "SERVICES" 4-block grid (numbered 01–04). Closing full-black
contact section: "LET'S BUILD SOMETHING USEFUL." + location/email/phone + "GET IN TOUCH ↗". Minimal
black footer (name / tagline / copyright / back-to-top).

## Full written brief (verbatim from ChatGPT, as pasted by user)

You are a senior European digital product designer, creative developer, UX engineer, and motion designer.

Redesign my existing personal portfolio website: https://eggan.vercel.app/

The goal is NOT to make a generic portfolio website. The goal is to transform it into a premium,
editorial, highly polished personal portfolio that feels like the website of a senior technology
consultant / product builder / public-sector leader who is credible enough to be hired by companies
in Indonesia and Europe.

USE THE PROVIDED REFERENCE IMAGE AS THE PRIMARY VISUAL ART-DIRECTION REFERENCE.

The final website should feel: premium, editorial, European, sophisticated, confident, highly
intentional, technical but human, clean, minimal, sharp, credible, modern, slightly cinematic.

DO NOT: look AI-generated-template, use generic startup landing-page patterns, use excessive
gradients, use purple-blue AI gradients, round every component, use excessive glassmorphism, look
like a SaaS template, over-animate everything.

The visual identity should combine two sides of Eggan: (1) TECHNOLOGY / PRODUCT / ENGINEERING and
(2) LEADERSHIP / COMMUNITY / PUBLIC IMPACT — these must feel like one coherent personal brand.

### 1. Core visual direction
Strict system. Primary colors: BLACK #050505, OFF WHITE #F7F7F4, WHITE #FFFFFF, LIGHT GRAY #E9E9E6,
DARK GRAY #181818, ACCENT BLUE #2457FF. Optional very subtle red only where the real profile photo
requires it. Blue used sparingly (CTA, links, timeline dots, small labels, active nav, selected
states, small graphic accents) — not the whole site. Page alternates WHITE/OFF-WHITE editorial
sections and BLACK/DARK sections for rhythm.

### 2. Typography
Modern European grotesk/neo-grotesk. Display: "Manrope", "Sora", or "Space Grotesk" (or, if
available, a Neue Montreal/Helvetica Now/Suisse Intl-style face). Body: "Inter" or "DM Sans" (or
Inter/Helvetica/Arial). Clean, compact, strong, editorial, slightly technical. Bold headlines but
not excessively huge. Avoid serif, sci-fi, decorative, overly rounded fonts. Frequent uppercase
letter-spaced labels for metadata (SELECTED WORK / LEADERSHIP & COMMUNITY / FIELD NOTES / SKILLS &
EXPERTISE / SERVICES / CONTACT).

### 3. Layout system
Desktop max content width 1200–1280px, horizontal padding 48–64px; mobile 20–24px. Strong 12-column
grid, most sections aligned to it. No random centering. Use asymmetric/split layouts, large
whitespace, strong horizontal rules, editorial alignment. Cards: subtle 1px borders, very small
radius or square corners, restrained shadows, clean type. Not rounded-cards-everywhere.

### 4. Navbar
Sticky top nav. Left: EGGAN NACHSON. Right: WORK / LEADERSHIP / ABOUT / CONTACT / [EN ▾]. Black
background, 64–72px height, small uppercase/compact type, stays visible while scrolling — becomes
slightly more compact + subtle bottom border on scroll-down, gently returns on scroll-up. No
excessive animation. Language dropdown: English / Nederlands / Bahasa Indonesia, dark dropdown,
active language in blue accent, no flags, subtle and professional. Mobile: hamburger.

### 5. Page intro / loading motion
Short premium sequence, 700–1000ms max. Black screen → "EGGAN NACHSON" → thin horizontal line
animates left→right → "TECHNOLOGY · STRATEGY · LEADERSHIP" → subtle vertical clip/reveal into the
page. Must become interactive quickly, no long loader.

### 6. Hero section
Desktop: left ~50–55%, right ~45–50%. Left: small blue label "TECHNOLOGY × STRATEGY × LEADERSHIP",
large tight-spaced bold headline "I BUILD SYSTEMS THAT ACTUALLY WORK.", subhead paragraph, two CTAs
("EXPLORE MY WORK ↓" primary/blue, "LET'S CONNECT ↗" secondary/outlined or white), then a metadata
row with tiny icons: BASED IN (The Hague, Netherlands) / EDUCATION (2× Master's Degrees) / BUILT (4
Production Systems) / COMMUNITY (20K+ Network Across Indonesia). Right: his actual professional
portrait dominating the half, face never cropped, photo kept authentic (can sit against its real red
backdrop). Subtle entrance: image opacity+translateX(30px) in, text enters slightly earlier — not
word-by-word animation.

### 7. Hero micro-interaction
Subtle cursor parallax on the hero photo (~3–5px on hover), not overdone. Buttons: on hover, blue
darkens slightly, arrow moves 4px, 200ms transition.

### 8. About / profile section
White/off-white background, split editorial layout. Left: large photo of him speaking at an event.
Right: headline "I WORK BETWEEN TECHNOLOGY AND PEOPLE.", copy about working at the intersection of
technology/strategy/community, then a blue-highlighted pull-quote sentence: "How can technology
create something useful beyond the screen?"

### 9. Education timeline
Right side, vertical line with blue dots. Entries (2026–Present The Hague University of Applied
Sciences MSc Data-Driven Business; 2023–2025 Universitas Indonesia MSc Strategic Intelligence;
2018–2022 ITB Swadharma BSc Informatics Engineering). Animates on viewport entry: line grows
vertically, dots appear sequentially, no flashy bounce.

### 10. Selected work
Label "SELECTED WORK", headline "SYSTEMS I'VE BUILT", "View all projects →" link. 2-column grid, 4
projects (Creative AI Partner / MatchupSkills / Operations System / Lumbung Jakut), each: real
screenshot, description, tech-stack tags, "View case study →".

### 11. Project card interaction
Click opens a fullscreen/large dark modal, not immediate navigation. Header "PROJECT 01 / CREATIVE
AI PARTNER" + "× CLOSE". Large screenshot carousel with manual ← / 01 of 05 / → controls (click,
keyboard arrows, swipe — no autoplay). Below: Problem / Solution / My Role / Technology / Impact.
Modal entrance: opacity 0→1, scale 0.98→1, 250–350ms.

### 12. Leadership & Community
Must feel special — BLACK background, white type, blue accents. Label "BEYOND THE CODE", headline
"LEADERSHIP & COMMUNITY", "See full journey →" link. Horizontal editorial timeline — press-kit /
achievement-wall energy, not a resume. Each card: YEAR, PHOTO, ORGANIZATION, ROLE, STATISTIC, SHORT
DESCRIPTION. Example entries given: Indonesian Creative Cities Network (Director, 20K+ Network &
Community), Indonesia Mengglobal (VP Strategic Partnerships & Communications, 10K+ Scholars &
Members), UNESCO & UNDP Indonesia (Speaker, International Forum), Gerakan Sungai Bersih (Chief
Branding & Creative, 218K+ Community Reach), Generasi Berdampak Indonesia (Chief Branding & Creative,
15K+ Community Reach), Mentor & Trainer (50+ Events & Workshops). Use the actual supplied photos.

### 13. Leadership timeline interaction
Desktop horizontal timeline, thin blue line drawing left→right as the section enters viewport, cards
reveal sequentially (opacity 0→1, translateY(20px)→0, no bounce). Hover: image zooms 1.03x, card
border brightens, statistic turns blue.

### 14. Leadership full journey
"See full journey →" opens a dedicated page or large modal with the complete timeline — editorial
storytelling, not resume formatting; each entry can include year/org/position/impact/photo/metrics/
event photos/links.

### 15. Photo gallery
Off-white background, label "FIELD NOTES", headline "MOMENTS FROM THE FIELD", "View all photos →"
link. Horizontal gallery, large real photos (no stock), **manual-only navigation** (← / → buttons,
no autoplay). Click opens a fullscreen black lightbox: centered image, "CLOSE ×" top-right, "01 / 24"
counter + ← → at bottom, mouse/keyboard/touch-swipe support. Users must be able to see ALL photos.

### 16. Gallery motion
Images reveal with slight horizontal movement on viewport entry. Hover: scale 1.02. Arrow buttons
move 3–5px on hover. Keep it subtle — photos are the focus, not the animation.

### 17. Skills & Expertise
White section, headline "SKILLS & EXPERTISE", 4 columns (BUILD / AI / DATA / STRATEGY), simple line
icons, plain text lists — no colorful skill bars, no percentage meters, no fake proficiency scores.
Example lists given: BUILD (Next.js, React, TypeScript, Supabase, PostgreSQL, APIs, System Design),
AI (LLM Integration, AI Agents, Automation, Prompt Engineering, AI Product Architecture), DATA (Data
Analytics, Business Intelligence, Data Visualization, Data-driven Decision Making), STRATEGY (Product
Strategy, Project Management, Partnerships, Community Development, Public Initiatives).

### 18. Services
Same or following section. Headline "SERVICES", 4 numbered blocks (01 Digital Product Development,
02 AI Integration, 03 Business & Data Systems, 04 Security & Technical Audit), each with title, 1–2
line description, number, arrow that moves right on hover.

### 19. Contact / CTA
Strong black closing section. Headline "LET'S BUILD SOMETHING USEFUL.", supporting copy, then
Location / Email / Phone-WhatsApp / social links, CTA "GET IN TOUCH ↗". Should feel like the closing
page of an editorial publication.

### 20. Footer
Black, minimal. Left "EGGAN NACHSON", center "Technology · Strategy · Leadership", right "© 2026 All
rights reserved.", small back-to-top "↑".

### 21. Scroll behavior
Smooth scroll to anchors (WORK/LEADERSHIP/ABOUT/CONTACT). Active nav item updates via
IntersectionObserver as user scrolls. No scroll hijacking, nothing that feels unnatural.

### 22. Motion design system
One coherent, restrained, "expensive-feeling" motion language. Standard reveal: opacity 0→1 +
translateY(24px)→0, 600–800ms, cubic-bezier(0.22, 1, 0.36, 1). Hover 180–250ms. Large image reveal
800–1000ms. Avoid bouncing, spinning, excessive parallax, particle/glow effects, cursor trails,
floating elements.

### 23. Custom graphics
Subtle technical-grid/editorial-rule/data-point/timeline-marker/thin-line/coordinate/system-label/
project-number motifs (e.g. "01 / 04 SELECTED SYSTEM", "SYSTEM 01 PRODUCTION"), used sparingly. No
decorative blobs, no generic AI illustrations.

### 24. Cursor
Desktop only. Small dark dot by default; expands slightly on link hover; small "VIEW" circle on
project-image hover; small "OPEN" circle on gallery hover. Extremely subtle. Disabled on mobile.

### 25. Responsive design
Fully responsive: 12-col desktop, 6-col tablet, 1-col mobile. Mobile hero: image first or directly
under headline, type scales intelligently, nav becomes hamburger, project cards stack vertically,
leadership timeline becomes vertical, gallery becomes horizontal swipe carousel. Redesign hierarchy
for mobile, don't just shrink desktop.

### 26. Accessibility
Semantic HTML (proper H1/H2/H3), alt text on every meaningful image, full keyboard access
(navigation, modals, gallery, language selector), ESC closes modals, ←/→ navigate gallery/carousel.
Respect `prefers-reduced-motion` — disable non-essential animation when set.

### 27. Performance
Lazy-load images, responsive image sizes, don't load all gallery images immediately, modern formats
(WebP/AVIF) without sacrificing quality excessively. Target Lighthouse 90+ across Performance/
Accessibility/Best Practices/SEO.

### 28. SEO
Title "Eggan Nachson — Technology, Strategy & Leadership". Meta description: "Eggan Nachson is a
technology consultant, product builder and community leader working across digital products, AI,
data and public impact." Open Graph metadata, canonical URL, Person structured data.

### 29. Content strategy
Must NOT read like a traditional CV. Hierarchy should communicate: "I build things." / "I understand
technology." / "I understand business." / "I can lead people." / "I have real-world impact." / "I can
operate internationally." Prioritize WORK / LEADERSHIP / IMPACT / EXPERIENCE / EDUCATION / SKILLS /
CONTACT framing over generic Resume/Experience/Skills/Education framing.

### 30. Visual hierarchy
1. Eggan's identity → 2. What he builds → 3. Real products → 4. Leadership/impact → 5. Photography →
6. Skills → 7. Contact. Photography treated as an editorial asset, not shrunk into tiny thumbnails.

### 31. Important image rule
Use the real photos/screenshots provided. Do NOT generate fake replacement people, do NOT use
AI-generated profile photos, do NOT change his appearance or alter his face or retouch his identity.
Profile photo must stay authentic — use the actual supplied portrait as the primary hero image.

### 32. Language system
Supports English / Nederlands / Bahasa Indonesia. ⚠️ **This brief says English should be the default
if no preference is detected** — this directly conflicts with the user's own earlier instruction
this same session that Dutch should be the default language. Do not silently pick one; confirm with
the user which default is actually correct before implementing. Switcher "EN ▾" with dropdown
(English / Nederlands / Bahasa Indonesia); all UI text must go through a translation dictionary
(`translations = { en: {...}, nl: {...}, id: {...} }`), never hardcoded.

### 33. URL / routing structure
Prefers clean routes if the framework supports it (/, /work, /leadership, /about, /contact, project
detail at /work/slug, language at /en /nl /id) OR a client-side switcher if keeping the current
single-page architecture — "choose the implementation that best fits the existing project... do not
unnecessarily rebuild the entire application architecture if the current codebase is already
functional." ⚠️ Current reality: this repo is a single static `index.html` generated by
`build-portfolio.js`, vanilla HTML/CSS/JS, no framework, no routing, no build tool. True multi-route
URLs would mean introducing a framework/build step — a real architecture decision to make explicitly
with the user, not something to slip in silently just because this brief mentions it as an option.

### 34. Technical implementation
Inspect the existing project first, don't blindly replace everything — identify framework/
components/CSS architecture/image assets/routing/existing data, then refactor. Suggested component
list: Navbar, Hero, SectionHeader, AboutSection, EducationTimeline, ProjectCard, ProjectModal,
LeadershipTimeline, LeadershipCard, Gallery, GalleryLightbox, SkillsGrid, ServicesGrid,
ContactSection, Footer, LanguageSwitcher. Keep data separate from UI (projects.ts, leadership.ts,
gallery.ts, translations.ts style separation — adapted to whatever this repo's actual tooling ends up
being).

### 35. Design details
Thin horizontal rules throughout, strong section spacing (desktop 100–140px vertical padding; hero
min 85vh; project section 120px top/bottom; leadership 120–160px; gallery 100px; contact 120–160px).
Avoid excessive card shadows, subtle borders, whitespace does most of the visual work.

### 36. Small premium details
Numbered project cards ("01 / 04" etc.), small uppercase section labels (SELECTED WORK / BEYOND THE
CODE / FIELD NOTES / EXPERTISE / CONTACT), small blue rules beside section labels, one consistent
icon family, consistent arrow glyphs (↗ and →) — not icons mixed from multiple styles.

### 37. Final art direction
Should feel like: European consulting website + premium editorial magazine + technology portfolio +
public leadership profile. Reference qualities: Swiss grid discipline, Scandinavian restraint,
European consulting credibility, modern product design, editorial photography, technical precision.
NOT: generic Webflow template, generic AI portfolio, gaming site, crypto site, SaaS landing page,
overly futuristic, flashy personal branding.

### 38. Final UX goal
Within 5 seconds a recruiter should understand: WHO (Eggan Nachson), WHAT (technology/product/data
professional), WHAT HE DOES (builds digital products and AI-powered systems), WHY DIFFERENT (combines
engineering with strategy and national-level leadership), PROOF (real products + real leadership +
real photographs + measurable impact), WHERE (The Hague/Netherlands + Indonesia), NEXT ACTION (view
work or contact).

### 39. Final instruction
Don't merely copy the reference screenshot — use it as the visual design language, recreate its
hierarchy/grid/spacing/typography/black-white rhythm/blue accent/editorial structure/project cards/
leadership timeline/photography/navbar/buttons/interaction/motion, but adapt everything to Eggan's
real identity and real content, so the result feels custom-designed, not templated. Full production-
ready implementation expected (not a static mockup) — inspect codebase/assets first, preserve useful
existing functionality, build a clear component architecture, implement design system + responsive
layouts + motion + project modals + leadership timeline + manual gallery nav + language switching +
image optimization, then test desktop/tablet/mobile/accessibility/nav/modals/gallery/language
switching end to end.

## Open questions / conflicts to resolve with the user before building

1. **Language default conflict**: this brief says English-default; user's own earlier instruction
   this session said Dutch-default. Needs explicit resolution, don't guess.
2. **Static file vs. framework**: brief's routing section (#33) floats real multi-page URLs
   (`/work`, `/work/slug`, `/en`), which the current architecture (single generated `index.html`, no
   framework) can't natively support without a real rebuild decision. Confirm whether to stay
   single-file+client-side-router-free (simplest, matches "don't unnecessarily rebuild" instruction
   in #33/#34) or actually introduce a framework/build step.
3. **Third master's degree** (Artificial Intelligence, Lübeck University) — still unconfirmed as of
   this same session, see the "Leadership & Community" folder notes below; the education-timeline
   spec here (#9) only lists 2 degrees, matching the CURRENT site, not the VP card's 3-degree bio —
   another reason this needs to be nailed down before any education-related copy is finalized.
4. User said explicitly: more asset folders are still coming, and he wants to walk through this
   brief point-by-point with me before implementation starts. **Do not start building from this file
   alone** — wait for his go-ahead.
