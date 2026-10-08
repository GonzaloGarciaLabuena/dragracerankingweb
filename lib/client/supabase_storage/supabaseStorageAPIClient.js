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

  uploadImg: async (franchise, name, imgUrl) => {
    const errors = [];

    if (typeof franchise !== "string" || franchise.trim() === "") {
      errors.push("Franchise is required");
    }

    if (typeof name !== "string" || name.trim() === "") {
      errors.push("Name is required");
    }

    if (typeof imgUrl !== "string" || imgUrl.trim() === "") {
      errors.push("Image URL is required");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", { cause: errors });
    }

    
    const imgBlob = await fetch(imgUrl).then((res) => res.blob());

    const formData = new FormData();
    formData.append("franchise", franchise);
    formData.append("name", name);
    formData.append("file", imgBlob);

    const res = await fetch("/api/supabase_storage", {
      method: "POST",
      body: formData,
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error uploading queen img");
    }

    return responseData;
  },

  deleteImgQueen: async (name, franchise) => {
    const errors = [];

    if (typeof name !== "string" || name.trim() === "") {
      errors.push("Name is required to delete queen image");
    }

    if (typeof franchise !== "string" || franchise.trim() === "") {
      errors.push("Season franchise is required to delete queen image");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", { cause: errors });
    }

    const path = `${franchise}/${name}CastMug.jpg`;
    const res = await fetch(
      `api/supabase_storage?path=${encodeURIComponent(path)}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    );

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error ?? "Error deleting queen img");
    }

    return responseData;
  },
};
