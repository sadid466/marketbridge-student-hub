"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { User, Wallet, ShieldCheck, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking anywhere outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Browse Items", href: "/" },
    { name: "Sell Item", href: "/sell" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-end gap-1 shrink-0">
          <span className="text-3xl font-bold text-blue-600">
            MarketBridge
          </span>
          <span className="text-sm text-gray-500 mb-1">
            DIU
          </span>
        </Link>

        {/* Navigation Links */}
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

        {/* Right Action Button / User Profile Menu */}
        <div className="shrink-0 flex items-center">
          {session ? (
            <div className="relative" ref={dropdownRef}>
              {/* User Pill Badge Trigger (Click to Toggle) */}
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 transition text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {session.user.name?.[0]?.toUpperCase() || "S"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 leading-tight">
                    {session.user.studentId || session.user.name}
                  </span>
                  <span className="text-xs text-gray-500">DIU Student</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 ml-1 transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Account Info Dropdown Card */}
              {menuOpen && (
                <div className="absolute right-0 top-full pt-2 w-72 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
                    {/* Account Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-base shrink-0">
                        <User size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">
                          {session.user.name || "DIU Student"}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>

                    {/* OneCard Balances Section */}
                    <div className="py-3 space-y-2 border-b border-gray-100">
                      <div className="flex items-center justify-between text-sm bg-blue-50/60 p-2.5 rounded-xl">
                        <div className="flex items-center gap-2 text-blue-700 font-medium">
                          <Wallet size={16} />
                          <span>OneCard Balance</span>
                        </div>
                        <span className="font-bold text-blue-800">
                          ৳{session.user.oneCardBalance ?? 0}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm bg-amber-50/60 p-2.5 rounded-xl">
                        <div className="flex items-center gap-2 text-amber-700 font-medium">
                          <ShieldCheck size={16} />
                          <span>Escrow Hold</span>
                        </div>
                        <span className="font-bold text-amber-800">
                          ৳{session.user.escrowInHold ?? 0}
                        </span>
                      </div>
                    </div>

                    {/* Quick Dashboard Link */}
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block my-2 text-center text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 rounded-xl transition"
                    >
                      View Account Dashboard
                    </Link>

                    {/* Subtle Logout Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        signOut({ callbackUrl: "/login" });
                      }}
                      className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 py-2.5 rounded-xl transition border border-transparent hover:border-red-100 cursor-pointer"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : pathname === "/login" ? (
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