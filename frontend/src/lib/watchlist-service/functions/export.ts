import { fetch } from "@/lib/utils";
import { Anime } from "@/types/anime.types";

export const exportWatchlist = async () => {
  return await fetch<Record<string, Anime[]>>(`/integrations/export`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
