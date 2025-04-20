import { fetch } from "@/lib/utils";

export type SonarrAddOptions = {
  monitor: string;
  searchForMissingEpisodes: boolean;
  ignoreEpisodesWithFiles: boolean;
  ignoreEpisodesWithoutFiles: boolean;
};

export type SonarrAddRequest = {
  tvdbId: string;
  title: string;
  qualityProfileId: number;
  titleSlug: string;
  images: string[];
  seasons: number[];
  rootFolderPath: string;
  monitored: boolean;
  addOptions: SonarrAddOptions;
};

export const addSonarrSeries = async (request: SonarrAddRequest) => {
  return await fetch<object[]>(`/integrations/sonarr/add`, {
    method: "POST",
    data: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
