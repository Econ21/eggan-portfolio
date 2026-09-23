# Eggan Portfolio — revisi visual 2.1

Paket website statis lengkap yang direvisi dari ZIP awal, berdasarkan gambar 1–7 dan revisi pada chat yang diberikan. Diperbarui: 23 September 2026.

## Membuka hasilnya

1. Ekstrak ZIP sepenuhnya.
2. Buka `BUKA-PORTFOLIO.html`, kemudian pilih English, Indonesia, atau Nederlands.
3. Scroll halaman utama untuk melihat animasi pembukaan kertas dan perjalanan karya. Buka Menu untuk mengakses semua halaman, mengganti tema, atau mengurangi animasi.

File HTML, font, gambar, video, dan PDF tersedia lokal. Untuk preview dengan perilaku URL dan PDF yang lebih konsisten, jalankan `npm run preview` dari folder paket, lalu buka `http://127.0.0.1:8914/en/`. Perintah ini memakai Python 3; tidak membutuhkan instalasi paket Node. Jika port sedang dipakai, jalankan `python3 -m http.server 8915 --bind 127.0.0.1` dan buka port 8915.

## Revisi minor terbaru

Kepala portrait utuh; navbar lengkap dan tombol tema; bio plus tiga tombol; lima kartu journey dengan tautan; cover produk tajam dari screenshot asli; carousel sepuluh karya dengan drag, panah, keyboard, dan See more. Rincian ada di `brief/RELEASE-NOTES.md`.

## Apa yang berubah

- Homepage dibangun ulang sebagai enam adegan: portrait di antara lipatan kertas, perjalanan melalui karya, panggung produk biru, instalasi Creative, lembar riset, lalu People dan kontak.
- Kertas, huruf, panel karya, dan navigasi merupakan elemen HTML/CSS yang hidup; gambar storyboard tidak dipasang menjadi screenshot website.
- Work index memakai baris visual; detail proyek memakai galeri screenshot dengan thumbnail, panah, keyboard, swipe, serta pembesaran gambar.
- Creative memakai komposisi panel perspektif, 129 karya, filter gambar/video, tombol muat bertahap, detail dalam rasio asli, dan pemulihan posisi galeri.
- Research memakai daftar editorial, empat filter status, dan pembaca 98 halaman dengan thumbnail, zoom, panah, serta posisi baca tersimpan.
- Documents memakai thumbnail dari PDF asli, pembaca dokumen dengan thumbnail dan kontrol bawah, unduhan, dan pergantian bahasa tesis.
- About, Leadership, menu, Contact, footer, serta versi mobile direvisi. Tema terang menjadi default; tema navy gelap dan pengurangan gerak tersedia.
- Cover Leadership dan Moments tidak memakai wajah/avatar buatan AI. Dokumentasi asli berada di halaman detail. Foto Critical Grounds asli memang belum ada di sumber.

Untuk melihat acuan dan website berdampingan, buka `COMPARE-REFERENCE.html`. Ada pilihan halaman serta ukuran desktop/tablet/mobile. Ini alat pembanding yang menjalankan website asli di iframe, bukan screenshot QA.

## Isi paket

- 480 HTML: 160 halaman per bahasa, EN / ID / NL. Versi Belanda tetap berada di root untuk mempertahankan struktur paket asal.
- `content.json`: sumber data dan terjemahan.
- `tools/build.mjs`: generator seluruh halaman.
- `assets/site.css`, `assets/site.js`: komponen dasar dan interaksi umum.
- `assets/revision.css`, `assets/revision.js`: layout, gerak scroll, galeri, dan pembaca dokumen.
- `assets/polish.css`, `assets/polish.js`: enam revisi minor terbaru, cover tajam, dan carousel interaktif.
- `assets/`: aset lokal asli beserta font, 129 karya kreatif, dokumen, dan latar langit pendukung.
- `design/references/`: gambar 1–7 dari pengguna.
- `design/motion-references/`: empat video referensi pengguna; ini bahan acuan, bukan konten galeri.
- `brief/`: uraian desain, perubahan, hasil tes, dan batas verifikasi.

## Pemeriksaan yang sudah dilakukan

`npm ci` lalu `npm test` menjalankan pemeriksaan semua 480 halaman, tautan/aset lokal, interaksi galeri, tema, menu, reader, filter, serta bahasa PDF. Hasil rinci tersimpan di `brief/verification.json` dan `brief/style-verification.json`.

**Pemeriksaan browser versi 2.1:** akses browser telah pulih. Pembuka, bio, cover, carousel, menu, tema, dan satu video diuji langsung pada viewport desktop 1440×900 dan ponsel 390×844, ditambah tampilan awal sekitar 968×988. Lihat `brief/browser-verification.json`. Pemeriksaan otomatis kini mencakup 32 kelompok tes. Tidak ada klaim seluruh 480 halaman telah diperiksa visual, atau pixel-perfect. Website live tidak dideploy oleh paket ini.

## Mengedit dan membangun ulang

Butuh Node.js 18+ untuk build (tanpa dependency runtime). Jalankan `npm run build` setelah mengedit `tools/build.mjs` atau `content.json`. Perubahan CSS/JS langsung terbaca saat halaman dimuat ulang. Jangan hanya mengedit salah satu HTML keluaran karena build berikutnya akan menimpanya.

## Pengetatan sesuai instruksi terakhir

Gambar 1–7 menjadi spesifikasi visual tetap. Judul mobile, urutan panel, ringkasan produk, tampilan riset, timeline About, foto kampus, dan pembaca dokumen dikoreksi mengikuti referensi. Pada halaman lain, beberapa artwork/screenshot masih memakai viewport SVG dari gambar referensi asli, dengan piksel sumber tidak diubah. Cover homepage CAP / MatchupSkills / Lumbung pada versi 2.1 sudah diganti komposisi HTML/CSS dan screenshot proyek asli. File referensi beresolusi terbatas; crop tersebut tidak memiliki detail lebih tinggi daripada sumbernya. Seluruh teks navigasi, heading, tombol, dan animasi tetap dikodekan sebagai UI hidup.

Reader dokumen mempunyai 557 halaman preview dari 6 PDF asli, termasuk tesis EN 256 halaman dan ID 275 halaman. Jumlah asli ini dipertahankan meskipun ilustrasi pada referensi menampilkan contoh angka berbeda.
