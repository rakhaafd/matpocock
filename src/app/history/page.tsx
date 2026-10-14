import { getHistoryData } from "@/actions/history";
import { HistoryView } from "@/components/HistoryView";
import { BottomNav } from "@/components/BottomNav";
import { ReceiptText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const data = await getHistoryData();

  return (
    <div className="p-5 pb-24 space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider flex items-center space-x-1">
            <ReceiptText className="w-3.5 h-3.5" />
            <span>Buku Kas</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Riwayat Transaksi
          </h1>
        </div>
      </div>

      {/* Main Interactive History Component */}
      <HistoryView
        initialTransactions={data.transactions}
        categories={data.categories}
      />

      {/* Persistent Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
