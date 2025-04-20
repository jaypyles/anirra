import { fetch } from "@/lib/utils";
import { SonarrResult } from "@/types/sonarr-result.types";

export const searchSonarr = async (
  query: string,
  options?: { signal: AbortSignal }
) => {
  return await fetch<SonarrResult[]>(
    `/integrations/sonarr/search?query=${query}`,
    options
  );
};
