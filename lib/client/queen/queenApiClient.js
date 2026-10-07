export const queenApiClient = {
  get: async (season, page) => {
    const errors = [];

    if (season !== null) {
      if (typeof season !== "object" || Array.isArray(season)) {
        errors.push("Season object is required to fetch queen");
      } else if (typeof season.id !== "string" || !season.id.trim()) {
        errors.push("Season ID is required to fetch queen");
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const params = new URLSearchParams();

    if (season?.id) {
      params.append("seasonId", season.id);
    }

    params.append("page", page);

    const res = await fetch(`/api/queen?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error fetching queens");
    }

    return responseData;
  },

  create: async (data) => {
    const errors = [];

    if (typeof data !== "object" || data === null) {
      errors.push("Data object is required to create participate");
    } else {
      if (typeof data.name !== "string" || !data.name.trim()) {
        errors.push("Queen Name is required to create queen");
      }

      if (typeof data.seasonId !== "string" || !data.seasonId.trim()) {
        errors.push("Season ID is required to create queen");
      }

      if (typeof data.image_url !== "string" || !data.image_url.trim()) {
        errors.push("Image Url is required to create queen");
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch("/api/queen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error creating queen");
    }

    return responseData;
  },

  remove: async (id) => {
    const errors = [];

    if (typeof id !== "string" || !id.trim()) {
      errors.push("ID is required to delete queen");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch("/api/queen", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error deleting queen");
    }

    return responseData;
  },

  existsQueen: async (queenName) => {
    const errors = [];

    if (typeof queenName !== "string" || !queenName.trim()) {
      errors.push("Queen Name is required to check if the queen exists");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch(
      `api/queen/exists?name=${encodeURIComponent(queenName)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error findin queen");
    }

    return responseData;
  },
};
