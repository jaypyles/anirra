import { AnimeProps } from "@/components/pages/anime";
import classes from "./anime-page.module.css";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type AnimePageProps = AnimeProps & {
  children?: React.ReactNode;
  className?: string;
};

export const Root = ({ children, className }: AnimePageProps) => {
  return <div className={cn(classes.root, className)}>{children}</div>;
};

export const Header = ({ anime, className }: AnimePageProps) => {
  return <h1 className={cn(classes.header, className)}>{anime.title}</h1>;
};

export const Picture = ({ anime, className }: AnimePageProps) => {
  return (
    <Image
      src={anime.image_url}
      alt={anime.title}
      fill
      className={cn(classes.image, className)}
    />
  );
};

export const Metadata = ({ anime, className }: AnimePageProps) => {
  return (
    <div className={cn(classes.metadata, className)}>
      <div className={classes.metadata}>
        <div className={classes.metadataItem}>
          <div className={classes.metadataLabel}>Score</div>
          <div className={classes.metadataValue}>{anime.rating}</div>
        </div>
        <div className={classes.metadataItem}>
          <div className={classes.metadataLabel}>Episodes</div>
          <div className={classes.metadataValue}>{anime.episode_count}</div>
        </div>
        <div className={classes.metadataItem}>
          <div className={classes.metadataLabel}>Status</div>
          <div className={classes.metadataValue}>{anime.status}</div>
        </div>
        <div className={classes.metadataItem}>
          <div className={classes.metadataLabel}>Year</div>
          <div className={classes.metadataValue}>{anime.year}</div>
        </div>
        <div className={classes.metadataItem}>
          <div className={classes.metadataLabel}>Genres</div>
          <div className={classes.metadataValue}>{anime.tags.join(", ")}</div>
        </div>
      </div>
    </div>
  );
};

export const Recommendations = ({ anime, className }: AnimePageProps) => {
  return (
    <div className={cn(classes.recommendations, className)}>
      <h2>Recommendations</h2>
      <div className={classes.metadata}>
        {anime.recommendations.map((rec) => (
          <div key={rec.id} className={classes.metadataItem}>
            <div className={classes.metadataLabel}>{rec.title}</div>
            <div className={classes.metadataValue}>
              Score: {rec.rating.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Body = ({ anime, children, className }: AnimePageProps) => {
  return (
    <div className={cn(classes.body, className)}>
      <div className={classes.description}>{anime.description}</div>
      {children}
    </div>
  );
};

export const Footer = ({ anime, children, className }: AnimePageProps) => {
  if (!anime.recommendations?.length) return null;

  return <div className={cn(classes.footer, className)}>{children}</div>;
};

export const AnimePage = {
  Root,
  Header,
  Body,
  Footer,
  Picture,
  Metadata,
  Recommendations,
};
