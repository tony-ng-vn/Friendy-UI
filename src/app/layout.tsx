import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Eczar } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: true,
});

const eczar = Eczar({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Friendy",
  description: "Don't lose the connection — always remember the moment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${eczar.variable}`}>
      <body>{children}</body>
    </html>
  );
}
