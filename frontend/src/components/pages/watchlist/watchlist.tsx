import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { Watchlist as WatchlistType } from "@/types/watchlist.types";
import { WatchlistTable } from "@/components/shared/watchlist-table";

import classes from "./watchlist.module.css";

export const Watchlist = ({ watchlist }: { watchlist: WatchlistType }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  console.log(watchlist);

  return (
    <div className={classes.watchlistContainer}>
      <Tabs value={value} onChange={handleChange} aria-label="watchlist tabs">
        <Tab label="Tab 1" />
        <Tab label="Tab 2" />
        <Tab label="Tab 3" />
      </Tabs>
      <Box className={classes.watchlistContent}>
        {value === 0 && <WatchlistTable watchlist={watchlist} />}
        {value === 1 && <div>Content for Tab 2</div>}
        {value === 2 && <div>Content for Tab 3</div>}
      </Box>
    </div>
  );
};
