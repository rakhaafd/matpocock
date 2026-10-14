import { describe, it, expect } from "vitest";
import { validateGoalWithdraw, simulateGoalPurchase } from "../src/services/purchase";
import { calculateBalance } from "../src/services/financial";
import { TransactionType } from "@prisma/client";

describe("Goal Withdraw and Purchase Invariants (Ticket 05 Seam)", () => {
  it("validates emergency withdrawal amount against current saved amount", () => {
    const savedAmount = 1000000;

    expect(validateGoalWithdraw(500000, savedAmount).valid).toBe(true);
    expect(validateGoalWithdraw(1000000, savedAmount).valid).toBe(true);

    const overWithdraw = validateGoalWithdraw(1200000, savedAmount);
    expect(overWithdraw.valid).toBe(false);
    expect(overWithdraw.error).toContain("tidak boleh melebihi total tabungan");

    expect(validateGoalWithdraw(0, savedAmount).valid).toBe(false);
    expect(validateGoalWithdraw(-100000, savedAmount).valid).toBe(false);
  });

  it("proves withdrawal balance invariant: withdrawing money returns it to Free Cash", () => {
    const initialTransactions = [
      { type: TransactionType.INCOME, amount: 6000000 },
      { type: TransactionType.EXPENSE, amount: 2000000 },
    ];
    let reservedSavings = 2000000;

    // Awal: Total Kas = 4.000.000, Tabungan Goal = 2.000.000, Saldo Bebas = 2.000.000
    const before = calculateBalance(initialTransactions, reservedSavings);
    expect(before.totalCash).toBe(4000000);
    expect(before.freeCash).toBe(2000000);

    // Pengguna menarik dana darurat Rp 500.000 dari Goal
    const withdrawAmount = 500000;
    expect(validateGoalWithdraw(withdrawAmount, 2000000).valid).toBe(true);

    reservedSavings -= withdrawAmount;
    const after = calculateBalance(initialTransactions, reservedSavings);

    // INVARIAN: Total Kas tetap 4.000.000, Saldo Bebas NAIK menjadi 2.500.000
    expect(after.totalCash).toBe(4000000);
    expect(after.freeCash).toBe(2500000);
    expect(after.reservedSavings).toBe(1500000);
  });

  it("proves NO DOUBLE DEDUCTION when a Goal is purchased (*Goal Purchase*)", () => {
    const transactions = [
      { type: TransactionType.INCOME, amount: 10000000 },
      { type: TransactionType.EXPENSE, amount: 3000000 },
    ];
    const goalSavedAmount = 4500000;
    const reservedSavingsBefore = 4500000;

    // Keadaan sebelum pembelian:
    // Total Kas = 7.000.000
    // Reserved = 4.500.000
    // Saldo Bebas Belanja = 2.500.000
    const before = calculateBalance(transactions, reservedSavingsBefore);
    expect(before.totalCash).toBe(7000000);
    expect(before.freeCash).toBe(2500000);

    // Eksekusi Pembelian Barang Impian:
    // 1. Terbit transaksi EXPENSE baru sebesar 4.500.000
    // 2. Goal status menjadi ACHIEVED sehingga tidak lagi masuk ke Reserved Savings
    const simulation = simulateGoalPurchase({
      existingTransactions: transactions,
      reservedSavingsBefore,
      goalSavedAmount,
    });

    // INVARIAN KRUSIAL:
    // - Total Kas riil berkurang karena uang resmi keluar membeli barang (7.000.000 -> 2.500.000)
    expect(simulation.afterBalance.totalCash).toBe(2500000);
    // - Tabungan aktif sekarang 0 (karena goal sudah dibeli)
    expect(simulation.afterBalance.reservedSavings).toBe(0);
    // - Saldo Bebas Belanja TETAP 2.500.000 (TIDAK terpotong ganda!)
    expect(simulation.afterBalance.freeCash).toBe(before.freeCash);
  });
});
