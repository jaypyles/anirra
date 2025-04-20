import { Anime } from "@/types/anime.types";
import { SearchResult } from "@/components/shared/search-result";
import styles from "./term.module.css";
import { SearchHeader } from "@/components/shared/search-result/header";
import { useRouter } from "next/router";
import { useMemo } from "react";
import Head from "next/head";

export type TagTermProps = {
  tagSearch: Anime[];
  totalCount: number;
};

export const TagTerm = ({ tagSearch, totalCount }: TagTermProps) => {
  const router = useRouter();
  const { tag, offset } = router.query;

  const itemsPerPage = 10;

  const tagTerm = useMemo(() => {
    if (!tag) return "";
    return Array.isArray(tag) ? tag.join("/") : tag;
  }, [tag]);

  const currentPage = useMemo(() => {
    const offsetValue = parseInt(offset as string);
    return isNaN(offsetValue) ? 0 : offsetValue / itemsPerPage;
  }, [offset]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    const url = new URL(`/tag/${tagTerm}`, window.location.origin);
    const offset = newPage * itemsPerPage;
    if (offset > 0) {
      url.searchParams.set("offset", offset.toString());
    }

    router.push(url.toString());
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
        <title>
          {totalCount} anime tagged with {tagTerm}
        </title>
      </Head>
      <div className={styles.container}>
        <SearchHeader>
          <h1 className={styles.title}>
            {totalCount} Anime tagged with{" "}
            <span className={styles.tag}>{tagTerm}</span>
          </h1>
        </SearchHeader>
        <div className={styles.resultsContainer}>
          {tagSearch.map((anime) => (
            <SearchResult key={anime.id} anime={anime} />
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
