import { describe, it, expect } from "vitest";
import { calculateBalance, formatRupiah } from "../src/services/financial";
import { TransactionType } from "@prisma/client";

describe("Financial Calculations (Ticket 02 Seam)", () => {
  it("formats currency to Indonesian Rupiah cleanly", () => {
    expect(formatRupiah(2500000)).toBe("Rp 2.500.000");
    expect(formatRupiah(0)).toBe("Rp 0");
    expect(formatRupiah(-50000)).toBe("-Rp 50.000");
  });

  it("calculates Total Cash and Free Cash correctly with no goals", () => {
    const transactions = [
      { type: TransactionType.INCOME, amount: 5000000 },
      { type: TransactionType.EXPENSE, amount: 1500000 },
      { type: TransactionType.EXPENSE, amount: 500000 },
    ];
    const reservedSavings = 0;

    const result = calculateBalance(transactions, reservedSavings);

    expect(result.totalIncome).toBe(5000000);
    expect(result.totalExpense).toBe(2000000);
    expect(result.totalCash).toBe(3000000);
    expect(result.freeCash).toBe(3000000);
  });

  it("reduces Free Cash when money is reserved in Dream Goals without altering Total Cash", () => {
    const transactions = [
      { type: TransactionType.INCOME, amount: 10000000 },
      { type: TransactionType.EXPENSE, amount: 3000000 },
    ];
    // Pengguna punya 7 juta kas riil, dan menyisihkan 2.5 juta untuk Impian
    const reservedSavings = 2500000;

    const result = calculateBalance(transactions, reservedSavings);

    expect(result.totalCash).toBe(7000000);
    expect(result.reservedSavings).toBe(2500000);
    expect(result.freeCash).toBe(4500000); // 7.000.000 - 2.500.000
  });

  it("handles negative free cash properly if expenses exceed free cash", () => {
    const transactions = [
      { type: TransactionType.INCOME, amount: 2000000 },
      { type: TransactionType.EXPENSE, amount: 1500000 },
    ];
    const reservedSavings = 1000000;

    const result = calculateBalance(transactions, reservedSavings);

    expect(result.totalCash).toBe(500000);
    expect(result.freeCash).toBe(-500000);
  });
});
