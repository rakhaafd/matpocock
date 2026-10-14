# Wayfinder Map: Personal Finance & Dream Goals Tracker

Label: `wayfinder:map`

## Destination

Menghasilkan spesifikasi teknis formal dan paket tiket implementasi siap bangun untuk aplikasi Web Personal Finance & Dream Goals Tracker berbasis Next.js App Router, TypeScript, Tailwind CSS, dan PostgreSQL (Prisma ORM).

## Notes

- **Domain Rules**: Mengacu pada [GLOSSARY.md](../../GLOSSARY.md) (Transaksi Income/Expense, Reserved Savings, Free Cash Balance, Realisasi Goal).
- **Tech Stack**: Next.js (App Router), TypeScript, Tailwind CSS, PostgreSQL, Prisma ORM.
- **Database Env**: Docker Compose untuk lokal dev + koneksi Cloud via `DATABASE_URL`.
- **User Mode**: Single-user default profile dengan schema multi-user ready (`user_id`).
- **Mata Uang**: IDR (Rupiah).
- **Skills Terkait**: `grilling`, `domain-modeling`, `prototype`, `tdd`, `to-spec`, `to-tickets`.

## Decisions so far

- [Schema dan Relasi Data Database](issues/01-schema-dan-relasi-data.md): PostgreSQL Prisma schema dirancang menggunakan Decimal(15, 2) untuk nominal IDR, tabel Category dinamis, tabel GoalDeposit untuk riwayat tabungan impian, dan model User dengan single-user seed.
- [UI/UX Flow dan Wireframe Mobile](issues/02-ui-ux-flow-dan-wireframe-mobile.md): Disepakati Varian C (Modern FinTech Card & Clean Category Pills) yang simple dan clean dengan 4 tab navigasi utama (Dompet, Impian, Riwayat, Laporan).
- [Setup Proyek dan Docker Compose](issues/04-setup-proyek-dan-docker-compose.md): Konfigurasi docker-compose.yml untuk PostgreSQL lokal, .env.example, prisma/schema.prisma, dan src/lib/prisma.ts singleton telah disiapkan.
- [Mekanisme Kalkulasi Saldo dan Goal Purchase](issues/03-mekanisme-kalkulasi-saldo-dan-goal-purchase.md): Rumus matematis Free Cash vs Reserved Savings, validasi pencegahan over-allocation, dukungan emergency withdraw, dan automasi transaksi EXPENSE saat goal dibeli tanpa double deduction.

## Not yet specified

- **Visualisasi & Analitik Bulanan**: Format chart/grafik ringkasan kategori pengeluaran dan tren pemasukan vs pengeluaran.
- **Backup & Ekspor Data**: Fitur ekspor riwayat transaksi ke format CSV / JSON untuk cadangan data.
- **PWA & Offline Capability**: Konfigurasi manifest PWA agar web dapat di-install di homescreen smartphone.

## Out of scope

- **Integrasi Bank / Open Banking / BCA API**: Di luar cakupan MVP; seluruh pencatatan transaksi dilakukan manual oleh pengguna.
- **Multi-Currency (Valas)**: Hanya mendukung Rupiah (IDR).
- **OCR Scan Struk Belanja**: Di luar cakupan MVP.
- **Multi-Dompet / Multi-Rekening**: MVP fokus pada 1 saldo kas tunggal (Total Kas & Saldo Bebas).
