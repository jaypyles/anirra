import { AnimeProps } from "@/components/pages/anime";
import classes from "./anime-page.module.css";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { WatchlistService } from "@/lib/watchlist-service";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import React from "react";
import { WatchlistStatus } from "@/types/watchlist.types";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { StarIcon } from "lucide-react";
import { Recommendations as RecommendationsComponent } from "../recommendations/recommendations";

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

export const Metadata = ({
  anime,
  className,
  watchlistStatus,
}: AnimePageProps) => {
  return (
    <div className={cn(classes.metadata, className)}>
      <div className={classes.metadataGrid}>
        {/* Left Column - Stats and Watchlist */}
        <div className={classes.leftColumn}>
          <div className={classes.metadataItem}>
            <div className={classes.metadataLabel}>Score</div>
            <div className={classes.metadataValue}>
              {anime.rating ? (
                <>
                  <StarIcon />
                  <span>{anime.rating.toFixed(2)}</span>
                </>
              ) : (
                "N/A"
              )}
            </div>
          </div>
          <div className={classes.metadataItem}>
            <div className={classes.metadataLabel}>Episodes</div>
            <div className={classes.metadataValue}>{anime.episode_count}</div>
          </div>
          <div className={classes.metadataItem}>
            <div className={classes.metadataLabel}>Status</div>
            <div className={classes.metadataValue}>
              {anime.status.toLowerCase()}
            </div>
          </div>
          <div className={classes.metadataItem}>
            <div className={classes.metadataLabel}>Year</div>
            <div className={classes.metadataValue}>{anime.year}</div>
          </div>
          <WatchlistForm anime={anime} watchlistStatus={watchlistStatus} />
        </div>

        {/* Right Column - Genre Tags */}
        <div className={classes.rightColumn}>
          <div className={classes.genreContainer}>
            <div className={classes.genreHeader}>Genres</div>
            <div className={classes.genreTags}>
              {anime.tags.map((tag, index) => (
                <span key={index} className={classes.genreTag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Recommendations = ({
  anime,
  className,
}: AnimePageProps) => {
  return (
    <RecommendationsComponent
      recommendedAnime={anime.recommendations} className={className} />
  );
};

export const WatchlistForm = ({
  anime,
  className,
  watchlistStatus,
}: AnimePageProps) => {
  const [status, setStatus] = React.useState(watchlistStatus);

  const onSelectChange = (event: SelectChangeEvent<string>) => {
    setStatus(event.target.value as WatchlistStatus);
  };

  const handleChange = () => {
    const newStatus = status as WatchlistStatus;
    setStatus(newStatus);

    try {
      WatchlistService.update([anime.id], newStatus);
      toast.success(`Watchlist status updated to ${newStatus.toLowerCase()}`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Failed to update watchlist status");
      }
    }
  };

  return (
    <div className={cn(classes.watchlistForm, className)}>
      <h2>Watchlist</h2>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel className={classes.inputLabel} id="watchlist-status-label">
          Status
        </InputLabel>
        <Select
          labelId="watchlist-status-label"
          value={status}
          label="Status"
          className={classes.select}
          onChange={onSelectChange}
        >
          <MenuItem value="PLANNING">Planning to Watch</MenuItem>
          <MenuItem value="DROPPED">Dropped</MenuItem>
          <MenuItem value="WATCHED">Watched</MenuItem>
          <MenuItem value="WATCHING">Watching</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={handleChange}
          sx={{
            backgroundColor: "var(--purple-primary)",
            "&:hover": {
              backgroundColor: "var(--purple-dark)",
            },
          }}
        >
          Add
        </Button>
      </FormControl>
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
  WatchlistForm,
};
