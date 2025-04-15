import Link from "next/link";

export const LoggedInUser = () => {
  return (
    <div>
      LoggedInUser
      <div>
        <Link href="/watchlist">Watchlist</Link>
      </div>
    </div>
  );
};
