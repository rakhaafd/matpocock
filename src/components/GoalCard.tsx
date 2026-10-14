import { formatRupiah } from "@/services/financial";
import { Sparkles, CheckCircle2, Calendar, PartyPopper } from "lucide-react";
import { GoalStatus } from "@prisma/client";
import { DepositModal } from "./DepositModal";
import { WithdrawModal } from "./WithdrawModal";
import { PurchaseButton } from "./PurchaseButton";

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
  freeCash?: number;
}

export function GoalCard({ goal, freeCash = 0 }: GoalCardProps) {
  const isAchieved = goal.status === GoalStatus.ACHIEVED;
  const isReadyToBuy = !isAchieved && goal.percentage >= 100;

  return (
    <div
      className={`p-4 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
        isAchieved
          ? "bg-slate-900/40 border-emerald-500/30 opacity-90"
          : isReadyToBuy
          ? "bg-gradient-to-b from-indigo-950/60 to-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/10"
          : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
      }`}
    >
      {/* Top Header */}
      <div className="flex justify-between items-start">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
            isAchieved
              ? "bg-emerald-500/20 text-emerald-400"
              : isReadyToBuy
              ? "bg-emerald-500/20 text-emerald-300 animate-pulse"
              : "bg-indigo-500/20 text-indigo-400"
          }`}
        >
          {isAchieved ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : isReadyToBuy ? (
            <PartyPopper className="w-5 h-5 text-emerald-300" />
          ) : (
            <Sparkles className="w-4 h-4 text-indigo-300" />
          )}
        </div>

        <span
          className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
            isAchieved
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : isReadyToBuy
              ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400"
              : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
          }`}
        >
          {isAchieved ? "TERBELI" : `${goal.percentage}%`}
        </span>
      </div>

      {/* Title & Target */}
      <div className="my-2.5">
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
              isAchieved
                ? "bg-emerald-400"
                : isReadyToBuy
                ? "bg-gradient-to-r from-emerald-400 to-teal-300"
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

        {/* Action Buttons */}
        {isReadyToBuy ? (
          <PurchaseButton
            goalId={goal.id}
            goalTitle={goal.title}
            savedAmount={goal.savedAmount}
          />
        ) : !isAchieved ? (
          <>
            <DepositModal
              goalId={goal.id}
              goalTitle={goal.title}
              freeCash={freeCash}
            />
            {goal.savedAmount > 0 && (
              <WithdrawModal
                goalId={goal.id}
                goalTitle={goal.title}
                savedAmount={goal.savedAmount}
              />
            )}
          </>
        ) : (
          <div className="mt-2 text-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 py-1.5 rounded-xl border border-emerald-500/20">
            ✓ Sudah Terealisasi
          </div>
        )}
      </div>
    </div>
  );
}
