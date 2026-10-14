"use server";

import { prisma } from "@/lib/prisma";
import { getDefaultUser } from "./transactions";

export async function getReportsData() {
  try {
    const user = await getDefaultUser();

    const [transactions, goals] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId: user.id },
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
      }),
      prisma.dreamGoal.findMany({
        where: { userId: user.id },
        include: {
          deposits: true,
        },
      }),
    ]);

    const formattedTransactions = transactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      categoryId: t.categoryId,
      categoryName: t.category?.name || "Tanpa Kategori",
      categoryColor: t.category?.color || "#64748b",
      categoryIcon: t.category?.icon || "tag",
      note: t.note,
      date: t.date.toISOString(),
    }));

    const totalGoalSaved = goals.reduce((sum, g) => {
      const savedInGoal = g.deposits.reduce((dSum, d) => dSum + Number(d.amount), 0);
      return sum + savedInGoal;
    }, 0);

    return {
      success: true,
      transactions: formattedTransactions,
      totalGoalSaved,
      goalsCount: goals.length,
      achievedGoalsCount: goals.filter((g) => g.status === "ACHIEVED").length,
    };
  } catch (error) {
    console.error("Gagal mengambil data laporan keuangan:", error);
    return {
      success: false,
      error: "Gagal menghubungkan ke database",
      transactions: [],
      totalGoalSaved: 0,
      goalsCount: 0,
      achievedGoalsCount: 0,
    };
  }
}
