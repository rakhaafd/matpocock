import { describe, it, expect } from "vitest";
import { filterTransactions, calculateHistorySummary, HistoryTransactionItem } from "../src/services/history";
import { TransactionType } from "@prisma/client";

describe("Transaction History Filtering & Summary (Ticket 06 Seam)", () => {
  const sampleTransactions: HistoryTransactionItem[] = [
    {
      id: "1",
      type: TransactionType.EXPENSE,
      amount: 35000,
      categoryId: "cat-food",
      categoryName: "Makanan & Minuman",
      note: "Nasi Padang komplit",
      date: new Date("2026-10-14T12:00:00Z"),
    },
    {
      id: "2",
      type: TransactionType.EXPENSE,
      amount: 20000,
      categoryId: "cat-coffee",
      categoryName: "Kopi & Jajan",
      note: "Es Kopi Susu",
      date: new Date("2026-10-14T10:00:00Z"),
    },
    {
      id: "3",
      type: TransactionType.INCOME,
      amount: 5000000,
      categoryId: "cat-salary",
      categoryName: "Gaji Utama",
      note: "Gaji Bulanan",
      date: new Date("2026-10-01T08:00:00Z"),
    },
    {
      id: "4",
      type: TransactionType.EXPENSE,
      amount: 50000,
      categoryId: "cat-fuel",
      categoryName: "Transportasi & Bensin",
      note: "Isi Pertamax motor",
      date: new Date("2026-10-13T15:00:00Z"),
    },
  ];

  it("filters transactions by type (EXPENSE only)", () => {
    const result = filterTransactions(sampleTransactions, { type: TransactionType.EXPENSE });
    expect(result.length).toBe(3);
    expect(result.every((t) => t.type === TransactionType.EXPENSE)).toBe(true);
  });

  it("filters transactions by type (INCOME only)", () => {
    const result = filterTransactions(sampleTransactions, { type: TransactionType.INCOME });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("3");
  });

  it("filters transactions by category ID", () => {
    const result = filterTransactions(sampleTransactions, { categoryId: "cat-food" });
    expect(result.length).toBe(1);
    expect(result[0].note).toBe("Nasi Padang komplit");
  });

  it("searches transactions by keyword in note or category (case-insensitive)", () => {
    const result = filterTransactions(sampleTransactions, { search: "kopi" });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("2");

    const result2 = filterTransactions(sampleTransactions, { search: "padang" });
    expect(result2.length).toBe(1);
    expect(result2[0].id).toBe("1");
  });

  it("calculates summary statistics for a filtered set of transactions", () => {
    const summary = calculateHistorySummary(sampleTransactions);
    expect(summary.totalIncome).toBe(5000000);
    expect(summary.totalExpense).toBe(105000); // 35k + 20k + 50k
    expect(summary.netFlow).toBe(4895000); // 5.000.000 - 105.000
    expect(summary.transactionCount).toBe(4);
  });
});
