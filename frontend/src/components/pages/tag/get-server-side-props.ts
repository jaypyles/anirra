import { GetServerSidePropsContext } from "next";

export default async function GetServerSideProps(
  context: GetServerSidePropsContext
) {
  const { offset } = context.query;

  const offsetValue = parseInt(offset as string);

  const url = new URL(
    `/anime/search/tags?query=${context.params?.tag}`,
    process.env.API_URL || "http://localhost:8000"
  );

  if (offsetValue > 0) {
    url.searchParams.set("offset", offsetValue.toString());
  }

  const tagSearch = await fetch(url.toString());

  const tagSearchData = await tagSearch.json();

  return {
    props: {
      tagSearch: tagSearchData.animes,
      totalCount: tagSearchData.total_count,
    },
  };
}
