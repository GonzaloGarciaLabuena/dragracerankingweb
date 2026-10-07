export const profileApiClient = {
  get: async () => {
    const res = await fetch("/api/profile", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error getting profile data");
    }

    return responseData;
  },

  getAll: async () => {
    const res = await fetch("/api/profile/all", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error getting profile data");
    }

    return responseData;
  },

  getAllOther: async () => {
    const res = await fetch("/api/profile/other", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error getting profile data");
    }

    return responseData;
  },

  update: async (data) => {
    const errors = [];

    if (typeof data !== "object" || data === null) {
      errors.push("Data object is required to create episode");
    } else {
      if (typeof data.userId !== "string" || !data.userId.trim()) {
        errors.push("User ID is required to update episode");
      }

      if (typeof data.editData !== "object" || data.editData === null) {
        errors.push("Edit Data object is required to update episode");
      } else {
        if (
          data.editData.role !== "" &&
          data.editData.role !== "admin" &&
          data.editData.role !== "user"
        ) {
          errors.push("Role is required to update episode");
        }
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch("/api/profile/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error updating profile");
    }

    return responseData;
  },

  updateSelf: async (data) => {
    const errors = [];

    if (typeof data !== "object" || data === null) {
      errors.push("Data object is required to update profile");
    } else {
      if (typeof data.editData !== "object" || data.editData === null) {
        errors.push("Edit data is required to update profile");
      } else {
        const allowedFields = ["username", "avatar_url"];

        const invalidFields = Object.keys(data.editData).filter(
          (key) => !allowedFields.includes(key),
        );

        if (invalidFields.length > 0) {
          errors.push("Invalid fields in edit data");
        }
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error updating profile");
    }

    return responseData;
  },

  delete: async (data) => {
    const errors = [];

    if (typeof data !== "object" || data === null) {
      errors.push("Data object is required to delete episode");
    } else {
      if (typeof data.userId !== "string" || !data.userId.trim()) {
        errors.push("User ID is required to delete episode");
      }
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const res = await fetch(`/api//profile/admin`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error deleting profile");
    }

    return responseData;
  },
};
