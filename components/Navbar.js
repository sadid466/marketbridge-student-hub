"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-end gap-1">
          <span className="text-2xl font-bold text-blue-600">
            MarketBridge
          </span>

          <span className="text-sm text-gray-500 mb-1">
            DIU
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8 text-base font-medium text-gray-700">
          <Link href="/" className="hover:text-blue-600 transition">
            Browse Items
          </Link>

          <Link href="/sell" className="hover:text-blue-600 transition">
            Sell Item
          </Link>

          <Link href="/dashboard" className="hover:text-blue-600 transition">
            Dashboard
          </Link>
        </div>

        {/* Right Button */}
        {pathname === "/login" ? (
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
          >
            Register
          </Link>
        ) : pathname === "/register" ? (
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
          >
            Login
          </Link>
        ) : (
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
          >
            Login with DIU ID
          </Link>
        )}
      </div>
    </nav>
  );
}