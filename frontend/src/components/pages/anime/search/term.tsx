import { Anime } from "@/types/anime.types";
import { SearchResult } from "@/components/shared/search-result";
import styles from "./term.module.css";
import { SearchHeader } from "@/components/shared/search-result/header";
import { useRouter } from "next/router";
import { useMemo } from "react";
import Head from "next/head";

export type SearchTermProps = {
  animeSearch: Anime[];
  totalCount: number;
};

export const SearchTerm = ({ animeSearch, totalCount }: SearchTermProps) => {
  const router = useRouter();
  const { term } = router.query;

  const searchTerm = useMemo(() => {
    if (!term) return "";
    return Array.isArray(term) ? term.join("/") : term;
  }, [term]);

  return (
    <>
      <Head>
        <title>Search results for {searchTerm}</title>
      </Head>
      <div className={styles.container}>
        <SearchHeader>
          <h1 className={styles.title}>
            {totalCount} Search results for{" "}
            <span className={styles.tag}>{searchTerm}</span>
          </h1>
        </SearchHeader>
        <div className={styles.resultsContainer}>
          {animeSearch.map((anime) => (
            <SearchResult key={anime.id} anime={anime} />
          ))}
        </div>
      </div>
    </>
  );
};
