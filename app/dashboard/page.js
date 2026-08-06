"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { USER as INITIAL_USER } from "@/data/user";

const MOCK_MY_LISTINGS = [
  {
    id: "1",
    title: "Casio FX-991EX ClassWiz Calculator",
    price: 1800,
    status: "Active",
    views: 24,
  },
  {
    id: "4",
    title: "Logitech Wireless Mouse M185",
    price: 600,
    status: "Active",
    views: 12,
  },
];

const INITIAL_PURCHASES = [
  {
    id: "P-1001",
    title: "Casio FX-991EX ClassWiz Calculator",
    seller: "Mohammed Omar",
    amount: 1800,
    status: "Escrow Locked",
    pin: "123456",
    meetup: "DIU Knowledge Valley",
  },
];

const MOCK_TRANSACTIONS = [
  {
    id: "TX-1092",
    item: "Data Structures & Algorithms Textbook",
    amount: 350,
    type: "Sold",
    status: "Escrow Held (Pending Pickup)",
    date: "Jul 28, 2026",
  },
  {
    id: "TX-1044",
    item: "DIU Varsity Jacket",
    amount: 900,
    type: "Sold",
    status: "Completed",
    date: "Jul 20, 2026",
  },
];

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "listings";

  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Interactive state for Purchases and User OneCard Balances
  const [purchases, setPurchases] = useState(INITIAL_PURCHASES);
  const [user, setUser] = useState(INITIAL_USER);

  // Handle Cancel & Refund
  const handleCancelPurchase = (purchaseId, amount, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel the purchase for "${title}"? ৳${amount} will be refunded immediately to your OneCard.`
    );

    if (!confirmed) return;

    // 1. Remove from active purchases
    setPurchases((prev) => prev.filter((item) => item.id !== purchaseId));

    // 2. Update balances: add amount back to available, remove from escrow hold
    setUser((prev) => ({
      ...prev,
      oneCardBalance: prev.oneCardBalance + amount,
      escrowInHold: Math.max(0, prev.escrowInHold - amount),
    }));
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.name}
              </h1>
              <p className="text-sm text-gray-500">
                {user.email} •{" "}
                <span className="font-medium text-gray-700">
                  {user.department}
                </span>
              </p>
            </div>
          </div>

          <Link
            href="/sell"
            className="w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition text-center shadow-sm"
          >
            + Post New Item
          </Link>
        </div>

        {/* OneCard Escrow Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              OneCard Available Balance
            </p>
            <h2 className="text-3xl font-extrabold mt-2">
              ৳ {user.oneCardBalance.toLocaleString()}
            </h2>
            <p className="text-xs text-blue-100 mt-2">
              Ready for instant campus escrow purchases
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Funds Held in Escrow
            </p>
            <h2 className="text-3xl font-extrabold text-gray-800 mt-2">
              ৳ {user.escrowInHold.toLocaleString()}
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Will be released upon item handover verification
            </p>
          </div>
        </div>

        {/* Tabs section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gray-50/50 px-4">
            <button
              onClick={() => setActiveTab("listings")}
              className={`py-4 px-4 text-sm font-semibold border-b-2 transition ${
                activeTab === "listings"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              My Listings ({MOCK_MY_LISTINGS.length})
            </button>
            <button
              onClick={() => setActiveTab("purchases")}
              className={`py-4 px-4 text-sm font-semibold border-b-2 transition ${
                activeTab === "purchases"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Purchases ({purchases.length})
            </button>

            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-4 px-4 text-sm font-semibold border-b-2 transition ${
                activeTab === "transactions"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Escrow History
            </button>
          </div>

          <div className="p-6">
            {/* TAB 1: My Listings */}
            {activeTab === "listings" && (
              <div className="space-y-4">
                {MOCK_MY_LISTINGS.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition gap-4 bg-gray-50/30"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm font-bold text-blue-600 mt-0.5">
                        ৳ {item.price}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 font-medium text-xs rounded-full">
                        Buyer Waiting
                      </span>

                      <Link
                        href={`/verify?item=${encodeURIComponent(item.title)}&amount=${item.price}&buyer=Mohammed Omar`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                      >
                        Verify Buyer
                      </Link>

                      <button className="text-xs font-semibold text-gray-500 hover:text-gray-700 underline">
                        Edit
                      </button>

                      <button className="text-xs font-semibold text-red-500 hover:text-red-700 underline">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

           {/* TAB 2: Purchases */}
{activeTab === "purchases" && (
  <div className="space-y-4">
    {purchases.length === 0 ? (
      <div className="text-center py-12 space-y-3">
        <p className="text-gray-400 text-sm font-medium">No active escrow purchases.</p>
        <Link
          href="/"
          className="inline-block text-xs font-bold text-blue-600 hover:underline"
        >
          Browse Campus Listings →
        </Link>
      </div>
    ) : (
      purchases.map((purchase) => (
        <div
          key={purchase.id}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-gray-100 rounded-2xl bg-gray-50/30 hover:border-gray-200 transition gap-4"
        >
          {/* Left Column: Product Details */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-base">
                {purchase.title}
              </h3>
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full border border-amber-200">
                {purchase.status}
              </span>
            </div>

            <div className="text-xs text-gray-500 space-y-0.5">
              <p>Seller: <span className="font-semibold text-gray-800">{purchase.seller}</span></p>
              <p>Amount: <span className="font-bold text-blue-600">৳ {purchase.amount}</span></p>
              <p>Meetup: <span className="font-medium text-gray-700">{purchase.meetup}</span></p>
            </div>
          </div>

          {/* Right Column: PIN Widget + Cancel Action Stack */}
          <div className="flex flex-col items-center gap-2 w-full sm:w-auto shrink-0">
            {/* Verification PIN Box */}
            <div className="bg-blue-50/80 border border-blue-100 rounded-xl px-5 py-2.5 text-center w-full sm:w-56">
              <p className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">
                Verification PIN
              </p>
              <p className="text-2xl font-black text-blue-600 tracking-widest my-0.5">
                {purchase.pin}
              </p>
              <p className="text-[10px] text-gray-400">
                Show after item inspection
              </p>
            </div>

            {/* Cancel Action Button directly underneath */}
            <button
              onClick={() => handleCancelPurchase(purchase.id, purchase.amount, purchase.title)}
              className="text-xs font-semibold text-gray-400 hover:text-red-600 hover:underline transition py-1"
            >
              Cancel Trade
            </button>
          </div>

        </div>
      ))
    )}
  </div>
)}

            {/* TAB 3: Escrow History */}
            {activeTab === "transactions" && (
              <div className="space-y-4">
                {MOCK_TRANSACTIONS.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/30 gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            tx.type === "Bought"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {tx.type}
                        </span>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {tx.item}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {tx.id} • {tx.date}
                      </p>
                    </div>
                    <div className="sm:text-right space-y-2">
                      <p className="font-bold text-gray-900">৳ {tx.amount}</p>

                      <p className="text-xs font-medium text-amber-600">
                        {tx.status}
                      </p>

                      {tx.status === "Escrow Held (Pending Pickup)" && (
                        <Link
                          href="/verify"
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                        >
                          Verify Buyer
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}