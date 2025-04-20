/* eslint-disable @next/next/no-img-element */
import { SearchService } from "@/lib/search-service";
import { Anime } from "@/types/anime.types";
import { TextField, CircularProgress } from "@mui/material";
import { useState, useEffect, useRef } from "react";

import classes from "./debounce-search-bar.module.css";
import { useRouter } from "next/router";

export const DebounceSearchBar = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Anime[]>([]);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    try {
      const handler = setTimeout(() => {
        setDebouncedSearch(search);
      }, 300);

      return () => {
        clearTimeout(handler);
      };
    } catch (error) {
      console.error("Error in debounce effect:", error);
    }
  }, [search]);

  useEffect(() => {
    const handleSearch = async (query: string) => {
      setIsLoading(true);

      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const data = await SearchService.search(query, {
          signal: controller.signal,
        });
        setResults(data as Anime[]);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Search error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (debouncedSearch) {
      try {
        handleSearch(debouncedSearch);
      } catch (error) {
        console.error("Error in search effect:", error);
      }
    } else {
      setResults([]);
    }

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [debouncedSearch]);

  return (
    <div style={{ position: "relative", width: "200px" }}>
      <TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
        size="small"
        sx={{
          width: "100%",
        }}
        ref={searchBarRef}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            router.push(`/anime/search/${search}`);
            setSearch("");
            setResults([]);
          }
        }}
      />
      {isLoading && (
        <div
          style={{
            position: "absolute",
            marginTop: "2px",
            top: "50%",
            right: "0",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        >
          <CircularProgress size={24} />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          backgroundColor: "white",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 1,
        }}
      >
        {results &&
          results.map((result, index) => (
            <div
              key={index}
              style={{
                padding: "8px",
                borderBottom: "1px solid #ddd",
                color: "black",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <img
                src={result.image_url}
                alt={result.title}
                style={{
                  width: "40px",
                  height: "40px",
                  aspectRatio: "1/1",
                  borderRadius: "4px",
                  objectFit: "cover",
                  border: "1px solid #ddd",
                }}
              />
              <a
                href={`/anime/${result.id}`}
                className={classes.link}
                onClick={() => setSearch("")}
              >
                {result.title}
              </a>
            </div>
          ))}
      </div>
    </div>
  );
};
