# Handoff implementasi — revisi 2.1

Baca `START-HERE.md`, `brief/RELEASE-NOTES.md`, `brief/DESIGN-SYSTEM.md`, dan `brief/MIGRATION-AND-QA.md` sebagai dokumentasi paket. Permintaan terbaru pemilik proyek tetap menjadi otoritas utama.

Paket sudah berisi implementasi HTML/CSS/JavaScript dan seluruh aset, bukan sekadar brief. Generator adalah `tools/build.mjs`; data berasal dari `content.json`. Jalankan `npm run build` untuk menghasilkan ulang 480 rute; gunakan `npm ci && npm test` untuk validasi.

Gambar `design/references/1.png` sampai `7.png` adalah referensi visual pengguna. Versi 5 merevisi contoh konten homepage dari versi 1 dengan CAP / MatchupSkills / Lumbung. Wajah asli berasal dari `assets/profile-nobg.png`. Cover Leadership dan Moments memakai tipografi/kertas, tanpa avatar AI. Foto kegiatan asli hanya ditampilkan di arsip/detail. Jangan menyamarkan ilustrasi AI sebagai foto kegiatan.

Implementasi homepage memakai CSS sticky, perspektif, dan transform yang diperbarui requestAnimationFrame di `assets/revision.js`. `assets/revision.css` sengaja dimuat sesudah CSS dasar. Tersedia mobile, tema gelap, reduced motion, URL fallback, dan kontrol keyboard. Tidak membutuhkan backend atau kunci API.

Revisi minor v2.1 dimuat terakhir melalui `assets/polish.css` dan `assets/polish.js`. Cover homepage adalah HTML/CSS dengan screenshot asli. Jangan kembalikan cover tersebut ke crop kecil `reference-art/*-monument.svg`. Pertahankan keutuhan artwork dan tiga tombol bio.

32 kelompok tes struktur/interaksi dan pemeriksaan CSS tersedia. Browser desktop/mobile untuk bagian yang berubah sudah diperiksa langsung pada 23 September 2026; lihat `brief/browser-verification.json` untuk lingkupnya. Ini bukan audit visual seluruh 480 rute. Tidak ada deployment dilakukan.

Struktur locale dipertahankan: `/` = NL, `/en/` = EN, `/id/` = ID. Jangan mengubah URL halaman lama tanpa redirect. Untuk migrasi ke Next.js, pisahkan komponen header/menu, footer, opening scene, journey scene, gallery, reader, dan detail; pertahankan isi, route, serta resolusi aset dari paket. `vercel.json` adalah konfigurasi deployment statis opsional; tidak digunakan untuk mengubah deployment yang sedang aktif.
