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

## Struktur file (REWRITE TOTAL 2026-08-14 — arsitektur lama single-file sudah tidak berlaku)
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

## Bukan bagian dari project ini
Repo CAP (`~/Desktop/website CAP`), MatchupSkills (`~/Desktop/matchupskills`), ms-admin
(`~/Desktop/ms-admin`), Lumbung Jakut (`~/Desktop/lumbung-jakut`) adalah bisnis nyata terpisah
dengan `CLAUDE.md` masing-masing. Portofolio ini cuma MENAMPILKAN screenshot publik dari produk-
produk itu sebagai bukti kerja — tidak pernah mengubah kode di repo-repo tersebut.
