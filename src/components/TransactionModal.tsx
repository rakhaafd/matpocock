"use client";

import { useState } from "react";
import { createTransactionAction } from "@/actions/transactions";
import { TransactionType } from "@prisma/client";
import { Plus, X, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

interface TransactionModalProps {
  categories: Category[];
}

export function TransactionModal({ categories }: TransactionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Nominal harus berupa angka lebih dari 0.");
      return;
    }

    if (!categoryId) {
      setError("Silakan pilih kategori.");
      return;
    }

    setIsSubmitting(true);
    const res = await createTransactionAction({
      type,
      amount: numAmount,
      categoryId,
      note,
    });
    setIsSubmitting(false);

    if (res.success) {
      setAmount("");
      setNote("");
      setCategoryId("");
      setIsOpen(false);
    } else {
      setError(res.error || "Gagal mencatat transaksi.");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition active:scale-98"
      >
        <Plus className="w-5 h-5" />
        <span>Catat Transaksi Baru</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 text-white space-y-5">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Catat Transaksi</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setType(TransactionType.EXPENSE);
                  setCategoryId("");
                }}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition ${
                  type === TransactionType.EXPENSE
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Pengeluaran</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setType(TransactionType.INCOME);
                  setCategoryId("");
                }}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition ${
                  type === TransactionType.INCOME
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Pemasukan</span>
              </button>
            </div>

            {error && (
              <div className="text-xs bg-rose-500/20 text-rose-300 p-2.5 rounded-xl border border-rose-500/30">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount Input */}
              <div>
                <label className="text-xs text-slate-400 font-medium">Nominal (Rp)</label>
                <input
                  type="text"
                  placeholder="Contoh: 50.000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-lg font-bold text-white focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>

              {/* Category Select */}
              <div>
                <label className="text-xs text-slate-400 font-medium">Kategori</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Pilih Kategori...</option>
                  {filteredCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Note Input */}
              <div>
                <label className="text-xs text-slate-400 font-medium">Catatan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Nasi padang + es teh"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-xl transition"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
