# Eggan Portfolio — Technology, Strategy & Leadership

## Apa ini
Portofolio pribadi Eggan untuk melamar kerja (bukan hanya jasa freelance lagi — lihat "Redesign
2026-08-14" di bawah) — **terpisah total** dari bisnis CAP dan MatchupSkills (repo lain, jangan
dicampur). Multi-page, 3 bahasa (Belanda default / Inggris / Indonesia), desain editorial
hitam/putih/biru per `DESIGN_BRIEF.md`.

## Live
- URL: **https://eggan.vercel.app**
- Vercel account: **personal** (`nachson21-6093s-projects`), project name **`eggan`** — BUKAN akun
  Vercel bisnis CAP, sengaja dipisah. Kalau `.vercel/project.json` di `dist/` hilang (selalu hilang,
  lihat di bawah), re-link dengan:
  ```
  vercel link --yes --project eggan --scope nachson21-6093s-projects
  ```
- GitHub: **personal** (`Econ21/eggan-portfolio`), BUKAN akun bisnis `creativeaipartner`.
- ⚠️ **Local git config untuk repo ini di-set ke `nachson21@gmail.com` / `Econ21`** (bukan global —
  cuma repo ini, tidak menyentuh CAP/MatchupSkills). Kalau lupa dan commit pakai email
  `creativeaipartner@gmail.com` (global default di mesin ini), Vercel akan **Block** deployment-nya
  dengan pesan "commit email could not be matched to a Git account" — karena email itu tidak
  terdaftar di akun Vercel/GitHub personal. Perbaikannya SELALU: `git config user.email
  nachson21@gmail.com` (lokal, di dalam folder ini) lalu commit ulang, BUKAN ganti default global
  (itu akan merusak alur CAP/MatchupSkills yang justru butuh `creativeaipartner@gmail.com`). Lihat
  juga catatan cross-repo soal ini di memory auto-Claude (`feedback_shared_cli_auth_switching.md`).

## ⚠️ ARSITEKTUR SEKARANG — paket "Revisi visual 2.1" (2026-09-23, commit `6832390`)

Situs lama (`data.js` + `build-portfolio.js` → `dist/`, 18 halaman) **sudah diganti total** oleh paket
editorial baru dari user (`Eggan-Portfolio-Revisi-v2.1.zip`). Semua section di bawah yang membahas
`data.js`/`build-portfolio.js`/`dist/` adalah **RIWAYAT**, bukan cara kerja sekarang. Versi lama masih bisa
diambil dari tag git `pre-revisi-2.0`.

- **Generator**: `tools/build.mjs` (Node 18+, tanpa dependency runtime). Sumber konten: `content.json`
  (+ `assets/credentials/document-pages.json`). Jalankan `npm run build` → menulis **480 HTML** ke root repo.
  Jangan mengedit HTML keluaran satu per satu; build berikutnya menimpanya.
- **Output di ROOT repo, bukan `dist/`.** `vercel.json`: `buildCommand: npm run build`,
  `outputDirectory: "."`, `cleanUrls: false`. Header keamanan lama (CSP dll.) dipertahankan; `img-src`
  supabase dihapus karena semua aset sekarang lokal.
- **Tiga bahasa, 160 halaman masing-masing** (struktur ini dipertahankan dari situs lama, jangan diubah
  tanpa redirect): `/` = **Belanda**, `/en/` = **Inggris**, `/id/` = **Indonesia**. Diverifikasi: `lang`
  attribute, judul, heading, dan pemindah bahasa menjaga rute yang sedang dibuka.
- **CSS/JS**: `assets/site.css|js` (dasar) → `assets/revision.css|js` (layout + gerak scroll) →
  `assets/polish.css|js` (revisi minor v2.1). Urutan muat ini disengaja; jangan dibalik.
- **Tes**: `npm test` = `tools/verify.cjs` (480 halaman, ±21.000 tautan/aset lokal, 21 kelompok) +
  `verify-styles.cjs` (grammar CSS) + `verify-polish.cjs` (11 kelompok revisi v2.1). Semua lulus saat commit ini.
