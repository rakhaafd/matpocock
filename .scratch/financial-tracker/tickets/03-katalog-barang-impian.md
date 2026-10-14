# 03: Katalog Barang Impian dan Form Tambah Goal Baru

**What to build:**  
Di tab "Impian" (atau widget di dashboard), pengguna dapat melihat katalog barang-barang impian yang ingin dibeli dalam bentuk grid 2 kolom yang rapi. Setiap kartu impian menampilkan ikon/foto, judul barang, target nominal, nominal terkumpul saat ini, dan progress bar persentase. Pengguna dapat membuka form modal untuk mendaftarkan barang impian baru.

**Blocked by:** 01 (Scaffolding Proyek Next.js, Prisma Migration, dan Seed Data Awal)

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] Tab "Impian" menampilkan seluruh barang impian berstatus `IN_PROGRESS` dalam grid responsif 2 kolom.
- [ ] Setiap kartu menampilkan persentase progress ($\text{saved} / \text{target} \times 100\%$) dan progress bar visual.
- [ ] Tombol "+ Tambah Impian" membuka form dialog untuk menginput Judul Barang, Target Nominal (IDR), Tanggal Target (opsional), dan Ikon/Kategori.
- [ ] Data barang impian baru tersimpan ke tabel `DreamGoal` dengan status awal `IN_PROGRESS` dan initial deposit Rp 0.
- [ ] Daftar kartu otomatis ter-refresh setelah goal baru berhasil disimpan.
