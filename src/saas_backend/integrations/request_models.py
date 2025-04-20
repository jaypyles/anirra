from pydantic import BaseModel


class SonarrAddOptions(BaseModel):
    monitor: str
    searchForMissingEpisodes: bool
    ignoreEpisodesWithFiles: bool
    ignoreEpisodesWithoutFiles: bool


class SonarrImage(BaseModel):
    coverType: str
    url: str
    remoteUrl: str


class SonarrSeason(BaseModel):
    seasonNumber: int
    monitored: bool


class SonarrAddRequest(BaseModel):
    tvdbId: int
    title: str
    qualityProfileId: int
    titleSlug: str
    images: list[SonarrImage]
    seasons: list[SonarrSeason]
    rootFolderPath: str
    monitored: bool
    addOptions: SonarrAddOptions
