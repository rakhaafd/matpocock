# 05: Penarikan Dana Darurat dan Otomatisasi Realisasi Pembelian Impian

**What to build:**  
Dua fitur siklus hidup tabungan impian:
1. **Tarik Dana Darurat:** Pengguna dapat menarik kembali sebagian atau seluruh uang yang sudah ditabung di suatu goal kembali ke Saldo Bebas.
2. **Realisasi Pembelian Impian:** Ketika tabungan barang impian mencapai 100% target, muncul tombol "Beli Barang Impian". Mengklik tombol ini otomatis menandai goal sebagai `ACHIEVED` dan secara bersamaan mencatat 1 transaksi `EXPENSE` riil di tabel `Transaction` tanpa terjadi pengurangan saldo ganda (*no double deduction*).

**Blocked by:** 04 (Alokasi Tabungan ke Goal dengan Validasi Saldo Bebas)

**Status:** resolved

## Acceptance Criteria

- [x] Pengguna dapat melakukan penarikan dana (*withdraw*) dari goal aktif; dana kembali ke Saldo Bebas Belanja dan tercatat sebagai entri negatif di `GoalDeposit`.
- [x] Goal yang tabungannya $\ge 100\%$ menampilkan indikator visual selesai dan tombol aksi "Beli Sekarang".
- [x] Mengklik "Beli Sekarang" memicu transaksi database atomik:
  1. `DreamGoal.status` menjadi `ACHIEVED` dan `achievedAt` tercatat.
  2. Sebuah record `Transaction` baru bertipe `EXPENSE` terbuat dengan nominal sebesar tabungan yang terkumpul, kategori *"Barang Impian"*, dan catatan nama barang.
- [x] Saldo Bebas Belanja tidak berkurang ganda saat realisasi pembelian dieksekusi (*no double deduction*).
- [x] Goal yang telah berstatus `ACHIEVED` pindah ke bagian arsip/selesai.
- [x] Pengujian otomatis memverifikasi end-to-end flow dari realisasi goal hingga terbitnya transaksi pengeluaran.
