"use server";

import { prisma } from "@/lib/prisma";
import { getDefaultUser } from "./transactions";
import { calculateGoalProgress } from "@/services/goals";
import { GoalStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getGoalsData() {
  try {
    const user = await getDefaultUser();

    const goals = await prisma.dreamGoal.findMany({
      where: {
        userId: user.id,
      },
      include: {
        deposits: {
          orderBy: { date: "desc" },
        },
      },
      orderBy: [
        { status: "asc" }, // IN_PROGRESS first, then ACHIEVED
        { createdAt: "desc" },
      ],
    });

    const formattedGoals = goals.map((g) => {
      const saved = g.deposits.reduce((sum, d) => sum + Number(d.amount), 0);
      const target = Number(g.targetAmount);
      const progress = calculateGoalProgress(target, saved);

      return {
        id: g.id,
        title: g.title,
        targetAmount: target,
        savedAmount: saved,
        remainingAmount: progress.remaining,
        percentage: progress.percentage,
        isAchieved: g.status === GoalStatus.ACHIEVED || progress.isAchieved,
        status: g.status,
        targetDate: g.targetDate ? g.targetDate.toISOString() : null,
        imageUrl: g.imageUrl,
        createdAt: g.createdAt.toISOString(),
        depositCount: g.deposits.length,
      };
    });

    // Hitung Saldo Bebas Belanja
    const allTransactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      select: { type: true, amount: true },
    });

    const activeReservedSavings = goals
      .filter((g) => g.status === GoalStatus.IN_PROGRESS)
      .reduce((sum, g) => {
        return sum + g.deposits.reduce((dSum, d) => dSum + Number(d.amount), 0);
      }, 0);

    const totalIncome = allTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = allTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const freeCash = totalIncome - totalExpense - activeReservedSavings;

    return {
      success: true,
      goals: formattedGoals,
      freeCash,
    };
  } catch (error) {
    console.error("Gagal mengambil data goals:", error);
    return {
      success: false,
      goals: [],
      error: "Gagal menghubungkan ke database",
    };
  }
}

export async function createGoalAction(formData: {
  title: string;
  targetAmount: number;
  targetDate?: string;
  imageUrl?: string;
}) {
  try {
    const user = await getDefaultUser();

    if (!formData.title || formData.title.trim() === "") {
      return { success: false, error: "Judul barang impian wajib diisi." };
    }

    if (!formData.targetAmount || formData.targetAmount <= 0) {
      return { success: false, error: "Target harga harus lebih dari 0." };
    }

    await prisma.dreamGoal.create({
      data: {
        userId: user.id,
        title: formData.title.trim(),
        targetAmount: formData.targetAmount,
        targetDate: formData.targetDate ? new Date(formData.targetDate) : null,
        imageUrl: formData.imageUrl || null,
        status: GoalStatus.IN_PROGRESS,
      },
    });

    revalidatePath("/goals");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { success: false, error: "Gagal menyimpan barang impian." };
  }
}
