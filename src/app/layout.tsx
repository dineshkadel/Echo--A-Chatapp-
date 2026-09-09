import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/src/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Echo - A Chatapp",
  description: "Real time communication between different user",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storedTheme = (await cookies()).get("app-theme")?.value;
  const themeClass = storedTheme === "light" ? "light" : "dark";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${themeClass} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
