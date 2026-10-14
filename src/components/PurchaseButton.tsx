"use client";

import { useState } from "react";
import { purchaseGoalAction } from "@/actions/purchase";
import { formatRupiah } from "@/services/financial";
import { ShoppingCart, Check, Loader2 } from "lucide-react";

interface PurchaseButtonProps {
  goalId: string;
  goalTitle: string;
  savedAmount: number;
}

export function PurchaseButton({ goalId, goalTitle, savedAmount }: PurchaseButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePurchase = async () => {
    const confirmed = confirm(
      `🎉 Selamat! Apakah Anda ingin membeli "${goalTitle}" sekarang?\n\nSistem akan mencatat pengeluaran resmi sebesar ${formatRupiah(savedAmount)} dan memindahkan barang impian ini ke daftar tercapai.`
    );
    if (!confirmed) return;

    setIsSubmitting(true);
    const res = await purchaseGoalAction({ goalId });
    setIsSubmitting(false);

    if (!res.success) {
      alert(res.error || "Gagal memproses pembelian impian.");
    }
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={isSubmitting}
      className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition active:scale-95 disabled:opacity-50"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Memproses...</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Beli Sekarang! 🎉</span>
        </>
      )}
    </button>
  );
}
