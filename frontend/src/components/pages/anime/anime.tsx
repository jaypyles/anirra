import { Anime as AnimeType } from "@/types/anime.types";
import { AnimePage } from "@/components/shared/anime-page/anime-page";

import classes from "./anime.module.css";
import { WatchlistStatus } from "@/types/watchlist.types";

export type AnimeProps = {
  anime: AnimeType;
  watchlistStatus?: WatchlistStatus;
};

export const Anime = ({ anime, watchlistStatus }: AnimeProps) => {
  console.log(anime.recommendations.length);
  return (
    <AnimePage.Root anime={anime} className={classes.root}>
      <AnimePage.Header anime={anime} className={classes.header} />
      <div className={classes.body}>
        <div className={classes.contentContainer}>
          <AnimePage.Picture anime={anime} className={classes.picture} />
          <AnimePage.Metadata
            anime={anime}
            watchlistStatus={watchlistStatus}
            className={classes.metadata}
          />
        </div>

        <AnimePage.Recommendations
          anime={anime}
          className={classes.recommendations}
        />
      </div>
      <AnimePage.Footer anime={anime} className={classes.footer} />
    </AnimePage.Root>
  );
};
