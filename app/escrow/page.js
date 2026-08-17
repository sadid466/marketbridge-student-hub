"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";

export default function EscrowPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <EscrowContent />
    </Suspense>
  );
}

function EscrowContent() {
  const searchParams = useSearchParams();
  const tradeId = searchParams.get("tradeId");

  const [trade, setTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tradeId) {
      setError("No transaction ID provided.");
      setLoading(false);
      return;
    }

    fetch(`/api/escrow?tradeId=${tradeId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load transaction.");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setTrade(data.trade);
        } else {
          setError(data.error || "Transaction could not be found.");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tradeId]);

  if (loading) {
    return <PageLoading />;
  }

  if (error || !trade) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f3f4f6",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <p style={{ color: "#ef4444", fontWeight: "600", fontSize: "18px" }}>
          {error || "Escrow transaction not found."}
        </p>
        <Link
          href="/"
          style={{
            marginTop: "16px",
            color: "#2563eb",
            fontWeight: "600",
            textDecoration: "underline",
          }}
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const qrPayload = JSON.stringify({
    tradeId: trade._id,
    pin: trade.verificationPin,
    amount: trade.amount,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "500px",
          borderRadius: "16px",
          padding: "35px",
          boxShadow: "0 10px 25px rgba(0,0,0,.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2563eb",
            marginBottom: "8px",
          }}
        >
          MarketBridge
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Escrow Receipt
        </p>

        <hr />

        <Info title="Transaction ID" value={trade._id} />
        <Info title="Product" value={trade.productId?.title || "Campus Item"} />
        <Info title="Seller" value={trade.sellerId?.name || "DIU Student"} />
        <Info title="Buyer" value={trade.buyerId?.name || "Current User"} />
        <Info title="Amount" value={`৳ ${trade.amount}`} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "18px",
            marginBottom: "18px",
          }}
        >
          <strong>Status</strong>

          <span
            style={{
              background: trade.status === "Completed" ? "#DCFCE7" : "#FEF3C7",
              color: trade.status === "Completed" ? "#166534" : "#92400E",
              padding: "6px 12px",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            {trade.status}
          </span>
        </div>

        <hr />

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          <p style={{ color: "#666" }}>Verification PIN</p>

          <h1
            style={{
              letterSpacing: "6px",
              color: "#2563eb",
              fontSize: "38px",
            }}
          >
            {trade.verificationPin}
          </h1>

          <div
            style={{
              marginTop: "25px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <QRCode value={qrPayload} size={170} />
          </div>

          <p
            style={{
              marginTop: "20px",
              color: "#666",
              lineHeight: "24px",
            }}
          >
            Show this QR Code or 6-digit PIN to the seller during your campus
            meetup.
          </p>

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "30px",
            }}
          >
            <Link
              href="/dashboard?tab=purchases"
              style={{
                flex: 1,
                background: "#2563eb",
                color: "#fff",
                textDecoration: "none",
                padding: "14px",
                textAlign: "center",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              View Purchases
            </Link>

            <Link
              href="/"
              style={{
                flex: 1,
                background: "#f3f4f6",
                color: "#111827",
                textDecoration: "none",
                padding: "14px",
                textAlign: "center",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
        color: "#666",
        fontWeight: "500",
      }}
    >
      Loading escrow details...
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "18px",
      }}
    >
      <strong>{title}</strong>
      <span>{value}</span>
    </div>
  );
}