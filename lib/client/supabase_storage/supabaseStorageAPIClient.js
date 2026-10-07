export const supabaseStorageAPIClient = {
  getImg: async (path) => {
    const errors = [];

    if (typeof path !== "string" || !path.trim()) {
      errors.push("Path is required to fetch image");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", { cause: errors });
    }

    const res = await fetch(
      `api/supabase_storage?path=${encodeURIComponent(path)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error fetching queen img");
    }

    return responseData;
  },

  getAllImg: async (page = 1, pageSize = 20) => {
    const errors = [];

    if (!Number.isInteger(page) || page < 1) {
      errors.push("Page must be a positive integer");
    }

    if (!Number.isInteger(pageSize) || pageSize < 1) {
      errors.push("Page size must be a positive integer");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", { cause: errors });
    }

    const res = await fetch(
      `api/supabase_storage/images?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error fetching queen img");
    }

    return responseData;
  },
};
