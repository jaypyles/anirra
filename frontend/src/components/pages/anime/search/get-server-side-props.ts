import { getJwt } from "@/lib/utils";
import { GetServerSidePropsContext, NextApiRequest } from "next";

export default async function getServerSideProps(
  context: GetServerSidePropsContext
) {
  const jwt = await getJwt(context.req as NextApiRequest);
  const term = context.params?.term;

  const searchTerm = Array.isArray(term) ? term.join("/") : term;

  if (!searchTerm) {
    return {
      props: {
        animeSearch: [],
        totalCount: 0,
      },
    };
  }

  const animeSearch = await fetch(
    `${
      process.env.API_URL
    }/anime/search?limit=10&total_count=true&query=${encodeURIComponent(
      searchTerm
    )}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  const animeSearchData = await animeSearch.json();
  console.log(animeSearchData);

  return {
    props: {
      animeSearch: animeSearchData.animes,
      totalCount: animeSearchData.total_count,
    },
  };
}
