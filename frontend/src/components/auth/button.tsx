import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export type AuthButtonProps = {
  toggleAuthModal: () => void;
};

export default function AuthButton({ toggleAuthModal }: AuthButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return (
      <button
        onClick={() => toggleAuthModal()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign In
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push("/auth/signout")}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign Out
      </button>
    </div>
  );
}
