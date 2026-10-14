import { getReportsData } from "@/actions/reports";
import { ReportsView } from "@/components/ReportsView";
import { BottomNav } from "@/components/BottomNav";
import { PieChart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const data = await getReportsData();

  return (
    <div className="p-5 pb-24 space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider flex items-center space-x-1">
            <PieChart className="w-3.5 h-3.5" />
            <span>Laporan & Analisis</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Laporan Keuangan
          </h1>
        </div>
      </div>

      {/* Main Interactive Reports Component */}
      <ReportsView
        initialTransactions={data.transactions}
        totalGoalSaved={data.totalGoalSaved}
        goalsCount={data.goalsCount}
        achievedGoalsCount={data.achievedGoalsCount}
      />

      {/* Persistent Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
