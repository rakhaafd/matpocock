# 03 - Mekanisme Kalkulasi Saldo dan Goal Purchase

Type: grilling  
Status: resolved  
Blocked by: 01  

## Question

Bagaimana aturan bisnis dan rumus matematis untuk menghitung saldo secara real-time, serta apa yang terjadi di database ketika pengguna mengeklik "Beli Barang Impian"?

Secara khusus, keputusan ini harus mematangkan:
1. Validasi saat user menabung ke goal: bagaimana sistem memblokir alokasi jika Saldo Bebas tidak mencukupi?
2. Bagaimana jika tabungan goal dibatalkan / ditarik kembali (*withdraw from goal*)?
3. Saat goal di-mark sebagai `ACHIEVED` (dibeli): apakah otomatis men-generate transaksi `EXPENSE` riil di tabel `Transaction` atau hanya mengubah status goal?

## Answer

Disepakati seluruh aturan bisnis dan mekanisme kalkulasi saldo sebagai berikut:

### 1. Rumus Matematis Saldo
- **Total Uang Kas Riil (*Total Cash Balance*)**:
  Total Cash = Total Pemasukan - Total Pengeluaran Riil
- **Total Dana Impian Aktif (*Reserved Savings*)**:
  Reserved Savings = Akumulasi deposit di seluruh goal yang berstatus `IN_PROGRESS`
- **Saldo Bebas Belanja (*Free Cash Balance*)**:
  Free Cash = Total Cash - Reserved Savings

### 2. Validasi Alokasi Tabungan
- Saat menambah deposit ke goal: `amount <= Free Cash`.
- Jika pengguna memasukkan nominal lebih besar dari Free Cash, tombol input di UI di-disable dan API backend melempar validasi error: *"Saldo bebas tidak mencukupi untuk disisihkan ke impian ini"*.

### 3. Penarikan Dana Darurat (*Withdraw from Goal*)
- Pengguna dapat menarik kembali uang yang telah disisihkan dari goal yang berstatus `IN_PROGRESS` ke Saldo Bebas.
- Dicatat di tabel `GoalDeposit` dengan nominal negatif (`amount < 0`) dan catatan *"Penarikan Dana Darurat"*, sehingga histori penabung tetap akurat dan audit trail terjaga.

### 4. Alur Realisasi Pembelian Barang Impian (*Goal Purchase*)
Ketika target tabungan tercapai dan pengguna menekan tombol **"Beli Barang Impian"**:
1. Status `DreamGoal` diupdate menjadi `ACHIEVED` dan `achievedAt = now()`.
2. Sistem otomatis membuat 1 transaksi pengeluaran riil di tabel `Transaction`:
   - `type`: `EXPENSE`
   - `amount`: Total dana yang terkumpul di goal tersebut
   - `categoryId`: Kategori bawaan *"Barang Impian"*
   - `note`: *"Realisasi Impian: [Judul Barang]"*
   - `date`: `now()`
3. **Mencegah Pengurangan Ganda (*No Double Deduction*)**: Karena goal telah berstatus `ACHIEVED`, dana goal tersebut secara otomatis tidak lagi dihitung ke dalam `Reserved Savings`. Pelepasan dari `Reserved Savings` terjadi bersamaan dengan pengurangan kas oleh transaksi `EXPENSE` baru, sehingga Saldo Bebas Belanja tetap konsisten tanpa fluktuasi ganda.
