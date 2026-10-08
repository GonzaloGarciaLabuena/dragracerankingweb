import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { supabaseStorageService } from "../../lib/services/supabaseStorageService";
import { supabaseStorageAPIClient } from "../../lib/client/supabase_storage/supabaseStorageAPIClient";

// Mock seasonApiClient
vi.mock("../../lib/client/supabase_storage/supabaseStorageAPIClient", () => ({
  supabaseStorageAPIClient: {
    getImg: vi.fn(),
    getAllImg: vi.fn(),
    uploadImg: vi.fn(),
    deleteImgQueen: vi.fn(),
  },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("supabaseStorageService", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("getQueenImg", () => {
    it("call getQueenImg", async () => {
      const path = "bbdd/image/path";

      const data = "path/url/img.png";
      supabaseStorageAPIClient.getImg.mockResolvedValue(data);
      const result = await supabaseStorageService.getQueenImg(path);
      expect(supabaseStorageAPIClient.getImg).toHaveBeenCalledWith(path);

      expect(result).toEqual(data);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await supabaseStorageService
        .getQueenImg(null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual(["Path is required to get the queen image"]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error fetching queen img");

      const path = "bbdd/image/path";

      supabaseStorageAPIClient.getImg.mockRejectedValue(apiError);

      await expect(supabaseStorageService.getQueenImg(path)).rejects.toThrow(
        "Error fetching queen img",
      );
    });
  });

  describe("getAllImg", () => {
    it("call getAllImg - default", async () => {
      const data = ["img1", "img2"];

      supabaseStorageAPIClient.getAllImg.mockResolvedValue(data);

      const result = await supabaseStorageService.getAllImg();

      expect(supabaseStorageAPIClient.getAllImg).toHaveBeenCalledWith(1, 20);
      expect(result).toEqual(data);
    });

    it("call getAllImg", async () => {
      const page = 2;
      const pageSize = 50;
      const data = ["img1", "img2"];

      supabaseStorageAPIClient.getAllImg.mockResolvedValue(data);

      const result = await supabaseStorageService.getAllImg(page, pageSize);

      expect(supabaseStorageAPIClient.getAllImg).toHaveBeenCalledWith(
        page,
        pageSize,
      );

      expect(result).toEqual(data);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await supabaseStorageService
        .getAllImg(-1, -1)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Page must be a positive integer",
        "Page size must be a positive integer",
      ]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error fetching queen img");

      supabaseStorageAPIClient.getAllImg.mockRejectedValue(apiError);

      await expect(supabaseStorageService.getAllImg()).rejects.toThrow(
        "Error fetching queen img",
      );
    });
  });

  describe("uploadImgQueen", () => {
    it("uploads queen image", async () => {
      const season = {
        franchise: "FR1",
      };
      const name = "queen";
      const url = "https://example.com/image.jpg";

      supabaseStorageAPIClient.uploadImg.mockResolvedValue("imgPath");

      const result = await supabaseStorageService.uploadImgQueen(
        season,
        name,
        url,
      );

      expect(supabaseStorageAPIClient.uploadImg).toHaveBeenCalledWith(
        "FR1",
        "queen",
        "https://example.com/image.jpg",
      );

      expect(result).toBe("imgPath");
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await supabaseStorageService
        .uploadImgQueen(null, null, null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Season is required to upload queen image",
        "Name is required to upload queen image",
        "Image URL is required to upload queen image",
      ]);
    });

    it("devuelve todos los errores cuando season es inválida", async () => {
      const error = await supabaseStorageService
        .uploadImgQueen({}, "queen", "https://example.com/image.jpg")
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Season franchise is required to upload queen image",
      ]);
    });

    it("devuelve error cuando la URL no es válida", async () => {
      const error = await supabaseStorageService
        .uploadImgQueen({ franchise: "FR1" }, "queen", "invalid-url")
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual(["Image URL must be a valid URL"]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error uploading image");

      supabaseStorageAPIClient.uploadImg.mockRejectedValue(apiError);

      await expect(
        supabaseStorageService.uploadImgQueen(
          { franchise: "FR1" },
          "queen",
          "https://example.com/image.jpg",
        ),
      ).rejects.toThrow("Error uploading image");
    });
  });

  describe("deleteImgQueen", () => {
    it("deletes queen image", async () => {
      const name = "queen";
      const season = {
        franchise: "FR1",
      };

      supabaseStorageAPIClient.deleteImgQueen.mockResolvedValue({
        success: true,
      });

      const result = await supabaseStorageService.deleteImgQueen(name, season);

      expect(supabaseStorageAPIClient.deleteImgQueen).toHaveBeenCalledWith(
        "queen",
        "FR1",
      );

      expect(result).toEqual({
        success: true,
      });
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await supabaseStorageService
        .deleteImgQueen(null, null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Name is required to delete queen image",
        "Season is required to delete queen image",
      ]);
    });

    it("devuelve error cuando el season no tiene franchise", async () => {
      const error = await supabaseStorageService
        .deleteImgQueen("queen", {})
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Season franchise is required to delete queen image",
      ]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error deleting image");

      supabaseStorageAPIClient.deleteImgQueen.mockRejectedValue(apiError);

      await expect(
        supabaseStorageService.deleteImgQueen("queen", { franchise: "FR1" }),
      ).rejects.toThrow("Error deleting image");
    });
  });

  describe("updateImgQueen", () => {
    it("updates queen image", async () => {
      const queen = {
        name: "queen",
      };

      const season = {
        franchise: "FR1",
      };

      const image_url = "https://example.com/image.jpg";

      supabaseStorageAPIClient.uploadImg.mockResolvedValue("imgPath");

      const result = await supabaseStorageService.updateImgQueen(
        queen,
        season,
        image_url,
      );

      expect(supabaseStorageAPIClient.uploadImg).toHaveBeenCalledWith(
        "FR1",
        "queen",
        "https://example.com/image.jpg",
      );

      expect(result).toBe("imgPath");
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await supabaseStorageService
        .updateImgQueen(null, null, null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Queen is required to update queen image",
        "Season is required to update queen image",
        "ImageUrl is required to update queen image",
      ]);
    });

    it("devuelve error cuando queen no tiene nombre", async () => {
      const error = await supabaseStorageService
        .updateImgQueen(
          {},
          { franchise: "FR1" },
          "https://example.com/image.jpg",
        )
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Queen Name is required to update queen image",
      ]);
    });

    it("devuelve error cuando season no tiene franchise", async () => {
      const error = await supabaseStorageService
        .updateImgQueen({ name: "queen" }, {}, "https://example.com/image.jpg")
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Season Franchise is required to update queen image",
      ]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error updating image");

      supabaseStorageAPIClient.uploadImg.mockRejectedValue(apiError);

      await expect(
        supabaseStorageService.updateImgQueen(
          { name: "queen" },
          { franchise: "FR1" },
          "https://example.com/image.jpg",
        ),
      ).rejects.toThrow("Error updating image");
    });
  });
});
