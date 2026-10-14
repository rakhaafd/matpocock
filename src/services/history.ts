import { TransactionType } from "@prisma/client";

export interface HistoryTransactionItem {
  id: string;
  type: TransactionType;
  amount: number | string | { toNumber?: () => number };
  categoryId?: string | null;
  categoryName?: string | null;
  categoryIcon?: string | null;
  note?: string | null;
  date: Date;
}

export interface HistoryFilterOptions {
  type?: TransactionType | "ALL";
  categoryId?: string;
  search?: string;
}

export interface HistorySummary {
  totalIncome: number;
  totalExpense: number;
  netFlow: number;
  transactionCount: number;
}

function parseAmount(amount: number | string | { toNumber?: () => number }): number {
  if (typeof amount === "number") {
    return amount;
  }
  if (typeof amount === "object" && amount && typeof amount.toNumber === "function") {
    return amount.toNumber();
  }
  return parseFloat(String(amount)) || 0;
}

/**
 * Filter list transaksi berdasarkan jenis (INCOME/EXPENSE/ALL), categoryId, dan kata kunci pencarian.
 */
export function filterTransactions(
  transactions: HistoryTransactionItem[],
  filters: HistoryFilterOptions = {}
): HistoryTransactionItem[] {
  const { type, categoryId, search } = filters;
  const query = search ? search.trim().toLowerCase() : "";

  return transactions.filter((t) => {
    // Filter jenis transaksi
    if (type && type !== "ALL" && t.type !== type) {
      return false;
    }

    // Filter kategori
    if (categoryId && categoryId !== "ALL" && t.categoryId !== categoryId) {
      return false;
    }

    // Filter pencarian teks
    if (query) {
      const matchNote = t.note?.toLowerCase().includes(query) ?? false;
      const matchCategory = t.categoryName?.toLowerCase().includes(query) ?? false;
      if (!matchNote && !matchCategory) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Menghitung ringkasan statistik (total pemasukan, pengeluaran, net flow, jumlah) untuk transaksi terpilih.
 */
export function calculateHistorySummary(
  transactions: HistoryTransactionItem[]
): HistorySummary {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of transactions) {
    const amt = parseAmount(t.amount);
    if (t.type === TransactionType.INCOME) {
      totalIncome += amt;
    } else if (t.type === TransactionType.EXPENSE) {
      totalExpense += amt;
    }
  }

  return {
    totalIncome,
    totalExpense,
    netFlow: totalIncome - totalExpense,
    transactionCount: transactions.length,
  };
}
