"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";

export default function EscrowPage() {
  const searchParams = useSearchParams();

  const transaction = {
    transactionId: "MB-2026-0001",
    product: searchParams.get("item") || "Campus Item",
    seller: searchParams.get("seller") || "DIU Student",
    buyer: searchParams.get("buyer") || "Current User",
    amount: searchParams.get("amount") || 0,
    pin: "123456",
    status: "Escrow Hold",
  };

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

        <Info title="Transaction ID" value={transaction.transactionId} />
        <Info title="Product" value={transaction.product} />
        <Info title="Seller" value={transaction.seller} />
        <Info title="Buyer" value={transaction.buyer} />
        <Info title="Amount" value={`৳ ${transaction.amount}`} />

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
              background: "#FEF3C7",
              color: "#92400E",
              padding: "6px 12px",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            {transaction.status}
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
            {transaction.pin}
          </h1>

          <div
            style={{
              marginTop: "25px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <QRCode value={JSON.stringify(transaction)} size={170} />
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
