import classes from "./landing.module.css";
import { useSession } from "next-auth/react";
import useUser from "@/hooks/useUser";
import { MiniCard } from "@/components/shared/mini-card";
import { Anime } from "@/types/anime.types";

export type LandingProps = {
  stats: {
    total_anime_watched: number;
    average_length: number;
    most_common_genres: string[];
  };
  recommendedAnime?: Array<Anime>;
};

export const Landing = ({ stats, recommendedAnime = [] }: LandingProps) => {
  const { data: session } = useSession();
  const { user } = useUser();

  console.log(recommendedAnime);

  if (!session) {
    return (
      <div className={classes.notLoggedIn}>
        <h2>Please log in to view your anime dashboard</h2>
        <p>
          Track your anime watching habits and get personalized recommendations
        </p>
      </div>
    );
  }

  return (
    <div className={classes.dashboardContainer}>
      <header className={classes.dashboardHeader}>
        <div className={classes.userInfo}>
          <h1>Welcome, {user?.username || "Anime Fan"}</h1>
          <p>Track your anime journey</p>
        </div>
      </header>

      <div className={classes.statsContainer}>
        <div className={classes.statCard}>
          <div className={classes.statIcon}>📺</div>
          <div className={classes.statTitle}>Anime Watched</div>
          <div className={classes.statValue}>{stats.total_anime_watched}</div>
        </div>

        <div className={classes.statCard}>
          <div className={classes.statIcon}>⏱️</div>
          <div className={classes.statTitle}>Average Length</div>
          <div className={classes.statValue}>
            {Math.ceil(stats.average_length)} eps
          </div>
        </div>

        <div className={classes.statCard}>
          <div className={classes.statIcon}>🏷️</div>
          <div className={classes.statTitle}>Top Genres</div>
          <ul className={classes.genreList}>
            {stats.most_common_genres.slice(0, 5).map(([genre], index) => (
              <li key={index} className={classes.genreItem}>
                {genre}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className={classes.recommendedSection}>
        <h2 className={classes.sectionTitle}>Recommended for you</h2>
        <div className={classes.animeGrid}>
          {recommendedAnime.length > 0 ? (
            recommendedAnime.map((anime) => (
              <MiniCard
                className={classes.miniCard}
                key={anime.id}
                anime={anime}
              />
            ))
          ) : (
            <div className={classes.noRecommendations}>
              Watch more anime to get personalized recommendations!
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
