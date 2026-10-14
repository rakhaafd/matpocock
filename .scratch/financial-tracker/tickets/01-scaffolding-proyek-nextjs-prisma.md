# 01: Scaffolding Proyek Next.js, Prisma Migration, dan Seed Data Awal

**What to build:**  
Struktur dasar aplikasi web Next.js App Router yang siap dijalankan dan terhubung ke database PostgreSQL via Prisma. Saat aplikasi pertama kali diinisialisasi, sistem secara otomatis menjalankan migrasi skema database dan mengisi data bawaan (*seed*) berupa akun profil default pengguna dan kategori pengeluaran/pemasukan standar (Makan, Kopi, Bensin, Belanja, Tagihan, Gaji, Bonus).

**Blocked by:** None (can start immediately)

**Status:** resolved

## Acceptance Criteria

- [x] Proyek Next.js App Router dengan TypeScript dan Tailwind CSS berhasil dibuat dan lolos `pnpm build` tanpa error.
- [x] Prisma Client terkonfigurasi dengan singleton di `src/lib/prisma.ts`.
- [x] Skrip migrasi database (`prisma migrate dev` / `prisma db push`) berhasil membuat tabel-tabel sesuai skema di PostgreSQL.
- [x] Skrip database seed (`prisma/seed.ts`) otomatis membuat profil User default dan minimal 6 kategori transaksi default jika tabel masih kosong.
- [x] Halaman awal (`/`) dapat diakses di browser dan menampilkan status koneksi database aktif.
