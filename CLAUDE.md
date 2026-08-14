# Eggan Portfolio — IT Consultant & Full-Stack Engineer

## Apa ini
Portofolio pribadi Eggan untuk jasa freelance/IT consulting — **terpisah total** dari bisnis CAP dan MatchupSkills (repo lain, jangan dicampur). Tujuannya: dapat klien dari Fastwork/Projects.co.id atau outreach langsung, dengan paket jasa harga tetap (fixed price) supaya tidak perlu nego.

## Live
- URL: **https://eggan.vercel.app**
- Vercel account: **personal** (`nachson21-6093s-projects`), BUKAN akun Vercel bisnis CAP — sengaja dipisah.
- Deploy saat ini: drag-and-drop manual `index.html` ke Vercel (belum connect ke Git repo).

## Struktur file di folder ini
- `index.html` — file FINAL yang di-deploy. Satu file HTML mandiri (CSS+JS inline, gambar sebagai base64 data URI, tanpa framework/build step eksternal).
- `build-portfolio.js` — Node script yang MENGHASILKAN `index.html`. Jalankan dengan `node build-portfolio.js` dari folder ini. Ini source of truth untuk struktur halaman.
- `shots/` — folder screenshot asli:
  - `shots/cap/*.jpg` (12 halaman publik CAP)
  - `shots/ms/*.jpg` (8 halaman publik MatchupSkills)
  - `shots/lumbung/*.jpg` (4 halaman publik Lumbung Jakut)
  - `shots/msadmin-login.jpg` (1 halaman — login dashboard internal, satu-satunya yang publik)

## Cara update
1. Edit `build-portfolio.js` untuk ubah struktur/copy/tambah slide, ATAU edit `index.html` langsung untuk perubahan teks kecil.
2. Kalau edit `build-portfolio.js`: jalankan `node build-portfolio.js` dari folder ini untuk regenerate `index.html`.
3. Deploy ulang: buka https://vercel.com/nachson21-6093s-projects/eggan → drag-and-drop `index.html` yang baru (atau `vercel --prod` via CLI kalau user sudah login dengan akun Vercel PRIBADI-nya).

## Isi halaman (ringkas)
- Hero: headline + tombol WhatsApp + chip tech stack
- Section profil: nama Eggan + riwayat pendidikan (Bachelor Informatics Engineering — ITB Swadharma; Master Strategic Intelligence — Universitas Indonesia; Master Data Driven Business — Den Haag University of Applied Sciences, Belanda). **Foto masih placeholder** (lingkaran huruf "E") — user belum kirim foto asli.
- 4 kartu case-study, klik → modal slideshow (carousel dengan prev/next + dots):
  1. **CAP — Creative AI Partner** (creativeaipartner.id) — 12 screenshot halaman publik
  2. **MatchupSkills** (matchupskills.id) — 8 screenshot halaman publik
  3. **Dashboard Operasional & Admin** (ms-admin/cap-admin, internal) — CUMA 1 screenshot (halaman login) — isi dashboard sengaja tidak ditampilkan karena berisi data finansial & tim asli
  4. **Lumbung Jakut** (lumbung.vercel.app) — 4 screenshot halaman publik
- Section Jasa & Harga (fixed, tanpa nego): Website + Payment Gateway (mulai Rp3.500.000, 3–5 hari), Audit Keamanan Aplikasi (mulai Rp1.500.000, 1–2 hari), Dashboard Admin Custom (sesuai scope), Integrasi Fitur AI (sesuai scope)
- Cara Kerja 3 langkah: chat WhatsApp → quote 24 jam → dikerjakan
- Kontak: WhatsApp **081401981855** (link `wa.me/6281401981855`), email `mahesacloude@gmail.com`

