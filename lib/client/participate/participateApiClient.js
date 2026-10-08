export const participateApiClient = {
  create: async (data) => {
    const errors = [];

    if (typeof data !== "object" || data === null) {
      errors.push("Data object is required to create participate");
    } else {
      if (typeof data.queenId !== "string" || !data.queenId.trim()) {
        errors.push("Queen ID is required to create participate");
      }

      if (typeof data.seasonId !== "string" || !data.seasonId.trim()) {
        errors.push("Season ID is required to create participate");
      }

      if (typeof data.image_url !== "string" || !data.image_url.trim()) {
        errors.push("Image Url is required to create participate");
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch("/api/participate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error creating participate");
    }

    return responseData;
  },

  getAll: async () => {
    const res = await fetch("/api/participate", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error fetching seasons");
    }

    return responseData;
  },

  delete: async (data) => {
    const errors = [];

    if (typeof data !== "object" || data === null) {
      errors.push("Data object is required to delete participate");
    } else {
      if (typeof data.queenId !== "string" || !data.queenId.trim()) {
        errors.push("Queen ID is required to delete participate");
      }

      if (typeof data.seasonId !== "string" || !data.seasonId.trim()) {
        errors.push("Season ID is required to delete participate");
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch("/api/participate", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error deleting participate");
    }

    return responseData;
  },

  update: async (data) => {
    const errors = [];

    if (typeof data !== "object" || data === null) {
      errors.push("Data object is required to delete participate");
    } else {
      if (typeof data.queenId !== "string" || !data.queenId.trim()) {
        errors.push("Queen ID is required to update participate");
      }

      if (typeof data.seasonId !== "string" || !data.seasonId.trim()) {
        errors.push("Season ID is required to update participate");
      }

      if (typeof data.imgPath !== "string" || !data.imgPath.trim()) {
        errors.push("Image Path is required to update participate");
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch("/api/participate", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error deleting participate");
    }

    return responseData;
  },
};
