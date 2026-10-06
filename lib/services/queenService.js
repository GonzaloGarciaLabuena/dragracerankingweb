import { queenApiClient } from "../client/queen/queenApiClient";
import { participateService } from "./participateService";

export const queenService = {
  async listQueens(seasonSelected, page) {
    const errors = [];

    if (seasonSelected?.id == null) {
      errors.push("Selected Season ID is required to list the queens");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const queenData = await queenApiClient.get(seasonSelected, page);
    return {
      ...queenData,
      data: queenData.data.map(mapQueen),
    };
  },

  //Return exists true if it was created
  async createQueen(name, seasonId, image_Url) {
    const errors = [];

    if (typeof name !== "string" || !name.trim()) {
      errors.push("Name is required");
    }

    if (typeof seasonId !== "string" || !seasonId.trim()) {
      errors.push("Season is required");
    }

    if (typeof image_Url !== "string" || !image_Url.trim()) {
      errors.push("Image is required");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const queenFound = await queenService.existsQueen(name);
    if (!queenFound) {
      //Queen is not in BBDD
      return await queenApiClient.create({
        name: name.trim(),
        seasonId: seasonId.trim(),
        image_Url: image_Url.trim(),
      });
    } else {
      //Ya existe una reina con ese nombre, saltamos ese paso y añadimos solo otra participacion
      return await participateService.addParticipation(
        queenFound.id,
        seasonId,
        image_Url,
      );
    }
  },

  async deleteQueen(id) {
    const errors = [];

    if (id == null) {
      errors.push("Queen ID is required to delete queen");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    return await queenApiClient.remove(id);
  },

  async existsQueen(queenName) {
    const errors = [];

    if (queenName == null) {
      errors.push("Queen Name is required to check if the queen exists");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }
    return await queenApiClient.existsQueen(queenName);
  },
};

const mapQueen = (item) => {
  return {
    id: item.queen.id,
    name: item.queen.name,
    image_url: item.image_url,
    season: item.season,
  };
};
