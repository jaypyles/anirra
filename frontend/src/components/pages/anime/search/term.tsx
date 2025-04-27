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
  const { term, offset } = router.query;

  const itemsPerPage = 10;

  const searchTerm = useMemo(() => {
    if (!term) return "";
    return Array.isArray(term) ? term.join("/") : term;
  }, [term]);

  const currentPage = useMemo(() => {
    const offsetValue = parseInt(offset as string);
    return isNaN(offsetValue) ? 0 : offsetValue / itemsPerPage;
  }, [offset]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    router.push(`/anime/search/${term}?offset=${newPage * itemsPerPage}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      handlePageChange(currentPage + 1);
    }
  };

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
        <div className={styles.results}>
          {animeSearch.map((anime) => (
            <SearchResult key={anime.title} anime={anime} />
          ))}
        </div>
        <div className={styles.pagination}>
          <button onClick={handlePreviousPage} disabled={currentPage === 0}>
            Previous
          </button>
          <span className={styles.paginationText}>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};
