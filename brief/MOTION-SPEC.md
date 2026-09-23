# Motion yang diimplementasikan

| Area | Perilaku | Penggerak |
|---|---|---|
| Opening | Kertas membuka ke samping, judul menjauh/fade, portrait mendekat sedikit | Progress scroll pada section 160svh desktop / 145svh mobile |
| Journey | Lima kartu utuh bergerak horizontal; kontrol manual menghentikan scrub scroll | Scroll section 155svh desktop / 140svh mobile, panah, drag, dan keyboard |
| Products | Panel perspektif dan lift saat hover; scroll horizontal/snap di mobile | CSS transform + native overflow |
| Creative | Sepuluh karya utuh, horizontal scroll, drag kursor, panah, keyboard; hover mengangkat karya | Native overflow, scroll snap, polish.js |
| Research | Halaman lipat statis; gerak kecil hanya saat hover | CSS |
| Menu | Fade/slide item secara berurutan | CSS keyframes, delay 35ms per item |
| Page navigation | Fade/translate jika browser mendukung native View Transitions | Progressive enhancement |
| Theme | Perubahan token warna; tidak membalik warna foto | Data attribute dan CSS variables |

Hanya satu requestAnimationFrame terjadwal untuk satu batch update scene ketika scroll/resize. Tidak ada loop animasi global tanpa henti. Gerak kertas Contact bersifat dekoratif dan dinonaktifkan ketika reduced motion aktif.

Tombol Motion di menu menyimpan preferensi. `prefers-reduced-motion` dihormati, animasi dipadamkan, dan section sticky dikembalikan menjadi alur halaman biasa. Tidak ada scroll hijacking atau audio otomatis.

Video pengguna 1/2/3/5 ditinjau melalui frame sampel sebagai acuan pergerakan panel dan transisi. Paket tidak mengklaim mereproduksi seluruh gerak 3D pada video secara identik. Implementasi memakai elemen web native, bukan video latar untuk menyimulasikan halaman interaktif.
