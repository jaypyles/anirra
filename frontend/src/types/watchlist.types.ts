import { Anime } from "./anime.types";

export type Watchlist = {
  id: number;
  user_id: number;
  anime: Anime[];
};
