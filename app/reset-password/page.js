"use client";

import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div>
      <h1>Reset Password</h1>
      <p>Token: {token}</p>
    </div>
  );
}