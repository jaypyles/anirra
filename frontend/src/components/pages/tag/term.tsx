import { Anime } from "@/types/anime.types";
import { SearchResult } from "@/components/shared/search-result";
import styles from "./term.module.css";
import { SearchHeader } from "@/components/shared/search-result/header";
import { useRouter } from "next/router";

export type TagTermProps = {
  tagSearch: Anime[];
};

export const TagTerm = ({ tagSearch }: TagTermProps) => {
  const router = useRouter();
  const { tag } = router.query;

  console.log(`tag: ${tag}`);

  return (
    <div className={styles.container}>
      <SearchHeader>
        <h1 className={styles.title}>
          Anime tagged with <span className={styles.tag}>{tag}</span>
        </h1>
      </SearchHeader>
      {tagSearch.map((anime) => (
        <SearchResult key={anime.id} anime={anime} />
      ))}
    </div>
  );
};
