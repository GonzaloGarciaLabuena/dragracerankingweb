export const lipsyncApiClient = {
  get: async (episodeId) => {
    const errors = [];

    if (typeof episodeId !== "string" || !episodeId.trim()) {
      errors.push("Episode ID is required to list lipsync battles");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch(`/api/lipsync?episodeId=${encodeURIComponent(episodeId)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error list lipsync battles");
    }

    return responseData;
  },

  create: async (data) => {
    const errors = [];

    if (typeof data !== "object" || data === null) {
      errors.push("Data object is required to create a lipsync battle");
    } else {
      if (typeof data.episode_id !== "string" || !data.episode_id.trim()) {
        errors.push("Episode ID is required to create a lipsync battle");
      }
      if (!Number.isInteger(data.round_number) || data.round_number <= 0) {
        errors.push("Round number must be a positive integer");
      }

      if (!Number.isInteger(data.number) || data.number <= 0) {
        errors.push("Battle number must be a positive integer");
      }
      if (typeof data.queen1_id !== "string" || !data.queen1_id.trim()) {
        errors.push("Queen 1 ID is required to create a lipsync battle");
      }
      if (typeof data.queen2_id !== "string" || !data.queen2_id.trim()) {
        errors.push("Queen 2 ID is required to create a lipsync battle");
      }
      if (data.queen3_id !== null) {
        if (typeof data.queen3_id !== "string" || !data.queen3_id.trim()) {
          errors.push("Queen 3 ID is required to create a lipsync battle");
        }
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch("/api/lipsync/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error creating lipsync battle");
    }

    return responseData;
  },

  update: async (data) => {
    const errors = [];

    if (typeof data !== "object" || data === null) {
      errors.push("Data object is required to update a lipsync battle");
    } else {
      if (typeof data.id !== "string" || !data.id.trim()) {
        errors.push("Episode ID is required to update a lipsync battle");
      }
      if (!Number.isInteger(data.round_number) || data.round_number <= 0) {
        errors.push("Round number must be a positive integer");
      }

      if (!Number.isInteger(data.number) || data.number <= 0) {
        errors.push("Battle number must be a positive integer");
      }
      if (typeof data.queen1_id !== "string" || !data.queen1_id.trim()) {
        errors.push("Queen 1 ID is required to update a lipsync battle");
      }
      if (typeof data.queen2_id !== "string" || !data.queen2_id.trim()) {
        errors.push("Queen 2 ID is required to update a lipsync battle");
      }
      if (data.queen3_id !== null) {
        if (typeof data.queen3_id !== "string" || !data.queen3_id.trim()) {
          errors.push("Queen 3 ID is required to update a lipsync battle");
        }
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch("/api/lipsync/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error updating lipsync battle");
    }

    return responseData;
  },
};
