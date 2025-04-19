import { GetServerSidePropsContext } from "next";

export default async function GetServerSideProps(
  context: GetServerSidePropsContext
) {
  const tagSearch = await fetch(
    `${process.env.API_URL}/anime/search/tags?query=${context.params?.tag}`
  );

  const tagSearchData = await tagSearch.json();

  return {
    props: {
      tagSearch: tagSearchData,
    },
  };
}
