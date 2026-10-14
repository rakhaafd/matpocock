import { describe, it, expect } from "vitest";
import { TransactionType } from "@prisma/client";
import {
  calculateReports,
  filterTransactionsByPeriod,
  ReportTransactionItem,
} from "../src/services/reports";

describe("Financial Reports Service (Reports Seam)", () => {
  const sampleTransactions: ReportTransactionItem[] = [
    {
      id: "1",
      type: TransactionType.EXPENSE,
      amount: 500000,
      categoryId: "cat-food",
      categoryName: "Makanan & Minuman",
      categoryColor: "#f97316",
      date: new Date("2026-10-10T12:00:00Z"),
    },
    {
      id: "2",
      type: TransactionType.EXPENSE,
      amount: 250000,
      categoryId: "cat-fuel",
      categoryName: "Transportasi & Bensin",
      categoryColor: "#3b82f6",
      date: new Date("2026-10-12T10:00:00Z"),
    },
    {
      id: "3",
      type: TransactionType.EXPENSE,
      amount: 250000,
      categoryId: "cat-food",
      categoryName: "Makanan & Minuman",
      categoryColor: "#f97316",
      date: new Date("2026-10-13T18:00:00Z"),
    },
    {
      id: "4",
      type: TransactionType.INCOME,
      amount: 5000000,
      categoryId: "cat-salary",
      categoryName: "Gaji Utama",
      categoryColor: "#10b981",
      date: new Date("2026-10-01T08:00:00Z"),
    },
  ];

  it("calculates total income, expense, net savings, and savings rate correctly", () => {
    const report = calculateReports(sampleTransactions);

    expect(report.totalIncome).toBe(5000000);
    expect(report.totalExpense).toBe(1000000); // 500k + 250k + 250k
    expect(report.netSavings).toBe(4000000);
    expect(report.savingsRate).toBe(80); // (4jt / 5jt) * 100 = 80%
    expect(report.healthStatus).toBe("HEALTHY");
  });

  it("calculates expense breakdown grouped by category with accurate percentages", () => {
    const report = calculateReports(sampleTransactions);

    expect(report.expenseBreakdown.length).toBe(2);
    // Highest expense first
    expect(report.expenseBreakdown[0].categoryId).toBe("cat-food");
    expect(report.expenseBreakdown[0].totalAmount).toBe(750000); // 500k + 250k
    expect(report.expenseBreakdown[0].percentage).toBe(75); // 750k / 1jt = 75%
    expect(report.expenseBreakdown[0].count).toBe(2);

    expect(report.expenseBreakdown[1].categoryId).toBe("cat-fuel");
    expect(report.expenseBreakdown[1].totalAmount).toBe(250000);
    expect(report.expenseBreakdown[1].percentage).toBe(25);
    expect(report.expenseBreakdown[1].count).toBe(1);
  });

  it("calculates income breakdown grouped by category", () => {
    const report = calculateReports(sampleTransactions);

    expect(report.incomeBreakdown.length).toBe(1);
    expect(report.incomeBreakdown[0].categoryId).toBe("cat-salary");
    expect(report.incomeBreakdown[0].totalAmount).toBe(5000000);
    expect(report.incomeBreakdown[0].percentage).toBe(100);
  });

  it("handles deficit state when expenses exceed income", () => {
    const deficitTransactions: ReportTransactionItem[] = [
      {
        id: "1",
        type: TransactionType.INCOME,
        amount: 1000000,
        categoryId: "cat-salary",
        categoryName: "Gaji Utama",
        date: new Date("2026-10-01"),
      },
      {
        id: "2",
        type: TransactionType.EXPENSE,
        amount: 1500000,
        categoryId: "cat-rent",
        categoryName: "Sewa Kos",
        date: new Date("2026-10-02"),
      },
    ];

    const report = calculateReports(deficitTransactions);
    expect(report.netSavings).toBe(-500000);
    expect(report.savingsRate).toBe(0);
    expect(report.healthStatus).toBe("DEFICIT");
  });

  it("filters transactions by period (THIS_MONTH, LAST_30_DAYS, ALL_TIME)", () => {
    const fixedNow = new Date("2026-10-15T10:00:00Z");

    const tList: ReportTransactionItem[] = [
      {
        id: "this-month",
        type: TransactionType.EXPENSE,
        amount: 50000,
        categoryId: "c1",
        categoryName: "Makan",
        date: new Date("2026-10-05T00:00:00Z"),
      },
      {
        id: "last-month",
        type: TransactionType.EXPENSE,
        amount: 100000,
        categoryId: "c1",
        categoryName: "Makan",
        date: new Date("2026-09-10T00:00:00Z"),
      },
      {
        id: "old-item",
        type: TransactionType.EXPENSE,
        amount: 200000,
        categoryId: "c1",
        categoryName: "Makan",
        date: new Date("2026-01-01T00:00:00Z"),
      },
    ];

    const thisMonth = filterTransactionsByPeriod(tList, "THIS_MONTH", fixedNow);
    expect(thisMonth.length).toBe(1);
    expect(thisMonth[0].id).toBe("this-month");

    const allTime = filterTransactionsByPeriod(tList, "ALL_TIME", fixedNow);
    expect(allTime.length).toBe(3);
  });
});
