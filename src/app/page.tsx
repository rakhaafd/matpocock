import { getDashboardData } from "@/actions/transactions";
import { HeroCard } from "@/components/HeroCard";
import { QuickCategories } from "@/components/QuickCategories";
import { TransactionModal } from "@/components/TransactionModal";
import { TodayActivity } from "@/components/TodayActivity";
import { BottomNav } from "@/components/BottomNav";
import { Database } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getDashboardData();

  if (!data.success) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
          <Database className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Menunggu Koneksi PostgreSQL</h2>
          <p className="text-xs text-slate-400 max-w-xs">
            Pastikan kontainer PostgreSQL telah berjalan via <code>docker compose up -d</code> atau file <code>.env</code> terisi DATABASE_URL yang valid.
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono">
          docker compose up -d
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6">
      {/* Top Bar Greeting */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <div className="text-xs text-slate-400">Selamat Datang,</div>
          <div className="font-extrabold text-lg text-white tracking-tight">
            {data.user?.name || "Personal User"} 👋
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
          {data.user?.name ? data.user.name.charAt(0) : "U"}
        </div>
      </div>

      {/* Hero FinTech Card */}
      <HeroCard balance={data.balance} />

      {/* Quick 1-Tap Category Pills */}
      <QuickCategories categories={data.categories} />

      {/* Main Action Button for Custom Transaction */}
      <TransactionModal categories={data.categories} />

      {/* Today Activity Stream */}
      <TodayActivity transactions={data.todayTransactions} />

      {/* Persistent Bottom Nav */}
      <BottomNav />
    </div>
  );
}
