import { prisma } from "@/lib/prisma";
import { CheckCircle2, Database, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let dbStatus = "Connecting...";
  let userCount = 0;
  let categoryCount = 0;
  let isConnected = false;

  try {
    userCount = await prisma.user.count();
    categoryCount = await prisma.category.count();
    isConnected = true;
    dbStatus = "Database Terhubung";
  } catch (error) {
    dbStatus = "Database belum aktif / menunggu koneksi";
    console.error("DB connection check error:", error);
  }

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
        <Sparkles className="w-8 h-8 text-white" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Personal Finance & Dream Goals
        </h1>
        <p className="text-sm text-slate-400">
          Proyek Next.js App Router & Prisma PostgreSQL telah siap.
        </p>
      </div>

      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm font-semibold text-white">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Status PostgreSQL</span>
          </div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              isConnected
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}
          >
            {isConnected ? "ONLINE" : "PENDING"}
          </span>
        </div>

        <div className="text-xs text-slate-400 border-t border-slate-800/80 pt-3 space-y-1.5">
          <div className="flex justify-between">
            <span>Kondisi Koneksi:</span>
            <span className="text-slate-200 font-medium">{dbStatus}</span>
          </div>
          {isConnected && (
            <>
              <div className="flex justify-between">
                <span>Pengguna Terdaftar:</span>
                <span className="text-slate-200 font-medium">{userCount} User</span>
              </div>
              <div className="flex justify-between">
                <span>Kategori Bawaan:</span>
                <span className="text-slate-200 font-medium">{categoryCount} Kategori</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Tiket 01 Foundation • Siap untuk Tiket 02 (Pencatatan Transaksi & Saldo)
      </div>
    </div>
  );
}
