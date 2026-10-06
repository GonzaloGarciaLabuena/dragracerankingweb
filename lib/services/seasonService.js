import { seasonApiClient } from "../client/season/seasonApiClient";
import { episodeService } from "./episodeService";

export const seasonService = {
  async createSeason(name, franchise, year) {
    const errors = [];

    if (typeof name !== "string") {
      errors.push("Name is required to create the season");
    }
    if (typeof franchise !== "string") {
      errors.push("Franchise is required to create the season");
    }
    if (!Number(year)) {
      errors.push("Year is required to create the season");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    return await seasonApiClient.create({ name, franchise, year });
  },

  async getRankableSeasons() {
    return await seasonApiClient.getRankableSeasons();
  },

  async getSeasonsWithEpisodes() {
    const seasons = await this.getAllSeasons();

    const entries = await Promise.all(
      seasons.map(async (season) => {
        const episodes = await episodeService.getEpisodes(season.id);
        return [season, episodes];
      }),
    );

    return new Map(entries);
  },

  async updateSeason(id, name, franchise, year) {
    const errors = [];

    if (typeof id !== "string") {
      errors.push("ID is required to update the season");
    }
    if (typeof name !== "string") {
      errors.push("Name is required to update the season");
    }
    if (typeof franchise !== "string") {
      errors.push("Franchise is required to update the season");
    }
    if (!Number(year)) {
      errors.push("Year is required to update the season");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    return await seasonApiClient.update({ id, name, franchise, year });
  },

  async getAllSeasons() {
    return await seasonApiClient.getAllSeasons();
  },

  async getRankableSeasonsWithEpisodes() {
    const seasons = await this.getRankableSeasons();

    const entries = await Promise.all(
      seasons.map(async (season) => {
        const episodes = await episodeService.getEpisodes(season.id);
        return [season, episodes];
      }),
    );

    return new Map(entries);
  },

  async getUserRankedSeasons(user) {
    const errors = [];

    if (typeof user !== "object" || user === null) {
      errors.push("User object is required to create the episode");
    } else {
      if (typeof user.id !== "string" || !user.id.trim()) {
        errors.push("ID for the user is required");
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }
    return await seasonApiClient.getUserRankedSeasons(user.id);
  },
};
