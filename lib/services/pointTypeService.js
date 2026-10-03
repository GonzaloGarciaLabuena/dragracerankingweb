import { pointtypeApiClient } from "../client/episode/pointtypeApiClient";

export const pointTypeService = {
  async getPointTypes(mode) {
    const errors = [];

    if (typeof mode !== "string" || mode === null) {
      errors.push("Mode is required to fetch point types for the ranking");
    } else {
      if (mode !== 'default' && mode !== 'final' && mode !== 'finalDraga') {
        errors.push("Mode not permited (default, final, finalDraga)");
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }
    return await pointtypeApiClient.getAll(mode);
  },
};
