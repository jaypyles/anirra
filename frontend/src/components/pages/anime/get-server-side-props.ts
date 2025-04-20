import { GetServerSidePropsContext } from "next";

export default async function GetServerSideProps(
  context: GetServerSidePropsContext
) {
  const anime = await fetch(
    `${process.env.API_URL}/anime/${context.params?.id}`
  );

  const recommendations = await fetch(
    `${process.env.API_URL}/anime/recommendations?ids=${context.params?.id}&limit=20`
  );

  const recommendationsData = await recommendations.json();

  const animeData = await anime.json();

  const res = await fetch(
    `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
      animeData.title
    )}&limit=1`
  );

  const aniListResponse = await res.json();
  const aniListData = aniListResponse.data?.[0] || null;

  if (anime.status === 401) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      anime: { ...animeData, recommendations: recommendationsData },
      description: aniListData ? aniListData?.synopsis : null,
      watchlistStatus: animeData.watchlist_status,
    },
  };
}
