import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mattison Allocation Calculator",
  description: "Calculate your optimal portfolio allocation based on the Mattison Allocation strategy. Age-based recommendations for Gold and Bitcoin allocation.",
  openGraph: {
    title: "Mattison Allocation Calculator",
    description: "Calculate your optimal portfolio allocation based on the Mattison Allocation strategy.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mattison Allocation Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mattison Allocation Calculator",
    description: "Calculate your optimal portfolio allocation based on the Mattison Allocation strategy.",
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
