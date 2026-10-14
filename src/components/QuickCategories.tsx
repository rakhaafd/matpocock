"use client";

import { useState } from "react";
import { createTransactionAction } from "@/actions/transactions";
import { TransactionType } from "@prisma/client";
import { Utensils, Coffee, Fuel, ShoppingBag, Zap } from "lucide-react";

interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

interface QuickCategoriesProps {
  categories: Category[];
}

export function QuickCategories({ categories }: QuickCategoriesProps) {
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);

  const quickPresets = [
    { name: "Makanan & Minuman", label: "Makan", icon: Utensils, defaultAmount: 25000 },
    { name: "Kopi & Jajan", label: "Kopi", icon: Coffee, defaultAmount: 18000 },
    { name: "Transportasi & Bensin", label: "Bensin", icon: Fuel, defaultAmount: 20000 },
    { name: "Belanja Kebutuhan", label: "Belanja", icon: ShoppingBag, defaultAmount: 50000 },
  ];

  const handleQuickAdd = async (presetName: string, amount: number) => {
    const category = categories.find(
      (c) => c.name.toLowerCase().includes(presetName.toLowerCase().split(" ")[0])
    ) || categories[0];

    if (!category) {
      alert("Kategori belum tersedia.");
      return;
    }

    setLoadingCategory(presetName);
    const res = await createTransactionAction({
      type: TransactionType.EXPENSE,
      amount,
      categoryId: category.id,
      note: `Quick Log: ${presetName}`,
    });
    setLoadingCategory(null);

    if (!res.success) {
      alert(res.error || "Gagal mencatat transaksi cepat.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Catat Cepat (1-Tap)</span>
        </span>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
        {quickPresets.map((preset) => {
          const Icon = preset.icon;
          const isLoading = loadingCategory === preset.name;
          return (
            <button
              key={preset.name}
              disabled={isLoading}
              onClick={() => handleQuickAdd(preset.name, preset.defaultAmount)}
              className="flex-shrink-0 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs px-3.5 py-2.5 rounded-2xl flex items-center space-x-2 transition active:scale-95 disabled:opacity-50"
            >
              <Icon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold">{preset.label}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {preset.defaultAmount / 1000}rb
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
