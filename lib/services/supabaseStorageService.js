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
};
