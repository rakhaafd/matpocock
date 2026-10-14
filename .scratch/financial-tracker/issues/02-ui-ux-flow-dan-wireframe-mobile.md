# 02 - UI/UX Flow dan Wireframe Mobile

Type: prototype  
Status: resolved  
Blocked by: none  

## Question

Bagaimana susunan antarmuka (*wireframe / UI flow*) pada layar smartphone agar pencatatan transaksi harian bisa dilakukan dalam kurang dari 5 detik?

Secara khusus, keputusan ini harus mematangkan:
1. Komponen Dashboard: visualisasi Saldo Bebas vs Saldo Impian, serta tombol cepat (*Quick Add*).
2. Tampilan Kartu Barang Impian (*Goal Card*): progress bar persentase, estimasi waktu tercapai, dan modal pop-up "Tabung ke Goal Ini".
3. Struktur navigasi bawah (*Bottom Navigation Bar*): tab apa saja yang harus tersedia di mobile view?

## Answer

Pengguna memilih **Varian C (Modern FinTech Card & Clean Category Pills)** dengan penekanan pada estetika yang **simple dan clean**.

### Spesifikasi Desain Terpilih
1. **Header Hero Card**: Kartu digital modern elegan yang menampilkan:
   - Sisa Saldo Bebas Belanja (*Free Cash Balance*) sebagai angka paling dominan.
   - Total Dana Impian yang tersimpan di seluruh active goals.
   - Status mata uang (IDR).
2. **Quick Category Pills**: Tombol kategori horizontal 1-tap (*Makan, Kopi, Belanja, Bensin, dll.*) untuk mencatat pengeluaran dalam waktu kurang dari 3 detik.
3. **Wishlist Impian (Grid 2 Kolom)**: Kartu ringkas dengan ikon, judul barang impian, badge persentase tercapai, dan nominal terkumpul.
4. **Riwayat Transaksi Harian**: List transaksi clean dengan indikator warna hijau (+ pemasukan) dan abu-abu/merah (- pengeluaran).
5. **Bottom Navigation Bar**: 4 tab navigasi utama:
   - 💳 **Dompet / Dashboard** (Halaman Utama)
   - 🎯 **Impian** (Katalog Goal & Detail Progres)
   - 🧾 **Riwayat** (Filter Transaksi & Pencarian)
   - 📊 **Laporan** (Analitik & Statistik Pengeluaran)

*Asset Prototipe:* [`../prototypes/mobile-ui-prototype.html?variant=C`](../prototypes/mobile-ui-prototype.html)
