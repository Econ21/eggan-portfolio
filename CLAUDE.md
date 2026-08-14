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
  - `leadership/*.jpg` — 1 foto per entry Leadership & Community (8 dari 10 entry punya foto; Titik
    Terang & YouthRanger.id sengaja text-only card karena tidak ada foto personal yang layak)
  - `gallery/*.jpg` — foto "Field Notes" (community/lapangan)
  - `research/tokyo/*.jpg`, `research/jurnal/*.jpg` — halaman PDF di-rasterize jadi gambar (lihat
    "Research reader" di bawah)
  - `work/{cap,ms,lumbung}/*.jpg` + `work/msadmin-login.jpg` — screenshot case-study (sama seperti
    `shots/` versi lama, dikopi ke sini)
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
1. Edit teks/data di `data.js` (semua field 3-bahasa: `{nl, en, id}` — JANGAN lupa update ketiganya
   kalau ubah sesuatu, atau kontennya jadi tidak konsisten antar bahasa).
2. Kalau nambah/ubah foto: taruh file di `assets/<kategori>/`, referensikan di `data.js`
   (field `img` pada entry Leadership/Gallery, atau `thumb`/`dir` pada Project).
3. `node build-portfolio.js` dari folder ini.
4. `cd dist && vercel link --yes --project eggan --scope nachson21-6093s-projects && vercel --prod
   --yes --scope nachson21-6093s-projects`.
5. Commit + push perubahan SOURCE (bukan `dist/`, itu gitignored) ke `Econ21/eggan-portfolio` —
   pastikan `git config user.email` masih `nachson21@gmail.com` lokal di repo ini dulu (lihat
   "Live" di atas) sebelum commit.

## Struktur halaman (multi-page, bukan single-page — permintaan eksplisit user 2026-08-14)
6 halaman × 3 bahasa = 18 file HTML. URL bersih via `vercel.json` (`cleanUrls: true`, auto-generate
oleh `build-portfolio.js`, jangan edit manual). Bahasa default **Belanda** di root (`/`), Inggris di
`/en/*`, Indonesia di `/id/*`.

| Halaman | Slug | Isi |
|---|---|---|
| Home | `/` | Hero (foto profil + headline + CTA), teaser 2 project, teaser 4 leadership entry |
| Education | `/education` | Bio + foto "Critical Grounds" + pull-quote + timeline pendidikan + Skills grid |
| Work | `/work` | 4 case-study card (modal carousel manual next/back, sama pola dgn versi lama) + Skills + Services |
| Research | `/research` | 2 paper (published journal + joint research Tokyo University) — klik → reader halaman-per-halaman manual, **TANPA tombol download** (lihat di bawah) |
| Leadership | `/leadership` | 10 entry Leadership & Community (black timeline cards) + Gallery "Field Notes" (manual scroll strip + lightbox klik-buka) |
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
- Gelar master ketiga (Artificial Intelligence, Lübeck University) — **BELUM dikonfirmasi user**,
  cuma muncul di bio kartu VP Indonesia Mengglobal. `data.js` `EDUCATION` sengaja cuma 2 entry
  (UI + Den Haag). JANGAN tambah entry ketiga tanpa konfirmasi eksplisit dari user.
- Bahasa default: **Belanda**, bukan Inggris — ini instruksi eksplisit user, override dari asumsi
  default ChatGPT di `DESIGN_BRIEF.md` bagian §32.
- Arsitektur: tetap static HTML generated (vanilla, TANPA framework/build-tool React/Next), tapi
  **multi-page** (file terpisah per halaman × bahasa) — bukan lagi single `index.html` dengan anchor
  section. Ini juga instruksi eksplisit user (awalnya direncanakan single-page, diubah di tengah
  proses build).

## Yang belum dikerjakan / disederhanakan dari DESIGN_BRIEF.md
Redesign 2026-08-14 mengimplementasikan struktur inti, konten nyata (3 bahasa), dan interaksi wajib
(manual carousel/gallery/reader nav, language switcher, leadership timeline) — tapi BEBERAPA detail
motion-design di brief 39-section sengaja disederhanakan demi selesai dalam waktu wajar:
- Custom cursor (§24) — belum ada
- Elaborate page-load animation sequence (§5) — belum ada, halaman langsung tampil
- Scroll-triggered line-draw animation di timeline (§9, §13) — belum ada, elemen langsung tampil
- Parallax hero image on cursor move (§7) — belum ada
Semua ini bisa ditambahkan belakangan kalau user minta — prioritas kemarin adalah struktur, konten
akurat, dan interaksi fungsional, bukan polish motion-design penuh.

## Bukan bagian dari project ini
Repo CAP (`~/Desktop/website CAP`), MatchupSkills (`~/Desktop/matchupskills`), ms-admin
(`~/Desktop/ms-admin`), Lumbung Jakut (`~/Desktop/lumbung-jakut`) adalah bisnis nyata terpisah
dengan `CLAUDE.md` masing-masing. Portofolio ini cuma MENAMPILKAN screenshot publik dari produk-
produk itu sebagai bukti kerja — tidak pernah mengubah kode di repo-repo tersebut.
