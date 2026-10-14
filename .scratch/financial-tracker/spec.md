# Specification: Personal Finance & Dream Goals Tracker

Status: ready-for-agent  
Date: 2026-10-14  
Tracker: Local Markdown (`.scratch/financial-tracker/`)  

---

## Problem Statement

Pengguna sering kesulitan mengelola keuangan pribadi harian karena dua masalah mendasar:
1. **Pencatatan yang merepotkan dan lambat:** Aplikasi keuangan yang ada terlalu rumit, memerlukan login berbelit, atau memiliki terlalu banyak formulir input sehingga pengguna malas mencatat pengeluaran kecil harian (kopi, makan, bensin).
2. **Uang tabungan impian tercampur dengan uang belanja:** Pengguna memiliki barang impian (*wishlist/goals*) yang ingin dibeli, tetapi tidak memiliki pemisahan yang jelas antara "uang kas yang bebas dibelanjakan hari ini" dan "uang yang sudah disisihkan untuk barang impian". Akibatnya, uang untuk impian seringkali tidak sengaja terpakai untuk belanja harian, atau pengguna merasa memiliki banyak uang padahal sebagian uang tersebut sudah dialokasikan untuk tujuan tertentu.

---

## Solution

Aplikasi Web Mobile-First (*Personal Finance & Dream Goals Tracker*) yang memungkinkan pengguna:
1. **Mencatat Transaksi Harian dalam < 3 Detik:** Antarmuka bersih (*clean FinTech card*) dengan tombol cepat 1-tap untuk kategori harian populer (Makan, Kopi, Bensin, Belanja), serta form cepat untuk nominal kustom.
2. **Sistem Envelope Tabungan Impian (*Reserved Savings*):** Pengguna dapat mendaftarkan barang impian lengkap dengan target harga, tanggal target, dan progres tabungan. Uang yang disisihkan ke impian otomatis mengurangi *Saldo Bebas Belanja (Free Cash Balance)* tanpa mengurangi *Total Kekayaan Kas (Total Cash Balance)*.
3. **Realisasi Impian Otomatis:** Saat tabungan barang impian tercapai dan pengguna membeli barang tersebut, sistem otomatis mencatat transaksi pengeluaran riil (*EXPENSE*) dan melepas alokasi tabungan tanpa risiko pengurangan saldo ganda (*no double deduction*).

---

## User Stories

### A. Pencatatan Transaksi & Kategori
1. As a user, I want to see my Free Cash Balance prominently on the home screen, so that I immediately know how much money I can safely spend today without touching my dream savings.
2. As a user, I want to quickly log an expense using pre-configured category quick-pills (e.g., Makan, Kopi, Bensin), so that logging daily spending takes less than 3 seconds.
3. As a user, I want to log custom income transactions with amount, category, date, and optional notes, so that my salary, freelance earnings, or bonuses are accurately tracked.
4. As a user, I want to log custom expense transactions with amount, category, date, and optional notes, so that irregular expenses are properly documented.
5. As a user, I want to view a chronological feed of today's transactions, so that I can audit my daily activity at a glance.
6. As a user, I want income and expense items to be visually distinct (e.g., green for income, neutral/red for expense), so that my cash flow direction is instantly readable.
7. As a user, I want to filter and search through past transactions by date range and category in the History tab, so that I can look up past purchases easily.
8. As a user, I want to delete or edit a mistakenly recorded transaction, so that my balance remains completely accurate.
9. As a user, I want standard categories pre-populated by default, so that I can start logging immediately without any initial configuration.
10. As a user, I want to create custom categories with custom icons and colors, so that the app matches my personal spending habits.

### B. Dream Goals & Tabungan Impian
11. As a user, I want to create a new Dream Goal with a title, target amount in IDR, optional target date, and optional photo/icon, so that I have clear visual targets for things I want to buy.
12. As a user, I want to view all my active Dream Goals in a clean 2-column grid or list with visual progress bars and percentage badges, so that I feel motivated tracking my progress.
13. As a user, I want to allocate/deposit money into a specific Dream Goal from my Free Cash Balance, so that I steadily save toward that item.
14. As a user, I want the system to prevent me from allocating more money than my available Free Cash Balance, so that my spending money never drops below zero into accidental debt.
15. As a user, I want to see the deposit history for each Dream Goal, so that I know when and how much I have contributed over time.
16. As a user, I want the ability to withdraw funds from a Dream Goal back into my Free Cash Balance in case of emergencies, so that my money is never permanently trapped.
17. As a user, I want to mark a Dream Goal as "Purchased" (*Goal Purchase*) once the target is reached, so that the app celebrates my achievement and archives the goal.
18. As a user, I want the system to automatically generate a real `EXPENSE` transaction when a goal is marked as purchased, so that my actual bank outflow is recorded without double-counting against my free cash.
19. As a user, I want to view completed/achieved Dream Goals in an archived section, so that I have a rewarding history of goals I have accomplished.

### C. Navigasi & Pengalaman Pengguna
20. As a user, I want the app to open instantly without requiring an email/password login screen on every session, so that there is zero friction when logging a quick purchase on the go.
21. As a user, I want a persistent bottom navigation bar with 4 clear tabs (Dompet, Impian, Riwayat, Laporan), so that switching between features is ergonomic with one hand on mobile.
22. As a user, I want all currency values formatted cleanly in Indonesian Rupiah (e.g. `Rp 25.000`), so that amounts are natural and easy to read.

---

## Implementation Decisions