- **Revisi v2.1 yang sudah masuk** (dari 6 poin screenshot user): portrait tidak terpotong; navbar desktop
  lengkap (Home, Experience & Education, Work, Creative, Research, Leadership, Contact + bahasa + tema + Menu);
  bio + tiga tombol (Explore my work / Let's connect / CV & Documents); journey 5 kartu artwork utuh + label
  "Open" + tautan detail; cover CAP/MatchupSkills/Lumbung dari screenshot asli (bukan crop kecil yang blur);
  Creative carousel 10 karya asli + "See more".
- **Folder non-situs SENGAJA tetap di repo** (`brief/` dokumentasi paket, `design/` referensi 1–7 + video,
  `tools/` generator, `content.json`, `BUKA-PORTFOLIO.html`, `COMPARE-REFERENCE.html`): itu spesifikasi visual
  yang dibutuhkan revisi berikutnya. Karena `outputDirectory` = root, semuanya tadinya ter-serve publik —
  `.vercelignore` TIDAK menolong (hanya berlaku untuk deploy lewat CLI, bukan deploy dari Git). Solusinya di
  `vercel.json`: **14 `redirects`** (`/design/:path*`, `/brief/:path*`, `/tools/:path*`, file dev, `content.json`,
  `package*.json`) → `/`, karena di Vercel redirects diproses SEBELUM filesystem; plus header `X-Robots-Tag:
  noindex` dan `robots.txt`. Diverifikasi live: `/design/references/1.png` → 307 ke `/`, situs tetap normal.
  ⚠️ `robots.txt` ditulis manual (bukan dari zip) — kalau memasang zip baru dengan `rsync --delete`, kecualikan
  `robots.txt`, `vercel.json`, `.gitignore`, `CLAUDE.md`, `.claude/`, seperti waktu memasang v2.1.
- Verifikasi live 2026-09-23 setelah deploy: `/`, `/en`, `/id`, `/en/work`, `/en/creative-work`,
  `/en/research`, `/en/documents`, `/en/leadership`, `/en/contact`, `/id/*`, `/work/*` semua 200; 22 URL yang
  dipakai situs lama semuanya masih ada; tema gelap, mobile, dan galeri karya diperiksa di browser.

## [RIWAYAT] Struktur file lama (REWRITE TOTAL 2026-08-14 — arsitektur lama single-file sudah tidak berlaku)
- `data.js` — **satu-satunya sumber konten**: semua UI string + Leadership entries + Project
  entries + Skills + Research metadata, masing-masing field `{nl, en, id}`. Edit di sini untuk ubah
  copy apa pun.
- `build-portfolio.js` — generator: baca `data.js`, tulis 18 file HTML (6 halaman × 3 bahasa) ke
  `dist/`. Jalankan `node build-portfolio.js` dari folder ini setiap kali `data.js` atau CSS/JS di
  dalam script ini berubah. **`dist/` di-`rm -rf` total setiap build** — jangan taruh apa pun manual
  di sana, dan selalu `vercel link` ulang setelah build (lihat di atas) karena link config-nya ikut
  terhapus.
- `assets/` — semua gambar FINAL (bukan base64 lagi — file statis biasa, di-serve langsung via
  Vercel, direferensikan sebagai `/assets/...` absolut dari root supaya sama-sama resolve baik dari
  `/halaman` maupun `/en/halaman` / `/id/halaman`):
  - `profile-nobg.png` — foto hero (background merah sudah dihapus via chroma-key)
  - `about-speaking.jpg` — foto "Critical Grounds" (dia bicara di panggung depan penonton penuh)
  - `leadership/*.jpg` — foto per entry Leadership & Community. Beberapa entry (PT Pindad, Timur
    Growth, UNESCO & UNDP, Study Hub) punya **beberapa foto** — file dinamai `<slug>-1.jpg`,
    `<slug>-2.jpg`, dst, direferensikan via field `images: [...]` (array) di `data.js`, dirender
    sebagai carousel manual (prev/next + counter) di dalam kartu leadership itu sendiri — LIHAT
    "Revision round 2026-08-14b" di bawah. Entry lain (ICCN, Indonesia Mengglobal, Biru Muda, KUTU IT)
    tetap 1 foto via field `img` (string tunggal). Titik Terang, ILUNI UI & YouthRanger.id sengaja
    text-only card (tidak ada foto personal yang layak).
  - `gallery/*.jpg` — foto "Field Notes" (community/lapangan)
  - `research/{tokyo,jurnal,proposal-p3,reef-welfare}/*.jpg` — halaman PDF di-rasterize jadi gambar,
    zero-padded 2-digit (`slug-01.jpg`, dst — konsisten di semua 4, jangan campur pola padding lagi)
    (lihat "Research reader" di bawah)
  - `work/{cap,ms,lumbung}/*.jpg` — screenshot case-study (sama seperti `shots/` versi lama, dikopi
    ke sini). **`msadmin-login.jpg` sudah tidak dipakai** — project "Operations System" dihapus dari
    `PROJECTS` (lihat "Yang berubah 2026-08-14 (fix pasca-redesign)" di bawah), jangan hidupkan lagi
    tanpa foto dashboard yang lebih baik dari sekadar halaman login.
- `shots/` — masih ada, sumber asli untuk `assets/work/` (jangan dihapus, `build-portfolio.js`
  membaca folder ini langsung untuk menghitung jumlah slide carousel tiap project).
- `research/*.pdf` — 2 file PDF ASLI (joint research Tokyo University + jurnal ransomware
  published) — **bukan yang ditampilkan ke user**, cuma disimpan sebagai arsip sumber. Yang tampil
  di halaman `/research` adalah versi raster halaman-per-halaman di `assets/research/`.
- `photos-inbox/` — scratch/staging area (crop attempts, contact sheets, `remove_bg.py`) —
  **di-gitignore**, bukan bagian dari deployment, boleh berantakan.
- `dist/` — **build output, di-gitignore total**, jangan pernah commit. Regenerate kapan saja via
  `node build-portfolio.js`.
- `DESIGN_BRIEF.md` — spec desain lengkap (39 section) yang jadi acuan redesign ini. Masih relevan
  untuk detail visual (custom cursor, elaborate scroll-choreography, dll) yang **belum** semua
  diimplementasi — lihat "Yang belum dikerjakan" di bawah.

## Cara update konten
**GitHub↔Vercel auto-deploy AKTIF sejak 2026-08-14 malam** (user connect via dashboard Vercel sendiri
— lihat insiden di bawah). Artinya sekarang **`git push` ke `main` = auto-deploy**, tidak perlu lagi
manual `vercel --prod` dari `dist/` seperti sebelumnya (langkah lama itu masih valid dipakai untuk
preview cepat sebelum push kalau mau, tapi bukan keharusan lagi).
1. Edit teks/data di `data.js` (semua field 3-bahasa: `{nl, en, id}` — JANGAN lupa update ketiganya
   kalau ubah sesuatu, atau kontennya jadi tidak konsisten antar bahasa).
2. Kalau nambah/ubah foto: taruh file di `assets/<kategori>/`, referensikan di `data.js`
   (field `img` pada entry Leadership/Gallery, atau `thumb`/`dir` pada Project).
3. (Opsional, buat preview lokal cepat) `node build-portfolio.js` dari folder ini, cek hasil di
   `dist/`.
4. Commit + push perubahan SOURCE (bukan `dist/`, itu gitignored — Vercel yang re-generate dari
   `vercel.json` di root, lihat di bawah) ke `Econ21/eggan-portfolio` — pastikan `git config
   user.email` masih `nachson21@gmail.com` lokal di repo ini dulu (lihat "Live" di atas) sebelum
   commit.
5. **Selalu verifikasi setelah push** — jangan asumsikan auto-deploy sukses cuma karena push
   berhasil: `curl -sL -o /dev/null -w "%{http_code}" https://eggan.vercel.app/` harus balikin
   `200` (tunggu ~20-30 detik dulu setelah push, build butuh waktu). Kalau 404/500, cek
   `vercel ls` untuk deployment terbaru lalu `vercel inspect <url> --logs`.

### Root `vercel.json` — WAJIB ada, jangan hapus
```json
{
  "buildCommand": "node build-portfolio.js",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "trailingSlash": false
}
```
Ini yang bikin git-triggered auto-deploy tahu caranya generate situs (repo git TIDAK menyimpan
`dist/` — itu gitignored, murni build output). Tanpa file ini, auto-deploy akan coba serve isi repo
root apa adanya (yang isinya cuma source `data.js`/`build-portfolio.js`, bukan HTML) → 404. Repo
tidak punya `package.json` — sengaja, tidak perlu (`build-portfolio.js` cuma pakai built-in `fs`/
`path`, Vercel tetap bisa jalankan `buildCommand` tanpa itu).

## Struktur halaman (multi-page, bukan single-page — permintaan eksplisit user 2026-08-14)
6 halaman × 3 bahasa = 18 file HTML. URL bersih via `vercel.json` (`cleanUrls: true`, auto-generate
oleh `build-portfolio.js`, jangan edit manual). Bahasa default **Belanda** di root (`/`), Inggris di
`/en/*`, Indonesia di `/id/*`.

| Halaman | Slug | Isi |
|---|---|---|
| Home | `/` | Hero (foto profil + headline + CTA), teaser 2 project, teaser 4 leadership entry |
| Education | `/education` | Bio + foto "Critical Grounds" + pull-quote + timeline pendidikan + Skills grid |
| Work | `/work` | **3** case-study card (CAP, MatchupSkills, Lumbung Jakut — "Operations System" dihapus, lihat di bawah) — klik kartu = langsung buka website live-nya di tab baru; ada tombol sekunder terpisah "View screenshots" yang buka modal carousel manual next/back (screenshot di dalam `shots/`) tanpa navigasi keluar dari portofolio. + Skills + Services |
| Research | `/research` | **4** paper: jurnal ransomware (published), joint research Tokyo University, proposal P3 (dasar akademik LUMBUNG Jakut), Reef to Welfare (kompetisi riset nasional BRIN×LPDP) — klik → reader halaman-per-halaman manual, **TANPA tombol download** (lihat di bawah) |
| Leadership | `/leadership` | 10 entry Leadership & Community (black timeline cards, scroll-reveal fade-in) + Gallery "Field Notes" — **big single-photo slideshow** (bukan strip kecil lagi) dengan prev/next besar + counter + caption overlay + thumbnail strip di bawahnya, klik foto utama = buka lightbox fullscreen |
| Contact | `/contact` | Lokasi/email/WA + CTA |

## Research reader — kenapa raster image, bukan `<iframe>` PDF
User eksplisit: PDF harus bisa dibuka/dibaca tapi **TANPA tombol download**, tanpa toolbar PDF
browser bawaan. Solusinya: `pdftoppm` rasterize tiap halaman PDF jadi JPG
(`assets/research/{tokyo,jurnal}/*.jpg`), lalu di-render sebagai image viewer custom (prev/next
manual, counter halaman, ESC/←/→ keyboard) — sama pola dengan gallery lightbox. Ini BUKAN proteksi
keamanan sungguhan (siapa pun yang cukup niat masih bisa screenshot/save gambar per-halaman satu-
satu) — cuma menghilangkan tombol "Download" & toolbar PDF browser dari alur normal.

## Batasan penting (jangan langgar tanpa sadar konsekuensinya)
- **Tidak boleh login ke aplikasi yang butuh akun** (CAP image-studio/video-generator, halaman dalam
  MatchupSkills yang gated, isi dashboard ms-admin/cap-admin) untuk ambil screenshot — aturan keras.
  Semua screenshot yang ada sekarang cuma dari halaman PUBLIK.
- **Jangan upscale gambar melebihi resolusi native saat crop** — pernah kejadian nyata: crop kecil
  dari screenshot lalu di-resize paksa ke 900px lebar → hasilnya pecah/blur, user langsung komplain
  ("jangan anda crop gitu jadi jelek"). Cara benar: crop dengan area lebih lebar (jangan terlalu
  ketat) di resolusi asli, JANGAN upscale kalau crop lebih kecil dari target — biarkan CSS
  `object-fit: cover` yang melakukan "crop visual", jangan proses raster manual yang merusak piksel.
  Kalau sumber foto memang resolusi rendah (screenshot-di-dalam-screenshot), cari sumber lain yang
  lebih tajam (contoh: entry ICCN Director akhirnya pakai official appointment graphic, bukan crop
  dari mosaic Instagram screenshot yang buram).
- Gelar master ketiga (Artificial Intelligence, Lübeck University) — **DIKONFIRMASI TIDAK ADA**
  (2026-08-14b): CV asli user (dibaca penuh) sama sekali tidak menyebut Lübeck atau gelar AI apa pun
  — cuma muncul dulu di bio kartu VP Indonesia Mengglobal (sumber tidak resmi). `EDUCATION` di
  `data.js` sekarang **4 entry** (UI Diploma Administrasi + UI S1 + ITB + Den Haag Master, sesuai CV),
  Lübeck sengaja TIDAK ditambahkan — keputusan ini final, bukan lagi "menunggu konfirmasi".
- Bahasa default: **Belanda**, bukan Inggris — ini instruksi eksplisit user, override dari asumsi
  default ChatGPT di `DESIGN_BRIEF.md` bagian §32.
- Arsitektur: tetap static HTML generated (vanilla, TANPA framework/build-tool React/Next), tapi
  **multi-page** (file terpisah per halaman × bahasa) — bukan lagi single `index.html` dengan anchor
  section. Ini juga instruksi eksplisit user (awalnya direncanakan single-page, diubah di tengah
  proses build).

## ⚠️ Insiden 2026-08-14 — stale root `index.html` menimpa deploy baru (SUDAH DIPERBAIKI, baca ini
## dulu sebelum deploy manapun ke depannya)
Setelah redesign multi-page selesai dan di-`vercel --prod` dari `dist/`, user lapor situs live masih
terlihat versi LAMA (single-file, warna beda, tanpa navbar/leadership/gallery/research). Root cause:
folder root repo ini masih punya `index.html` peninggalan versi pra-redesign (1MB, base64 images) DAN
`.vercel/project.json` sendiri yang link ke project Vercel **yang sama** (`eggan`). Kapan pun
`vercel --prod` sempat dijalankan dari ROOT folder (bukan `dist/`) — sengaja atau tidak sengaja — itu
men-deploy `index.html` basi itu ke production, menimpa build baru dari `dist/` yang sudah benar
duluan. **Sudah diperbaiki**: `index.html` lama dan `.vercel/` di root sudah dihapus permanen (root
sekarang TIDAK punya link Vercel sendiri lagi — sengaja, supaya `vercel --prod` yang salah jalan dari
root akan ERROR minta link dulu, bukan diam-diam deploy sesuatu yang salah). **Jangan pernah taruh
`index.html` atau `.vercel/` apa pun di root folder ini lagi** — satu-satunya tempat yang boleh
punya `.vercel` link adalah `dist/` (dan itu pun hilang tiap build karena `dist/` di-`rm -rf` total,
makanya harus `vercel link` ulang tiap kali sebelum `vercel --prod`, persis seperti di "Cara update
konten" langkah 4 di atas). **Selalu verifikasi setelah deploy** — jangan percaya "Deployment ready"
begitu saja: `curl -sL https://eggan.vercel.app/ | grep -o "EGGAN NACHSON"` harus balikin match (kalau
kosong, berarti versi lama yang ke-deploy lagi).

## Yang berubah 2026-08-14 (fix pasca-redesign, setelah insiden di atas ketemu & user kasih feedback
## visual lain sekalian)
- **Project "Operations System" (dashboard admin internal) dihapus total** dari `PROJECTS` di
  `data.js` — dulu cuma nampilin 1 screenshot halaman login doang, user bilang hapus dulu sampai ada
  bukti visual yang lebih baik. Sisa 3 project: CAP, MatchupSkills, Lumbung Jakut — masing-masing
  sekarang punya field `url` (link live product asli).
- **Klik kartu project = langsung buka website live-nya** (`target="_blank"`), bukan lagi buka modal
  screenshot — itu instruksi eksplisit user ("kalau diklik, maka auto ke website landing page
  mereka"). Modal carousel screenshot TETAP ada tapi jadi tombol sekunder "View screenshots" di dalam
  kartu (pakai `event.stopPropagation()` biar tidak ikut trigger link utama).
- **Gallery "Field Notes" didesain ulang** — dulu strip horizontal kecil yang terasa seperti "cuma
  nampilin satu foto", sekarang big single-photo slideshow (mirip pola project-modal carousel) dengan
  panah prev/next besar + counter + caption overlay, PLUS thumbnail strip di bawahnya biar semua foto
  kelihatan sekaligus. Klik foto utama tetap buka lightbox fullscreen seperti sebelumnya.
- **Scroll-reveal motion ditambahkan** (§22 di `DESIGN_BRIEF.md`) — `IntersectionObserver` +
  CSS class `.reveal`/`.reveal.in`, dipasang di project card, leadership card, timeline item, service
  card, research item. Menghormati `prefers-reduced-motion`. Ini yang tadinya masuk daftar "belum
  dikerjakan" di bawah — sekarang sudah ada.
- **2 riset baru ditambahkan** ke `RESEARCH` di `data.js` (total sekarang 4, bukan 2): proposal P3
  Universitas Indonesia (dasar akademik LUMBUNG Jakut) dan "Reef to Welfare" (kompetisi riset
  nasional BRIN×LPDP, partner Tokyo University of Science). File asli PDF ada di `research/`, halaman
  di-rasterize ke `assets/research/{proposal-p3,reef-welfare}/`. ⚠️ Untuk "Reef to Welfare", **1
  halaman (halaman pengesahan/approval page) SENGAJA DIKECUALIKAN** dari reader publik — halaman itu
  berisi nomor ID pegawai/registrasi nasional & alamat rumah kolega (Dr. Palupi), bukan data Eggan
  sendiri, tidak pantas dipublikasikan di portofolio publik. Sisa halaman (cover, abstrak, metodologi,
  dst) tetap lengkap. Kalau nambah riset lain yang punya halaman serupa (tanda tangan resmi + data
  pribadi orang lain), terapkan pola yang sama — jangan asumsikan semua halaman PDF akademik aman
  dipublikasikan mentah-mentah.

## Revision round 2026-08-14b (CV integration + image rework + theme toggle + bug fixes)
User kirim CV asli (`CV - EGGAN NACHSON.pdf`) + 3 keluhan visual setelah redesign pertama. Semua sudah
dikerjakan:
- **Nama lengkap**: "Eggan Nachson" → **"Eggan Nachson Silueta"** di semua tempat (navbar, footer,
  page `<title>`, meta description, `alt` text) — 8 titik di `build-portfolio.js`, verified via grep.
- **Red background di foto profil**: root cause `.hero-photo { background: #C81E1E }` (CSS-ku
  sendiri, bukan artefak dari foto sumber) — fixed ke `var(--gray-dark)`.
- **CV jadi sumber otoritatif** untuk konten profesional — `data.js` sekarang punya 3 array baru
  (`EXPERIENCE`, `COURSES`, `ACHIEVEMENTS`, di-export lewat `module.exports` + di-`require` di
  `build-portfolio.js`), dirender di halaman `/education` sebagai 2 section baru (section-white
  "Professional Experience" pakai `.timeline` layout yang sama dengan Education Timeline; section-off
  2 kolom "Courses & Certifications" + "Achievements"). Ini yang jawab komplain "kenapa course doang" —
  sekarang riwayat pendidikan (`EDUCATION`) DAN pengalaman kerja DAN course/sertifikasi DAN
  achievement semua ada, terpisah jelas. Beberapa role/stat LEADERSHIP juga dikoreksi dari CV (paling
  signifikan: Titik Terang `Chief Branding & Creative` → **`Chief Operating Officer`**, ditambah entry
  baru ILUNI UI yang sebelumnya tidak ada sama sekali).
- **Leadership images — total re-crop dari sumber PDF asli** (bukan lagi crop dari screenshot
  composite/contact-sheet lama yang ternyata masih menyisakan sliver foto tetangga + teks slide
  bocor di pinggir — komplain user "kenapa masih di-crop, seperti puzzle"). Proses: identifikasi
  halaman PDF sumber per entry di `photos-inbox/pdf-pages/leadership-XX.png` (raster 4000×2250 dari
  `Portofolio_Eggan Nachson.pdf`), re-crop presisi per foto individual pakai PIL langsung dari raster
  resolusi penuh (bukan dari crop lama yang sudah rusak), lalu untuk entry yang punya ≥2 foto bersih
  (PT Pindad ×4, Timur Growth ×4, UNESCO & UNDP ×2, Study Hub ×2) dibuatkan **carousel manual di
  dalam kartu** — pola baru `leadershipCardHtml()` menerima `l.images` (array) alih-alih `l.img`
  (string tunggal), render `.lead-carousel`/`.lead-slide`/`.lead-car-btn`/`.lead-car-counter` (CSS +
  JS `leadNext()`/`leadPrev()`, mirip pola project-modal carousel yang sudah ada — inilah yang
  dimaksud user "seperti cap gitu slide shownya"). Entry dengan cuma 1 foto bersih (ICCN, KUTU IT)
  di-re-crop lebih ketat tanpa carousel (buang panah navigasi UI/teks nyangkut dari sumber asli).
- **Kontak — 2 nomor WhatsApp terpisah**: `CONTACT` di `data.js` diubah dari 1 field `waLink`/`phone`
  jadi `waIndonesia`/`waNetherlands` (masing-masing `{phone, link, label}`), `buildContact()` render 2
  tombol CTA + 2 baris kontak terpisah, masing-masing berlabel jelas negaranya.
- **Bug halaman Contact "hitam-lalu-putih kosong"**: root cause — halaman Contact cuma 1 section
  pendek (beda dari halaman lain yang 2+ section), jadi total tinggi konten (navbar+section+footer)
  seringkali LEBIH PENDEK dari tinggi viewport → sisa area viewport di bawah konten menampilkan
  background `<html>`/canvas default (nyaris putih), kontras tajam dengan section hitam di atasnya.
  Fix generik (bukan cuma tambal Contact): `body` sekarang `display:flex;flex-direction:column;
  min-height:100vh`, `bodyHtml` dibungkus `<main class="page-main">`, dan
  `.page-main > section:last-of-type { flex: 1 0 auto }` — section TERAKHIR di halaman manapun (bukan
  cuma Contact) otomatis melar mengisi sisa viewport kalau kontennya pendek, jadi tidak akan pernah
  ada celah warna aneh lagi di halaman pendek manapun ke depannya.
- **Light/dark theme toggle** — tombol ☀/☾ baru di navbar (kanan lang-switch), simpan preferensi ke
  `localStorage('cap_portfolio_theme')`, di-apply via `data-theme` attribute di `<html>` (inline
  blocking script `THEME_INIT_JS` di `<head>` SEBELUM `<style>` supaya tidak ada flash tema salah saat
  load). CSS custom-property jadi semantic token (`--ink`, `--ink-soft`, dan `--off-white`/`--white`/
  `--gray-light`/`--text-muted`/`--border` di-override total di bawah `html[data-theme="dark"]`) — SISI
  "editorial dark sections" (navbar/hero/section-dark/footer/modal, yang sengaja hitam sebagai bagian
  desain, BUKAN terkait tema) tidak berubah antar tema (tetap gelap di kedua mode, itu memang bagian
  konten desainnya, bukan "dark mode"), yang berubah HANYA section yang tadinya putih/off-white
  (Selected Work, Skills, dll) — di dark theme jadi charcoal gelap (`#121317`/`#1A1B20`), bukan
  langsung ke hitam solid tema Contact. **Juga**: user bilang dark section yang SUDAH ada terasa
  "warna item doang, jelek" — jadi SEMUA permukaan hitam editorial (navbar/hero/section-dark/modal/
  footer/lead-card) sekarang pakai `--black-surface` (radial-gradient halus, bukan `#050505` flat)
  supaya ada kedalaman/depth di kedua tema, bukan cuma toggle-nya yang baru.
- **Verifikasi**: build lokal (`node build-portfolio.js`) + browser-preview (localhost via
  `python3 -m http.server`, BUKAN live site) — semua fix di atas diverifikasi visual: nama lengkap ✓,
  foto profil tanpa background merah ✓, carousel leadership 4-foto & 2-foto jalan (klik next/prev,
  counter update) ✓, halaman Education render 3 section baru ✓, Contact 2 tombol WA + link `wa.me`
  benar + tidak ada celah putih ✓, theme toggle switch dua arah + section putih berubah charcoal
  (bukan hitam solid) ✓. **Belum di-deploy ke live URL saat dokumentasi ini ditulis** — commit &
  push masih perlu dilakukan setelah ini (lihat "Cara update konten" di atas untuk langkah baku).

## Yang masih belum dikerjakan / disederhanakan dari DESIGN_BRIEF.md
- Custom cursor (§24) — belum ada
- Elaborate page-load animation sequence (§5) — belum ada, halaman langsung tampil
- Scroll-triggered line-draw animation khusus di timeline pendidikan/leadership (§9, §13) — reveal
  fade-in sudah ada (lihat di atas), tapi animasi garis timeline yang "menggambar" sendiri belum
- Parallax hero image on cursor move (§7) — belum ada
Semua ini bisa ditambahkan belakangan kalau user minta — prioritas sejauh ini adalah struktur, konten
akurat, deploy yang benar-benar jalan, dan interaksi fungsional, bukan polish motion-design penuh.

## PhD Motivation Letter — Reference Playbook (NEW 2026-08-31)

Kalau user minta "buatkan motivation letter untuk PhD [posisi/universitas]" lagi — pakai section ini
sebagai starting point, JANGAN re-derive semua riset/fakta/format dari nol seperti sesi pertama. Dibangun
pertama kali untuk lamaran **PhD Fellow, Governance of Cybercrime** (vacancy 16776), ISGA/Leiden
University, deadline 31 Agustus 2026 — proses lengkapnya (termasuk 2 ronde review self-kritik) ada di
riwayat sesi itu kalau perlu detail lebih, tapi kesimpulannya sudah dirangkum di bawah ini.

### Fakta biografis yang sudah terverifikasi (baca dari `data.js`, jangan karang detail baru)
Sumber kebenaran tetap `EDUCATION`/`EXPERIENCE`/`RESEARCH` di `data.js` — ringkasan yang paling relevan
untuk surat PhD:
- **Master's thesis** (Universitas Indonesia, School of Strategic and Global Studies, program National
  Resilience Studies, konsentrasi Intelligence Strategic Studies, **cum laude, GPA 3.80/4.00**): analisis
  serangan siber perbankan Indonesia termasuk breach LockBit 3.0 di Bank Syariah Indonesia (2023),
  metodologi Cyber Kill Chain + triangulasi 4 sumber wawancara (petugas intelijen nasional, white-hat
  hacker, kepala divisi cybersecurity vendor perbankan, ketua lembaga riset cybersecurity nasional), 4
  lensa governance (cyber threat intelligence, adaptive security, strategic intelligence, cyber
  resilience), rekomendasi ke regulator keuangan/bank sentral/badan siber nasional Indonesia.
- **Publikasi**: "Strategic Intelligence Foresight on Ransomware Threats in State-Owned Bankings in
  Indonesia", Jurnal Indonesia Sosial Teknologi (JIST) Vol. 6 No. 6, Juni 2025, DOI
  10.36418/jist.v6i6.008 (lihat `RESEARCH` slug `jurnal` di `data.js`).
- **Pekerjaan**: AI Product Lead di MatchupSkills.id (2023–sekarang, redesign AI pipeline → kurangi
  generation failure >90%); part-time research assistant RISE Team Universitas Indonesia (dashboard
  monitoring ketahanan pangan AI+OSINT untuk 6 kecamatan Jakarta Utara, selaras FIES FAO, policy brief
  bulanan); Relationship Manager Bank BRI 2021–2025 (portofolio 500+ klien UMKM).
- **Pendidikan lain**: BSc Informatics Engineering ITB Swadharma (GPA 3.18/4.00), Diploma Administrasi
  Universitas Indonesia (GPA 3.42/4.00), MSc Data-Driven Business The Hague University of Applied
  Sciences (2026–2027, sedang berjalan).
- **Domisili**: The Hague, Belanda, sudah terdaftar sebagai resident (boleh disebut sebagai alasan
  sekunder/logistik, JANGAN jadi alasan utama "kenapa universitas ini").
- **Kontak resmi untuk surat**: email `nachson21@gmail.com`, WA `+31 6 8552 7266` (link
  `wa.me/31685527266`), portfolio `eggan.vercel.app` — samakan dengan yang dipakai di Credentials Dossier
  CAP, jangan pakai email/nomor lain.
- **Tanda tangan asli** (scan, sudah dipakai di motivation letter Leiden & Credentials Dossier CAP):
  `/Users/eggan/Desktop/website CAP/assets/private/signatures/eggan_nachson_cropped.png` — file itu ada
  di repo CAP, BUKAN repo ini, dan **privat** (jangan pernah commit ke git manapun, termasuk repo ini).
  Copy ke scratchpad sesi saat build surat, tempel via `reportlab.platypus.Image` di atas nama ketik,
  target height ~40pt (jaga aspect ratio asli via `ImageReader(...).getSize()`).

### ⚠️ Sensitif — cek status dulu sebelum disebut di dokumen apa pun
- **Universität zu Lübeck (MSc Artificial Intelligence, online, periode 2026–2029)** — NYATA (dikonfirmasi
  user 2026-08-15), tapi **sedang cuti** sejak percakapan 2026-08-31 (info dari user langsung, belum
  tentu publik). User eksplisit minta: (a) jangan sebut nama Lübeck di dokumen/situs mana pun selagi
  cuti; (b) jangan pernah sebutkan angka pasti "gelar master ke-berapa" di mana pun — cukup indikasikan
  plural ("several master's degrees") dan highlight cuma **UI + THUAS** kalau perlu nama institusi
  spesifik. Entry-nya di `data.js` `EDUCATION` (dan bio `heroSub`, dan note dokumen transkrip) sudah
  di-comment-out/disunting dengan catatan cara restore — **cek dulu ke user apakah cuti sudah selesai**
  sebelum menyebut Lübeck di surat/dokumen baru manapun, jangan asumsikan sudah aktif lagi hanya karena
  waktu sudah berlalu.
- Kalau ada detail biografis yang kelihatan belum terverifikasi (beda dari yang tertulis di `data.js` atau
  dari konteks sesi sebelumnya yang sudah usang) — JANGAN dipakai di surat resmi tanpa konfirmasi user
  dulu via pertanyaan langsung. Ini nyaris jadi kesalahan faktual nyata di surat yang benar-benar dikirim
  ke universitas (klaim Lübeck di draft awal sesi 2026-08-31, ketahuan sendiri sebelum kirim final karena
  cek ulang ke `CLAUDE.md` ini, bukan karena ditanya user) — treat sebagai near-miss serius, bukan cuma
  detail kecil.

### Standar format surat (sumber kredibel — JANGAN improvisasi tata letak sendiri)
Diriset dari [TU Delft Career & Counselling Services — Motivation Letter Checklist](https://filelist.tudelft.nl/Studentenportal/Centraal/Mijn%20studie%20_%20ik/Persoonlijke%20ontwikkeling/Managing%20your%20career/Career%20Toolkit/Quickguide_motivation%20letter_25.01.18.pdf)
(PDF resmi, top-3 universitas Belanda, lengkap contoh surat "before/after" beranotasi oleh konselor karier
mereka sendiri):
- **Letterhead di atas** (nama + kontak, rata kiri, dipisah garis tipis dari isi) — WAJIB, bukan opsional.
  Kutipan panduan: *"Motivation letters should be written on a formal letter template so contact details
  will be visible at the top of the letter."*
- **Urutan yang benar** (dicontek persis dari revisi surat yang di-approve panduan TU Delft): letterhead →
  tanggal → alamat penerima (nama + jabatan + institusi lengkap, JANGAN "Dear Hiring Manager" generik) →
  salam pembuka → baris **"Re: [posisi] (nomor vacancy)"** SETELAH salam (bukan sebelum — ini yang salah
  di draft pertama sesi ini) → isi surat → penutup + call-to-action eksplisit ("I would welcome the
  opportunity to discuss...") → "Yours sincerely," → tanda tangan asli (scan, ditempel di atas nama
  ketik). **Jangan tambah baris "Enclosures:" terpisah** kalau daftar dokumen sudah disebut di kalimat
  penutup — itu redundan, dan kata "enclosed" sendiri istilah surat-pos-fisik yang tidak cocok untuk
  aplikasi digital lewat portal upload (ganti ke "included with this application" kalau memang perlu).
- **Rata kiri-kanan (justified)** untuk paragraf isi, bukan cuma rata kiri — pakai
  `reportlab.platypus.Paragraph` dengan `alignment=TA_JUSTIFY`, BUKAN `canvas.Canvas` manual
  `drawString` (rawan bug pagination, lihat catatan teknis di bawah).
- **Maksimal 1 halaman A4** untuk motivation letter kerja/magang biasa (checklist TU Delft), tapi **PhD
  boleh sampai 2 halaman** (riwayat riset jauh lebih kompleks) — JANGAN sampai 3 halaman, itu tandanya
  kepanjangan; padatkan kalimat, jangan kurangi margin/leading untuk memaksa muat.
- **Font Times-Roman/Times-Bold** (built-in reportlab, tidak perlu embed font apa pun) — ini dokumen
  akademik formal, bukan materi marketing/brand CAP, jadi TIDAK pakai palet gold/off-white CAP.

### Playbook menulis isi — ini yang bedain surat "generik" vs "green flag" ke reviewer PhD Eropa
1. **Riset SPESIFIK supervisor/grup riset target SEBELUM menulis satu kalimat pun** — `WebSearch` nama
   supervisor + universitas + kata "research", cari halaman staf resminya (bukan asumsi dari nama
   posisi doang). Begitu ketemu tema riset asli mereka, JAHIT ke reframing pertanyaan riset user sendiri
   — bukan cuma name-drop kosong. Contoh nyata sesi ini: Dr. van den Berg (ISGA/Leiden) punya tema
   "techno-regulation and nudging" yang sama sekali tidak disebut draft awal → begitu ditambahkan, surat
   berubah dari "bisa dikirim ke universitas manapun" jadi "kelihatan sudah baca risetnya beneran". Ini
   beda paling besar antara surat yang menonjol vs surat yang generik.
2. **Selaraskan bahasa dengan disiplin ilmu POSISI yang dilamar, bukan disiplin ilmu thesis lama user.**
   Thesis Eggan pakai bahasa intelligence/security studies ("detection capacity", "cyber threat
   intelligence"). Kalau posisi PhD-nya di ranah criminology/governance/victimology, reframe pakai
   istilah baku bidang itu (contoh dipakai: "routine activity theory", "guardianship gap" — bukan cuma
   terjemahan istilah security studies) — riset istilahnya dulu, jangan asal translate.
3. **Sertakan draft pendekatan/metodologi riset PhD itu sendiri**, bukan cuma pertanyaan besar — panel
   PhD kompetitif mau lihat bayangan konkret cara mengerjakannya (contoh: "extend the mixed-methods
   approach from my thesis... from institutional cases to individual ones"), bukan cuma niat abstrak.
4. **Jawab "kenapa universitas/grup ini spesifik" dengan alasan AKADEMIK** (kecocokan struktural
   program/pendekatan riset), bukan cuma alasan logistik (domisili) — logistik boleh disebut tapi
   diposisikan sebagai bonus sekunder, ditulis eksplisit begitu ("though that convenience is secondary
   to the fit").
5. **Hindari em dash ("—") dan pola retorika "not X, rather Y" berulang** — dua-duanya gampang terbaca
   sebagai gaya tulisan AI. Setelah draft jadi, hitung manual berapa kali "rather"/kata kontrastif serupa
   muncul — kalau lebih dari 2 di seluruh surat, variasikan strukturnya (pecah jadi 2 kalimat, ganti
   "instead of"/"not X" tanpa "rather").
6. **Sebut nomor vacancy + judul posisi PERSIS sama seperti postingan resmi**, konsisten di semua tempat
   yang menyebutnya (Re: line, paragraf pembuka) — jangan parafrase ("PhD Fellowship" vs "PhD Fellow" itu
   beda, dan reviewer yang teliti notice mismatch semacam ini).
7. **Setelah draft jadi, self-review pakai lensa reviewer PhD sungguhan** sebelum ditawarkan ke user —
   checklist yang sudah terbukti kepake sesi ini: kecocokan disiplin ilmu ✓, ada rujukan spesifik ke
   supervisor/grup (bukan generik) ✓, ada draft metodologi ✓, judul posisi konsisten ✓, tidak ada
   repetisi gaya tulisan ✓, setiap klaim fakta sudah diverifikasi vs `data.js`/CV asli (bukan asumsi dari
   konteks sesi lama yang mungkin sudah usang) ✓.

### Catatan teknis build (reusable)
- Pakai reportlab **Platypus** (`SimpleDocTemplate` + `Paragraph` + `HRFlowable` + `Image`), BUKAN raw
  `canvas.Canvas` dengan `drawString` manual. Canvas manual pernah menyebabkan bug serius di draft
  pertama sesi ini: helper `line()` tanpa bound-check menggambar teks di bawah margin halaman secara
  **diam-diam hilang tanpa error** (paragraf penutup + tanda tangan lenyap total, `pdfinfo` tetap lapor
  "Pages: 1" padahal isinya kepotong pertengahan kalimat). Platypus menghindari kelas bug ini total
  karena auto-paginate sendiri berdasarkan tinggi konten sebenarnya.
- Verifikasi WAJIB sebelum kirim ke user (jangan skip meski terburu-buru mendekati deadline): render
  `pdftoppm -jpeg -r 130 <file>.pdf <prefix>` tiap halaman → Read tool untuk cek visual (bukan cuma
  percaya angka `pdfinfo` "Pages: N") → kalau curiga ada teks terpotong, `pdftotext -layout <file>.pdf -
  | tail -20` untuk pastikan kalimat penutup & tanda tangan benar-benar ada.
- Script per-sesi terakhir yang dipakai: `build_motivation_letter.py` (disimpan di scratchpad sesi,
  BUKAN di repo manapun — sengaja, karena isinya spesifik ke satu lamaran). Untuk lamaran PhD baru,
  boleh mulai dari STRUKTUR yang sama (letterhead → alamat → Re: → isi → penutup+ttd, styles Platypus
  yang sama), tapi tulis ulang SELURUH konten paragraf isi sesuai posisi/universitas/supervisor yang
  baru — jangan reuse teks atau klaim spesifik dari surat Leiden ini ke lamaran lain.

## Bukan bagian dari project ini
Repo CAP (`~/Desktop/website CAP`), MatchupSkills (`~/Desktop/matchupskills`), ms-admin
(`~/Desktop/ms-admin`), Lumbung Jakut (`~/Desktop/lumbung-jakut`) adalah bisnis nyata terpisah
dengan `CLAUDE.md` masing-masing. Portofolio ini cuma MENAMPILKAN screenshot publik dari produk-
produk itu sebagai bukti kerja — tidak pernah mengubah kode di repo-repo tersebut.
