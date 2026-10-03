import { participateApiClient } from "../client/participate/participateApiClient";

export const participateService = {
  async addParticipation(queenId, seasonId, image_url) {
    const errors = [];

    if (typeof queenId !== "string" || !queenId.trim()) {
      errors.push("Queen ID is required to add a participation");
    }

    if (typeof seasonId !== "string" || !seasonId.trim()) {
      errors.push("Season ID is required to add a participation");
    }

    if (typeof image_url !== "string" || !image_url.trim()) {
      errors.push("Image Url is required to add a participation");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    return await participateApiClient.create({ queenId, seasonId, image_url });
  },

  async deleteParticipation(queenId, seasonId) {
    const errors = [];

    if (typeof queenId !== "string" || !queenId.trim()) {
      errors.push("Queen ID is required to delete a participation");
    }

    if (typeof seasonId !== "string" || !seasonId.trim()) {
      errors.push("Season ID is required to delete a participation");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    return await participateApiClient.delete({ queenId, seasonId });
  },
};
