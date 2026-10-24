import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignalTrace — Pharmacovigilance Case Lab",
  description:
    "A fictional adverse-event reporting practice simulator for pharmacy students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}