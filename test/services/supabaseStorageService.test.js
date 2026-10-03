import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { supabaseStorageService } from "../../lib/services/supabaseStorageService";
import { supabaseStorageAPIClient } from "../../lib/client/supabase_storage/supabaseStorageAPIClient";

// Mock seasonApiClient
vi.mock("../../lib/client/supabase_storage/supabaseStorageAPIClient", () => ({
  supabaseStorageAPIClient: {
    getImg: vi.fn(),
    getAllImg: vi.fn(),
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
  });
});
