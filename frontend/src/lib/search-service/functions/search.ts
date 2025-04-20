import { fetch } from "@/lib/utils";

export const search = async (
  query: string,
  options: { signal: AbortSignal }
) => {
  return await fetch(`/anime/search?query=${query}&limit=5&offset=0`, options);
};
