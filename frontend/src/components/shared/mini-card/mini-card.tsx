import { Anime } from "@/types/anime.types";
import classes from "./mini-card.module.css";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const MiniCard = ({
  anime,
  className,
}: {
  anime: Anime;
  className?: string;
}) => {
  return (
    <div className={cn(classes.miniCard, className)} data-testid="mini-card">
      <Image
        className={classes.miniCardImage}
        src={anime.image_url}
        alt={anime.title}
        fill
      />
      <div className={classes.miniCardContent}>
        <div className={classes.miniCardTitle}>
          <a href={`/anime/${anime.id}`}>{anime.title}</a>
        </div>
        <div className={classes.miniCardScore}>
          {anime.rating ? anime.rating.toFixed(2) : "N/A"}
        </div>
      </div>
    </div>
  );
};
