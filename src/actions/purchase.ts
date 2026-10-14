"use server";

import { prisma } from "@/lib/prisma";
import { getDefaultUser } from "./transactions";
import { validateGoalWithdraw } from "@/services/purchase";
import { GoalStatus, TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function withdrawFromGoalAction(formData: {
  goalId: string;
  amount: number;
  note?: string;
}) {
  try {
    const user = await getDefaultUser();

    if (!formData.goalId) {
      return { success: false, error: "Barang impian tidak valid." };
    }

    const goal = await prisma.dreamGoal.findUnique({
      where: { id: formData.goalId },
      include: { deposits: true },
    });

    if (!goal || goal.userId !== user.id) {
      return { success: false, error: "Barang impian tidak ditemukan." };
    }

    if (goal.status === GoalStatus.ACHIEVED) {
      return { success: false, error: "Barang impian yang sudah terbeli tidak dapat ditarik dananya." };
    }

    const currentSaved = goal.deposits.reduce((acc, d) => acc + Number(d.amount), 0);
    const validation = validateGoalWithdraw(formData.amount, currentSaved);

    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Catat penarikan dana sebagai deposit negatif
    await prisma.goalDeposit.create({
      data: {
        goalId: goal.id,
        amount: -formData.amount,
        note: formData.note?.trim() || "Penarikan Dana Darurat",
      },
    });

    revalidatePath("/goals");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Gagal menarik dana dari goal:", error);
    return { success: false, error: "Terjadi kesalahan saat memproses penarikan dana." };
  }
}

export async function purchaseGoalAction(formData: { goalId: string }) {
  try {
    const user = await getDefaultUser();

    if (!formData.goalId) {
      return { success: false, error: "Barang impian tidak valid." };
    }

    const goal = await prisma.dreamGoal.findUnique({
      where: { id: formData.goalId },
      include: { deposits: true },
    });

    if (!goal || goal.userId !== user.id) {
      return { success: false, error: "Barang impian tidak ditemukan." };
    }

    if (goal.status === GoalStatus.ACHIEVED) {
      return { success: false, error: "Barang impian ini sudah pernah dibeli." };
    }

    const totalSaved = goal.deposits.reduce((acc, d) => acc + Number(d.amount), 0);
    if (totalSaved <= 0) {
      return { success: false, error: "Belum ada tabungan yang terkumpul untuk membeli barang ini." };
    }

    // Eksekusi atomik menggunakan Prisma Transaction
    await prisma.$transaction(async (tx) => {
      // 1. Dapatkan atau buat kategori "Barang Impian"
      let category = await tx.category.findFirst({
        where: {
          userId: user.id,
          name: "Barang Impian",
          type: TransactionType.EXPENSE,
        },
      });

      if (!category) {
        category = await tx.category.create({
          data: {
            userId: user.id,
            name: "Barang Impian",
            type: TransactionType.EXPENSE,
            icon: "sparkles",
            color: "#6366f1",
          },
        });
      }

      // 2. Ubah status goal menjadi ACHIEVED
      await tx.dreamGoal.update({
        where: { id: goal.id },
        data: {
          status: GoalStatus.ACHIEVED,
          achievedAt: new Date(),
        },
      });

      // 3. Catat transaksi pengeluaran riil EXPENSE
      await tx.transaction.create({
        data: {
          userId: user.id,
          categoryId: category.id,
          type: TransactionType.EXPENSE,
          amount: totalSaved,
          note: `Realisasi Impian: ${goal.title}`,
          date: new Date(),
        },
      });
    });

    revalidatePath("/goals");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Gagal merealisasikan pembelian goal:", error);
    return { success: false, error: "Terjadi kesalahan saat memproses pembelian barang impian." };
  }
}
