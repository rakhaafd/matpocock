# GLOSSARY

Dokumen ini mendefinisikan istilah resmi (*Ubiquitous Language*) untuk domain **Personal Finance & Dream Goals Tracker**.

---

### Istilah Inti (*Core Domain Terms*)

- **Transaction (Transaksi)**:  
  Catatan arus kas dengan atribut nominal (`amount`), tanggal (`date`), kategori (`category`), dan catatan (`note`). Terdiri dari dua tipe dasar:
  - `INCOME`: Uang masuk yang menambah total kas (contoh: gaji, uang saku, bonus).
  - `EXPENSE`: Uang keluar riil yang langsung mengurangi kekayaan kas (contoh: makan, transportasi, tagihan).

- **Dream Goal (Barang Impian)**:  
  Target barang atau pencapaian finansial masa depan yang memiliki target nominal (`target_amount`), batas waktu opsional (`target_date`), serta jumlah dana yang sudah terkumpul (`saved_amount`). Status: `IN_PROGRESS` atau `ACHIEVED`.

- **Goal Deposit / Reserved Savings (Dana Disisihkan)**:  
  Aksi memindahkan sejumlah uang dari saldo kas harian ke dalam satu Dream Goal tertentu. Alokasi ini **bukan** pengeluaran riil, melainkan cadangan dana (*envelope budgeting*).

- **Goal Purchase / Realization (Realisasi Impian)**:  
  Momen ketika target tabungan suatu Dream Goal terpenuhi dan barang tersebut resmi dibeli. Aksi ini mengubah status goal menjadi `ACHIEVED` dan secara otomatis menerbitkan satu transaksi `EXPENSE` riil sebesar harga barang.

- **Total Cash Balance (Total Kas)**:  
  Total seluruh uang riil yang dimiliki: `Total Income - Total Actual Expenses`.

- **Free Cash Balance (Saldo Bebas Belanja)**:  
  Uang kas yang aman dibelanjakan hari ini tanpa mengganggu tabungan impian:  
  `Total Cash Balance - Total Reserved Savings di seluruh active goals`.
