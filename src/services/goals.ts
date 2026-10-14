export interface GoalProgressResult {
  percentage: number;
  remaining: number;
  isAchieved: boolean;
}

/**
 * Menghitung persentase progres dan sisa nominal menuju target barang impian
 */
export function calculateGoalProgress(
  targetAmountInput: number | string | { toNumber?: () => number },
  savedAmountInput: number | string | { toNumber?: () => number }
): GoalProgressResult {
  let target: number;
  if (typeof targetAmountInput === "number") {
    target = targetAmountInput;
  } else if (typeof targetAmountInput === "object" && targetAmountInput && typeof targetAmountInput.toNumber === "function") {
    target = targetAmountInput.toNumber();
  } else {
    target = parseFloat(String(targetAmountInput)) || 0;
  }

  let saved: number;
  if (typeof savedAmountInput === "number") {
    saved = savedAmountInput;
  } else if (typeof savedAmountInput === "object" && savedAmountInput && typeof savedAmountInput.toNumber === "function") {
    saved = savedAmountInput.toNumber();
  } else {
    saved = parseFloat(String(savedAmountInput)) || 0;
  }

  if (target <= 0) {
    return {
      percentage: 0,
      remaining: 0,
      isAchieved: false,
    };
  }

  const rawPercentage = (saved / target) * 100;
  const percentage = Math.min(100, Math.max(0, Math.round(rawPercentage)));
  const remaining = Math.max(0, target - saved);
  const isAchieved = saved >= target;

  return {
    percentage,
    remaining,
    isAchieved,
  };
}
