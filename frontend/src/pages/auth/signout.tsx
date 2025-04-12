"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const signOutApi = async () => {
      try {
        const response = await fetch(`/api/logout`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to log out from the backend");
        }

        signOut({ callbackUrl: "/" });
      } catch (err) {
        console.error("Error during sign-out API call:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    signOutApi();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Signing you out...</h1>
        <p>Please wait while we log you out.</p>
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Failed to sign you out</h1>
        <p>{error}</p>
      </div>
    );
  }

  return null;
}
