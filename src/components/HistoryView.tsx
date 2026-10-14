"use client";

import { useState, useTransition } from "react";
import { TransactionType } from "@prisma/client";
import { filterTransactions, calculateHistorySummary, HistoryTransactionItem } from "@/services/history";
import { formatRupiah } from "@/services/financial";
import { deleteTransactionAction } from "@/actions/history";
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  Filter,
  X,
  AlertTriangle,
  Receipt,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface CategoryOption {
  id: string;
  name: string;
  type: TransactionType;
}

interface HistoryViewProps {
  initialTransactions: Array<{
    id: string;
    type: TransactionType;
    amount: number;
    categoryId?: string | null;
    categoryName?: string | null;
    categoryIcon?: string | null;
    categoryColor?: string | null;
    note?: string | null;
    date: string;
  }>;
  categories: CategoryOption[];
}

export function HistoryView({ initialTransactions, categories }: HistoryViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [typeFilter, setTypeFilter] = useState<TransactionType | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal konfirmasi hapus
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    note: string;
    amount: number;
    type: TransactionType;
  } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Parse items untuk service
  const items: HistoryTransactionItem[] = initialTransactions.map((t) => ({
    ...t,
    date: new Date(t.date),
  }));

  // Filter menggunakan service seam
  const filtered = filterTransactions(items, {
    type: typeFilter,
    categoryId: categoryFilter === "ALL" ? undefined : categoryFilter,
    search: searchQuery,
  });

  // Kalkulasi statistik menggunakan service seam
  const summary = calculateHistorySummary(filtered);

  // Format tanggal grup (Indonesian format)
  const formatDateGroup = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const compareDate = new Date(d);
    compareDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((today.getTime() - compareDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 0) return "Hari Ini";
    if (diffDays === 1) return "Kemarin";

    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Group transaksi berdasarkan tanggal
  const groupedTransactions: Record<string, HistoryTransactionItem[]> = {};
  for (const item of filtered) {
    const groupKey = formatDateGroup(item.date);
    if (!groupedTransactions[groupKey]) {
      groupedTransactions[groupKey] = [];
    }
    groupedTransactions[groupKey].push(item);
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    setDeleteError(null);
    startTransition(async () => {
      const res = await deleteTransactionAction(deleteTarget.id);
      if (res.success) {
        setDeleteTarget(null);
        router.refresh();
      } else {
        setDeleteError(res.error || "Gagal menghapus transaksi.");
      }
    });
  };

  return (
    <div className="space-y-5">
      {/* 1. Ringkasan Statistik */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-lg shadow-emerald-950/20">
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
            <ArrowDownLeft className="w-4 h-4" />
            <span>Pemasukan Terfilter</span>
          </div>
          <div className="mt-1.5 text-lg font-black text-white tracking-tight">
            +{formatRupiah(summary.totalIncome)}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-4 shadow-lg shadow-rose-950/20">
          <div className="flex items-center space-x-1.5 text-xs text-rose-400 font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>Pengeluaran Terfilter</span>
          </div>
          <div className="mt-1.5 text-lg font-black text-white tracking-tight">
            -{formatRupiah(summary.totalExpense)}
          </div>
        </div>
      </div>

      {/* Bar Net Flow & Jumlah */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs">
        <span className="text-slate-400">
          Ditemukan <strong className="text-white">{summary.transactionCount}</strong> transaksi
        </span>
        <span className="font-semibold text-slate-300">
          Arus Bersih:{" "}
          <span className={summary.netFlow >= 0 ? "text-emerald-400" : "text-rose-400"}>
            {summary.netFlow >= 0 ? "+" : ""}
            {formatRupiah(summary.netFlow)}
          </span>
        </span>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3.5 space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari catatan atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Type Filter Pills & Category Dropdown */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setTypeFilter("ALL")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                typeFilter === "ALL"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter(TransactionType.EXPENSE)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                typeFilter === TransactionType.EXPENSE
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Keluar
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter(TransactionType.INCOME)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                typeFilter === TransactionType.INCOME
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Masuk
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex-1 min-w-[140px]">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type === TransactionType.EXPENSE ? "Keluar" : "Masuk"})
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Daftar Transaksi */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400 space-y-3">
          <Receipt className="w-10 h-10 mx-auto text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">Tidak ada transaksi ditemukan</p>
          <p className="text-xs text-slate-500">
            Coba ubah kata kunci pencarian atau reset filter kategori di atas.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedTransactions).map(([dateLabel, transList]) => (
            <div key={dateLabel} className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{dateLabel}</span>
              </div>

              <div className="space-y-2">
                {transList.map((t) => {
                  const isIncome = t.type === TransactionType.INCOME;
                  const timeStr = t.date.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={t.id}
                      className="group flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm ${
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

                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate leading-tight">
                            {t.note || t.categoryName}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {t.categoryName} • {timeStr}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0 ml-3">
                        <div
                          className={`font-black text-sm tracking-tight text-right ${
                            isIncome ? "text-emerald-400" : "text-slate-100"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatRupiah(t.amount)}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              id: t.id,
                              note: t.note || t.categoryName || "Transaksi",
                              amount: Number(t.amount),
                              type: t.type,
                            })
                          }
                          title="Hapus transaksi"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Modal Konfirmasi Hapus Transaksi */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Hapus Transaksi?</h3>
              <p className="text-xs text-slate-400">
                Apakah Anda yakin ingin menghapus catatan &quot;
                <strong className="text-slate-200">{deleteTarget.note}</strong>&quot; sebesar{" "}
                <strong className="text-white">{formatRupiah(deleteTarget.amount)}</strong>?
              </p>
              <p className="text-[11px] text-emerald-400 pt-1">
                Saldo kas Anda akan disesuaikan kembali secara otomatis.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
                {deleteError}
              </div>
            )}

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-800 transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition shadow-lg shadow-rose-900/40 disabled:opacity-50"
              >
                {isPending ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
