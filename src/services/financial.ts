import { TransactionType } from "@prisma/client";

export interface TransactionItem {
  type: TransactionType;
  amount: number | string | { toNumber?: () => number };
}

export interface BalanceSummary {
  totalIncome: number;
  totalExpense: number;
  totalCash: number;
  reservedSavings: number;
  freeCash: number;
}

/**
 * Memformat angka nominal ke format Rupiah standar (contoh: Rp 2.500.000)
 */
export function formatRupiah(amount: number | string | { toNumber?: () => number }): string {
  let val: number;
  if (typeof amount === "number") {
    val = amount;
  } else if (typeof amount === "object" && amount && typeof amount.toNumber === "function") {
    val = amount.toNumber();
  } else {
    val = parseFloat(String(amount)) || 0;
  }

  const isNegative = val < 0;
  const absVal = Math.abs(val);
  const formatted = Math.round(absVal).toLocaleString("id-ID");

  return isNegative ? `-Rp ${formatted}` : `Rp ${formatted}`;
}

/**
 * Menghitung ringkasan saldo berdasarkan seluruh transaksi kas dan tabungan yang disisihkan di goal aktif.
 *
 * Rumus:
 * - Total Cash = Total Income - Total Expense
 * - Free Cash = Total Cash - Reserved Savings
 */
export function calculateBalance(
  transactions: TransactionItem[],
  reservedSavingsInput: number | string | { toNumber?: () => number } = 0
): BalanceSummary {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of transactions) {
    let amt: number;
    if (typeof t.amount === "number") {
      amt = t.amount;
    } else if (typeof t.amount === "object" && t.amount && typeof t.amount.toNumber === "function") {
      amt = t.amount.toNumber();
    } else {
      amt = parseFloat(String(t.amount)) || 0;
    }

    if (t.type === TransactionType.INCOME) {
      totalIncome += amt;
    } else if (t.type === TransactionType.EXPENSE) {
      totalExpense += amt;
    }
  }

  let reservedSavings: number;
  if (typeof reservedSavingsInput === "number") {
    reservedSavings = reservedSavingsInput;
  } else if (
    typeof reservedSavingsInput === "object" &&
    reservedSavingsInput &&
    typeof reservedSavingsInput.toNumber === "function"
  ) {
    reservedSavings = reservedSavingsInput.toNumber();
  } else {
    reservedSavings = parseFloat(String(reservedSavingsInput)) || 0;
  }

  const totalCash = totalIncome - totalExpense;
  const freeCash = totalCash - reservedSavings;

  return {
    totalIncome,
    totalExpense,
    totalCash,
    reservedSavings,
    freeCash,
  };
}
