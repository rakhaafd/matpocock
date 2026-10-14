# 02: Kartu Hero Saldo dan Pencatatan Transaksi Cepat

**What to build:**  
Di halaman beranda ("Dompet"), pengguna melihat kartu digital FinTech modern yang menampilkan Saldo Bebas Belanja (*Free Cash Balance*) dan Total Kas Riil. Pengguna dapat mencatat pengeluaran harian dalam < 3 detik menggunakan pill kategori cepat (Makan, Kopi, Bensin) atau form kustom. Transaksi baru langsung tersimpan di database dan langsung memperbarui saldo serta daftar aktivitas transaksi hari ini secara reaktif.

**Blocked by:** 01 (Scaffolding Proyek Next.js, Prisma Migration, dan Seed Data Awal)

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] Kartu hero visual (desain Varian C) tampil di halaman utama, menampilkan *Free Cash Balance* dan *Total Cash Balance* dalam format Rupiah (contoh: `Rp 2.500.000`).
- [ ] Tombol pill kategori cepat (Makan, Kopi, Bensin, dll.) tersedia dan langsung merekam transaksi `EXPENSE` ke database saat diklik.
- [ ] Tersedia tombol/modal form untuk mencatat transaksi kustom dengan input nominal uang, jenis (`INCOME` atau `EXPENSE`), kategori, tanggal, dan catatan.
- [ ] Komponen riwayat aktivitas harian menampilkan daftar transaksi hari ini dengan warna hijau untuk pemasukan dan abu-abu/merah untuk pengeluaran.
- [ ] Menambah transaksi pemasukan meningkatkan Saldo Bebas & Total Kas; menambah pengeluaran mengurangi Saldo Bebas & Total Kas.
- [ ] Pengujian unit/integrasi pada level Server Action / Domain Service membuktikan rumus saldo kas berjalan akurat.
