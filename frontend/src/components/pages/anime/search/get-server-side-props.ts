import { getJwt } from "@/lib/utils";
import { GetServerSidePropsContext, NextApiRequest } from "next";

export default async function getServerSideProps(
  context: GetServerSidePropsContext
) {
  const jwt = await getJwt(context.req as NextApiRequest);
  const term = context.params?.term;
  const offset = context.query?.offset;

  const searchTerm = Array.isArray(term) ? term.join("/") : term;

  if (!searchTerm) {
    return {
      props: {
        animeSearch: [],
        totalCount: 0,
      },
    };
  }

  const url = new URL(
    `${
      process.env.API_URL || "http://localhost:8000"
    }/anime/search?limit=10&total_count=true&query=${encodeURIComponent(
      searchTerm
    )}`
  );

  if (offset) {
    url.searchParams.set("offset", offset as string);
  }

  const animeSearch = await fetch(url, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const animeSearchData = await animeSearch.json();

  return {
    props: {
      animeSearch: animeSearchData.animes,
      totalCount: animeSearchData.total_count,
    },
  };
}
