import { fetch } from "@/lib/utils";

export const rateAnime = async (animeId: number, rating: number) => {
  return await fetch(`/anime/rate?anime_id=${animeId}&rating=${rating}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
