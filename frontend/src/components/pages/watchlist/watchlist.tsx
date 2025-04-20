import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { Watchlist as WatchlistType } from "@/types/watchlist.types";
import { WatchlistTable } from "@/components/shared/watchlist-table";

import classes from "./watchlist.module.css";
import Head from "next/head";

export const Watchlist = ({ watchlist }: { watchlist: WatchlistType }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Head>
        <title>Your Watchlist</title>
      </Head>
      <div className={classes.watchlistContainer}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="watchlist tabs"
          textColor="secondary"
          indicatorColor="secondary"
          className={classes.watchlistTabs}
        >
          <Tab
            label="Watching"
            className={classes.watchlistTab}
            disableRipple
          />
          <Tab label="Watched" className={classes.watchlistTab} disableRipple />
          <Tab label="Dropped" className={classes.watchlistTab} disableRipple />
          <Tab
            label="Plan to Watch"
            className={classes.watchlistTab}
            disableRipple
          />
        </Tabs>
        <Box className={classes.watchlistContent}>
          {value === 0 && (
            <WatchlistTable
              watchlist={{
                ...watchlist,
                anime: watchlist.anime.filter(
                  (anime) => anime.watchlist_status === "WATCHING"
                ),
              }}
            />
          )}
          {value === 1 && (
            <WatchlistTable
              watchlist={{
                ...watchlist,
                anime: watchlist.anime.filter(
                  (anime) => anime.watchlist_status === "WATCHED"
                ),
              }}
            />
          )}
          {value === 2 && (
            <WatchlistTable
              watchlist={{
                ...watchlist,
                anime: watchlist.anime.filter(
                  (anime) => anime.watchlist_status === "DROPPED"
                ),
              }}
            />
          )}
          {value === 3 && (
            <WatchlistTable
              watchlist={{
                ...watchlist,
                anime: watchlist.anime.filter(
                  (anime) => anime.watchlist_status === "PLANNING"
                ),
              }}
            />
          )}
        </Box>
      </div>
    </>
  );
};
