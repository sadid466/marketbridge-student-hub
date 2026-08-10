"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <VerifyContent />
    </Suspense>
  );
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const item = searchParams.get("item") || "Campus Item";
  const buyer = searchParams.get("buyer") || "Buyer";
  const amount = searchParams.get("amount") || "0";

  const [pin, setPin] = useState("");
  const [verified, setVerified] = useState(false);

  const correctPin = "123456";

  const handleVerify = () => {
    if (pin === correctPin) {
        localStorage.setItem("transactionCompleted", "true");
      setVerified(true);

      // Automatically return to Dashboard after 2.5 seconds
      setTimeout(() => {
        router.push("/dashboard?tab=purchases");
      }, 2500);
    } else {
      alert("Invalid Verification PIN");
    }
  };

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "60px auto",
        padding: "40px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 8px 25px rgba(0,0,0,.1)",
      }}
    >
      {!verified ? (
        <>
          <h1
            style={{
              textAlign: "center",
              color: "#2563eb",
              marginBottom: "10px",
            }}
          >
            Verify Transaction
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "30px",
            }}
          >
            Confirm the campus handover by entering the buyer&apos;s 6-digit PIN.
          </p>

          {/* Transaction Information */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "30px",
            }}
          >
            <Info title="Buyer" value={buyer} />
            <Info title="Product" value={item} />
            <Info title="Amount" value={`৳ ${amount}`} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "18px",
              }}
            >
              <strong>Status</strong>

              <span
                style={{
                  background: "#FEF3C7",
                  color: "#92400E",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                }}
              >
                Escrow Hold
              </span>
            </div>
          </div>

          {/* PIN */}
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            Enter Verification PIN
          </label>

          <input
            type="text"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="123456"
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "24px",
              letterSpacing: "8px",
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={handleVerify}
            style={{
              width: "100%",
              marginTop: "30px",
              padding: "15px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            Verify Transaction
          </button>
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "70px",
              color: "#16a34a",
            }}
          >
            ✓
          </div>

          <h2
            style={{
              color: "#16a34a",
            }}
          >
            Payment Released Successfully
          </h2>

          <p
            style={{
              color: "#666",
              marginTop: "15px",
            }}
          >
            Escrow funds have been released to the seller&apos;s OneCard account.
          </p>

          <div
            style={{
              marginTop: "30px",
              background: "#ECFDF5",
              border: "1px solid #10B981",
              borderRadius: "12px",
              padding: "25px",
            }}
          >
            <h3>Seller OneCard Updated</h3>

            <h1
              style={{
                color: "#059669",
                margin: "10px 0",
              }}
            >
              + ৳ {amount}
            </h1>

            <p>Returning to Dashboard...</p>
          </div>

          <Link
            href="/dashboard"
            style={{
              display: "inline-block",
              marginTop: "30px",
              background: "#2563eb",
              color: "#fff",
              padding: "14px 30px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      )}
    </main>
  );
}

function PageLoading() {
  return <div className="min-h-screen bg-gray-50" />;
}

function Info({ title, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px",
      }}
    >
      <strong>{title}</strong>
      <span>{value}</span>
    </div>
  );
}
