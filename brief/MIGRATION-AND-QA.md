# Migrasi dan pemeriksaan

## Menjalankan

- Buka `BUKA-PORTFOLIO.html` untuk pratinjau file lokal.
- Preview server: `npm run preview` (Python 3) dan buka `http://127.0.0.1:8914/en/`.
- Rebuild: `npm run build` (Node 18+).
- Pemeriksaan: `npm ci && npm test`.

## Deployment

Paket merupakan website statis. Semua folder locale, assets, dan HTML perlu ikut dipublikasikan. `vercel.json` menonaktifkan deteksi framework dan memakai output root; `.vercelignore` mengecualikan dependency development, brief, dan referensi desain. Tidak ada kredensial hosting atau deployment dijalankan pada sesi ini.

Untuk memasang ke repository Next.js yang sudah ada, pindahkan komponen dan aset secara bertahap atau gunakan deployment statis terpisah. ZIP ini tidak berisi source repository live yang tidak tersedia. Pertahankan URL `/education` untuk About, `/creative-work` untuk Creative, serta seluruh slug detail. `/` tetap versi Belanda; `/en/` dan `/id/` tersedia.

## Pemeriksaan otomatis

`tools/verify.cjs` memeriksa 480 halaman, language attribute, heading, ID unik, aset dan link lokal, seluruh media, menu/theme/reduced motion, filter dan pagination, galeri produk, image viewer, research reader, dan bahasa PDF. `tools/verify-styles.cjs` memeriksa grammar CSS dan URL aset CSS. `tools/verify-polish.cjs` menambahkan pemeriksaan navbar, bio, cover dan kontrol carousel. Total 32 kelompok tes. Tes otomatis menggunakan jsdom dan parser CSS; pemeriksaan render browser dicatat terpisah.

## Status browser

Akses browser pulih pada 23 September 2026. Homepage yang berubah diperiksa langsung pada desktop 1440×900 dan ponsel 390×844, plus tampilan awal tablet. Pemeriksaan mencakup portrait, navbar, bio, cover, carousel, drag, tema, menu, tautan video, dan playback. Lihat `browser-verification.json` untuk lingkup dan batas. Seluruh 480 rute belum diaudit visual satu per satu; tidak ada klaim pixel-perfect. Website produksi tidak diubah.

## Pemeriksaan visual saat browser tersedia

Bandingkan homepage dengan referensi 5 pada desktop 1440×900 dan mobile 390×844. Scroll melalui semua scene; periksa heading, wajah, aperture, layering panel, serta keterbacaan. Uji nav dari tiap locale, delapan tujuan menu, tema navy, reduced motion, pagination/filter galeri, keyboard dan swipe galeri proyek, reader halaman terakhir, dokumen PDF, unduhan, dan back-to-archive. Periksa pula lebar 360 dan 768 px untuk overflow dan tinggi panel.

Pembaca dokumen sekarang memakai halaman hasil render PDF asli dengan thumbnail, nomor halaman, fit page/width, zoom, keyboard, serta pilihan tesis EN/ID. Tombol Open PDF dan Download mengakses file asli. Jumlah halaman mengikuti dokumen nyata, bukan angka contoh pada gambar referensi. `COMPARE-REFERENCE.html` menyediakan website dan referensi berdampingan untuk pengecekan visual ketika browser tersedia.
