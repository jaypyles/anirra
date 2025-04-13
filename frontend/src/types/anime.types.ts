export type Anime = {
  id: number;
  title: string;
  description: string;
  episode_count: number;
  status: string;
  year: number;
  genres: string[];
  rating: number;
  recommendations: Anime[];
  image_url: string;
  tags: string[];
};
