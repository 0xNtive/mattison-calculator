import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mattison Allocation Calculator | Gold & Bitcoin Portfolio Tool",
  description: "Explore the Mattison Allocation formula - an age-based approach to Gold and Bitcoin allocation. View historical performance simulations and compare strategies.",
  keywords: ["Mattison Allocation", "Gold", "Bitcoin", "portfolio calculator", "asset allocation", "crypto allocation"],
  authors: [{ name: "Techster", url: "https://x.com/Techster" }],
  openGraph: {
    title: "Mattison Allocation Calculator",
    description: "Explore the Mattison Allocation formula - an age-based approach to Gold and Bitcoin allocation.",
    type: "website",
    siteName: "Mattison Allocation Calculator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mattison Allocation Calculator - Gold & Bitcoin Portfolio Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mattison Allocation Calculator",
    description: "Explore the Mattison Allocation formula - an age-based approach to Gold and Bitcoin allocation.",
    creator: "@Techster",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
