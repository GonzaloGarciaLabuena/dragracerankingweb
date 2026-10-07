export const episodeApiClient = {
  create: async (data) => {
    const errors = [];

    if (typeof data !== "object" || data === null) {
      errors.push("Data object is required to create episode");
    } else {
      if (typeof data.seasonId !== "string" || !data.seasonId.trim()) {
        errors.push("Season ID is required to create episode");
      }

      if (typeof data.newEpisode !== "object" || data.newEpisode === null) {
        errors.push("Data NewEpisode object is required to create episode");
      } else {
        if (
          typeof data.newEpisode.title !== "string" ||
          !data.newEpisode.title.trim()
        ) {
          errors.push("Title is required to create episode");
        }

        if (typeof data.newEpisode.esFinal !== "boolean") {
          errors.push("esFinal must be a boolean to create episode");
        }

        if (typeof data.newEpisode.esFinalDraga !== "boolean") {
          errors.push("esFinalDraga must be a boolean to create episode");
        }
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch("/api/episode/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error creating episode");
    }

    return responseData;
  },

  get: async (seasonId) => {
    const errors = [];

    if (typeof seasonId !== "string" || !seasonId.trim()) {
      errors.push("Season ID is required to get episode");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch(
      `/api/episode?seasonId=${encodeURIComponent(seasonId)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error getting episode");
    }

    return responseData;
  },

  getAdmin: async (seasonId) => {
    const errors = [];

    if (typeof seasonId !== "string" || !seasonId.trim()) {
      errors.push("Season ID is required to get episode");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch(
      `/api/episode/admin?seasonId=${encodeURIComponent(seasonId)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error getting episode");
    }

    return responseData;
  },

  deleteLast: async (seasonId) => {
    const errors = [];

    if (typeof seasonId !== "string" || !seasonId.trim()) {
      errors.push("Season ID is required to delete episode");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch(
      `/api/episode/admin?seasonId=${encodeURIComponent(seasonId)}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    );

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error deleting episode");
    }

    return responseData;
  },

  update: async (data) => {
    const errors = [];

    if (
      typeof data !== "object" ||
      data === null ||
      typeof data.episode !== "object" ||
      data.episode === null
    ) {
      errors.push("Data Episode object is required to update episode");
    } else {
      if (typeof data.episode.id !== "string" || !data.episode.id.trim()) {
        errors.push("ID is required to update episode");
      }

      if (
        typeof data.episode.title !== "string" ||
        !data.episode.title.trim()
      ) {
        errors.push("Title is required to update episode");
      }

      if (typeof data.episode.esFinal !== "boolean") {
        errors.push("esFinal must be a boolean to update episode");
      }

      if (typeof data.episode.esFinalDraga !== "boolean") {
        errors.push("esFinalDraga must be a boolean to update episode");
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch("/api/episode/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      console.error("Error updating episode:", error);

      throw new Error(error.error || "Error updating episode");
    }
    return res.json();
  },
};
