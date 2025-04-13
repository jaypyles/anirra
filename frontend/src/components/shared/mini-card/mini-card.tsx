import { Anime } from "@/types/anime.types";
import classes from "./mini-card.module.css";
import Image from "next/image";

export const MiniCard = ({ anime }: { anime: Anime }) => {
  return (
    <div className={classes.miniCard}>
      <Image
        className={classes.miniCardImage}
        src={anime.image_url}
        alt={anime.title}
        fill
      />
      <div className={classes.miniCardContent}>
        <div className={classes.miniCardTitle}>{anime.title}</div>
        <div className={classes.miniCardScore}>{anime.rating.toFixed(2)}</div>
      </div>
    </div>
  );
};
