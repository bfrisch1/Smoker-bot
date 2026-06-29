import type { Metadata, Viewport } from "next";
import { Ultra, Spectral, Space_Mono } from "next/font/google";
import "./globals.css";
import { MeatIconSprite } from "@/components/MeatIconSprite";

const ultra = Ultra({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ultra",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Butcher's Log — Smoke & Temp Journal",
  description:
    "Turn your dual-probe smoke receiver into a logged, plotted cook history. Snap a photo, plot the temps.",
};

export const viewport: Viewport = {
  themeColor: "#ECDFC0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ultra.variable} ${spectral.variable} ${spaceMono.variable} font-body`}
      >
        <MeatIconSprite />
        {children}
      </body>
    </html>
  );
}