## Batasan penting (jangan langgar tanpa sadar konsekuensinya)
- **Tidak boleh login ke aplikasi yang butuh akun** (CAP image-studio/video-generator, halaman dalam MatchupSkills yang gated, isi dashboard ms-admin/cap-admin) untuk ambil screenshot — itu aturan keras yang tidak boleh dilanggar (membuat akun / masukkan password itu terlarang). Semua screenshot yang ada sekarang cuma dari halaman PUBLIK (dicek langsung dari `middleware.js` masing-masing repo, bukan tebakan).
- Kalau user mau screenshot LEBIH DALAM (misal UI generate gambar CAP yang sebenarnya, atau isi dashboard ms-admin) — **user harus screenshot sendiri** (karena mereka sudah login) lalu attach di chat. Baru dari situ ditambahkan ke `shots/` + carousel yang sesuai.
- User belum kirim foto profil asli — masih placeholder. Tanyakan/tunggu file-nya kalau mau dipasang.
- `index.html` HARUS tetap punya `<meta charset="utf-8">` di baris pertama — pernah ada bug nyata: tanpa ini, em-dash/panah render jadi mojibake (`â€"`) kalau di-serve tanpa header UTF-8 eksplisit.
- Ukuran gambar: screenshot di `shots/` sengaja di-resize ke ~760px lebar + JPEG quality ~50, dan tag `<img>` di carousel pakai `loading="lazy" decoding="async"`. Versi awal (1100px + quality 70 + tanpa lazy load) bikin halaman ~2.5MB dan lag parah saat di-scroll — jangan balik ke ukuran besar tanpa alasan kuat.

## Redesign 2026-08-14 — status: BELUM MULAI, spec tersimpan

Repo ini sedang di-scope ulang jadi jauh lebih besar dari "4 case-study card" di atas — user mau
job-application-grade portfolio: foto profil asli (background merah sudah dihapus, ada di
`photos-inbox/profile-nobg.png`), section **Leadership & Community** (8-9 peran kepemimpinan nyata —
Direktur ICCN, VP Indonesia Mengglobal, speaker UNESCO/UNDP, dll — sumber lengkap sudah ada di PDF
`Portofolio_Eggan Nachson.pdf` yang user kirim), galeri foto personal dengan navigasi klik manual
(next/back, bukan slideshow), section Skills/Keahlian baru, dan language switcher 3-bahasa
(Belanda/Inggris/Indonesia).

Full design brief (39-section spec dari ChatGPT + deskripsi mockup reference) ada di
**`DESIGN_BRIEF.md`** di root repo ini — baca file itu sebelum mulai kerjakan redesign. Status di
file itu eksplisit: **JANGAN MULAI BUILD** — user masih mau jelaskan brief itu poin-per-poin dan
masih akan kirim lebih banyak folder asset dulu. Ada juga 4 konflik/pertanyaan terbuka yang dicatat
di bagian akhir file itu (default bahasa EN vs NL, static-file vs framework, gelar master ketiga yang
belum dikonfirmasi, dan instruksi eksplisit untuk tunggu izin sebelum build) — jangan mulai
implementasi sebelum semua itu clear dari user.

Asset masuk lewat `~/Downloads/NEW PORTOFOLIO ASSET /` (dibuat manual oleh user via Finder, ada
folder per konteks di dalamnya — ICCN, Indonesia Mengglobal, Leadership & Community PDF, dst),
dikopi ke `photos-inbox/` di repo ini sebagai staging area. Ini proses multi-sesi/multi-turn — jangan
asumsikan sudah selesai hanya karena satu batch sudah masuk.

## Bukan bagian dari project ini
Repo CAP (`~/Desktop/website CAP`), MatchupSkills (`~/Desktop/matchupskills`), ms-admin (`~/Desktop/ms-admin`), Lumbung Jakut (`~/Desktop/lumbung-jakut`) adalah bisnis nyata terpisah dengan `CLAUDE.md` masing-masing. Portofolio ini cuma MENAMPILKAN screenshot publik dari produk-produk itu sebagai bukti kerja — tidak pernah mengubah kode di repo-repo tersebut.
