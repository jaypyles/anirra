import { WatchlistService } from "@/lib/watchlist-service";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

type AnimeRatingDialogProps = {
  open: boolean;
  onClose: () => void;
  initialRating: number;
  animeId: number;
  onRate: (animeId: number, rating: number) => void;
};

export const AnimeRatingDialog = ({
  open,
  onClose,
  initialRating,
  animeId,
  onRate,
}: AnimeRatingDialogProps) => {
  const [rating, setRating] = useState<number | undefined>(initialRating);

  const handleRate = async () => {
    try {
      await WatchlistService.rateAnime(animeId, rating || 0);
      onRate(animeId, rating || 0);
      onClose();
      setRating(undefined);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontFamily: "var(--root-font)" }}>
        Rate Anime
      </DialogTitle>
      <DialogContent>
        <Select
          value={rating}
          onChange={(event) => {
            setRating(Number(event.target.value));
          }}
          sx={{
            width: "100%",
          }}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={9}>9</MenuItem>
          <MenuItem value={10}>10</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleRate} disabled={rating === initialRating}>
          Rate
        </Button>
      </DialogActions>
    </Dialog>
  );
};
