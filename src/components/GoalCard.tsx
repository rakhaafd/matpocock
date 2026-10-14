import { formatRupiah } from "@/services/financial";
import { Sparkles, CheckCircle2, Calendar } from "lucide-react";
import { GoalStatus } from "@prisma/client";

export interface GoalCardProps {
  goal: {
    id: string;
    title: string;
    targetAmount: number;
    savedAmount: number;
    remainingAmount: number;
    percentage: number;
    isAchieved: boolean;
    status: GoalStatus;
    targetDate: string | null;
  };
}

export function GoalCard({ goal }: GoalCardProps) {
  const isCompleted = goal.status === GoalStatus.ACHIEVED || goal.percentage >= 100;

  return (
    <div
      className={`p-4 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between h-44 ${
        isCompleted
          ? "bg-emerald-950/30 border-emerald-500/40"
          : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
      }`}
    >
      {/* Top Header */}
      <div className="flex justify-between items-start">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
            isCompleted
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-indigo-500/20 text-indigo-400"
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </div>

        <span
          className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
            isCompleted
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
          }`}
        >
          {goal.percentage}%
        </span>
      </div>

      {/* Title & Target */}
      <div className="my-2">
        <h4 className="text-sm font-bold text-white truncate leading-tight">
          {goal.title}
        </h4>
        <div className="text-[11px] text-slate-400 mt-1">
          Target: <span className="text-slate-200 font-semibold">{formatRupiah(goal.targetAmount)}</span>
        </div>
      </div>

      {/* Progress Bar & Saved Amount */}
      <div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-1.5">
          <div
            className={`h-full transition-all duration-500 ${
              isCompleted
                ? "bg-emerald-400"
                : "bg-gradient-to-r from-blue-500 to-indigo-500"
            }`}
            style={{ width: `${goal.percentage}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
          <span className="text-white font-bold">{formatRupiah(goal.savedAmount)}</span>
          {goal.targetDate && (
            <span className="flex items-center space-x-1 text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>{new Date(goal.targetDate).toLocaleDateString("id-ID", { month: "short", year: "2-digit" })}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
