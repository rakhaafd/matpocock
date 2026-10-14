import { TransactionType } from "@prisma/client";

export interface ReportTransactionItem {
  id: string;
  type: TransactionType;
  amount: number | string | { toNumber?: () => number };
  categoryId?: string | null;
  categoryName?: string | null;
  categoryColor?: string | null;
  categoryIcon?: string | null;
  note?: string | null;
  date: Date;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  categoryColor?: string | null;
  categoryIcon?: string | null;
  totalAmount: number;
  percentage: number; // 0 to 100
  count: number;
}

export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number; // 0 to 100
  healthStatus: "HEALTHY" | "MODERATE" | "DEFICIT";
  healthMessage: string;
  expenseBreakdown: CategoryBreakdownItem[];
  incomeBreakdown: CategoryBreakdownItem[];
}

export type ReportPeriod = "THIS_MONTH" | "LAST_30_DAYS" | "ALL_TIME";

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
 * Filter list transaksi berdasarkan periode tertentu.
 */
export function filterTransactionsByPeriod(
  transactions: ReportTransactionItem[],
  period: ReportPeriod,
  now: Date = new Date()
): ReportTransactionItem[] {
  if (period === "ALL_TIME") {
    return transactions;
  }

  if (period === "THIS_MONTH") {
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
  }

  if (period === "LAST_30_DAYS") {
    const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return transactions.filter((t) => new Date(t.date) >= past30Days);
  }

  return transactions;
}

/**
 * Menghitung ringkasan analisis keuangan, rasio tabungan, dan breakdown kategori.
 */
export function calculateReports(transactions: ReportTransactionItem[]): ReportSummary {
  let totalIncome = 0;
  let totalExpense = 0;

  const expenseCategoryMap: Record<
    string,
    {
      categoryId: string;
      categoryName: string;
      categoryColor?: string | null;
      categoryIcon?: string | null;
      totalAmount: number;
      count: number;
    }
  > = {};

  const incomeCategoryMap: Record<
    string,
    {
      categoryId: string;
      categoryName: string;
      categoryColor?: string | null;
      categoryIcon?: string | null;
      totalAmount: number;
      count: number;
    }
  > = {};

  for (const t of transactions) {
    const amt = parseAmount(t.amount);
    const catId = t.categoryId || "uncategorized";
    const catName = t.categoryName || "Tanpa Kategori";

    if (t.type === TransactionType.INCOME) {
      totalIncome += amt;
      if (!incomeCategoryMap[catId]) {
        incomeCategoryMap[catId] = {
          categoryId: catId,
          categoryName: catName,
          categoryColor: t.categoryColor || "#10b981",
          categoryIcon: t.categoryIcon || "briefcase",
          totalAmount: 0,
          count: 0,
        };
      }
      incomeCategoryMap[catId].totalAmount += amt;
      incomeCategoryMap[catId].count += 1;
    } else if (t.type === TransactionType.EXPENSE) {
      totalExpense += amt;
      if (!expenseCategoryMap[catId]) {
        expenseCategoryMap[catId] = {
          categoryId: catId,
          categoryName: catName,
          categoryColor: t.categoryColor || "#f97316",
          categoryIcon: t.categoryIcon || "tag",
          totalAmount: 0,
          count: 0,
        };
      }
      expenseCategoryMap[catId].totalAmount += amt;
      expenseCategoryMap[catId].count += 1;
    }
  }

  const netSavings = totalIncome - totalExpense;

  const savingsRate =
    totalIncome > 0
      ? Math.max(0, Math.round((netSavings / totalIncome) * 100))
      : 0;

  // Breakdown expense
  const expenseBreakdown: CategoryBreakdownItem[] = Object.values(expenseCategoryMap)
    .map((item) => ({
      ...item,
      percentage: totalExpense > 0 ? Math.round((item.totalAmount / totalExpense) * 100) : 0,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  // Breakdown income
  const incomeBreakdown: CategoryBreakdownItem[] = Object.values(incomeCategoryMap)
    .map((item) => ({
      ...item,
      percentage: totalIncome > 0 ? Math.round((item.totalAmount / totalIncome) * 100) : 0,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  // Status kesehatan keuangan
  let healthStatus: "HEALTHY" | "MODERATE" | "DEFICIT";
  let healthMessage: string;

  if (netSavings < 0) {
    healthStatus = "DEFICIT";
    healthMessage = "Pengeluaran melebihi pemasukan pada periode ini. Tinjau kembali pos pengeluaran terbesar.";
  } else if (savingsRate >= 20) {
    healthStatus = "HEALTHY";
    healthMessage = `Keuangan prima! Kamu berhasil menyisihkan ${savingsRate}% dari total pemasukan.`;
  } else {
    healthStatus = "MODERATE";
    healthMessage = `Keuangan aman dengan surplus, namun coba tingkatkan rasio tabungan hingga minimal 20%.`;
  }

  return {
    totalIncome,
    totalExpense,
    netSavings,
    savingsRate,
    healthStatus,
    healthMessage,
    expenseBreakdown,
    incomeBreakdown,
  };
}
