# 06: Tab Riwayat Transaksi Lengkap, Pencarian, dan Filter Kategori

**What to build:**  
Di tab "Riwayat", pengguna dapat menjelajahi seluruh riwayat transaksi keuangan masa lalu dengan cepat. Halaman ini menyediakan pencarian kata kunci berdasarkan catatan transaksi, filter berdasarkan kategori (misal hanya tampilkan *Makanan* atau *Gaji*), filter rentang tanggal, serta opsi untuk menghapus atau mengedit transaksi yang salah dicatat.

**Blocked by:** 02 (Kartu Hero Saldo dan Pencatatan Transaksi Cepat)

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] Tab "Riwayat" menampilkan seluruh transaksi kas dalam urutan kronologis terbalik (terbaru di atas) dengan pagination atau infinite scroll.
- [ ] Pengguna dapat memfilter daftar berdasarkan Kategori transaksi.
- [ ] Pengguna dapat memfilter daftar berdasarkan Jenis (`ALL`, `INCOME`, `EXPENSE`).
- [ ] Pengguna dapat mencari transaksi berdasarkan teks pada kolom catatan (*note*).
- [ ] Tersedia tombol hapus transaksi dengan konfirmasi dialog; menghapus transaksi langsung mengembalikan/mengurangi saldo kas secara presisi.
- [ ] Ringkasan total pemasukan dan total pengeluaran untuk periode filter yang dipilih tampil di bagian atas halaman riwayat.
