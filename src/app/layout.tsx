import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { ToastContainer } from "@/components/ui/toast";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "AdLayer AI | Creative Intelligence Platform",
  description:
    "Turn every advertisement into structured, machine-readable, automation-ready data. Upload an ad. Get back structured layers, semantic classifications, and production-ready exports.",
  openGraph: {
    title: "AdLayer AI",
    description: "Creative Intelligence Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className={plusJakarta.className}>
        <QueryProvider>
          {children}
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}
