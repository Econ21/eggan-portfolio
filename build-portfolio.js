const fs = require('fs');
const path = require('path');

const SHOTS = path.join(__dirname, 'shots');
const OUT = path.join(__dirname, 'index.html');

function b64(p) { return fs.readFileSync(p).toString('base64'); }
function img(dir, file) { return b64(path.join(SHOTS, dir, file)); }

const PROJECTS = {
  cap: {
    slides: [
      { file: 'home.jpg', caption: 'Beranda' },
      { file: 'harga.jpg', caption: 'Halaman Harga & Paket' },
      { file: 'ai-video.jpg', caption: 'Landing — AI Video Generator' },
      { file: 'ai-image.jpg', caption: 'Landing — AI Image Generator' },
      { file: 'untuk-creator.jpg', caption: 'Halaman Khusus Content Creator' },
      { file: 'untuk-umkm.jpg', caption: 'Halaman Khusus UMKM' },
      { file: 'consult-training.jpg', caption: 'Consult & Training' },
      { file: 'blog.jpg', caption: 'Blog' },
      { file: 'blog-post.jpg', caption: 'Artikel Blog' },
      { file: 'kontak.jpg', caption: 'Kontak' },
      { file: 'signup.jpg', caption: 'Sign Up' },
      { file: 'signin.jpg', caption: 'Sign In' },
    ],
  },
  ms: {
    slides: [
      { file: 'home.jpg', caption: 'Beranda' },
      { file: 'pricing.jpg', caption: 'Halaman Harga' },
      { file: 'community-join.jpg', caption: 'Titik Terang — Community' },
      { file: 'journey-wall.jpg', caption: 'Journey Wall' },
      { file: 'partnership.jpg', caption: 'Halaman Partnership' },
      { file: 'help.jpg', caption: 'Help Center' },
      { file: 'terms.jpg', caption: 'Terms of Service' },
      { file: 'privacy.jpg', caption: 'Privacy Policy' },
    ],
  },
  lumbung: {
    slides: [
      { file: 'home.jpg', caption: 'Beranda — Dashboard Publik' },
      { file: 'pasar.jpg', caption: 'Pasar Tani' },
      { file: 'signup.jpg', caption: 'Sign Up' },
      { file: 'signin.jpg', caption: 'Sign In' },
    ],
  },
};

const ADMIN_LOGIN_B64 = b64(path.join(SHOTS, 'msadmin-login.jpg'));

function slideDataUri(dir, file) { return `data:image/jpeg;base64,${img(dir, file)}`; }

function buildThumb(dir, firstFile) {
  return slideDataUri(dir, firstFile);
}

function buildCarouselSlides(id, dir, slides) {
  return slides.map((s, i) => `
        <div class="slide${i === 0 ? ' active' : ''}" data-idx="${i}">
          <img src="${slideDataUri(dir, s.file)}" alt="${s.caption}" loading="lazy" decoding="async" />
        </div>`).join('');
}

function buildDots(id, count) {
  return Array.from({ length: count }, (_, i) =>
    `<button class="dot-nav${i === 0 ? ' active' : ''}" onclick="goSlide('${id}',${i})" aria-label="Slide ${i + 1}"></button>`
  ).join('');
}

const capThumb = buildThumb('cap', PROJECTS.cap.slides[0].file);
const msThumb = buildThumb('ms', PROJECTS.ms.slides[0].file);
const lumbungThumb = buildThumb('lumbung', PROJECTS.lumbung.slides[0].file);
const adminThumb = `data:image/jpeg;base64,${ADMIN_LOGIN_B64}`;

