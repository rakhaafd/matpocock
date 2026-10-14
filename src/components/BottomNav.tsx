"use client";

import { Wallet, Target, ReceiptText, PieChart } from "lucide-react";

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/80 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around px-2">
        <button className="flex flex-col items-center py-1 px-3 text-emerald-400">
          <Wallet className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Dompet</span>
        </button>

        <button
          onClick={() => alert("Katalog Impian ada di Tiket 03.")}
          className="flex flex-col items-center py-1 px-3 text-slate-400 hover:text-white transition"
        >
          <Target className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Impian</span>
        </button>

        <button
          onClick={() => alert("Tab Riwayat Lengkap ada di Tiket 06.")}
          className="flex flex-col items-center py-1 px-3 text-slate-400 hover:text-white transition"
        >
          <ReceiptText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Riwayat</span>
        </button>

        <button
          onClick={() => alert("Tab Laporan Keuangan akan segera hadir.")}
          className="flex flex-col items-center py-1 px-3 text-slate-400 hover:text-white transition"
        >
          <PieChart className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Laporan</span>
        </button>
      </div>
    </div>
  );
}
