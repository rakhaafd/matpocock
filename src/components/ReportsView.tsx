"use client";

import { useState } from "react";
import { TransactionType } from "@prisma/client";
import {
  calculateReports,
  filterTransactionsByPeriod,
  ReportPeriod,
  ReportTransactionItem,
} from "@/services/reports";
import { formatRupiah } from "@/services/financial";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  PieChart,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Calendar,
  Sparkles,
  Target,
} from "lucide-react";

interface ReportsViewProps {
  initialTransactions: Array<{
    id: string;
    type: TransactionType;
    amount: number;
    categoryId?: string | null;
    categoryName?: string | null;
    categoryColor?: string | null;
    categoryIcon?: string | null;
    note?: string | null;
    date: string;
  }>;
  totalGoalSaved: number;
  goalsCount: number;
  achievedGoalsCount: number;
}

export function ReportsView({
  initialTransactions,
  totalGoalSaved,
  goalsCount,
  achievedGoalsCount,
}: ReportsViewProps) {
  const [period, setPeriod] = useState<ReportPeriod>("THIS_MONTH");

  // Format transaksi
  const items: ReportTransactionItem[] = initialTransactions.map((t) => ({
    ...t,
    date: new Date(t.date),
  }));

  // Filter berdasarkan periode yang dipilih
  const filtered = filterTransactionsByPeriod(items, period);

  // Kalkulasi ringkasan laporan & breakdown
  const summary = calculateReports(filtered);

  return (
    <div className="space-y-5">
      {/* 1. Period Selector Pills */}
      <div className="flex bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shadow-inner">
        <button
          type="button"
          onClick={() => setPeriod("THIS_MONTH")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${
            period === "THIS_MONTH"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Bulan Ini</span>
        </button>

        <button
          type="button"
          onClick={() => setPeriod("LAST_30_DAYS")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${
            period === "LAST_30_DAYS"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>30 Hari Terakhir</span>
        </button>

        <button
          type="button"
          onClick={() => setPeriod("ALL_TIME")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${
            period === "ALL_TIME"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Semua Waktu</span>
        </button>
      </div>

      {/* 2. Executive Financial Health Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 rounded-3xl p-5 text-white shadow-xl space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Kesehatan Finansial
            </span>
            <div className="flex items-center space-x-2 mt-1">
              {summary.healthStatus === "HEALTHY" && (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Keuangan Sehat</span>
                </span>
              )}
              {summary.healthStatus === "MODERATE" && (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Cukup Stabil</span>
                </span>
              )}
              {summary.healthStatus === "DEFICIT" && (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Defisit Anggaran</span>
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium">Rasio Tabungan</span>
            <div className="text-2xl font-black text-emerald-400 tracking-tight">
              {summary.savingsRate}%
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60 leading-relaxed">
          {summary.healthMessage}
        </p>

        {/* Progress Bar Rasio Tabungan */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Tersimpan dari Pemasukan</span>
            <span>Target Rekomendasi: 20%+</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                summary.savingsRate >= 20
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                  : summary.savingsRate > 0
                  ? "bg-gradient-to-r from-amber-500 to-amber-400"
                  : "bg-rose-500"
              }`}
              style={{ width: `${Math.min(100, summary.savingsRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Ringkasan Pemasukan vs Pengeluaran */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-lg shadow-emerald-950/20 space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>Pemasukan</span>
          </div>
          <div className="text-lg font-black text-white tracking-tight">
            +{formatRupiah(summary.totalIncome)}
          </div>
          <div className="text-[10px] text-slate-400">
            {summary.incomeBreakdown.reduce((sum, i) => sum + i.count, 0)} transaksi masuk
          </div>
        </div>

        <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-4 shadow-lg shadow-rose-950/20 space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-rose-400 font-semibold">
            <TrendingDown className="w-4 h-4" />
            <span>Pengeluaran</span>
          </div>
          <div className="text-lg font-black text-white tracking-tight">
            -{formatRupiah(summary.totalExpense)}
          </div>
          <div className="text-[10px] text-slate-400">
            {summary.expenseBreakdown.reduce((sum, i) => sum + i.count, 0)} transaksi keluar
          </div>
        </div>
      </div>

      {/* Arus Kas Bersih */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Sisa Arus Kas Bersih</div>
            <div className="text-base font-black text-white">
              {summary.netSavings >= 0 ? "+" : ""}
              {formatRupiah(summary.netSavings)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500">Status Saldo</span>
          <div
            className={`text-xs font-bold ${
              summary.netSavings >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {summary.netSavings >= 0 ? "Surplus Kas" : "Defisit Kas"}
          </div>
        </div>
      </div>

      {/* 4. Alokasi Tabungan Barang Impian Widget */}
      <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-indigo-300 font-medium">Dana Impian Tersimpan</div>
            <div className="text-base font-black text-white">
              {formatRupiah(totalGoalSaved)}
            </div>
          </div>
        </div>
        <div className="text-right text-xs">
          <div className="text-slate-300 font-semibold">{goalsCount} Wishlist</div>
          <div className="text-[10px] text-emerald-400">{achievedGoalsCount} Terbeli 🎯</div>
        </div>
      </div>

      {/* 5. Distribusi Pengeluaran per Kategori */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Distribusi Pengeluaran
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            {summary.expenseBreakdown.length} Kategori
          </span>
        </div>

        {summary.expenseBreakdown.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs">
            Belum ada pengeluaran pada periode ini.
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 space-y-4">
            {summary.expenseBreakdown.map((item) => (
              <div key={item.categoryId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.categoryColor || "#f97316" }}
                    />
                    <span className="font-semibold text-white">{item.categoryName}</span>
                    <span className="text-[10px] text-slate-500">({item.count}x)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-slate-200">
                      {formatRupiah(item.totalAmount)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 w-8 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.categoryColor || "#f97316",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Distribusi Pemasukan per Kategori */}
      {summary.incomeBreakdown.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Sumber Pemasukan
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">
              {summary.incomeBreakdown.length} Sumber
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 space-y-4">
            {summary.incomeBreakdown.map((item) => (
              <div key={item.categoryId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.categoryColor || "#10b981" }}
                    />
                    <span className="font-semibold text-white">{item.categoryName}</span>
                    <span className="text-[10px] text-slate-500">({item.count}x)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-emerald-400">
                      +{formatRupiah(item.totalAmount)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 w-8 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.categoryColor || "#10b981",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
