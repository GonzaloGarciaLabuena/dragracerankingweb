export const ppeApiClient = {
  saveRanking: async ({ season_id, rows }) => {
    const errors = [];

    if (typeof season_id !== "string" || !season_id.trim()) {
      errors.push("Season ID is required to save ranking");
    }

    if (!Array.isArray(rows)) {
      errors.push("Rows array is required to save ranking");
    } else {
      rows.forEach((row, index) => {
        if (typeof row !== "object" || row === null) {
          errors.push(`Row ${index} must be an object`);
          return;
        }

        if (typeof row.queen_id !== "string" || !row.queen_id.trim()) {
          errors.push(`Queen ID is required for row ${index}`);
        }

        if (typeof row.episode_id !== "string" || !row.episode_id.trim()) {
          errors.push(`Episode ID is required for row ${index}`);
        }

        if (
          row.point_type_id !== null &&
          (typeof row.point_type_id !== "string" || !row.point_type_id.trim())
        ) {
          errors.push(
            `Point Type ID must be a string or null for row ${index}`,
          );
        }
      });
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch("/api/ppe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        season_id,
        rows,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error ?? "Error saving ranking");
    }

    return data;
  },

  getRanking: async (seasonId) => {
    const errors = [];

    if (typeof seasonId !== "string" || !seasonId.trim()) {
      errors.push("Season ID is required");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch(
      `/api/ppe?seasonId=${encodeURIComponent(seasonId)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error ?? "Error getting ranking");
    }

    return data;
  },

  getRankingUser: async (userId, seasonId) => {
    const errors = [];

    if (typeof userId !== "string" || !userId.trim()) {
      errors.push("User ID is required to get the ranking of a user");
    }

    if (typeof seasonId !== "string" || !seasonId.trim()) {
      errors.push("Season ID is required to get the ranking of a user");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch(
      `/api/ppe/users?userId=${encodeURIComponent(userId)}&seasonId=${encodeURIComponent(seasonId)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error ?? "Error getting ranking of user");
    }

    return data;
  },

  publishRanking: async (seasonId) => {
    const errors = [];

    if (typeof seasonId !== "string" || !seasonId.trim()) {
      errors.push("Season ID is required to publish ranking");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch("/api/ppe_reference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ seasonId }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error ?? "Error publishing ranking");
    }

    return data;
  },

  getHallOfFame: async (userId) => {
    const errors = [];

    if (
      (typeof userId !== "string" && userId !== null) ||
      (typeof userId === "string" && !userId.trim())
    ) {
      errors.push("User ID is required to get the ranking of a user");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const url = userId
      ? `/api/halloffame?userId=${encodeURIComponent(userId)}`
      : "/api/halloffame";

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error ?? "Error obteniendo Hall of Fame");
    }

    return data;
  },
};
