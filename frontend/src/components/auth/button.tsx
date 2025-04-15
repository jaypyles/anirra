import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import classes from "./button.module.css";

export type AuthButtonProps = {
  toggleAuthModal: () => void;
};

export default function AuthButton({ toggleAuthModal }: AuthButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return (
      <button onClick={() => toggleAuthModal()} className={classes.authButton}>
        Sign In
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push("/auth/signout")}
        className={classes.authButton}
      >
        Sign Out
      </button>
    </div>
  );
}
