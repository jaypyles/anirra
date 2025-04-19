import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Watchlist as WatchlistType } from "@/types/watchlist.types";
import styles from "./watchlist-table.module.css";
import { Button, IconButton } from "@mui/material";
import { TrashIcon } from "lucide-react";
import { WatchlistService } from "@/lib/watchlist-service";
import { Anime } from "@/types/anime.types";
import { toast } from "react-toastify";

export const WatchlistTable = ({ watchlist }: { watchlist: WatchlistType }) => {
  const [animes, setAnimes] = useState<Anime[]>(watchlist.anime);
  const [selectedAnimeIds, setSelectedAnimeIds] = useState<Set<number>>(
    new Set()
  );
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

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

  const handleDelete = async (animeId: number, animeTitle: string) => {
    try {
      await WatchlistService.deleteEntry(animeId);
      setAnimes((prevAnimes) =>
        prevAnimes.filter((anime) => anime.id !== animeId)
      );
      toast.success(`${animeTitle} removed from watchlist`);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const startIndex = currentPage * itemsPerPage;
  const currentAnimes = animes.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(animes.length / itemsPerPage);

  useEffect(() => {
    if (currentAnimes.length === 0 && currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  }, [currentAnimes, currentPage, handlePageChange]);

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
          {currentAnimes.map((anime) => (
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
                <IconButton onClick={() => handleDelete(anime.id, anime.title)}>
                  <TrashIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          sx={{
            backgroundColor: "var(--purple-primary)",
          }}
        >
          <span>Previous</span>
        </Button>
        Page {currentPage + 1} of {totalPages}
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          sx={{
            backgroundColor: "var(--purple-primary)",
          }}
        >
          <span>Next</span>
        </Button>
      </div>
    </div>
  );
};
