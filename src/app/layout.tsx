import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
