# Revisi 2.1 — 23 September 2026

Desain yang telah disetujui dipertahankan. Revisi ini menerapkan enam permintaan minor dari screenshot pengguna:

1. Aperture kertas dan ukuran/posisi portrait disesuaikan supaya kepala utuh pada desktop dan ponsel.
2. Navbar desktop memuat Home, Experience & Education, Work, Creative, Research, Leadership, Contact, bahasa, tombol tema, dan Menu. Tablet memakai dua baris; ponsel memiliki menu lengkap delapan tujuan.
3. Bio asli dipulihkan tepat setelah pembuka, dengan Explore my work, Let’s connect, serta CV & Documents. Ketiganya menuju halaman sebenarnya dalam bahasa aktif.
4. Journey memuat lima kartu: dua karya kreatif dan tiga proyek. Artwork utuh, label Open, nama, tombol panah, serta tautan detail. Gerak scroll berjalan sampai pengguna mengambil alih melalui drag/scroll/keyboard.
5. Cover CAP, MatchupSkills, dan Lumbung dibuat dengan tipografi HTML/CSS, komposisi warna proyek, dan screenshot asli. Tidak menggunakan pembesaran crop thumbnail referensi untuk cover homepage. Tidak ada gambar AI baru.
6. Creative menampilkan sepuluh karya asli arsip (delapan gambar, dua video), horizontal scrolling, drag kursor, panah, keyboard, dan See more. Karya ditampilkan utuh; video dibuka pada halaman pemutar dengan kontrol asli. Preview arsip juga mempertahankan rasio gambar.

Implementasi tambahan: `assets/polish.css`, `assets/polish.js`, serta helper di `tools/build.mjs`. Semua 480 halaman dibangun ulang, lengkap dalam EN/ID/NL.

## Pemeriksaan versi ini

32 kelompok pemeriksaan struktur/interaksi, pemeriksaan CSS, dan seluruh tautan/aset lokal. Browser kini dapat diakses: pembuka, bio, cover, carousel, tema, menu ponsel dan satu pemutar video telah diperiksa langsung pada desktop dan ponsel. Ruang lingkup serta batasnya ada dalam `browser-verification.json`. Pemeriksaan ini bukan klaim semua 480 halaman telah diperiksa visual atau pixel-perfect.

Website produksi tidak dideploy. ZIP lama tidak ditimpa.

---

# Arsip catatan versi 2.0

Catatan berikut menggambarkan versi terdahulu; batas akses browser saat itu telah berubah sebagaimana dicatat di atas.

# Revisi 2.0 — 20 September 2026

## Perubahan utama

Revisi mengganti komposisi generik paket awal dengan sistem visual berdasarkan gambar 1–7: kertas ivory, langit cobalt, serif display rapat, penanda oranye, dan panel dengan perspektif. Semua teks dan kontrol tetap HTML yang dapat dipilih dan diakses.

Homepage lama (hero + daftar bagian berulang) diganti menjadi enam adegan yang mengikuti storyboard. Intro membuka aperture kertas; bagian berikutnya menggerakkan pita berisi karya dan screenshot asli. Produk dipresentasikan sebagai tiga panel berperspektif di ruangan biru. Creative memakai lima panel; Research berhenti sebagai area baca; People memakai portrait asli sebelum kontak.

Work index, tiga detail proyek, Creative index dan 129 detail media, About & Experience, Leadership dan detail organisasi, field notes, Research beserta reader, Documents beserta preview, Contact, menu, dan footer direvisi di ketiga bahasa.

## Interaksi

- Scroll-scrubbed opening dan journey; gerak berjalan berdasarkan scroll pengguna.
- Native scrolling, tanpa scroll hijacking. Kontrol reduced motion menghapus pinning dan animasi.
- Project gallery: 12 / 8 / 4 screenshot dari arsip CAP / MatchupSkills / Lumbung, thumbnail, navigasi melingkar, arrow keys, swipe, lightbox.
- Creative: 20 item awal, load more per 20, filter 79 gambar / 50 video, URL detail, video controls, posisi galeri tersimpan.
- Research: empat status, 98 gambar halaman asli, thumbnail, halaman langsung, tombol panah, zoom, persistence.
- Documents: pembaca dokumen dari halaman PDF asli, preview eksternal, download, serta pergantian tesis EN/ID serentak.
- Menu fullscreen, pemulihan fokus, tema gelap tersimpan, bahasa mempertahankan rute yang sedang dibuka.

## Konten / aset

Semua aset asli tetap disertakan. Thumbnail PDF dibuat dari halaman pertama dokumen asli. Keterangan jumlah halaman CV dikoreksi dari 1 menjadi 2 setelah memeriksa file. Latar langit baru dibuat melalui imagegen bawaan; tidak ada wajah atau foto acara baru yang dibuat. File latar, prompt, dan provenance ada di paket.

## Hasil pemeriksaan

480 halaman dihasilkan. 21 kelompok pengujian struktur dan interaksi lulus. CSS lolos pemeriksaan grammar dan tautan aset lokal. Jumlah tautan terkini ada di `verification.json`.

QA visual browser belum dilakukan karena akses live dan localhost sama-sama tertolak oleh pemeriksaan keamanan browser yang tidak tersedia. Implementasi tidak diklaim pixel-perfect. Website aktif tidak diubah. Foto asli Critical Grounds belum tersedia dan tetap diberi keterangan yang jujur di halaman field notes.

## Pengetatan visual setelah arahan “samain persis”

Tidak mengganti arah desain. Mobile mengikuti judul pada referensi 2. Artwork yang tersedia dalam gambar acuan dipakai melalui viewport SVG; urutan panel homepage berbeda dari Creative index sesuai referensi. About memakai timeline ringkas, empat kartu kampus, enam kursus, tiga pencapaian, lima kategori skills. Cerita/uraian lengkap tetap dapat dibuka dari details. Reader dokumen mempunyai thumbnail dan toolbar bawah yang dikodekan, tanpa bergantung pada toolbar PDF browser. Alat pembanding referensi vs iframe disertakan.

Kesesuaian pixel akhir tetap belum terverifikasi karena browser terblokir. Berkas acuan raster juga tidak menyediakan font sumber, layer 3D, atau artwork terpisah beresolusi tinggi untuk seluruh elemen. Tidak ada klaim bahwa batas tersebut sudah terselesaikan.
