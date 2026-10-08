import { queenApiClient } from "../client/queen/queenApiClient";
import { participateService } from "./participateService";
import { supabaseStorageService } from "./supabaseStorageService";

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
  async createQueen(name, season, image_Url) {
    const errors = [];

    if (typeof name !== "string" || !name.trim()) {
      errors.push("Name is required");
    }
    if (!season || typeof season !== "object") {
      errors.push("Season is required to create queen");
    } else {
      if (typeof season.id !== "string" || season.id.trim() === "") {
        errors.push("Season Id is required to create queen");
      }

      if (
        typeof season.franchise !== "string" ||
        season.franchise.trim() === ""
      ) {
        errors.push("Season franchise is required to create queen");
      }
    }

    if (typeof image_Url !== "string" || !image_Url.trim()) {
      errors.push("Image is required");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const urlQueenName = name.replace(/\s+/g, "");
    let imgPath;

    try {
      imgPath = await supabaseStorageService.uploadImgQueen(
        season,
        urlQueenName,
        image_Url,
      );
    } catch (error) {
      throw error;
    }

    try {
      const imgUrlBBDD = await supabaseStorageService.getQueenImg(imgPath);
      const queenFound = await queenService.existsQueen(name);

      if (!queenFound) {
        return await queenApiClient.create({
          name: name,
          seasonId: season.id,
          image_url: imgUrlBBDD,
        });
      }
      return await participateService.addParticipation(
        queenFound.id,
        season.id,
        imgUrlBBDD,
      );
    } catch (error) {
      try {
        await supabaseStorageService.deleteImgQueen(urlQueenName, season);
      } catch (deleteError) {
        console.error("Error deleting uploaded queen image", deleteError);
      }

      throw error;
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

  async updateQueen(queen, season, editData) {
    if (editData.name !== undefined) {
      await queenApiClient.updateName(queen.id, editData.name);
    }

    if (editData.image_url !== undefined) {
      queen.name = queen.name.replace(/\s+/g, "");
      const imgPath = await supabaseStorageService.updateImgQueen(queen, season, editData.image_url);
      const imgUrlBBDD = await supabaseStorageService.getQueenImg(imgPath);
      await participateService.updateParticipationImg(queen.id, season.id, imgUrlBBDD)
    }
/*
    if (editData.seasonId !== undefined) {
      await queenApiClient.moveParticipation(
        queen.id,
        queen.seasonId,
        editData.seasonId,
      );
    }*/
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
