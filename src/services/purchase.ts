import { TransactionType } from "@prisma/client";
import { calculateBalance, BalanceSummary, TransactionItem } from "./financial";

export interface WithdrawValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Memvalidasi apakah penarikan dana darurat dari Goal sah:
 * 1. Nominal penarikan harus > 0.
 * 2. Nominal penarikan tidak boleh melebihi jumlah uang yang saat ini terkumpul di Goal tersebut.
 */
export function validateGoalWithdraw(
  amount: number,
  currentSavedAmount: number
): WithdrawValidationResult {
  if (isNaN(amount) || amount <= 0) {
    return {
      valid: false,
      error: "Nominal penarikan harus lebih dari Rp 0.",
    };
  }

  if (amount > currentSavedAmount) {
    return {
      valid: false,
      error: `Nominal penarikan (Rp ${amount.toLocaleString("id-ID")}) tidak boleh melebihi total tabungan yang terkumpul di impian ini (Rp ${currentSavedAmount.toLocaleString("id-ID")}).`,
    };
  }

  return {
    valid: true,
  };
}

export interface SimulateGoalPurchaseInput {
  existingTransactions: TransactionItem[];
  reservedSavingsBefore: number;
  goalSavedAmount: number;
}

export interface SimulateGoalPurchaseResult {
  afterBalance: BalanceSummary;
  newExpenseTransaction: TransactionItem;
}

/**
 * Menyimulasikan kalkulasi matematis saat Realisasi Pembelian Goal terjadi.
 * Membuktikan bahwa Free Cash Balance TIDAK berkurang dua kali (No Double Deduction).
 */
export function simulateGoalPurchase({
  existingTransactions,
  reservedSavingsBefore,
  goalSavedAmount,
}: SimulateGoalPurchaseInput): SimulateGoalPurchaseResult {
  // 1. Transaksi EXPENSE baru sebesar dana goal yang dibeli
  const newExpenseTransaction: TransactionItem = {
    type: TransactionType.EXPENSE,
    amount: goalSavedAmount,
  };

  const updatedTransactions = [...existingTransactions, newExpenseTransaction];

  // 2. Goal yang dibeli berstatus ACHIEVED sehingga alokasinya lepas dari Reserved Savings
  const updatedReservedSavings = Math.max(0, reservedSavingsBefore - goalSavedAmount);

  // 3. Kalkulasi saldo akhir
  const afterBalance = calculateBalance(updatedTransactions, updatedReservedSavings);

  return {
    afterBalance,
    newExpenseTransaction,
  };
}
