import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "ReviewIT",
  description: "A universal review platform — rate, review, and categorize anything.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" className="h-full antialiased bg-white">
      <body className="min-h-screen flex flex-col font-sans bg-white">
        <Navbar user={session} />
        {children}</body>
    </html>
  );
}
