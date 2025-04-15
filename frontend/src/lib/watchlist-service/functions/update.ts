import { fetch } from "@/lib/utils";

export const update = async (animeIds: number[], status: string) => {
  return await fetch("/anime/watchlists", {
    method: "PUT",
    data: JSON.stringify({ anime: animeIds, request: "update", status }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
