# Konten dan provenance

Konten profil, proyek, pendidikan, pengalaman, kepemimpinan, riset, dokumen, tautan, dan terjemahan berasal dari `content.json` dalam ZIP pengguna. Revisi terutama mengubah komposisi tampilan dan memperpendek judul/deskripsi pada permukaan visual; uraian proyek lengkap tetap tersedia dalam expandable project story. File CV aktual memiliki dua halaman, sehingga label jumlah halamannya diperbaiki.

`assets/profile-nobg.png` adalah portrait asli dari paket. Screenshot cover proyek menggunakan artwork yang tampil pada gambar referensi 6. Screenshot lain dan file sumber produk asli tetap disertakan. Artwork cover tersebut merupakan visual acuan yang diberikan pengguna; tidak diklaim sebagai tangkapan website live terbaru.

Cover Leadership dan Moments hanya memakai tipografi dan bidang kertas. Foto kegiatan pada detail organisasi/field notes berasal dari folder leadership/gallery asli. Critical Grounds tidak memiliki foto asli dalam ZIP; kartu arsip menyatakan belum tersedia. Tidak ada avatar AI atau acara buatan yang ditambahkan.

129 karya Creative (79 gambar, 50 video) tetap karya kreatif dari arsip. Sebagian adalah produksi berbantuan AI, sesuai keterangannya. Ini tidak diperlakukan sebagai foto kegiatan nyata.

Thumbnail PDF dibuat dari halaman pertama PDF lokal: CV 2 halaman, sertifikat S1 7, sertifikat S2 6, tesis Inggris 256, sertifikat/penghargaan 11. Reader riset terpisah berisi 24+6+29+39 = 98 gambar halaman.

Aset baru: `assets/visuals/sky.png`, satu latar langit tanpa orang atau teks, dibuat dengan tool imagegen bawaan. Prompt lengkap ada di `IMAGE-ASSET.md`. `assets/visuals/grain.svg` adalah noise texture kecil. Semua paper plane lain adalah CSS native.

Sumber visual pengguna disalin tanpa perubahan ke `design/references/` dan video referensi ke `design/motion-references/`. Screenshot chat tidak ikut dimasukkan karena hanya diperlukan untuk memahami revisi, bukan bagian website.

Tidak ada akses terverifikasi ke website live pada sesi ini. Konten dari paket awal tidak dipresentasikan sebagai hasil audit website terbaru.

## Artwork acuan dalam pass terakhir

`assets/reference-art/*.svg` adalah viewport SVG yang menyematkan piksel PNG referensi tanpa mengubah sumbernya. Ini digunakan untuk artwork riset, foto kampus di referensi, poster, panel produk, dan cover proyek agar tidak diganti desain baru. Pemetaan koordinat sumber tercatat di `reference-art.json`; generatornya `tools/reference-art.mjs`. Artwork kampus adalah ilustrasi pada referensi, bukan verifikasi fotografi kampus.

Semua PDF asli tetap utuh. `assets/credentials/pages/` memuat 557 preview halaman untuk reader yang sama di semua browser: CV 2, S1 7, S2 6, tesis EN 256, tesis ID 275, sertifikat 11.
