export type SonarrResult = {
  id: number;
  title: string;
  images: SonarrImage[];
  seasons: SonarrSeason[];
  ratings: SonarrRating;
  statistics: SonarrStatistics;
};

export type SonarrStatistics = {
  episodeFileCount: number;
  episodeCount: number;
  totalEpisodeCount: number;
  sizeOnDisk: number;
  percentOfEpisodes: number;
  seasonCount: number;
};

export type SonarrRating = {
  votes: number;
  value: number;
};

export type SonarrImage = {
  coverType: string;
  url: string;
  remoteUrl: string;
};

export type SonarrSeason = {
  seasonNumber: number;
  monitored: boolean;
};
