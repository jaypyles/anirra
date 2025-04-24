import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@mui/material";
import { WatchlistService } from "@/lib/watchlist-service";

export type ImportButtonProps = {
  className?: string;
  onImport?: (file: File) => void;
};

export const ImportButton: React.FC<ImportButtonProps> = ({
  className,
  onImport,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsLoading(true);
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      await WatchlistService.importWatchlist(file);
      onImport?.(file);

      window.location.reload();
    } catch (error) {
      console.error("Error importing watchlist:", error);
    } finally {
      setIsLoading(false);
    }

    event.target.value = "";
  };

  return (
    <div className={className}>
      <input
        accept=".json"
        style={{ display: "none" }}
        id="file-upload-import"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload-import">
        <Button
          variant="contained"
          component="span"
          startIcon={<Upload />}
          disabled={isLoading}
          sx={{
            backgroundColor: "var(--purple-primary)",
            "&:hover": {
              backgroundColor: "var(--purple-dark) !important",
            },
            "&:disabled": {
              backgroundColor: "var(--purple-disabled)",
            },
          }}
        >
          {isLoading ? "Importing..." : "Import Watchlist"}
        </Button>
      </label>
    </div>
  );
};
