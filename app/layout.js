import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";

export const metadata = {
  title: "MarketBridge - DIU Student Marketplace",
  description: "Campus marketplace with OneCard escrow and QR code handshake.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
