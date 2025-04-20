import { fetch } from "@/lib/utils";

export type RadarrAddOptions = {
  monitor: string;
  searchForMovie: boolean;
};

export type RadarrAddRequest = {
  tmdbId: string;
  title: string;
  qualityProfileId: number;
  titleSlug: string;
  images: string[];
  rootFolderPath: string;
  monitored: boolean;
  addOptions: RadarrAddOptions;
};

export const addRadarrSeries = async (request: RadarrAddRequest) => {
  return await fetch<object[]>(`/integrations/radarr/add`, {
    method: "POST",
    data: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
