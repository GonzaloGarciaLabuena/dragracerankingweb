import { describe, it, expect, vi, beforeEach } from "vitest";
import { supabaseStorageAPIClient } from "../../lib/client/supabase_storage/supabaseStorageAPIClient";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("supabaseStorageAPIClient", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("getImg", () => {
    it("calls the API correctly and returns the data", async () => {
      const path = "bbdd/image/path";

      const data = "path/url/img.png";

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await supabaseStorageAPIClient.getImg(path);

      expect(fetch).toHaveBeenCalledWith(
        `api/supabase_storage?path=${encodeURIComponent(path)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(supabaseStorageAPIClient.getImg(null)).rejects.toMatchObject(
        {
          message: "Invalid data",
          cause: ["Path is required to fetch image"],
        },
      );

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error fetching queen img",
        }),
      });

      await expect(
        supabaseStorageAPIClient.getImg("bbdd/image/path"),
      ).rejects.toThrow("Error fetching queen img");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        supabaseStorageAPIClient.getImg("bbdd/image/path"),
      ).rejects.toThrow("Error fetching queen img");
    });
  });

  describe("getAllImg", () => {
    it("calls the API correctly and returns the data - default", async () => {
      const data = ["img1", "img2"];

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await supabaseStorageAPIClient.getAllImg(1, 20);

      expect(fetch).toHaveBeenCalledWith(
        `api/supabase_storage/images?page=${1}&pageSize=${20}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
    });

    it("calls the API correctly and returns the data - default", async () => {
      const page = 2;
      const pageSize = 50;
      const data = ["img1", "img2"];

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await supabaseStorageAPIClient.getAllImg(page, pageSize);

      expect(fetch).toHaveBeenCalledWith(
        `api/supabase_storage/images?page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(
        supabaseStorageAPIClient.getAllImg(-1, -1),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "Page must be a positive integer",
          "Page size must be a positive integer",
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error fetching queen img",
        }),
      });

      await expect(supabaseStorageAPIClient.getAllImg(1, 20)).rejects.toThrow(
        "Error fetching queen img",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(supabaseStorageAPIClient.getAllImg(1, 20)).rejects.toThrow(
        "Error fetching queen img",
      );
    });
  });

  describe("uploadImg", () => {
    it("calls the API correctly and returns the data", async () => {
      const franchise = "Drag Race";
      const name = "Queen";
      const imgUrl = "https://example.com/image.jpg";

      const imgBlob = new Blob(["image"]);
      const data = { exists: true };

      fetch
        .mockResolvedValueOnce({
          blob: vi.fn().mockResolvedValue(imgBlob),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue(data),
        });

      const result = await supabaseStorageAPIClient.uploadImg(
        franchise,
        name,
        imgUrl,
      );

      expect(fetch).toHaveBeenNthCalledWith(1, imgUrl);

      const formData = fetch.mock.calls[1][1].body;

      expect(fetch).toHaveBeenNthCalledWith(2, "/api/supabase_storage", {
        method: "POST",
        body: formData,
      });

      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get("franchise")).toBe(franchise);
      expect(formData.get("name")).toBe(name);

      const file = formData.get("file");
      expect(file).toBeInstanceOf(File);
      expect(await file.arrayBuffer()).toEqual(await imgBlob.arrayBuffer());

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(
        supabaseStorageAPIClient.uploadImg(null, null, null),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "Franchise is required",
          "Name is required",
          "Image URL is required",
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when franchise is invalid", async () => {
      await expect(
        supabaseStorageAPIClient.uploadImg(null, "Queen", "imageUrl"),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Franchise is required"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when name is invalid", async () => {
      await expect(
        supabaseStorageAPIClient.uploadImg("Drag Race", null, "imageUrl"),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Name is required"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when imgUrl is invalid", async () => {
      await expect(
        supabaseStorageAPIClient.uploadImg("Drag Race", "Queen", null),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Image URL is required"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      const imgBlob = new Blob(["image"]);

      fetch
        .mockResolvedValueOnce({
          blob: vi.fn().mockResolvedValue(imgBlob),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: vi.fn().mockResolvedValue({
            error: "Error uploading queen img",
          }),
        });

      await expect(
        supabaseStorageAPIClient.uploadImg(
          "Drag Race",
          "Queen",
          "https://example.com/image.jpg",
        ),
      ).rejects.toThrow("Error uploading queen img");
    });

    it("throws the default error if the API does not provide an error", async () => {
      const imgBlob = new Blob(["image"]);

      fetch
        .mockResolvedValueOnce({
          blob: vi.fn().mockResolvedValue(imgBlob),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: vi.fn().mockResolvedValue({}),
        });

      await expect(
        supabaseStorageAPIClient.uploadImg(
          "Drag Race",
          "Queen",
          "https://example.com/image.jpg",
        ),
      ).rejects.toThrow("Error uploading queen img");
    });
  });

  describe("deleteImgQueen", () => {
    it("calls the API correctly and returns the data", async () => {
      const name = "Queen";
      const franchise = "Drag Race";

      const data = { exists: true };

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await supabaseStorageAPIClient.deleteImgQueen(
        name,
        franchise,
      );

      expect(fetch).toHaveBeenCalledWith(
        "api/supabase_storage?path=Drag%20Race%2FQueenCastMug.jpg",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(
        supabaseStorageAPIClient.deleteImgQueen(null, null),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "Name is required to delete queen image",
          "Season franchise is required to delete queen image",
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when name is invalid", async () => {
      await expect(
        supabaseStorageAPIClient.deleteImgQueen(null, "Drag Race"),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Name is required to delete queen image"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when franchise is invalid", async () => {
      await expect(
        supabaseStorageAPIClient.deleteImgQueen("Queen", null),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Season franchise is required to delete queen image"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error deleting queen img",
        }),
      });

      await expect(
        supabaseStorageAPIClient.deleteImgQueen("Queen", "Drag Race"),
      ).rejects.toThrow("Error deleting queen img");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        supabaseStorageAPIClient.deleteImgQueen("Queen", "Drag Race"),
      ).rejects.toThrow("Error deleting queen img");
    });
  });
});
