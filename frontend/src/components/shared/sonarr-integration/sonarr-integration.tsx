import { Button } from "@/components/ui/button";
import {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IntegrationService } from "@/lib/integration-service";
import { useState } from "react";
import {
  SonarrAddOptions,
  SonarrAddRequest,
} from "@/lib/integration-service/functions/add-sonarr";

import classes from "./sonarr-integration.module.css";
import { Checkbox } from "@mui/material";
import { Label } from "@/components/ui/label";
import { SonarrResult } from "@/types/sonarr-result.types";
import Image from "next/image";
import {
  RadarrAddOptions,
  RadarrAddRequest,
} from "@/lib/integration-service/functions/add-radarr";
import { RadarrResult } from "@/types/radarr-result.types";

export type SonarrIntegrationProps = {
  searchTerm: string;
  type: "sonarr" | "radarr";
};

export const SonarrIntegration = ({
  searchTerm,
  type,
}: SonarrIntegrationProps) => {
  const isSonarr = type === "sonarr";
  const [results, setResults] = useState<SonarrResult[] | RadarrResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addLoading, setAddLoading] = useState<{ [key: string]: boolean }>({});
  const [addSuccess, setAddSuccess] = useState<{ [key: string]: boolean }>({});
  const [sonarrOptions, setSonarrOptions] = useState<SonarrAddOptions>({
    monitor: "all",
    searchForMissingEpisodes: false,
    ignoreEpisodesWithFiles: true,
    ignoreEpisodesWithoutFiles: true,
  });

  const [radarrOptions, setRadarrOptions] = useState<RadarrAddOptions>({
    monitor: "movieOnly",
    searchForMovie: false,
  });

  const handleSearch = async (query: string) => {
    setSearchLoading(true);
    if (type === "sonarr") {
      const response = await IntegrationService.searchSonarr(query);
      setResults(response ?? []);
    } else {
      const response = await IntegrationService.searchRadarr(query);
      setResults(response ?? []);
    }
    setSearchLoading(false);
  };

  const handleAdd = async (
    series: SonarrResult | RadarrResult,
    index: number
  ) => {
    setAddLoading((prev) => ({ ...prev, [index]: true }));
    if (isSonarr) {
      await IntegrationService.addSonarrSeries({
        ...(series as unknown as SonarrAddRequest),
        qualityProfileId: 1,
        rootFolderPath: "/tv",
        monitored: sonarrOptions.searchForMissingEpisodes,
        addOptions: sonarrOptions,
      });
    } else {
      await IntegrationService.addRadarrSeries({
        ...(series as unknown as RadarrAddRequest),
        qualityProfileId: 1,
        rootFolderPath: "/movies",
        monitored: radarrOptions.searchForMovie,
        addOptions: radarrOptions,
      });
    }
    setAddLoading((prev) => ({ ...prev, [index]: false }));
    setAddSuccess((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <Dialog>
      <DialogTrigger className={classes.trigger}>
        <Image
          className={classes.sonarrIcon}
          src={isSonarr ? "/images/sonarr-icon.png" : "/images/radarr-icon.png"}
          alt={isSonarr ? "Sonarr" : "Radarr"}
          width={40}
          height={40}
        />
      </DialogTrigger>
      <DialogContent className={classes.dialog}>
        <DialogHeader>
          <DialogTitle>Add a {isSonarr ? "series" : "movie"}</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          placeholder={`Search for a ${isSonarr ? "series" : "movie"}`}
          value={searchTerm}
        />

        <Button onClick={() => handleSearch(searchTerm)}>
          {searchLoading ? "Searching..." : "Search"}
        </Button>
        <div className={classes.options}>
          <div className={classes.option}>
            <Label>Search for missing {isSonarr ? "episodes" : "movies"}</Label>
            <Checkbox
              checked={
                isSonarr
                  ? sonarrOptions.searchForMissingEpisodes
                  : radarrOptions.searchForMovie
              }
              onChange={(e) =>
                isSonarr
                  ? setSonarrOptions({
                      ...sonarrOptions,
                      searchForMissingEpisodes: e.target.checked,
                    })
                  : setRadarrOptions({
                      ...radarrOptions,
                      searchForMovie: e.target.checked,
                    })
              }
            />
          </div>
        </div>

        <div className={classes.results}>
          {results.slice(0, 10).map((result, index) => (
            <div className={classes.result} key={result.id}>
              <div className={classes.resultTitle}>
                <Image
                  src={
                    result.images.find((image) => image.coverType === "poster")
                      ?.remoteUrl ?? ""
                  }
                  alt={result.title}
                  width={30}
                  height={30}
                />
                <div className={classes.resultTitleText}>
                  <div>{result.title}</div>
                  <div className={classes.resultTitleTextStats}>
                    <span className={classes.star}>★</span>{" "}
                    <span>
                      {isSonarr
                        ? (result as SonarrResult).ratings.value
                        : (result as RadarrResult).ratings.tmdb.value.toFixed(
                            2
                          ) || "N/A"}
                    </span>
                    <span>•</span>
                    {isSonarr ? (
                      <span>
                        {(result as SonarrResult).statistics.seasonCount}{" "}
                        seasons
                      </span>
                    ) : (
                      <span>
                        {(result as RadarrResult).genres.slice(0, 3).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button onClick={() => handleAdd(result, index)}>
                {addSuccess[index]
                  ? "Added"
                  : addLoading[index]
                  ? "Adding..."
                  : "Add"}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
