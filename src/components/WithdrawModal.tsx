"use client";

import { useState } from "react";
import { withdrawFromGoalAction } from "@/actions/purchase";
import { formatRupiah } from "@/services/financial";
import { ArrowDownRight, X, AlertCircle } from "lucide-react";

interface WithdrawModalProps {
  goalId: string;
  goalTitle: string;
  savedAmount: number;
}

export function WithdrawModal({ goalId, goalTitle, savedAmount }: WithdrawModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;
  const isOverWithdraw = numAmount > savedAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (numAmount <= 0) {
      setError("Nominal penarikan harus lebih dari Rp 0.");
      return;
    }

    if (isOverWithdraw) {
      setError(`Nominal penarikan tidak boleh melebihi ${formatRupiah(savedAmount)}.`);
      return;
    }

    setIsSubmitting(true);
    const res = await withdrawFromGoalAction({
      goalId,
      amount: numAmount,
      note,
    });
    setIsSubmitting(false);

    if (res.success) {
      setAmount("");
      setNote("");
      setIsOpen(false);
    } else {
      setError(res.error || "Gagal memproses penarikan dana.");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mt-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-medium py-1.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 border border-slate-700/80"
      >
        <ArrowDownRight className="w-3.5 h-3.5 text-amber-400" />
        <span>Tarik Dana</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 text-white space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Tarik Dana Darurat
                </div>
                <h3 className="text-base font-bold text-white truncate max-w-[280px]">
                  {goalTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Dana Terkumpul */}
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Dana di Goal Ini:</span>
              <span className="font-extrabold text-indigo-300">{formatRupiah(savedAmount)}</span>
            </div>

            {/* Over-withdraw Error */}
            {isOverWithdraw && (
              <div className="text-xs bg-rose-500/20 text-rose-300 p-3 rounded-xl border border-rose-500/30 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Nominal penarikan melebihi saldo yang ada di impian ini ({formatRupiah(savedAmount)}).
                </span>
              </div>
            )}

            {error && !isOverWithdraw && (
              <div className="text-xs bg-rose-500/20 text-rose-300 p-2.5 rounded-xl border border-rose-500/30">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-medium">Nominal Penarikan (Rp)</label>
                <input
                  type="text"
                  placeholder="Contoh: 100.000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-lg font-bold text-white focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium">Alasan / Catatan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Butuh uang darurat perbaikan motor"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isOverWithdraw || numAmount <= 0}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
              >
                {isSubmitting ? "Memproses..." : "Kembalikan ke Saldo Bebas"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
