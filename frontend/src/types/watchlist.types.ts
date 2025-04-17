import { Anime } from "./anime.types";

export type Watchlist = {
  id: number;
  user_id: number;
  anime: Anime[];
};

export enum WatchlistStatus {
  WATCHING = "WATCHING",
  WATCHED = "WATCHED",
  PLANNING = "PLANNING",
  DROPPED = "DROPPED",
}
