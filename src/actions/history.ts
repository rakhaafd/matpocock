"use server";

import { prisma } from "@/lib/prisma";
import { getDefaultUser } from "./transactions";
import { revalidatePath } from "next/cache";

export async function getHistoryData() {
  try {
    const user = await getDefaultUser();

    const [categories, rawTransactions] = await Promise.all([
      prisma.category.findMany({
        where: { userId: user.id },
        orderBy: { name: "asc" },
      }),
      prisma.transaction.findMany({
        where: { userId: user.id },
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
      }),
    ]);

    const transactions = rawTransactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      categoryId: t.categoryId,
      categoryName: t.category?.name || "Tanpa Kategori",
      categoryIcon: t.category?.icon || "tag",
      categoryColor: t.category?.color || "#64748b",
      note: t.note,
      date: t.date.toISOString(),
    }));

    return {
      success: true,
      categories,
      transactions,
    };
  } catch (error) {
    console.error("Gagal mengambil data riwayat transaksi:", error);
    return {
      success: false,
      error: "Gagal menghubungkan ke database",
      categories: [],
      transactions: [],
    };
  }
}

export async function deleteTransactionAction(transactionId: string) {
  try {
    const user = await getDefaultUser();

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: user.id,
      },
    });

    if (!transaction) {
      return { success: false, error: "Transaksi tidak ditemukan" };
    }

    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    revalidatePath("/history");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus transaksi:", error);
    return { success: false, error: "Gagal menghapus transaksi dari database" };
  }
}
