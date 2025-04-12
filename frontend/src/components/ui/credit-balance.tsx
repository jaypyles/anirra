import React from "react";
import useUser from "@/hooks/useUser";
import { useSession } from "next-auth/react";
import { CSSProperties } from "react";

export const CreditBalance = () => {
  const { user } = useUser();
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="bg-blue-500 py-2 px-4" style={buttonStyle}>
      Credit Balance: {user?.creditBalance}
    </div>
  );
};

const buttonStyle: CSSProperties = {
  display: "inline-block",
  color: "#fff",
  borderRadius: "5px",
  textAlign: "center",
  userSelect: "none",
};
