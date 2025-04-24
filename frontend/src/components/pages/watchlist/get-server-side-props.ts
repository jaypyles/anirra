import { getJwt } from "@/lib/utils";
import { GetServerSidePropsContext, NextApiRequest } from "next";

export default async function GetServerSideProps(
  context: GetServerSidePropsContext
) {
  const jwt = await getJwt(context.req as NextApiRequest);

  if (!jwt) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  const watchlist = await fetch(
    `${process.env.API_URL || "http://127.0.0.1:8000"}/anime/watchlists`,
    {
      headers: {
        Authorization: `Bearer ${jwt.access_token}`,
      },
    }
  );

  const watchlistData = await watchlist.json();

  return {
    props: {
      watchlist: watchlistData,
    },
  };
}
