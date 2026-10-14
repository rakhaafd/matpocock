import { PrismaClient, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai database seeding...");

  // 1. Buat atau dapatkan user default
  const defaultUser = await prisma.user.upsert({
    where: { email: "user@local.app" },
    update: {},
    create: {
      name: "Personal User",
      email: "user@local.app",
    },
  });

  console.log(`Default User siap: ${defaultUser.name} (${defaultUser.id})`);

  // 2. Kategori bawaan standar
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
    await prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: defaultUser.id,
          name: cat.name,
          type: cat.type,
        },
      },
      update: {},
      create: {
        userId: defaultUser.id,
        name: cat.name,
        type: cat.type,
        icon: cat.icon,
        color: cat.color,
      },
    });
  }

  console.log(`Berhasil men-seed ${defaultCategories.length} kategori default.`);
}

main()
  .catch((e) => {
    console.error("Gagal menjalankan seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
