import { GetServerSidePropsContext } from "next";

export default async function GetServerSideProps(
  context: GetServerSidePropsContext
) {
  const anime = await fetch(
    `${process.env.API_URL}/anime/${context.params?.id}`
  );

  const recommendations = await fetch(
    `${process.env.API_URL}/anime/recommendations?ids=${context.params?.id}`
  );

  const recommendationsData = await recommendations.json();

  const animeData = await anime.json();

  return {
    props: {
      anime: { ...animeData, recommendations: recommendationsData },
      watchlistStatus: animeData.watchlist_status,
    },
  };
}
