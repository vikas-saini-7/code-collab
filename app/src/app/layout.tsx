import { Bricolage_Grotesque } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import GlobalProvider from "@/providers/GlobalProvider";

// Initialize the font object with desired weights
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-bricolage",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body className={`${bricolage.className} antialiased dark`}>
        <GlobalProvider>
          {children}
          <Toaster theme="dark" />
        </GlobalProvider>
      </body>
    </html>
  );
}
