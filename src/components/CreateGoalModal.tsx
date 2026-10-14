"use client";

import { useState } from "react";
import { createGoalAction } from "@/actions/goals";
import { Plus, X, Sparkles } from "lucide-react";

export function CreateGoalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = parseInt(targetAmount.replace(/[^0-9]/g, ""), 10);
    if (!title.trim()) {
      setError("Judul barang impian wajib diisi.");
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Target harga harus berupa nominal lebih dari 0.");
      return;
    }

    setIsSubmitting(true);
    const res = await createGoalAction({
      title,
      targetAmount: numAmount,
      targetDate: targetDate || undefined,
    });
    setIsSubmitting(false);

    if (res.success) {
      setTitle("");
      setTargetAmount("");
      setTargetDate("");
      setIsOpen(false);
    } else {
      setError(res.error || "Gagal membuat barang impian.");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 transition active:scale-98"
      >
        <Plus className="w-5 h-5" />
        <span>Tambah Barang Impian</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 text-white space-y-5">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold">Barang Impian Baru</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="text-xs bg-rose-500/20 text-rose-300 p-2.5 rounded-xl border border-rose-500/30">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs text-slate-400 font-medium">Nama Barang Impian</label>
                <input
                  type="text"
                  placeholder="Contoh: Sony WH-1000XM5 / Liburan Bali"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>

              {/* Target Amount */}
              <div>
                <label className="text-xs text-slate-400 font-medium">Target Harga (Rp)</label>
                <input
                  type="text"
                  placeholder="Contoh: 4.500.000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-lg font-bold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Target Date */}
              <div>
                <label className="text-xs text-slate-400 font-medium">Target Tercapai (Opsional)</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Barang Impian"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
