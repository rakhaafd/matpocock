"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Target, ReceiptText, PieChart } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isGoals = pathname === "/goals";
  const isHistory = pathname === "/history";
  const isReports = pathname === "/reports";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/80 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around px-2">
        <Link
          href="/"
          className={`flex flex-col items-center py-1 px-3 transition ${
            isHome ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-white font-medium"
          }`}
        >
          <Wallet className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Dompet</span>
        </Link>

        <Link
          href="/goals"
          className={`flex flex-col items-center py-1 px-3 transition ${
            isGoals ? "text-indigo-400 font-bold" : "text-slate-400 hover:text-white font-medium"
          }`}
        >
          <Target className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Impian</span>
        </Link>

        <Link
          href="/history"
          className={`flex flex-col items-center py-1 px-3 transition ${
            isHistory ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-white font-medium"
          }`}
        >
          <ReceiptText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Riwayat</span>
        </Link>

        <Link
          href="/reports"
          className={`flex flex-col items-center py-1 px-3 transition ${
            isReports ? "text-indigo-400 font-bold" : "text-slate-400 hover:text-white font-medium"
          }`}
        >
          <PieChart className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Laporan</span>
        </Link>
      </div>
    </div>
  );
}
