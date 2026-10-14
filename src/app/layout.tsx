import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Finance & Dream Goals Tracker",
  description: "Aplikasi keuangan harian dan pelacak tabungan barang impian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased flex flex-col items-center">
        <main className="w-full max-w-md min-h-screen flex flex-col relative pb-20">
          {children}
        </main>
      </body>
    </html>
  );
}
