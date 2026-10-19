import { lipsyncApiClient } from "../client/lipsync/lipsyncApiClient";

export const lipsyncService = {
  async getBattles(episode) {
    const errors = [];

    if (typeof episode !== "object" || episode === null) {
      errors.push("Episode is required to list lipsync battles");
    } else {
      if (typeof episode.id !== "string" || !episode.id.trim()) {
        errors.push("Episode ID is required to list lipsync battles");
      }
    }

    if (errors.length > 0) {
      console.error(errors);
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    return await lipsyncApiClient.get(episode.id);
  },

  async createBattle(battle) {
    const errors = [];

    if (typeof battle !== "object" || battle === null) {
      errors.push("Battle is required to create a lipsync battle");
    } else {
      if (typeof battle.episode_id !== "string" || !battle.episode_id.trim()) {
        errors.push("Episode ID is required to create a lipsync battle");
      }
      if (!Number.isInteger(battle.round_number) || battle.round_number <= 0) {
        errors.push("Round number must be a positive integer");
      }

      if (!Number.isInteger(battle.number) || battle.number <= 0) {
        errors.push("Battle number must be a positive integer");
      }
      if (typeof battle.queen1_id !== "string" || !battle.queen1_id.trim()) {
        errors.push("Queen 1 ID is required to create a lipsync battle");
      }
      if (typeof battle.queen2_id !== "string" || !battle.queen2_id.trim()) {
        errors.push("Queen 2 ID is required to create a lipsync battle");
      }
      if (battle.queen3_id !== null) {
        if (typeof battle.queen3_id !== "string" || !battle.queen3_id.trim()) {
          errors.push("Queen 3 ID is required to create a lipsync battle");
        }
      }
    }

    if (errors.length > 0) {
      console.error(errors);
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    return await lipsyncApiClient.create(battle);
  },

  async updateBattle(battle) {
    const errors = [];

    if (typeof battle !== "object" || battle === null) {
      errors.push("Battle is required to update a lipsync battle");
    } else {
      if (typeof battle.id !== "string" || !battle.id.trim()) {
        errors.push("Battle ID is required to update a lipsync battle");
      }
      if (!Number.isInteger(battle.round_number) || battle.round_number <= 0) {
        errors.push("Round number must be a positive integer");
      }

      if (!Number.isInteger(battle.number) || battle.number <= 0) {
        errors.push("Battle number must be a positive integer");
      }
      if (typeof battle.queen1_id !== "string" || !battle.queen1_id.trim()) {
        errors.push("Queen 1 ID is required to update a lipsync battle");
      }
      if (typeof battle.queen2_id !== "string" || !battle.queen2_id.trim()) {
        errors.push("Queen 2 ID is required to update a lipsync battle");
      }
      if (battle.queen3_id !== null) {
        if (typeof battle.queen3_id !== "string" || !battle.queen3_id.trim()) {
          errors.push("Queen 3 ID is required to update a lipsync battle");
        }
      }
    }

    if (errors.length > 0) {
      console.error(errors);
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    return await lipsyncApiClient.update(battle);
  },
};
