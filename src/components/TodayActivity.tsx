import { formatRupiah } from "@/services/financial";
import { TransactionType } from "@prisma/client";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react";

interface TodayTransactionItem {
  id: string;
  type: TransactionType;
  amount: number;
  categoryName: string;
  categoryIcon?: string | null;
  categoryColor?: string | null;
  note?: string | null;
  date: string;
}

interface TodayActivityProps {
  transactions: TodayTransactionItem[];
}

export function TodayActivity({ transactions }: TodayActivityProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Aktivitas Hari Ini
        </span>
        <Link
          href="/history"
          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition"
        >
          Lihat Riwayat
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center text-slate-400 space-y-2">
          <Receipt className="w-8 h-8 mx-auto text-slate-600" />
          <p className="text-xs">Belum ada transaksi yang dicatat hari ini.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((t) => {
            const isIncome = t.type === TransactionType.INCOME;
            const timeStr = new Date(t.date).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={t.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${
                      isIncome
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white leading-tight">
                      {t.note || t.categoryName}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {t.categoryName} • {timeStr}
                    </div>
                  </div>
                </div>

                <div
                  className={`font-black text-sm tracking-tight ${
                    isIncome ? "text-emerald-400" : "text-slate-100"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatRupiah(t.amount)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
