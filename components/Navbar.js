"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Browse Items", href: "/" },
    { name: "Sell Item", href: "/sell" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-end gap-1 flex-shrink-0">
          <span className="text-3xl font-bold text-blue-600">
            MarketBridge
          </span>

          <span className="text-sm text-gray-500 mb-1">
            DIU
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-10">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition font-medium text-lg ${
                  active
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Button */}
        <div className="flex-shrink-0">
          {pathname === "/login" ? (
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Register
            </Link>
          ) : pathname === "/register" ? (
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Login
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Login with DIU ID
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}