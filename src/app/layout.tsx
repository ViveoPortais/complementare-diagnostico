import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import { Footer } from "@/components/Footer";
import { FooterSignin } from "@/components/FooterSignin";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Programa Complementare Diagnóstico",
  description: "Programa Complementare Diagnóstico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