const html = `<meta charset="utf-8">
<title>Eggan — IT Consultant &amp; Full-Stack Engineer</title>
<style>
  :root {
    --bg: #f6f3ee;
    --surface: #ffffff;
    --ink: #1b1f24;
    --muted: #5b6570;
    --faint: #99a3ad;
    --line: #e6e1d8;
    --accent: #b5732e;
    --accent-ink: #ffffff;
    --accent-soft: #f4e7d7;
    --status-live: #2f8f5b;
    --shadow: 0 18px 44px rgba(27, 22, 12, .08);
    --scrim: rgba(20, 16, 10, .6);
  }
  :root[data-theme="dark"] {
    --bg: #11151a;
    --surface: #171c22;
    --ink: #eceef0;
    --muted: #9aa4ad;
    --faint: #5e6771;
    --line: #262c34;
    --accent: #d99a55;
    --accent-ink: #191008;
    --accent-soft: #2a2015;
    --status-live: #4fbf85;
    --shadow: 0 18px 44px rgba(0, 0, 0, .4);
    --scrim: rgba(0, 0, 0, .75);
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --bg: #11151a; --surface: #171c22; --ink: #eceef0; --muted: #9aa4ad; --faint: #5e6771;
      --line: #262c34; --accent: #d99a55; --accent-ink: #191008; --accent-soft: #2a2015;
      --status-live: #4fbf85; --shadow: 0 18px 44px rgba(0, 0, 0, .4); --scrim: rgba(0, 0, 0, .75);
    }
  }

  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--bg); color: var(--ink);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6; -webkit-font-smoothing: antialiased;
  }
  ::selection { background: var(--accent-soft); color: var(--ink); }
  .font-display { font-family: Georgia, "Iowan Old Style", "Palatino Linotype", "Times New Roman", serif; }
  .font-mono { font-family: ui-monospace, "SF Mono", "Cascadia Code", Menlo, Consolas, monospace; }
  a { color: inherit; }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 3px; }
  .wrap { max-width: 980px; margin: 0 auto; padding: 0 24px; }

  .topbar { display: flex; align-items: center; justify-content: space-between; padding: 26px 0 0; }
  .brand { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 13px; font-weight: 600; letter-spacing: .02em; color: var(--muted); }
  .brand b { color: var(--ink); font-weight: 700; }
  .topbar-cta { font-size: 12.5px; font-weight: 700; color: var(--accent); text-decoration: none; border: 1px solid var(--line); padding: 7px 14px; border-radius: 999px; white-space: nowrap; }
  .topbar-cta:hover { border-color: var(--accent); }

  .hero { padding: 64px 0 40px; }
  .eyebrow { display: inline-flex; align-items: center; gap: 8px; font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin: 0 0 22px; }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--status-live); flex-shrink: 0; box-shadow: 0 0 0 3px color-mix(in srgb, var(--status-live) 20%, transparent); }
  h1.headline { font-size: clamp(32px, 5vw, 50px); line-height: 1.12; font-weight: 400; letter-spacing: -.01em; margin: 0 0 22px; max-width: 15ch; text-wrap: balance; }
  h1.headline em { font-style: italic; color: var(--accent); }
  .lede { font-size: 17px; color: var(--muted); max-width: 56ch; margin: 0 0 30px; }
  .lede b { color: var(--ink); font-weight: 600; }
  .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 46px; }
  .btn { display: inline-flex; align-items: center; gap: 8px; font-size: 14.5px; font-weight: 700; text-decoration: none; padding: 13px 24px; border-radius: 10px; transition: transform .12s ease, box-shadow .12s ease; border: none; cursor: pointer; font-family: inherit; }
  .btn-primary { background: var(--accent); color: var(--accent-ink); }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 10px 22px color-mix(in srgb, var(--accent) 35%, transparent); }
  .btn-ghost { border: 1px solid var(--line); color: var(--ink); background: none; }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
  .stack-row { display: flex; flex-wrap: wrap; gap: 8px 10px; padding-top: 26px; border-top: 1px solid var(--line); }
  .chip { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 12px; color: var(--muted); background: var(--surface); border: 1px solid var(--line); padding: 5px 10px; border-radius: 6px; }

  section { padding: 58px 0; border-top: 1px solid var(--line); }
  .section-head { margin-bottom: 34px; }
  .section-kicker { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--accent); margin: 0 0 10px; }
  h2.section-title { font-size: 26px; font-weight: 400; margin: 0; letter-spacing: -.01em; text-wrap: balance; }
  .section-note { color: var(--muted); font-size: 14.5px; max-width: 56ch; margin: 10px 0 0; }

  .profile-panel { display: flex; gap: 28px; align-items: flex-start; background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 30px; box-shadow: var(--shadow); }
  @media (max-width: 640px) { .profile-panel { flex-direction: column; align-items: center; text-align: center; } }
  .avatar { width: 84px; height: 84px; border-radius: 50%; flex-shrink: 0; background: var(--accent-soft); color: var(--accent); display: flex; align-items: center; justify-content: center; font-family: Georgia, serif; font-size: 30px; font-weight: 700; border: 1px solid var(--line); overflow: hidden; }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .profile-name { font-size: 19px; font-weight: 700; margin: 0 0 4px; }
  .profile-role { font-size: 13.5px; color: var(--muted); margin: 0 0 16px; }
  .edu-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 9px; }
  .edu-list li { font-size: 13.5px; color: var(--ink); padding-left: 20px; position: relative; }
  .edu-list li::before { content: "🎓"; position: absolute; left: 0; top: -1px; font-size: 12px; }
  .edu-list b { font-weight: 700; }
  .edu-list span.school { color: var(--muted); }

  .cases { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
  @media (max-width: 720px) { .cases { grid-template-columns: 1fr; } }
  .case-card { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; box-shadow: var(--shadow); display: flex; flex-direction: column; cursor: pointer; text-align: left; width: 100%; padding: 0; font-family: inherit; color: inherit; transition: transform .15s ease, box-shadow .15s ease; }
  .case-card:hover { transform: translateY(-3px); box-shadow: 0 22px 50px rgba(27,22,12,.14); }
  .case-thumb { aspect-ratio: 16/9.4; width: 100%; overflow: hidden; background: var(--accent-soft); position: relative; }
  .case-thumb img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
  .case-thumb-tag { position: absolute; top: 10px; left: 10px; font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 10px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: #fff; background: rgba(20,16,10,.55); backdrop-filter: blur(4px); padding: 4px 9px; border-radius: 999px; display: inline-flex; align-items: center; gap: 5px; }
  .case-thumb-count { position: absolute; bottom: 10px; right: 10px; font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 10px; font-weight: 700; color: #fff; background: rgba(20,16,10,.55); backdrop-filter: blur(4px); padding: 4px 9px; border-radius: 999px; }
  .case-body { padding: 22px 24px 24px; display: flex; flex-direction: column; gap: 12px; }
  .case-top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
  .case-name { font-size: 18px; font-weight: 700; }
  .case-role { font-size: 12.5px; color: var(--faint); margin-top: -8px; }
  .case-desc { font-size: 14.5px; color: var(--muted); margin: 0; }
  .case-stack { display: flex; flex-wrap: wrap; gap: 6px; }
  .case-more { font-size: 12.5px; font-weight: 700; color: var(--accent); margin-top: 2px; }

  .modal-overlay { display: none; position: fixed; inset: 0; background: var(--scrim); z-index: 100; padding: 28px 16px; overflow-y: auto; }
  .modal-overlay.open { display: flex; align-items: flex-start; justify-content: center; }
  .modal { background: var(--surface); border-radius: 16px; max-width: 680px; width: 100%; margin: auto; box-shadow: 0 30px 80px rgba(0,0,0,.35); overflow: hidden; }

  .carousel { position: relative; width: 100%; aspect-ratio: 16/9.4; background: #000; overflow: hidden; }
  .carousel .slide { position: absolute; inset: 0; opacity: 0; transition: opacity .25s ease; }
  .carousel .slide.active { opacity: 1; }
  .carousel .slide img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
  .car-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 38px; height: 38px; border-radius: 50%; border: none; background: rgba(20,16,10,.5); color: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px); }
  .car-btn:hover { background: rgba(20,16,10,.75); }
  .car-prev { left: 12px; } .car-next { right: 12px; }
  .car-caption { position: absolute; bottom: 0; left: 0; right: 0; padding: 22px 16px 12px; background: linear-gradient(to top, rgba(0,0,0,.75), transparent); color: #fff; font-size: 12.5px; font-weight: 600; }
  .car-counter { position: absolute; top: 12px; right: 12px; font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 11px; font-weight: 700; color: #fff; background: rgba(20,16,10,.5); padding: 3px 9px; border-radius: 999px; backdrop-filter: blur(3px); }
  .dots-row { display: flex; gap: 6px; justify-content: center; padding: 12px 0 0; flex-wrap: wrap; }
  .dot-nav { width: 6px; height: 6px; border-radius: 50%; border: none; background: var(--line); cursor: pointer; padding: 0; }
  .dot-nav.active { background: var(--accent); width: 16px; border-radius: 4px; }

  .modal-body { padding: 20px 28px 30px; }
  .modal-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 4px; }
  .modal-name { font-size: 21px; font-weight: 700; }
  .modal-close { border: 1px solid var(--line); background: var(--surface); color: var(--muted); width: 30px; height: 30px; border-radius: 50%; font-size: 15px; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .modal-close:hover { color: var(--accent); border-color: var(--accent); }
  .modal-role { font-size: 13px; color: var(--faint); margin: 0 0 16px; }
  .modal-desc { font-size: 14.5px; color: var(--muted); margin: 0 0 18px; }
  .modal-built { margin: 0 0 18px; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .modal-built li { font-size: 14px; color: var(--ink); padding-left: 18px; position: relative; }
  .modal-built li::before { content: ""; position: absolute; left: 0; top: 8px; width: 6px; height: 6px; border-radius: 1px; background: var(--accent); }
  .modal-outcome { font-size: 13.5px; font-style: italic; color: var(--muted); border-top: 1px dashed var(--line); padding-top: 14px; margin: 0 0 16px; }
  .modal-stack { display: flex; flex-wrap: wrap; gap: 6px; }
  .modal-note { font-size: 12.5px; color: var(--faint); background: var(--accent-soft); border-radius: 10px; padding: 12px 14px; margin: 0 0 16px; }

  .services { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
  @media (max-width: 720px) { .services { grid-template-columns: 1fr; } }
  .svc-card { border: 1px solid var(--line); border-radius: 14px; padding: 26px; display: flex; flex-direction: column; gap: 12px; background: var(--surface); }
  .svc-card.featured { border-color: var(--accent); box-shadow: var(--shadow); }
  .svc-name { font-size: 16.5px; font-weight: 700; }
  .svc-desc { font-size: 14px; color: var(--muted); margin: 0; flex-grow: 1; }
  .svc-meta { display: flex; align-items: baseline; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--line); }
  .svc-price { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 15px; font-weight: 700; color: var(--accent); }
  .svc-time { font-size: 12px; color: var(--faint); }

  .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  @media (max-width: 720px) { .steps { grid-template-columns: 1fr; } }
  .step { display: flex; gap: 14px; }
  .step-num { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 13px; font-weight: 700; color: var(--accent); border: 1px solid var(--line); border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .step-title { font-size: 15px; font-weight: 700; margin: 0 0 4px; }
  .step-desc { font-size: 13.5px; color: var(--muted); margin: 0; }

  .contact-panel { background: var(--surface); border: 1px solid var(--line); border-radius: 18px; padding: 42px 36px; box-shadow: var(--shadow); display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
  .contact-text h2 { font-size: 22px; font-weight: 400; margin: 0 0 8px; }
  .contact-text p { font-size: 14px; color: var(--muted); margin: 0; max-width: 42ch; }
  footer { padding: 34px 0 50px; }
  .foot-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; font-size: 12.5px; color: var(--faint); }
  .foot-links { display: flex; gap: 16px; }
  .foot-links a { color: var(--faint); text-decoration: none; }
  .foot-links a:hover { color: var(--accent); }
</style>

<div class="wrap">
  <div class="topbar">
    <span class="brand"><b>eggan</b>.dev</span>
    <a class="topbar-cta" href="https://wa.me/6281401981855" target="_blank" rel="noopener noreferrer">Chat WhatsApp →</a>
  </div>

  <div class="hero">
    <p class="eyebrow"><span class="dot"></span>Tersedia untuk proyek baru</p>
    <h1 class="headline font-display">Saya bangun sistem yang <em>benar-benar jalan</em> — bukan sekadar prototipe.</h1>
    <p class="lede">IT Consultant &amp; Full-Stack Engineer. Empat produk di bawah ini <b>live di production</b>, bukan demo portofolio — lengkap dengan payment gateway, sistem AI, dan dashboard admin yang saya bangun dan audit keamanannya sendiri.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="https://wa.me/6281401981855" target="_blank" rel="noopener noreferrer">Konsultasi Gratis via WhatsApp</a>
      <a class="btn btn-ghost" href="#karya">Lihat Produk yang Sudah Dibangun</a>
    </div>
    <div class="stack-row">
      <span class="chip">Next.js</span><span class="chip">Supabase</span><span class="chip">Midtrans / Xendit</span>
      <span class="chip">Clerk Auth</span><span class="chip">fal.ai / Claude API</span><span class="chip">Gmail Workspace API</span>
      <span class="chip">Security Audit</span>
    </div>
  </div>

  <section id="profil">
    <div class="profile-panel">
      <div class="avatar">E</div>
      <div>
        <p class="profile-name">Eggan</p>
        <p class="profile-role">IT Consultant &amp; Full-Stack Engineer — AI Systems, Payment Integration, Security Audit</p>
        <ul class="edu-list">
          <li><b>Bachelor, Informatics Engineering</b> — <span class="school">Institut Teknologi Bandung (ITB) Swadharma, Indonesia</span></li>
          <li><b>Master, Strategic Intelligence</b> — <span class="school">Universitas Indonesia</span></li>
          <li><b>Master, Data Driven Business</b> — <span class="school">Den Haag University of Applied Sciences, Netherlands</span></li>
        </ul>
      </div>
    </div>
  </section>

  <section id="karya">
    <div class="section-head">
      <p class="section-kicker">Produk yang Sudah Dibangun</p>
      <h2 class="section-title font-display">Bukan mockup — semuanya production.</h2>
      <p class="section-note">Dua di antaranya bisnis SaaS milik sendiri, satu proyek pemerintah, satu sistem operasional internal. Klik kartunya untuk lihat slideshow halaman aslinya.</p>
    </div>

    <div class="cases">
      <button class="case-card" onclick="openModal('cap')">
        <div class="case-thumb"><span class="case-thumb-tag"><span class="dot" style="width:5px;height:5px"></span>Live</span><span class="case-thumb-count">${PROJECTS.cap.slides.length} halaman</span><img src="${capThumb}" alt="Tampilan CAP Creative AI" /></div>
        <div class="case-body">
          <div class="case-top"><span class="case-name">CAP — Creative AI Partner</span></div>
          <p class="case-role">Platform generate gambar &amp; video AI untuk konten kreator dan bisnis</p>
          <p class="case-desc">Dari nol jadi produk SaaS lengkap: generate AI multi-model, sistem kredit &amp; langganan, checkout otomatis, dashboard monitoring biaya AI.</p>
          <div class="case-stack"><span class="chip">Next.js 14</span><span class="chip">Clerk</span><span class="chip">Xendit</span></div>
          <p class="case-more">Lihat ${PROJECTS.cap.slides.length} halaman →</p>
        </div>
      </button>

      <button class="case-card" onclick="openModal('ms')">
        <div class="case-thumb"><span class="case-thumb-tag"><span class="dot" style="width:5px;height:5px"></span>Live</span><span class="case-thumb-count">${PROJECTS.ms.slides.length} halaman</span><img src="${msThumb}" alt="Tampilan MatchupSkills" /></div>
        <div class="case-body">
          <div class="case-top"><span class="case-name">MatchupSkills</span></div>
          <p class="case-role">Platform edukasi berbasis AI — persiapan ujian &amp; simulasi belajar interaktif</p>
          <p class="case-desc">Termasuk mesin generate laporan PDF matematika custom dan sistem rekrutmen volunteer end-to-end.</p>
          <div class="case-stack"><span class="chip">Next.js 14</span><span class="chip">Supabase</span><span class="chip">Midtrans</span></div>
          <p class="case-more">Lihat ${PROJECTS.ms.slides.length} halaman →</p>
        </div>
      </button>

      <button class="case-card" onclick="openModal('admin')">
        <div class="case-thumb"><span class="case-thumb-tag"><span class="dot" style="width:5px;height:5px"></span>Live</span><span class="case-thumb-count">Internal</span><img src="${adminThumb}" alt="Login dashboard admin internal" /></div>
        <div class="case-body">
          <div class="case-top"><span class="case-name">Dashboard Operasional &amp; Admin</span></div>
          <p class="case-role">Sistem internal untuk mengelola dua produk di atas — tim, keuangan, keamanan</p>
          <p class="case-desc">Kontrol akses berlapis per-divisi, manajemen proyek, pelacakan keuangan, dan audit keamanan terstruktur berkala.</p>
          <div class="case-stack"><span class="chip">Next.js 14</span><span class="chip">JWT Auth</span><span class="chip">Supabase</span></div>
          <p class="case-more">Lihat detail →</p>
        </div>
      </button>

      <button class="case-card" onclick="openModal('lumbung')">
        <div class="case-thumb"><span class="case-thumb-tag"><span class="dot" style="width:5px;height:5px"></span>Live</span><span class="case-thumb-count">${PROJECTS.lumbung.slides.length} halaman</span><img src="${lumbungThumb}" alt="Tampilan Lumbung Jakut" /></div>
        <div class="case-body">
          <div class="case-top"><span class="case-name">Lumbung Jakut</span></div>
          <p class="case-role">Aplikasi ketahanan pangan — proyek untuk Pemerintah Kota Jakarta Utara</p>
          <p class="case-desc">Aplikasi warga (PWA) + dashboard dinas, dengan laporan otomatis dan perhitungan indeks resmi FAO/SDG.</p>
          <div class="case-stack"><span class="chip">Next.js 14</span><span class="chip">PWA</span><span class="chip">Report Automation</span></div>
          <p class="case-more">Lihat ${PROJECTS.lumbung.slides.length} halaman →</p>
        </div>
      </button>
    </div>
  </section>

  <section id="jasa">
    <div class="section-head">
      <p class="section-kicker">Jasa &amp; Harga</p>
      <h2 class="section-title font-display">Harga jelas di depan — tanpa tawar-menawar.</h2>
      <p class="section-note">Pilih paket, chat WhatsApp, ceritakan kebutuhan Anda — saya kasih quote pasti dalam 24 jam. Harga di bawah adalah titik mulai, bisa disesuaikan untuk kebutuhan lebih besar.</p>
    </div>
    <div class="services">
      <div class="svc-card featured">
        <span class="svc-name">Website + Payment Gateway</span>
        <p class="svc-desc">Landing page atau website bisnis lengkap dengan integrasi payment (Midtrans/Xendit) — siap terima transaksi nyata sejak hari pertama.</p>
        <div class="svc-meta"><span class="svc-price font-mono">Mulai Rp3.500.000</span><span class="svc-time">3–5 hari kerja</span></div>
      </div>
      <div class="svc-card">
        <span class="svc-name">Audit Keamanan Aplikasi</span>
        <p class="svc-desc">Saya cari celah keamanan nyata di aplikasi web Anda sebelum ditemukan orang lain — laporan lengkap + rekomendasi perbaikan.</p>
        <div class="svc-meta"><span class="svc-price font-mono">Mulai Rp1.500.000</span><span class="svc-time">1–2 hari kerja</span></div>
      </div>
      <div class="svc-card">
        <span class="svc-name">Dashboard Admin Custom</span>
        <p class="svc-desc">Sistem internal untuk tim Anda — manajemen data, laporan otomatis, kontrol akses per-role, sesuai alur kerja bisnis Anda.</p>
        <div class="svc-meta"><span class="svc-price font-mono">Sesuai scope</span><span class="svc-time">Konsultasi dulu</span></div>
      </div>
      <div class="svc-card">
        <span class="svc-name">Integrasi Fitur AI</span>
        <p class="svc-desc">Tambahkan fitur AI (generate konten, chatbot, otomatisasi laporan) ke produk yang sudah Anda punya sekarang.</p>
        <div class="svc-meta"><span class="svc-price font-mono">Sesuai scope</span><span class="svc-time">Konsultasi gratis</span></div>
      </div>
    </div>
  </section>

  <section id="cara">
    <div class="section-head">
      <p class="section-kicker">Cara Kerja</p>
      <h2 class="section-title font-display">Tiga langkah, tidak ada drama.</h2>
    </div>
    <div class="steps">
      <div class="step"><span class="step-num font-mono">1</span><div><p class="step-title">Chat WhatsApp</p><p class="step-desc">Ceritakan kebutuhan Anda — sesingkat apapun, tidak perlu brief formal.</p></div></div>
      <div class="step"><span class="step-num font-mono">2</span><div><p class="step-title">Quote pasti dalam 24 jam</p><p class="step-desc">Harga &amp; timeline jelas di awal. Tidak ada biaya tersembunyi, tidak ada nego bolak-balik.</p></div></div>
      <div class="step"><span class="step-num font-mono">3</span><div><p class="step-title">Dikerjakan &amp; dilaporkan</p><p class="step-desc">Update progres berkala sampai selesai dan siap dipakai.</p></div></div>
    </div>
  </section>

  <section id="kontak">
    <div class="contact-panel">
      <div class="contact-text"><h2 class="font-display">Ada proyek yang mau dikerjakan?</h2><p>Konsultasi awal gratis, tanpa komitmen. Balas dalam 24 jam.</p></div>
      <a class="btn btn-primary" href="https://wa.me/6281401981855" target="_blank" rel="noopener noreferrer">Chat WhatsApp →</a>
    </div>
  </section>

  <footer>
    <div class="foot-row">
      <span>© 2026 Eggan — IT Consultant &amp; Full-Stack Engineer</span>
      <div class="foot-links"><a href="mailto:mahesacloude@gmail.com">Email</a><a href="https://wa.me/6281401981855" target="_blank" rel="noopener noreferrer">WhatsApp</a></div>
    </div>
  </footer>
</div>

<!-- ── CAP modal ───────────────────────────────────────────── -->
<div class="modal-overlay" id="modal-cap" onclick="if(event.target===this) closeModal('cap')">
  <div class="modal">
    <div class="carousel" id="car-cap">
      ${buildCarouselSlides('cap', 'cap', PROJECTS.cap.slides)}
      <button class="car-btn car-prev" onclick="prevSlide('cap')" aria-label="Sebelumnya">‹</button>
      <button class="car-btn car-next" onclick="nextSlide('cap')" aria-label="Selanjutnya">›</button>
      <span class="car-counter" id="counter-cap">1 / ${PROJECTS.cap.slides.length}</span>
      <div class="car-caption" id="caption-cap">${PROJECTS.cap.slides[0].caption}</div>
    </div>
    <div class="dots-row" id="dots-cap">${buildDots('cap', PROJECTS.cap.slides.length)}</div>
    <div class="modal-body">
      <div class="modal-top"><span class="modal-name">CAP — Creative AI Partner</span><button class="modal-close" onclick="closeModal('cap')" aria-label="Tutup">✕</button></div>
      <p class="modal-role">creativeaipartner.id — Platform generate gambar &amp; video AI</p>
      <p class="modal-desc">Dibangun dari nol jadi produk SaaS lengkap untuk konten kreator dan bisnis yang butuh materi visual cepat — generate gambar, video, avatar, dan voiceover dari satu dashboard.</p>
      <ul class="modal-built">
        <li>Integrasi multi-model AI (fal.ai, Claude Vision) untuk generate gambar &amp; video</li>
        <li>Sistem kredit &amp; langganan custom (formula dinamis, bukan harga flat asal tebak)</li>
        <li>Payment gateway (Xendit) + webhook signature verification anti-fraud</li>
        <li>Dashboard admin: monitoring biaya AI &amp; transaksi real-time</li>
        <li>SEO landing pages + blog dengan structured data (JSON-LD)</li>
      </ul>
      <p class="modal-outcome">"Dari ide jadi produk yang benar-benar menerima pembayaran, bukan cuma demo."</p>
      <div class="modal-stack"><span class="chip">Next.js 14</span><span class="chip">Clerk</span><span class="chip">Supabase</span><span class="chip">Xendit</span><span class="chip">fal.ai</span></div>
    </div>
  </div>
</div>

<!-- ── MatchupSkills modal ─────────────────────────────────── -->
<div class="modal-overlay" id="modal-ms" onclick="if(event.target===this) closeModal('ms')">
  <div class="modal">
    <div class="carousel" id="car-ms">
      ${buildCarouselSlides('ms', 'ms', PROJECTS.ms.slides)}
      <button class="car-btn car-prev" onclick="prevSlide('ms')" aria-label="Sebelumnya">‹</button>
      <button class="car-btn car-next" onclick="nextSlide('ms')" aria-label="Selanjutnya">›</button>
      <span class="car-counter" id="counter-ms">1 / ${PROJECTS.ms.slides.length}</span>
      <div class="car-caption" id="caption-ms">${PROJECTS.ms.slides[0].caption}</div>
    </div>
    <div class="dots-row" id="dots-ms">${buildDots('ms', PROJECTS.ms.slides.length)}</div>
    <div class="modal-body">
      <div class="modal-top"><span class="modal-name">MatchupSkills</span><button class="modal-close" onclick="closeModal('ms')" aria-label="Tutup">✕</button></div>
      <p class="modal-role">matchupskills.id — Platform edukasi berbasis AI</p>
      <p class="modal-desc">Ubah dokumen/materi apapun jadi pengalaman belajar interaktif (simulasi, latihan soal) untuk persiapan ujian seperti GRE, GMAT, SNBT, IELTS, LPDP.</p>
      <ul class="modal-built">
        <li>Mesin render PDF custom (subset LaTeX sendiri) untuk laporan belajar personal per user</li>
        <li>Sistem email otomatis multi-channel (Gmail Workspace API + fallback Resend)</li>
        <li>Payment gateway (Midtrans) + sistem voucher &amp; diskon</li>
        <li>Pipeline rekrutmen volunteer (Titik Terang): form aplikasi → review → onboarding otomatis</li>
        <li>Journey Wall — galeri kisah komunitas dengan moderasi</li>
      </ul>
      <p class="modal-outcome">"Sistem yang biasanya butuh tim terpisah — content, engineering, ops — dikerjakan satu alur penuh."</p>
      <div class="modal-stack"><span class="chip">Next.js 14</span><span class="chip">Clerk</span><span class="chip">Supabase</span><span class="chip">Midtrans</span><span class="chip">Gmail API</span></div>
    </div>
  </div>
</div>

<!-- ── Admin modal (single, internal, no carousel needed) ──── -->
<div class="modal-overlay" id="modal-admin" onclick="if(event.target===this) closeModal('admin')">
  <div class="modal">
    <div class="carousel" id="car-admin">
      <div class="slide active" data-idx="0"><img src="${adminThumb}" alt="Login dashboard admin internal" /></div>
      <span class="car-counter" id="counter-admin">1 / 1</span>
      <div class="car-caption" id="caption-admin">Halaman Login (Internal)</div>
    </div>
    <div class="modal-body">
      <div class="modal-top"><span class="modal-name">Dashboard Operasional &amp; Admin</span><button class="modal-close" onclick="closeModal('admin')" aria-label="Tutup">✕</button></div>
      <p class="modal-role">Sistem internal — mengelola tim, keuangan, dan keamanan kedua produk di atas</p>
      <p class="modal-note">🔒 Hanya halaman login yang bisa ditunjukkan di sini — sisanya berisi data finansial &amp; tim yang bersifat rahasia perusahaan, jadi sengaja tidak diperlihatkan.</p>
      <ul class="modal-built">
        <li>Role-based access control — tiap divisi hanya lihat data miliknya sendiri</li>
        <li>Manajemen proyek tim (Kanban + Kalender + penugasan otomatis per divisi/role)</li>
        <li>Sistem pelacakan keuangan &amp; laporan biaya operasional otomatis</li>
        <li>Pipeline HR/rekrutmen dengan email otomatis di tiap tahap</li>
        <li>Audit keamanan rutin — menemukan &amp; menutup celah nyata (IDOR, injection, auth bypass) sebelum jadi masalah</li>
      </ul>
      <p class="modal-outcome">"Sistem yang saya jaga sendiri seperti aset bisnis, bukan proyek sampingan yang ditinggal begitu selesai."</p>
      <div class="modal-stack"><span class="chip">Next.js 14</span><span class="chip">JWT Auth</span><span class="chip">Supabase</span><span class="chip">Role-Based Access</span></div>
    </div>
  </div>
</div>

<!-- ── Lumbung modal ───────────────────────────────────────── -->
<div class="modal-overlay" id="modal-lumbung" onclick="if(event.target===this) closeModal('lumbung')">
  <div class="modal">
    <div class="carousel" id="car-lumbung">
      ${buildCarouselSlides('lumbung', 'lumbung', PROJECTS.lumbung.slides)}
      <button class="car-btn car-prev" onclick="prevSlide('lumbung')" aria-label="Sebelumnya">‹</button>
      <button class="car-btn car-next" onclick="nextSlide('lumbung')" aria-label="Selanjutnya">›</button>
      <span class="car-counter" id="counter-lumbung">1 / ${PROJECTS.lumbung.slides.length}</span>
      <div class="car-caption" id="caption-lumbung">${PROJECTS.lumbung.slides[0].caption}</div>
    </div>
    <div class="dots-row" id="dots-lumbung">${buildDots('lumbung', PROJECTS.lumbung.slides.length)}</div>
    <div class="modal-body">
      <div class="modal-top"><span class="modal-name">Lumbung Jakut</span><button class="modal-close" onclick="closeModal('lumbung')" aria-label="Tutup">✕</button></div>
      <p class="modal-role">Proyek untuk Pemerintah Kota Administrasi Jakarta Utara</p>
      <p class="modal-desc">Aplikasi ketahanan pangan yang menghubungkan warga, kelurahan, dan dinas — memantau produksi pangan secara real-time dan terukur, bukan sekadar program seremonial.</p>
      <ul class="modal-built">
        <li>PWA untuk warga: akses info Pasar Tani &amp; harga pangan real-time</li>
        <li>Dashboard komando untuk dinas dengan laporan otomatis (Word &amp; PDF)</li>
        <li>Perhitungan Indeks Ketahanan Pangan sesuai standar resmi FAO/SDG 2.1.2</li>
        <li>Otomasi input data dari file Excel dinas — tidak perlu entry manual</li>
      </ul>
      <p class="modal-outcome">"Standar pelaporan resmi pemerintah, dibangun sesuai aturan yang berlaku — bukan aplikasi CRUD generik."</p>
      <div class="modal-stack"><span class="chip">Next.js 14</span><span class="chip">PWA</span><span class="chip">Report Automation</span></div>
    </div>
  </div>
</div>

<script>
  var SLIDE_COUNTS = { cap: ${PROJECTS.cap.slides.length}, ms: ${PROJECTS.ms.slides.length}, lumbung: ${PROJECTS.lumbung.slides.length}, admin: 1 };
  var CAPTIONS = {
    cap: ${JSON.stringify(PROJECTS.cap.slides.map(s => s.caption))},
    ms: ${JSON.stringify(PROJECTS.ms.slides.map(s => s.caption))},
    lumbung: ${JSON.stringify(PROJECTS.lumbung.slides.map(s => s.caption))},
    admin: ['Halaman Login (Internal)']
  };
  var current = { cap: 0, ms: 0, lumbung: 0, admin: 0 };

  function openModal(id) {
    document.getElementById('modal-' + id).classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    document.getElementById('modal-' + id).classList.remove('open');
    document.body.style.overflow = '';
  }
  function renderSlide(id) {
    var idx = current[id];
    var car = document.getElementById('car-' + id);
    var slides = car.querySelectorAll('.slide');
    slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
    var dotsWrap = document.getElementById('dots-' + id);
    if (dotsWrap) {
      var dots = dotsWrap.querySelectorAll('.dot-nav');
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    }
    var counter = document.getElementById('counter-' + id);
    if (counter) counter.textContent = (idx + 1) + ' / ' + SLIDE_COUNTS[id];
    var caption = document.getElementById('caption-' + id);
    if (caption) caption.textContent = CAPTIONS[id][idx];
  }
  function nextSlide(id) { current[id] = (current[id] + 1) % SLIDE_COUNTS[id]; renderSlide(id); }
  function prevSlide(id) { current[id] = (current[id] - 1 + SLIDE_COUNTS[id]) % SLIDE_COUNTS[id]; renderSlide(id); }
  function goSlide(id, idx) { current[id] = idx; renderSlide(id); }

  document.addEventListener('keydown', function (e) {
    var openId = null;
    ['cap', 'ms', 'admin', 'lumbung'].forEach(function (id) {
      if (document.getElementById('modal-' + id).classList.contains('open')) openId = id;
    });
    if (!openId) return;
    if (e.key === 'Escape') { closeModal(openId); }
    if (e.key === 'ArrowRight') { nextSlide(openId); }
    if (e.key === 'ArrowLeft') { prevSlide(openId); }
  });
</script>
`;

fs.writeFileSync(OUT, html);
console.log('Written:', OUT, '(' + (fs.statSync(OUT).size / 1024).toFixed(0) + ' KB)');
