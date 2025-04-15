import { useState } from "react";
import Image from "next/image";
import { Watchlist as WatchlistType } from "@/types/watchlist.types";
import styles from "./watchlist-table.module.css";
import { IconButton } from "@mui/material";
import { TrashIcon } from "lucide-react";
import { WatchlistService } from "@/lib/watchlist-service";
import { Anime } from "@/types/anime.types";

export const WatchlistTable = ({ watchlist }: { watchlist: WatchlistType }) => {
  const [animes, setAnimes] = useState<Anime[]>(watchlist.anime);
  const [selectedAnimeIds, setSelectedAnimeIds] = useState<Set<number>>(
    new Set()
  );

  const handleCheckboxChange = (animeId: number) => {
    setSelectedAnimeIds((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(animeId)) {
        newSelected.delete(animeId);
      } else {
        newSelected.add(animeId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAnimeIds(new Set(watchlist.anime.map((anime) => anime.id)));
    } else {
      setSelectedAnimeIds(new Set());
    }
  };

  const allSelected =
    watchlist.anime.length > 0 &&
    selectedAnimeIds.size === watchlist.anime.length;
  const someSelected =
    selectedAnimeIds.size > 0 && selectedAnimeIds.size < watchlist.anime.length;

  const getStatusClassName = (status: string = "") => {
    const statusLower = status.toLowerCase();
    if (statusLower === "watched") return styles.statusCompleted;
    if (statusLower === "watching") return styles.statusOngoing;
    if (statusLower === "planning") return styles.statusPlanned;
    if (statusLower === "dropped") return styles.statusDropped;
    return styles.statusDefault;
  };

  const handleDelete = async (animeId: number) => {
    try {
      await WatchlistService.deleteEntry(animeId);
      setAnimes((prevAnimes) =>
        prevAnimes.filter((anime) => anime.id !== animeId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th className={styles.checkboxCell}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={allSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = someSelected;
                  }
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
            <th className={styles.headerCell}>Name</th>
            <th className={styles.headerCell}>Episodes</th>
            <th className={styles.headerCell}>Release</th>
            <th className={styles.headerCell}>Status</th>
            <th className={styles.headerCell}>Progress</th>
            <th className={styles.headerCell}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {animes.map((anime) => (
            <tr
              key={anime.id}
              className={`${styles.tableRow} ${
                selectedAnimeIds.has(anime.id) ? styles.selectedRow : ""
              }`}
            >
              <td className={styles.checkboxCell}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedAnimeIds.has(anime.id)}
                  onChange={() => handleCheckboxChange(anime.id)}
                />
              </td>
              <td className={styles.cell}>
                <div className={styles.nameContainer}>
                  <div className={styles.imageWrapper}>
                    <Image
                      className={styles.animeImage}
                      src={anime.image_url}
                      alt={anime.title}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className={styles.titleContainer}>
                    <div className={styles.animeTitle}>
                      <a href={`/anime/${anime.id}`} className={styles.link}>
                        {anime.title}
                      </a>
                    </div>
                  </div>
                </div>
              </td>
              <td className={styles.cell}>{anime.episode_count}</td>
              <td className={styles.cell}>{anime.year}</td>
              <td className={styles.cell}>
                <span
                  className={`${styles.statusBadge} ${getStatusClassName(
                    anime.status
                  )}`}
                >
                  {anime.status.toLowerCase()}
                </span>
              </td>
              <td className={styles.cell}>
                <span
                  className={`${styles.statusBadge} ${getStatusClassName(
                    anime.watchlist_status
                  )}`}
                >
                  {anime.watchlist_status?.toLowerCase() || "not started"}
                </span>
              </td>
              <td className={styles.cell}>
                <IconButton onClick={() => handleDelete(anime.id)}>
                  <TrashIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
