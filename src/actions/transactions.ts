"use server";

import { prisma } from "@/lib/prisma";
import { calculateBalance, BalanceSummary } from "@/services/financial";
import { TransactionType, GoalStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Mendapatkan atau memastikan user default tersedia
export async function getDefaultUser() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Personal User",
        email: "user@local.app",
      },
    });

    // Seed default categories
    const defaultCategories = [
      { name: "Makanan & Minuman", type: TransactionType.EXPENSE, icon: "utensils", color: "#f97316" },
      { name: "Kopi & Jajan", type: TransactionType.EXPENSE, icon: "coffee", color: "#eab308" },
      { name: "Transportasi & Bensin", type: TransactionType.EXPENSE, icon: "fuel", color: "#3b82f6" },
      { name: "Belanja Kebutuhan", type: TransactionType.EXPENSE, icon: "shopping-cart", color: "#8b5cf6" },
      { name: "Tagihan & Utilitas", type: TransactionType.EXPENSE, icon: "receipt", color: "#ec4899" },
      { name: "Barang Impian", type: TransactionType.EXPENSE, icon: "sparkles", color: "#6366f1" },
      { name: "Gaji Utama", type: TransactionType.INCOME, icon: "briefcase", color: "#10b981" },
      { name: "Bonus & Freelance", type: TransactionType.INCOME, icon: "gift", color: "#06b6d4" },
    ];

    for (const cat of defaultCategories) {
      await prisma.category.create({
        data: {
          userId: user.id,
          name: cat.name,
          type: cat.type,
          icon: cat.icon,
          color: cat.color,
        },
      });
    }
  }
  return user;
}

export async function getDashboardData() {
  try {
    const user = await getDefaultUser();

    // 1. Ambil seluruh transaksi untuk kalkulasi saldo akurat
    const allTransactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      select: {
        type: true,
        amount: true,
      },
    });

    // 2. Ambil total tabungan yang sedang disisihkan di goal aktif
    const activeGoalDeposits = await prisma.goalDeposit.findMany({
      where: {
        goal: {
          userId: user.id,
          status: GoalStatus.IN_PROGRESS,
        },
      },
      select: {
        amount: true,
      },
    });

    const reservedSavings = activeGoalDeposits.reduce(
      (sum, dep) => sum + Number(dep.amount),
      0
    );

    const balance: BalanceSummary = calculateBalance(allTransactions, reservedSavings);

    // 3. Ambil kategori untuk pilihan form dan quick pills
    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    });

    // 4. Ambil transaksi hari ini
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startOfToday,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // 5. Ambil data goals aktif untuk widget ringkas
    const activeGoals = await prisma.dreamGoal.findMany({
      where: {
        userId: user.id,
        status: GoalStatus.IN_PROGRESS,
      },
      include: {
        deposits: true,
      },
      take: 2,
    });

    const goalsWithProgress = activeGoals.map((g) => {
      const saved = g.deposits.reduce((acc, d) => acc + Number(d.amount), 0);
      return {
        id: g.id,
        title: g.title,
        targetAmount: Number(g.targetAmount),
        savedAmount: saved,
        percentage: Math.min(100, Math.round((saved / Number(g.targetAmount)) * 100)),
      };
    });

    return {
      success: true,
      user,
      balance,
      categories,
      todayTransactions: todayTransactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: Number(t.amount),
        categoryName: t.category.name,
        categoryIcon: t.category.icon,
        categoryColor: t.category.color,
        note: t.note,
        date: t.date.toISOString(),
      })),
      goals: goalsWithProgress,
    };
  } catch (error: any) {
    console.error("Gagal mengambil data dashboard:", error);
    const isTableMissing =
      error?.code === "P2021" ||
      String(error?.message || "").includes("does not exist in the current database");

    return {
      success: false,
      errorType: isTableMissing ? ("TABLES_MISSING" as const) : ("CONNECTION_FAILED" as const),
      error: isTableMissing
        ? "Tabel database belum dibuat di PostgreSQL"
        : "Gagal menghubungkan ke database PostgreSQL",
      balance: {
        totalIncome: 0,
        totalExpense: 0,
        totalCash: 0,
        reservedSavings: 0,
        freeCash: 0,
      },
      categories: [],
      todayTransactions: [],
      goals: [],
    };
  }
}

export async function createTransactionAction(formData: {
  type: TransactionType;
  amount: number;
  categoryId: string;
  note?: string;
  date?: string;
}) {
  try {
    const user = await getDefaultUser();

    if (!formData.amount || formData.amount <= 0) {
      return { success: false, error: "Nominal transaksi harus lebih dari 0" };
    }

    if (!formData.categoryId) {
      return { success: false, error: "Kategori wajib dipilih" };
    }

    await prisma.transaction.create({
      data: {
        userId: user.id,
        categoryId: formData.categoryId,
        type: formData.type,
        amount: formData.amount,
        note: formData.note?.trim() || null,
        date: formData.date ? new Date(formData.date) : new Date(),
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Gagal menyimpan transaksi ke database" };
  }
}
