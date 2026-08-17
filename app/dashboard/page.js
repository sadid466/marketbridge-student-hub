"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-500 font-medium">Loading Dashboard...</p></div>}>
      <DashboardContent />
    </Suspense>
  );
}
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status, update } = useSession();

  const defaultTab = searchParams.get("tab") || "listings";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Dynamic States from DB
  const [myListings, setMyListings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // QR Scanner Modal State for Seller Handover
  const [verifyingTrade, setVerifyingTrade] = useState(null);
  const [enteredPin, setEnteredPin] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [verifyingStatus, setVerifyingStatus] = useState({ loading: false, error: null, success: null });

  // Fetch real items and escrow records
  const loadDashboardData = () => {
    if (session?.user?.id) {
      setLoading(true);
      Promise.all([
        fetch(`/api/items?sellerId=${session.user.id}`).then((res) => {
          if (!res.ok) throw new Error("Failed to load listings");
          return res.json();
        }),
        fetch(`/api/escrow`).then((res) => {
          if (!res.ok) throw new Error("Failed to load escrow data");
          return res.json();
        }),
      ])
        .then(([itemsData, escrowData]) => {
          if (itemsData.success) {
            setMyListings(itemsData.items || []);
          }
          if (escrowData.success) {
            setPurchases(escrowData.purchases || []);
            setTransactions(escrowData.history || []);
          }
        })
        .catch((err) => {
          console.error("Dashboard fetch error:", err);
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.id) {
      loadDashboardData();
    }
  }, [session, status, router]);

  const handleDeleteListing = async (id, title) => {
    const confirmed = window.confirm(
      `Delete "${title}"? This action cannot be undone.`
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

      setMyListings((prev) => prev.filter((item) => item._id !== id));
      alert("Listing deleted successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

  // Handover Verification Logic (Seller scans buyer's QR or enters PIN)
const handleVerifyEscrow = async (pinToVerify) => {
  const pin = (pinToVerify || enteredPin).trim();
  if (!pin) {
    setVerifyingStatus({ loading: false, error: "Please enter the 6-digit PIN.", success: null });
    return;
  }

  setVerifyingStatus({ loading: true, error: null, success: null });

  try {

    const res = await fetch("/api/escrow/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tradeId: verifyingTrade?._id || verifyingTrade?.activeTradeId,
        pin: pin,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || data.error || "Verification failed");
    }

    setVerifyingStatus({ loading: false, error: null, success: "Handover verified! Escrow funds released." });
    setIsCameraActive(false);

    if (update) await update();
    setTimeout(() => {
      setVerifyingTrade(null);
      setEnteredPin("");
      setVerifyingStatus({ loading: false, error: null, success: null });
      loadDashboardData();
    }, 1500);
  } catch (err) {
    setVerifyingStatus({ loading: false, error: err.message, success: null });
  }
};

  // QR Code Scanner detection handler
  const handleQrScan = (detectedCodes) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const rawText = detectedCodes[0].rawValue;
      let extractedPin = rawText;

      try {
        const parsed = JSON.parse(rawText);
        if (parsed.pin) extractedPin = parsed.pin;
      } catch {
        extractedPin = rawText.trim();
      }

      setEnteredPin(extractedPin);
      setIsCameraActive(false);
      handleVerifyEscrow(extractedPin);
    }
  };

  if (status === "loading" || loading) {
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
              ৳ {(session.user.oneCardBalance ?? 0).toLocaleString()}
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
              ৳ {(session.user.escrowInHold ?? 0).toLocaleString()}
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
              Escrow History ({transactions.length})
            </button>
          </div>

          <div className="p-6">
            {/* TAB 1: My Listings */}
            {activeTab === "listings" && (
              <div className="space-y-4">
                {myListings.length === 0 ? (
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
                        <span
                          className={`px-3 py-1 font-medium text-xs rounded-full border ${
                            item.status === "Pending"
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : item.status === "Sold"
                              ? "bg-gray-100 text-gray-700 border-gray-200"
                              : "bg-green-100 text-green-800 border-green-200"
                          }`}
                        >
                          {item.status || "Active"}
                        </span>

                        {/* Scanner / Verification Action for Pending Trades */}
                        {item.status === "Pending" && (
                          <button
                            onClick={() => {
                              setVerifyingTrade(item);
                              setIsCameraActive(false);
                              setEnteredPin("");
                              setVerifyingStatus({ loading: false, error: null, success: null });
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>📷</span> Scan Buyer QR / Verify
                          </button>
                        )}

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
                  purchases.map((trade) => (
                    <div
                      key={trade._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-gray-100 rounded-2xl bg-gray-50/30 hover:border-gray-200 transition gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-base">
                            {trade.productId?.title || "Campus Item"}
                          </h3>
                          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full border border-amber-200">
                            {trade.status}
                          </span>
                        </div>

                        <div className="text-xs text-gray-500 space-y-0.5">
                          <p>
                            Seller:{" "}
                            <span className="font-semibold text-gray-800">
                              {trade.sellerId?.name || "DIU Student"}
                            </span>
                          </p>
                          <p>
                            Amount:{" "}
                            <span className="font-bold text-blue-600">
                              ৳ {trade.amount}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2 w-full sm:w-auto shrink-0">
                        <Link
                          href={`/escrow?tradeId=${trade._id}`}
                          className="bg-blue-50/80 border border-blue-100 hover:bg-blue-100/80 transition rounded-xl px-5 py-2.5 text-center w-full sm:w-56"
                        >
                          <p className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">
                            Verification PIN
                          </p>
                          <p className="text-2xl font-black text-blue-600 tracking-widest my-0.5">
                            {trade.verificationPin}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            Click to view Escrow QR
                          </p>
                        </Link>
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
                    No completed transaction history yet.
                  </p>
                ) : (
                  transactions.map((tx) => (
                    <div
                      key={tx._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/30 gap-4"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {tx.productId?.title || "Handover Transaction"}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          ID: {tx._id} • {new Date(tx.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            tx.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.status}
                        </span>
                        <p className="font-bold text-gray-900">৳ {tx.amount}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SELLER QR SCANNER / PIN VERIFICATION MODAL */}
      {verifyingTrade && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Verify Handover</h3>
                <p className="text-xs text-gray-500">Scan buyer's QR code to release escrow funds</p>
              </div>
              <button
                onClick={() => setVerifyingTrade(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Camera Viewfinder */}
            {isCameraActive ? (
              <div className="space-y-3">
                <div className="overflow-hidden rounded-xl border border-gray-300 bg-black aspect-square">
                  <Scanner
                    onScan={handleQrScan}
                    onError={(err) => console.error("Scanner Error:", err)}
                    components={{ finder: true }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsCameraActive(false)}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                >
                  Close Camera
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsCameraActive(true)}
                className="w-full py-4 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 text-blue-600 flex flex-col items-center justify-center gap-2 transition cursor-pointer"
              >
                <span className="text-2xl">📷</span>
                <span className="text-xs font-bold">Open Camera to Scan Buyer's Screen</span>
              </button>
            )}

            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-gray-200"></div>
              <span className="shrink mx-3 text-gray-400 text-xs font-medium uppercase">Or enter 6-digit pin</span>
              <div className="grow border-t border-gray-200"></div>
            </div>

            {/* Manual PIN Input */}
            <div>
              <input
                type="text"
                maxLength={6}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="0 0 0 0 0 0"
                className="w-full text-center text-2xl tracking-widest font-mono font-bold py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {verifyingStatus.error && (
              <p className="text-xs text-red-600 text-center font-medium bg-red-50 py-2 rounded-lg">
                {verifyingStatus.error}
              </p>
            )}

            {verifyingStatus.success && (
              <p className="text-xs text-emerald-600 text-center font-medium bg-emerald-50 py-2 rounded-lg">
                {verifyingStatus.success}
              </p>
            )}

            <button
              onClick={() => handleVerifyEscrow()}
              disabled={verifyingStatus.loading || enteredPin.length !== 6}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {verifyingStatus.loading ? "Verifying & Transferring..." : "Confirm & Claim Payment"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}