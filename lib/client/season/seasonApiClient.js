export const seasonApiClient = {
  create: async (data) => {
    const errors = [];

    if (typeof data !== "object" || data === null) {
      errors.push("Data object is required to create season");
    } else {
      if (typeof data.name !== "string" || !data.name.trim()) {
        errors.push("Name is required to create episode");
      }

      if (typeof data.franchise !== "string" || !data.franchise.trim()) {
        errors.push("Franchise is required to create episode");
      }

      if (!Number(data.year)) {
        errors.push("Year is required to create episode");
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch("/api/season", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error creating season");
    }

    return responseData;
  },

  getRankableSeasons: async () => {
    const res = await fetch("/api/season/rankeable", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error fetching seasons");
    }

    return responseData;
  },

  update: async (data) => {
    const errors = [];

    if (typeof data !== "object" || data === null) {
      errors.push("Data object is required to update season");
    } else {
      if (typeof data.id !== "string" || !data.id.trim()) {
        errors.push("Season Id is required to update episode");
      }

      if (typeof data.name !== "string" || !data.name.trim()) {
        errors.push("Name is required to update episode");
      }

      if (typeof data.franchise !== "string" || !data.franchise.trim()) {
        errors.push("Franchise is required to update episode");
      }

      if (!Number(data.year)) {
        errors.push("Year is required to update episode");
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch("/api/season", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error updating seasons");
    }

    return responseData;
  },

  getAllSeasons: async () => {
    const res = await fetch("/api/season", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error fetching seasons");
    }

    return responseData;
  },

  getUserRankedSeasons: async (userId) => {
    const errors = [];

    if (typeof userId !== "string" || !userId.trim()) {
      errors.push("User Id is required to update episode");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch(
      `/api/season/other?userId=${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error fetching seasons");
    }

    return responseData;
  },
};
