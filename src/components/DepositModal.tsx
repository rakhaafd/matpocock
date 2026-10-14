"use client";

import { useState } from "react";
import { depositToGoalAction } from "@/actions/allocation";
import { formatRupiah } from "@/services/financial";
import { PlusCircle, X, Wallet, AlertCircle } from "lucide-react";

interface DepositModalProps {
  goalId: string;
  goalTitle: string;
  freeCash: number;
}

export function DepositModal({ goalId, goalTitle, freeCash }: DepositModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;
  const isOverAllocated = numAmount > freeCash;

  const quickPresets = [25000, 50000, 100000, 250000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (numAmount <= 0) {
      setError("Nominal harus berupa angka lebih dari Rp 0.");
      return;
    }

    if (isOverAllocated) {
      setError(`Saldo bebas belanja Anda tidak mencukupi (Tersedia: ${formatRupiah(freeCash)}).`);
      return;
    }

    setIsSubmitting(true);
    const res = await depositToGoalAction({
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
      setError(res.error || "Gagal menyisihkan tabungan.");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mt-2 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white font-semibold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 border border-indigo-500/30"
      >
        <PlusCircle className="w-3.5 h-3.5" />
        <span>+ Tabung</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 text-white space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                  Menabung untuk Impian
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

            {/* Free Cash Info Banner */}
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-400">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Saldo Bebas Belanja:</span>
              </div>
              <span className="font-extrabold text-emerald-400">{formatRupiah(freeCash)}</span>
            </div>

            {/* Quick Preset Buttons */}
            <div>
              <div className="text-[11px] text-slate-400 font-medium mb-1.5">Pilih Cepat:</div>
              <div className="grid grid-cols-4 gap-2">
                {quickPresets.map((preset) => {
                  const disabled = preset > freeCash;
                  return (
                    <button
                      key={preset}
                      type="button"
                      disabled={disabled}
                      onClick={() => setAmount(preset.toString())}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        disabled
                          ? "bg-slate-950 text-slate-600 border-slate-850 opacity-40 cursor-not-allowed"
                          : numAmount === preset
                          ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                          : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                      }`}
                    >
                      +{preset / 1000}rb
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error / Over-allocation Warning */}
            {isOverAllocated && (
              <div className="text-xs bg-rose-500/20 text-rose-300 p-3 rounded-xl border border-rose-500/30 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Nominal ini melebihi Saldo Bebas Anda ({formatRupiah(freeCash)}). Tidak bisa menabung melebihi uang kas bebas.
                </span>
              </div>
            )}

            {error && !isOverAllocated && (
              <div className="text-xs bg-rose-500/20 text-rose-300 p-2.5 rounded-xl border border-rose-500/30">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input Nominal */}
              <div>
                <label className="text-xs text-slate-400 font-medium">Nominal Tabungan (Rp)</label>
                <input
                  type="text"
                  placeholder="Contoh: 100.000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-lg font-bold text-white focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>

              {/* Catatan */}
              <div>
                <label className="text-xs text-slate-400 font-medium">Catatan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Sisa uang makan minggu ini"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || isOverAllocated || numAmount <= 0}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Tabungan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
