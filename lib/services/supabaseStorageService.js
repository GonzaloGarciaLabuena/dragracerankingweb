import { supabaseStorageAPIClient } from "../client/supabase_storage/supabaseStorageAPIClient";

export const supabaseStorageService = {
  async getQueenImg(path) {
    const errors = [];

    if (typeof path !== "string" || !path.trim()) {
      errors.push("Path is required to get the queen image");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    return await supabaseStorageAPIClient.getImg(path);
  },

  async getAllImg(page = 1, pageSize = 20) {
    const errors = [];

    if (!Number.isInteger(page) || page < 1) {
      errors.push("Page must be a positive integer");
    }

    if (!Number.isInteger(pageSize) || pageSize < 1) {
      errors.push("Page size must be a positive integer");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    return await supabaseStorageAPIClient.getAllImg(page, pageSize);
  },

  async uploadImgQueen(season, name, url) {
    const errors = [];

    if (!season || typeof season !== "object") {
      errors.push("Season is required to upload queen image");
    } else if (
      typeof season.franchise !== "string" ||
      season.franchise.trim() === ""
    ) {
      errors.push("Season franchise is required to upload queen image");
    }

    if (typeof name !== "string" || name.trim() === "") {
      errors.push("Name is required to upload queen image");
    }

    if (typeof url !== "string" || url.trim() === "") {
      errors.push("Image URL is required to upload queen image");
    } else {
      try {
        new URL(url);
      } catch {
        errors.push("Image URL must be a valid URL");
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", { cause: errors });
    }

    return await supabaseStorageAPIClient.uploadImg(
      season.franchise,
      name,
      url,
    );
  },

  async deleteImgQueen(name, season) {
    const errors = [];

    if (typeof name !== "string" || name.trim() === "") {
      errors.push("Name is required to delete queen image");
    }

    if (!season || typeof season !== "object") {
      errors.push("Season is required to delete queen image");
    } else if (
      typeof season.franchise !== "string" ||
      season.franchise.trim() === ""
    ) {
      errors.push("Season franchise is required to delete queen image");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", { cause: errors });
    }

    return await supabaseStorageAPIClient.deleteImgQueen(
      name,
      season.franchise,
    );
  },

  async updateImgQueen(queen, season, image_url) {
    const errors = [];

    if (!queen || typeof queen !== "object") {
      errors.push("Queen is required to update queen image");
    } else {
      if (typeof queen.name !== "string" || queen.name.trim() === "") {
        errors.push("Queen Name is required to update queen image");
      }
    }

    if (!season || typeof season !== "object") {
      errors.push("Season is required to update queen image");
    } else {
      if (
        typeof season.franchise !== "string" ||
        season.franchise.trim() === ""
      ) {
        errors.push("Season Franchise is required to update queen image");
      }
    }

    if (typeof image_url !== "string" || image_url.trim() === "") {
      errors.push("ImageUrl is required to update queen image");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", { cause: errors });
    }
    
    return await supabaseStorageAPIClient.uploadImg(
      season.franchise,
      queen.name,
      image_url,
    );
  },
};
