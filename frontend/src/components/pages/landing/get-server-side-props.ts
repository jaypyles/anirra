import { getJwt } from "@/lib/utils";
import { Anime } from "@/types/anime.types";

import { GetServerSidePropsContext, NextApiRequest } from "next";

export default async function GetServerSideProps(
  context: GetServerSidePropsContext
) {
  const jwt = await getJwt(context.req as NextApiRequest);

  if (!jwt) {
    return {
      redirect: { destination: "/api/auth/signin", permanent: false },
    };
  }

  console.log(jwt);

  const stats = await fetch(`${process.env.API_URL}/anime/stats`, {
    headers: {
      Authorization: `Bearer ${jwt.access_token}`,
    },
  });

  const statsData = await stats.json();

  const animeWatched = await fetch(`${process.env.API_URL}/anime/watchlists`, {
    headers: {
      Authorization: `Bearer ${jwt.access_token}`,
    },
  });

  const animeWatchedData = await animeWatched.json();
  if (animeWatched.status === 401) {
    return {
      redirect: { destination: "/api/auth/signin", permanent: false },
    };
  }

  const animeRecommendations = await fetch(
    `${process.env.API_URL}/anime/recommendations?${animeWatchedData.anime
      .map((anime: Anime) => `ids=${anime.id}`)
      .join("&")}&limit=20`,
    {
      headers: {
        Authorization: `Bearer ${jwt.access_token}`,
      },
    }
  );

  if (animeRecommendations.status === 401) {
    return {
      redirect: { destination: "/api/auth/signin", permanent: false },
    };
  }

  const animeRecommendationsData = await animeRecommendations.json();

  return {
    props: {
      stats: statsData,
      recommendedAnime: animeRecommendationsData,
    },
  };
}
