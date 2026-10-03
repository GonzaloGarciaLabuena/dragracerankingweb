import { episodeApiClient } from "../client/episode/episodeApiClient";

export const episodeService = {
  async createEpisode(seasonId, newEpisode) {
    const errors = [];

    if (typeof seasonId !== "string") {
      errors.push("Season ID is required to create the episode");
    }

    if (typeof newEpisode !== "object" || newEpisode === null) {
      errors.push("Episode object is required to create the episode");
    } else {
      if (typeof newEpisode.title !== "string" || !newEpisode.title.trim()) {
        errors.push("Title for the episode is required");
      }

      if (
        typeof newEpisode.esFinal !== "boolean" ||
        typeof newEpisode.esFinalDraga !== "boolean"
      ) {
        errors.push("Final values for the episode are required");
      } else if (newEpisode.esFinal && newEpisode.esFinalDraga) {
        errors.push("An episode cannot be both final and final Draga");
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    return await episodeApiClient.create({
      seasonId,
      newEpisode,
    });
  },

  async getEpisodes(seasonId) {
    const errors = [];

    if (typeof seasonId !== "string") {
      errors.push("Season ID is required to fetch the episodes");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    return await episodeApiClient.get(seasonId);
  },

  async getEpisodesAdmin(seasonId) {
    const errors = [];

    if (typeof seasonId !== "string") {
      errors.push("Season ID is required to fetch the episodes");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    return await episodeApiClient.getAdmin(seasonId);
  },

  async deleteLastEpisode(seasonId) {
    const errors = [];

    if (typeof seasonId !== "string") {
      errors.push("Season ID is required to delete the episode");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    return await episodeApiClient.deleteLast(seasonId);
  },

  async updateEpisode(episode) {
    const errors = [];

    if (typeof episode !== "object" || episode === null) {
      errors.push("Episode object is required to update episode");
    } else {
      if (typeof episode.id !== "string" || !episode.id.trim()) {
        errors.push("Season ID is required to create the episode");
      }

      if (typeof episode.title !== "string" || !episode.title.trim()) {
        errors.push("Title for the episode is required");
      }

      if (
        typeof episode.esFinal !== "boolean" ||
        typeof episode.esFinalDraga !== "boolean"
      ) {
        errors.push("Final values for the episode are required");
      } else if (episode.esFinal && episode.esFinalDraga) {
        errors.push("An episode cannot be both final and final Draga");
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }
    
    return await episodeApiClient.update({
      episode,
    });
  },
};
