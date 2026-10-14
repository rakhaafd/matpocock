# 01 - Schema dan Relasi Data Database

Type: grilling  
Status: resolved  
Blocked by: none  

## Question

Bagaimana struktur tabel, enum, dan relasi data di PostgreSQL (Prisma schema) untuk entitas `User`, `Transaction`, `Category`, `DreamGoal`, dan `GoalDeposit`?

Secara khusus, keputusan ini harus mematangkan:
1. Apakah Kategori bersifat enum statis atau tabel yang bisa ditambah sendiri oleh user?
2. Bagaimana relasi riwayat penambahan tabungan ke goal (`GoalDeposit`) terhadap transaksi kas?
3. Format tipe data nominal uang (apakah `Decimal(15, 2)` atau `BigInt` untuk Rupiah)?

## Answer

Disepakati rancangan schema Prisma sebagai berikut:

1. **Format Nominal**: Menggunakan `Decimal(15, 2)` di PostgreSQL untuk seluruh field `amount` guna menghindari floating-point precision error serta aman di-serialize.
2. **Kategori Dinamis**: Tabel `Category` independen dengan relasi ke `User`, di-seed dengan kategori default (Makanan, Transportasi, Belanja, Tagihan, Gaji, Bonus), dan mendukung penambahan kustom oleh user.
3. **Riwayat Tabungan Goal**: Disediakan tabel `GoalDeposit` yang mencatat tiap transaksi menyisihkan uang ke `DreamGoal`, sehingga riwayat tabungan transparan dan total `saved_amount` bisa diverifikasi.
4. **Multi-User Ready**: Seluruh entitas terikat pada `userId` ke tabel `User`. Disediakan akun default seed saat pertama kali inisialisasi agar aplikasi dapat langsung digunakan tanpa form login.

### Definisi Prisma Schema
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
