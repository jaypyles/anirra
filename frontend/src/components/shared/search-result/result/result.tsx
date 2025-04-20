import styles from "./result.module.css";
import { Anime } from "@/types/anime.types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export type SearchResultProps = {
  anime: Anime;
  className?: string;
};

export const SearchResult = ({ anime, className }: SearchResultProps) => {
  return (
    <div className={cn(styles.result, className)}>
      <div className={styles.image}>
        <Image
          src={anime.image_url}
          alt={anime.title}
          width={300}
          height={400}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          <Link href={`/anime/${anime.id}`}>{anime.title}</Link>
        </div>
        <div className={styles.meta}>
          <span className={styles.year}>{anime.year}</span>
          <span className={styles.dot}>•</span>
          <span className={styles.episodes}>
            {anime.episode_count} episodes
          </span>
          <span className={styles.dot}>•</span>
          <span className={styles.status}>{anime.status}</span>
        </div>
        <div className={styles.rating}>
          <span className={styles.star}>★</span>{" "}
          {anime.rating ? anime.rating.toFixed(2) : "N/A"}
        </div>
        <div className={styles.genres}>
          {anime.tags && anime.tags.length > 0
            ? anime.tags.slice(0, 3).join(", ")
            : "No genres available"}
        </div>
        <div className={styles.description}>
          {anime.description && anime.description.length > 120
            ? `${anime.description.substring(0, 120)}...`
            : anime.description}
        </div>
      </div>
    </div>
  );
};
