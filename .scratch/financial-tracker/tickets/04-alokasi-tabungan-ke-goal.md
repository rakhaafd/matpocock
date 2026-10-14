# 04: Alokasi Tabungan ke Goal dengan Validasi Saldo Bebas

**What to build:**  
Pengguna dapat menyisihkan uang dari Saldo Bebas Belanja ke suatu barang impian secara langsung dari kartu goal (misal tombol cepat `+25rb`, `+100rb`, atau input kustom). Sistem memvalidasi bahwa nominal yang disisihkan tidak boleh melebihi Saldo Bebas Belanja. Uang yang disisihkan tersimpan di tabel `GoalDeposit`, otomatis menaikkan progress bar goal, mengurangi Saldo Bebas, dan menjaga Total Kas tetap utuh.

**Blocked by:** 02 (Kartu Hero Saldo dan Pencatatan Transaksi Cepat), 03 (Katalog Barang Impian dan Form Tambah Goal Baru)

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] Pada setiap kartu barang impian, terdapat aksi/tombol untuk menyisihkan dana (deposit tabungan).
- [ ] Validasi Saldo: Jika nominal alokasi $> \text{Free Cash Balance}$, tombol submit diblokir di UI dan API melempar error penolakan *"Saldo bebas belanja tidak mencukupi"*.
- [ ] Berhasil menyimpan deposit ke tabel `GoalDeposit` dan langsung memperbarui akumulasi tabungan goal.
- [ ] Dampak Saldo: Saldo Bebas Belanja berkurang sebesar nominal deposit, sementara Total Kas Riil tetap sama.
- [ ] Pengujian otomatis memverifikasi invarian alokasi tabungan dan penolakan saat terjadi over-allocation.