### 1. Architectural Style & Tech Stack
- **Framework**: Next.js App Router (Fullstack React 19/18, TypeScript, Tailwind CSS).
- **ORM & Database**: Prisma ORM connected to PostgreSQL.
- **Local Dev Infrastructure**: Docker Compose providing a self-contained PostgreSQL 16 container with healthchecks and persistent volume.
- **Client State / Fast Interaction**: Server Actions for data mutations with optimistic UI updates where appropriate.
- **Design Language**: Clean modern FinTech card layout (Variant C prototype validated by user).

### 2. State Calculation & Invariants
All balance calculations are derived dynamically to guarantee mathematical integrity:
- $\text{Total Cash} = \sum(\text{Transactions}_{INCOME}) - \sum(\text{Transactions}_{EXPENSE})$
- $\text{Reserved Savings} = \sum_{\text{goal.status} = \text{IN\_PROGRESS}} (\text{GoalDeposit.amount})$
- $\text{Free Cash} = \text{Total Cash} - \text{Reserved Savings}$

**Invariants:**
1. A deposit to a goal must reject if $\text{amount} > \text{Free Cash}$.
2. A goal purchase triggers an atomic transaction:
   - `DreamGoal.status` becomes `ACHIEVED`.
   - A new `Transaction` record is inserted with `type: EXPENSE` and `amount: goal.savedAmount`.
   - Because `goal.status` is no longer `IN_PROGRESS`, its deposits are excluded from `Reserved Savings`, preventing any double-deduction.

### 3. Data Schema (Prisma)
Derived from validated prototype and design ticket:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum TransactionType {
  INCOME
  EXPENSE
}

enum GoalStatus {
  IN_PROGRESS
  ACHIEVED
}

model User {
  id           String        @id @default(uuid())
  name         String        @default("Personal User")
  email        String?       @unique
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  categories   Category[]
  transactions Transaction[]
  goals        DreamGoal[]
}

model Category {
  id           String          @id @default(uuid())
  userId       String
  name         String
  type         TransactionType
  icon         String?         @default("tag")
  color        String?         @default("#64748b")
  createdAt    DateTime        @default(now())
  user         User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@unique([userId, name, type])
}

model Transaction {
  id         String          @id @default(uuid())
  userId     String
  categoryId String
  type       TransactionType
  amount     Decimal         @db.Decimal(15, 2)
  date       DateTime        @default(now())
  note       String?
  createdAt  DateTime        @default(now())
  updatedAt  DateTime        @updatedAt
  user       User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  category   Category        @relation(fields: [categoryId], references: [id], onDelete: Restrict)
}

model DreamGoal {
  id           String        @id @default(uuid())
  userId       String
  title        String
  targetAmount Decimal       @db.Decimal(15, 2)
  targetDate   DateTime?
  imageUrl     String?
  status       GoalStatus    @default(IN_PROGRESS)
  achievedAt   DateTime?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  deposits     GoalDeposit[]
}

model GoalDeposit {
  id        String    @id @default(uuid())
  goalId    String
  amount    Decimal   @db.Decimal(15, 2)
  date      DateTime  @default(now())
  note      String?
  createdAt DateTime  @default(now())
  goal      DreamGoal @relation(fields: [goalId], references: [id], onDelete: Cascade)
}
```

---

## Testing Decisions

### 1. The Single Testing Seam (High-Level Domain Actions)
Tests will target the **Domain Service Layer / Server Action Functions** (`src/actions/` or `src/services/`) directly rather than testing internal database implementation details or mocking low-level queries:
- `createTransaction({ type, amount, categoryId, note, date })`
- `allocateGoalDeposit({ goalId, amount, note })`
- `withdrawGoalDeposit({ goalId, amount, note })`
- `purchaseGoal({ goalId })`
- `getBalanceSummary()`

### 2. Observable External Behavior Under Test
- **Balance Invariant Test:** Verify that adding income increases both Total Cash and Free Cash.
- **Expense Invariant Test:** Verify that recording an expense reduces both Total Cash and Free Cash.
- **Deposit Invariant Test:** Verify that depositing Rp 100.000 to a Goal decreases Free Cash by Rp 100.000, leaves Total Cash unchanged, and increases the Goal's saved amount.
- **Over-allocation Rejection:** Verify that attempting to deposit an amount greater than Free Cash throws a validation error and leaves database state untouched.
- **Emergency Withdrawal Test:** Verify that withdrawing Rp 50.000 from a Goal returns Rp 50.000 back to Free Cash and records a negative deposit in the audit history.
- **Purchase Realization Test:** Verify that purchasing an achieved goal creates a real `EXPENSE` transaction, marks the goal as `ACHIEVED`, and produces no double-deduction on Free Cash.

---

## Out of Scope

- **Integrasi Mutasi Bank / Open Banking API**: Seluruh transaksi dicatat manual oleh pengguna.
- **Multi-Currency (Valuta Asing)**: Hanya mendukung Rupiah (IDR).
- **OCR Scan Struk Belanja**: Tidak ada pemindaian gambar otomatis.
- **Multi-Dompet (E-wallet terpisah, rekening bank terpisah)**: Sistem beroperasi pada satu total kas tunggal untuk kesederhanaan MVP.
- **Sistem Akun / Login Kompleks**: Dimulai dengan profil tunggal default bawaan.

---

## Further Notes

- Prototipe visual interaktif yang divalidasi pengguna tersedia di [`.scratch/financial-tracker/prototypes/mobile-ui-prototype.html?variant=C`](./prototypes/mobile-ui-prototype.html).
- Konfigurasi Docker Compose telah disiapkan di [`docker-compose.yml`](../../docker-compose.yml).
- Model domain dan terminologi resmi dipelihara di [`GLOSSARY.md`](../../GLOSSARY.md).
