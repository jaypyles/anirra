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
} from "@/lib/integration-service/functions/add";

import classes from "./sonarr-integration.module.css";
import { Checkbox } from "@mui/material";
import { Label } from "@/components/ui/label";
import { SonarrResult } from "@/types/sonarr-result.types";
import Image from "next/image";

export type SonarrIntegrationProps = {
  searchTerm: string;
};

export const SonarrIntegration = ({ searchTerm }: SonarrIntegrationProps) => {
  const [results, setResults] = useState<SonarrResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addLoading, setAddLoading] = useState<{ [key: string]: boolean }>({});
  const [addSuccess, setAddSuccess] = useState<{ [key: string]: boolean }>({});
  const [options, setOptions] = useState<SonarrAddOptions>({
    monitor: "all",
    searchForMissingEpisodes: false,
    ignoreEpisodesWithFiles: true,
    ignoreEpisodesWithoutFiles: true,
  });

  const handleSearch = async (query: string) => {
    setSearchLoading(true);
    const response = await IntegrationService.searchSonarr(query);
    setResults(response ?? []);
    setSearchLoading(false);
  };

  const handleAdd = async (series: SonarrResult, index: number) => {
    setAddLoading((prev) => ({ ...prev, [index]: true }));
    await IntegrationService.addSonarrSeries({
      ...(series as unknown as SonarrAddRequest),
      qualityProfileId: 1,
      rootFolderPath: "/tv",
      monitored: options.searchForMissingEpisodes,
      addOptions: options,
    });
    setAddLoading((prev) => ({ ...prev, [index]: false }));
    setAddSuccess((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <Dialog>
      <DialogTrigger className={classes.trigger}>
        <Image
          className={classes.sonarrIcon}
          src="/images/sonarr-icon.png"
          alt="Sonarr"
          width={40}
          height={40}
        />
      </DialogTrigger>
      <DialogContent className={classes.dialog}>
        <DialogHeader>
          <DialogTitle>Add a series</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Search for a series"
          value={searchTerm}
        />

        <Button onClick={() => handleSearch(searchTerm)}>
          {searchLoading ? "Searching..." : "Search"}
        </Button>
        <div className={classes.options}>
          <div className={classes.option}>
            <Label>Search for missing episodes</Label>
            <Checkbox
              checked={options.searchForMissingEpisodes}
              onChange={(e) =>
                setOptions({
                  ...options,
                  searchForMissingEpisodes: e.target.checked,
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
                    <span>{result.ratings.value}</span>
                    <span>•</span>
                    <span>{result.statistics.seasonCount} seasons</span>
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
