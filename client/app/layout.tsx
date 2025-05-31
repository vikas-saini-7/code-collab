import type { Metadata } from "next";
import localFont from "next/font/local";
import GlobalProvider from "../providers/globalProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code Collab - Realtime Code Collaboration",
  description: "Code Collab is a platform for realtime code collaboration, allowing developers to work together seamlessly in shared coding environments.",
};

// newwer fonts
const redHatMono = localFont({
  src: [
    {
      path: "./assets/fonts/RedHatMono-VariableFont_wght.ttf",
      weight: "100 900", // adjust as needed
      style: "normal",
    },
    {
      path: "./assets/fonts/RedHatMono-Italic-VariableFont_wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-red-hat-mono",
  display: "swap",
});

const bricolageGrotesque = localFont({
  src: "./assets/fonts/BricolageGrotesque-VariableFont_opsz,wdth,wght.ttf",
  variable: "--font-bricolage-grotesque",
  display: "swap",
});

const antonSC = localFont({
  src: "./assets/fonts/AntonSC-Regular.ttf",
  variable: "--font-anton-sc",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${redHatMono.variable} ${bricolageGrotesque.variable} ${antonSC.variable} antialiased dark min-h-screen`}
      >
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
