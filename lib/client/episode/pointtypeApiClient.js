export const pointtypeApiClient = {
  getAll: async (mode) => {
    const errors = [];

    if (typeof mode !== "string" || mode === null) {
      errors.push("Mode is required to fetch point types for the ranking");
    } else {
      if (mode !== "default" && mode !== "final" && mode !== "finalDraga") {
        errors.push("Mode not permited (default, final, finalDraga)");
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch(`/api/pointtype?mode=${mode}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error fetching point types");
    }

    return responseData;
  },
};
