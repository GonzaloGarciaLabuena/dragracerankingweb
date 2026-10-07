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
        cause: ["Page must be a positive integer", "Page size must be a positive integer"],
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

      await expect(
        supabaseStorageAPIClient.getAllImg(1, 20),
      ).rejects.toThrow("Error fetching queen img");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        supabaseStorageAPIClient.getAllImg(1, 20),
      ).rejects.toThrow("Error fetching queen img");
    });
  });
});
