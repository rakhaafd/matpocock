import { describe, it, expect } from "vitest";
import { validateDepositAllocation } from "../src/services/allocation";
import { calculateBalance } from "../src/services/financial";
import { TransactionType } from "@prisma/client";

describe("Goal Deposit Allocation Invariants (Ticket 04 Seam)", () => {
  it("approves deposit when allocation amount is less than or equal to free cash", () => {
    const freeCash = 1000000;
    const depositAmount = 250000;

    const validation = validateDepositAllocation(depositAmount, freeCash);

    expect(validation.valid).toBe(true);
    expect(validation.error).toBeUndefined();
  });

  it("rejects deposit with clear error when allocation exceeds available free cash", () => {
    const freeCash = 300000;
    const depositAmount = 500000;

    const validation = validateDepositAllocation(depositAmount, freeCash);

    expect(validation.valid).toBe(false);
    expect(validation.error).toContain("Saldo bebas belanja tidak mencukupi");
  });

  it("rejects zero or negative deposit amounts", () => {
    const freeCash = 1000000;

    expect(validateDepositAllocation(0, freeCash).valid).toBe(false);
    expect(validateDepositAllocation(-50000, freeCash).valid).toBe(false);
  });

  it("verifies the balance invariant: saving to a goal reduces Free Cash but keeps Total Cash unchanged", () => {
    const initialTransactions = [
      { type: TransactionType.INCOME, amount: 5000000 },
      { type: TransactionType.EXPENSE, amount: 2000000 },
    ];
    let initialReservedSavings = 500000;

    // Keadaan awal: Total Kas = 3.000.000, Saldo Bebas = 2.500.000
    const before = calculateBalance(initialTransactions, initialReservedSavings);
    expect(before.totalCash).toBe(3000000);
    expect(before.freeCash).toBe(2500000);

    // Pengguna menabung Rp 500.000 ke Goal
    const newDeposit = 500000;
    const check = validateDepositAllocation(newDeposit, before.freeCash);
    expect(check.valid).toBe(true);

    const updatedReservedSavings = initialReservedSavings + newDeposit;
    const after = calculateBalance(initialTransactions, updatedReservedSavings);

    // INVARIAN KUNCI:
    // 1. Total kas riil TIDAK berubah sama sekali
    expect(after.totalCash).toBe(before.totalCash);
    // 2. Saldo bebas belanja berkurang persis sebesar nominal deposit
    expect(after.freeCash).toBe(before.freeCash - newDeposit);
    // 3. Tabungan impian bertambah sebesar nominal deposit
    expect(after.reservedSavings).toBe(1000000);
  });
});
