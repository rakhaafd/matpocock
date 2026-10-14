"use server";

import { prisma } from "@/lib/prisma";
import { getDefaultUser } from "./transactions";
import { validateDepositAllocation } from "@/services/allocation";
import { calculateBalance } from "@/services/financial";
import { GoalStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function depositToGoalAction(formData: {
  goalId: string;
  amount: number;
  note?: string;
}) {
  try {
    const user = await getDefaultUser();

    if (!formData.goalId) {
      return { success: false, error: "Barang impian tidak valid." };
    }

    // 1. Ambil data goal
    const goal = await prisma.dreamGoal.findUnique({
      where: { id: formData.goalId },
    });

    if (!goal || goal.userId !== user.id) {
      return { success: false, error: "Barang impian tidak ditemukan." };
    }

    if (goal.status === GoalStatus.ACHIEVED) {
      return { success: false, error: "Barang impian ini sudah selesai / tercapai." };
    }

    // 2. Hitung Saldo Bebas Belanja (Free Cash Balance) saat ini
    const allTransactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      select: { type: true, amount: true },
    });

    const activeGoalDeposits = await prisma.goalDeposit.findMany({
      where: {
        goal: {
          userId: user.id,
          status: GoalStatus.IN_PROGRESS,
        },
      },
      select: { amount: true },
    });

    const reservedSavings = activeGoalDeposits.reduce(
      (sum, dep) => sum + Number(dep.amount),
      0
    );

    const balance = calculateBalance(allTransactions, reservedSavings);

    // 3. Validasi alokasi tidak melebihi Saldo Bebas
    const validation = validateDepositAllocation(formData.amount, balance.freeCash);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // 4. Catat deposit ke tabel GoalDeposit
    await prisma.goalDeposit.create({
      data: {
        goalId: goal.id,
        amount: formData.amount,
        note: formData.note?.trim() || "Menabung untuk impian",
      },
    });

    revalidatePath("/goals");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Gagal menabung ke goal:", error);
    return { success: false, error: "Gagal menyimpan alokasi tabungan." };
  }
}
