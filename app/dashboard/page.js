"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  return (
   
      <DashboardContent />
    
  );
}

function DashboardContent() {
  const handleDeleteListing = async (id, title) => {
    const confirmed = window.confirm(
      `Delete "${title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete");
      }

      // Remove from UI immediately
      setMyListings((prev) => prev.filter((item) => item._id !== id));

      alert("Listing deleted successfully.");
    } catch (err) {
      alert(err.message);
    }
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const defaultTab = searchParams.get("tab") || "listings";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Dynamic States initialized from DB
  const [myListings, setMyListings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);

  const [balanceAdjustment, setBalanceAdjustment] = useState({
    oneCardBalance: 0,
    escrowInHold: 0,
  });
  const userState = {
    oneCardBalance:
      (session?.user?.oneCardBalance ?? 0) + balanceAdjustment.oneCardBalance,
    escrowInHold: Math.max(
      0,
      (session?.user?.escrowInHold ?? 0) + balanceAdjustment.escrowInHold,
    ),
  };

  // Fetch real items created by the logged-in student
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user) {
      // Fetch user's real products safely
      fetch(`/api/items?sellerId=${session.user.id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`API returned status ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            setMyListings(data.items || []);
          }
        })
        .catch((err) => {
          console.error("Failed to load listings:", err);
          setMyListings([]); // Fallback gracefully if route does not exist
        })
        .finally(() => setLoadingListings(false));
    }
  }, [session, status, router]);

  // Handle Cancel Trade / Refund
  const handleCancelPurchase = (purchaseId, amount, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel the purchase for "${title}"? ৳${amount} will be refunded immediately to your OneCard.`,
    );

    if (!confirmed) return;

    setPurchases((prev) => prev.filter((item) => item.id !== purchaseId));
    setBalanceAdjustment((prev) => ({
      ...prev,
      oneCardBalance: prev.oneCardBalance + amount,
      escrowInHold: Math.max(0, prev.escrowInHold - amount),
    }));
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center">
              {session.user.name?.[0]?.toUpperCase() || "S"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {session.user.name}
              </h1>
              <p className="text-sm text-gray-500">
                {session.user.email} •{" "}
                <span className="font-medium text-gray-700">
                  ID: {session.user.studentId || "DIU Student"}
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
              ৳ {userState.oneCardBalance.toLocaleString()}
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
              ৳ {userState.escrowInHold.toLocaleString()}
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
              className={`py-4 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === "listings"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              My Listings ({myListings.length})
            </button>
            <button
              onClick={() => setActiveTab("purchases")}
              className={`py-4 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === "purchases"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Purchases ({purchases.length})
            </button>

            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-4 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === "transactions"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Escrow History
            </button>
          </div>

          <div className="p-6">
            {/* TAB 1: My Listings (Real Data) */}
            {activeTab === "listings" && (
              <div className="space-y-4">
                {loadingListings ? (
                  <p className="text-center py-8 text-gray-400 text-sm">
                    Fetching your active listings...
                  </p>
                ) : myListings.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <p className="text-gray-400 text-sm font-medium">
                      You haven&apos;t listed any items for sale yet.
                    </p>
                    <Link
                      href="/sell"
                      className="inline-block text-xs font-bold text-blue-600 hover:underline"
                    >
                      Post your first item →
                    </Link>
                  </div>
                ) : (
                  myListings.map((item) => (
                    <div
                      key={item._id}
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
                        <span className="px-3 py-1 bg-green-100 text-green-800 border border-green-200 font-medium text-xs rounded-full">
                          {item.status || "Available"}
                        </span>

                        <Link
                          href={`/verify?item=${encodeURIComponent(item.title)}&amount=${item.price}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                        >
                          Verify Handover
                        </Link>

                        <button
                          onClick={() =>
                            handleDeleteListing(item._id, item.title)
                          }
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition shadow-sm cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: Purchases */}
            {activeTab === "purchases" && (
              <div className="space-y-4">
                {purchases.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <p className="text-gray-400 text-sm font-medium">
                      No active escrow purchases.
                    </p>
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
                          <p>
                            Seller:{" "}
                            <span className="font-semibold text-gray-800">
                              {purchase.seller}
                            </span>
                          </p>
                          <p>
                            Amount:{" "}
                            <span className="font-bold text-blue-600">
                              ৳ {purchase.amount}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2 w-full sm:w-auto shrink-0">
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

                        <button
                          onClick={() =>
                            handleCancelPurchase(
                              purchase.id,
                              purchase.amount,
                              purchase.title,
                            )
                          }
                          className="text-xs font-semibold text-gray-400 hover:text-red-600 hover:underline transition py-1 cursor-pointer"
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
                {transactions.length === 0 ? (
                  <p className="text-center py-12 text-gray-400 text-sm">
                    No transaction history yet.
                  </p>
                ) : (
                  transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/30 gap-4"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {tx.item}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {tx.id} • {tx.date}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">৳ {tx.amount}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500 font-medium">Loading dashboard...</p>
    </div>
  );
}
