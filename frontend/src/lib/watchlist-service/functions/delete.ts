import { fetch } from "@/lib/utils";

export const deleteEntry = async (animeId: number) => {
  return await fetch(`/anime/watchlists?anime_id=${animeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
