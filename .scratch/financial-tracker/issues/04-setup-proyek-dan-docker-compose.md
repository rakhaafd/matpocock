# 04 - Setup Proyek dan Docker Compose

Type: task  
Status: resolved  
Blocked by: 01  

## Question

Bagaimana konfigurasi file `docker-compose.yml` untuk PostgreSQL lokal, script inisialisasi database, serta struktur direktori dasar Next.js App Router yang siap untuk integrasi Prisma?

Secara khusus, keputusan ini harus mematangkan:
1. Konfigurasi `docker-compose.yml` dengan healthcheck dan persistent volume.
2. Template `.env.example` dengan format `DATABASE_URL` untuk lokal dan cloud.
3. Struktur folder Next.js (`src/app/`, `src/components/`, `src/lib/prisma.ts`).

## Answer

Konfigurasi lingkungan database dan boilerplate Prisma telah berhasil di-setup:

1. **Docker Compose (`docker-compose.yml`)**:
   - Image: `postgres:16-alpine`
   - Port: `5432:5432`
   - Database name: `financial_tracker`
   - Persistent volume: `postgres_data`
   - Healthcheck: `pg_isready -U postgres -d financial_tracker`
2. **Environment Variables (`.env.example` & `.env`)**:
   - `DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/financial_tracker?schema=public"`
   - `PORT=3000`
3. **Prisma Setup**:
   - Schema file: [`prisma/schema.prisma`](../../prisma/schema.prisma)
   - Singleton client: [`src/lib/prisma.ts`](../../src/lib/prisma.ts) (mencegah multiple instance saat Next.js fast-refresh)
