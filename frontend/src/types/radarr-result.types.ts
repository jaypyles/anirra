export type RadarrResult = {
  id: number;
  title: string;
  images: RadarrImage[];
  ratings: RadarrRating;
  genres: string[];
};

export type RadarrRating = {
  tmdb: {
    value: number;
  };
};

export type RadarrImage = {
  coverType: string;
  url: string;
  remoteUrl: string;
};

export type RadarrSeason = {
  seasonNumber: number;
  monitored: boolean;
};
