import { fetch } from "@/lib/utils";
import { RadarrResult } from "@/types/radarr-result.types";

export const searchRadarr = async (
  query: string,
  options?: { signal: AbortSignal }
) => {
  return await fetch<RadarrResult[]>(
    `/integrations/radarr/search?query=${query}`,
    options
  );
};
