import { formatRupiah, BalanceSummary } from "@/services/financial";
import { CreditCard, ShieldCheck } from "lucide-react";

interface HeroCardProps {
  balance: BalanceSummary;
}

export function HeroCard({ balance }: HeroCardProps) {
  return (
    <div className="w-full rounded-3xl bg-gradient-to-tr from-purple-800 via-indigo-800 to-emerald-700 p-6 text-white shadow-2xl relative overflow-hidden border border-white/10">
      {/* Decorative Blur Bubble */}
      <div className="absolute -right-12 -bottom-12 w-44 h-44 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header Card */}
      <div className="flex justify-between items-center text-xs text-white/80 tracking-wider">
        <div className="flex items-center space-x-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span className="uppercase tracking-widest text-[11px]">Personal Cashflow</span>
        </div>
        <CreditCard className="w-5 h-5 text-white/70" />
      </div>

      {/* Main Saldo Bebas Belanja */}
      <div className="my-5">
        <div className="text-xs text-emerald-200/90 font-medium tracking-wide">
          Sisa Saldo Bebas Belanja
        </div>
        <div className="text-3xl font-black tracking-tight text-white mt-1">
          {formatRupiah(balance.freeCash)}
        </div>
        <div className="text-[11px] text-slate-300 mt-1">
          Aman digunakan tanpa mengganggu target impian
        </div>
      </div>

      {/* Footer Sub-Balances */}
      <div className="flex justify-between items-end border-t border-white/20 pt-3 text-xs">
        <div>
          <span className="text-white/70 text-[11px]">Total Kas:</span>{" "}
          <span className="font-bold text-white">{formatRupiah(balance.totalCash)}</span>
        </div>
        <div>
          <span className="text-white/70 text-[11px]">Dana Impian:</span>{" "}
          <span className="font-bold text-indigo-200">{formatRupiah(balance.reservedSavings)}</span>
        </div>
      </div>
    </div>
  );
}
