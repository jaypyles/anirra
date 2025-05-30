import { Anime } from "@/types/anime.types";
import { ItemPaginator } from "../item-paginator/item-paginator";
import { MiniCard } from "../mini-card/mini-card";
import classes from "./recommendations.module.css";

export const Recommendations = ({
  title,
  recommendedAnime,
  className,
}: {
  title?: string;
  recommendedAnime: Anime[];
  className?: string;
}) => {
  return (
    <section
      className={classes.recommendedSection}
      data-testid="recommendations"
    >
      <h2 className={classes.sectionTitle}>{title || "Recommended for you"}</h2>
      <div className={classes.animeGrid}>
        {recommendedAnime.length > 0 ? (
          <ItemPaginator.Root
            className={className}
            items={recommendedAnime.map((anime) => (
              <MiniCard
                className={classes.miniCard}
                key={anime.id}
                anime={anime}
              />
            ))}
          />
        ) : (
          <div className={classes.noRecommendations}>
            Watch more anime to get personalized recommendations!
          </div>
        )}
      </div>
    </section>
  );
};
