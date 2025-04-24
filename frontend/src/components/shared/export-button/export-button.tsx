import React, { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@mui/material";
import { WatchlistService } from "@/lib/watchlist-service";
import { toast } from "react-toastify";

export type ExportButtonProps = {
  className?: string;
};

export const ExportButton: React.FC<ExportButtonProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    const response = await WatchlistService.exportWatchlist();

    if (!response) {
      return;
    }

    try {
      const blob = new Blob([JSON.stringify(response)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "watchlist.json";
      a.click();

      window.location.reload();
    } catch {
      toast.error("Error exporting watchlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button
        variant="contained"
        component="span"
        startIcon={<Download />}
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
        onClick={handleExport}
      >
        {isLoading ? "Exporting..." : "Export Watchlist"}
      </Button>
    </div>
  );
};
