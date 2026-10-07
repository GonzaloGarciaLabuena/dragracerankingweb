import { describe, it, expect, vi, beforeEach } from "vitest";
import { queenApiClient } from "../../lib/client/queen/queenApiClient";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("queenApiClient", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("get", () => {
    it("calls the API correctly and returns the data with season", async () => {
      const season = {
        id: "season1",
        name: "Drag Season 1",
        franchise: "Franchise 1",
        year: "2026",
      };
      const page = 1;

      const data = [
        {
          queen: {
            id: "queen1",
            name: "name1",
          },
          image_url: "image_url1",
          season: "season1",
        },
        {
          queen: {
            id: "queen2",
            name: "name2",
          },
          image_url: "image_url2",
          season: "season1",
        },
        {
          queen: {
            id: "queen3",
            name: "name3",
          },
          image_url: "image_url3",
          season: "season1",
        },
      ];
      const totalPages = 1;

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ data, totalPages }),
      });

      const result = await queenApiClient.get(season, page);

      expect(fetch).toHaveBeenCalledWith(
        `/api/queen?seasonId=${season.id}&page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(result).toEqual({ data, totalPages });
    });

    it("calls the API correctly and returns the data without season", async () => {
      const season = null;
      const page = 1;

      const data = [
        {
          queen: {
            id: "queen1",
            name: "name1",
          },
          image_url: "image_url1",
          season: "season1",
        },
        {
          queen: {
            id: "queen2",
            name: "name2",
          },
          image_url: "image_url2",
          season: "season2",
        },
        {
          queen: {
            id: "queen3",
            name: "name3",
          },
          image_url: "image_url3",
          season: "season3",
        },
      ];
      const totalPages = 1;

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ data, totalPages }),
      });

      const result = await queenApiClient.get(season, page);

      expect(fetch).toHaveBeenCalledWith(`/api/queen?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(result).toEqual({ data, totalPages });
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(queenApiClient.get(123, null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "Season object is required to fetch queen",
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when season is empty", async () => {
      await expect(queenApiClient.get({}, null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Season ID is required to fetch queen"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error fetching queens",
        }),
      });

      await expect(queenApiClient.get({ id: "season1" }, 1)).rejects.toThrow(
        "Error fetching queens",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(queenApiClient.get({ id: "season1" }, 1)).rejects.toThrow(
        "Error fetching queens",
      );
    });
  });

  describe("create", () => {
    it("calls the API correctly and returns the data", async () => {
      const input = {
        name: "name1",
        seasonId: "season1",
        image_url: "image_url1",
      };
      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          exists: true,
        }),
      });

      const result = await queenApiClient.create(input);

      expect(fetch).toHaveBeenCalledWith("/api/queen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      expect(result.exists).toEqual(true);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(queenApiClient.create({})).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "Queen Name is required to create queen",
          "Season ID is required to create queen",
          "Image Url is required to create queen",
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when data is empty", async () => {
      await expect(queenApiClient.create(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Data object is required to create participate"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error creating queen",
        }),
      });

      await expect(
        queenApiClient.create({
          name: "name1",
          seasonId: "season1",
          image_url: "image_url1",
        }),
      ).rejects.toThrow("Error creating queen");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        queenApiClient.create({
          name: "name1",
          seasonId: "season1",
          image_url: "image_url1",
        }),
      ).rejects.toThrow("Error creating queen");
    });
  });

  describe("remove", () => {
    it("calls the API correctly and returns the data", async () => {
      const id = "user1";

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          exists: true,
        }),
      });

      const result = await queenApiClient.remove(id);

      expect(fetch).toHaveBeenCalledWith("/api/queen", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      expect(result.exists).toEqual(true);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(queenApiClient.remove(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["ID is required to delete queen"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error deleting queen",
        }),
      });

      await expect(queenApiClient.remove("user1")).rejects.toThrow(
        "Error deleting queen",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(queenApiClient.remove("user1")).rejects.toThrow(
        "Error deleting queen",
      );
    });
  });

  describe("existsQueen", () => {
    it("calls the API correctly and returns the data", async () => {
      const queenName = "name1";

      const data = {
        id: "queen1",
        name: "name1",
      };

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await queenApiClient.existsQueen(queenName);

      expect(fetch).toHaveBeenCalledWith(`api/queen/exists?name=${queenName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(queenApiClient.existsQueen(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Queen Name is required to check if the queen exists"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error findin queen",
        }),
      });

      await expect(queenApiClient.existsQueen("name1")).rejects.toThrow(
        "Error findin queen",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(queenApiClient.existsQueen("user1")).rejects.toThrow(
        "Error findin queen",
      );
    });
  });
});
