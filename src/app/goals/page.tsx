import { getGoalsData } from "@/actions/goals";
import { GoalCard } from "@/components/GoalCard";
import { CreateGoalModal } from "@/components/CreateGoalModal";
import { BottomNav } from "@/components/BottomNav";
import { formatRupiah } from "@/services/financial";
import { Target, Sparkles, Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const data = await getGoalsData();
  const goals = data.goals || [];

  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalSaved = goals.reduce((acc, g) => acc + g.savedAmount, 0);
  const overallPercentage = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider flex items-center space-x-1">
            <Target className="w-3.5 h-3.5" />
            <span>Wishlist Impian</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Barang Impian Kamu
          </h1>
        </div>
      </div>

      {/* Aggregate Overview Card */}
      <div className="bg-gradient-to-br from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 text-white space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-indigo-200 font-medium">Total Dana Impian Terkumpul</span>
          <span className="bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full text-[10px]">
            {overallPercentage}% Terkumpul
          </span>
        </div>
        <div className="text-2xl font-black tracking-tight text-white">
          {formatRupiah(totalSaved)}
          <span className="text-xs text-slate-400 font-normal ml-1.5">
            dari target {formatRupiah(totalTarget)}
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Modal Tambah Goal */}
      <CreateGoalModal />

      {/* Goals 2-Column Grid */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Daftar Impian Aktif ({goals.length})
          </span>
        </div>

        {goals.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400 space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-xs">Belum ada barang impian yang didaftarkan.</p>
            <p className="text-[11px] text-slate-500">
              Mulai tambahkan target barang yang ingin kamu beli!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} freeCash={data.freeCash || 0} />
            ))}
          </div>
        )}
      </div>

      {/* Persistent Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
