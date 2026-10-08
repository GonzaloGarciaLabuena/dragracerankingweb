import { describe, it, expect, vi, beforeEach } from "vitest";
import { ppeApiClient } from "../../lib/client/ppe/ppeApiClient";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ppeApiClient", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("saveRanking", () => {
    it("calls the API correctly and returns the data", async () => {
      const season_id = "season1";
      const rows = [
        {
          queen_id: "queen1",
          episode_id: "episode1",
          point_type_id: "point1",
        },
        {
          queen_id: "queen1",
          episode_id: "episode2",
          point_type_id: null,
        },
      ];

      const data = { success: true };

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await ppeApiClient.saveRanking({
        season_id: season_id,
        rows,
      });

      expect(fetch).toHaveBeenCalledWith("/api/ppe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          season_id: "season1",
          rows,
        }),
      });

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(
        ppeApiClient.saveRanking({
          season_id: "",
          rows: [
            null,
            {
              queen_id: "",
              episode_id: "",
              point_type_id: 123,
            },
          ],
        }),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "Season ID is required to save ranking",
          "Row 0 must be an object",
          "Queen ID is required for row 1",
          "Episode ID is required for row 1",
          "Point Type ID must be a string or null for row 1",
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when rows is not an array", async () => {
      await expect(
        ppeApiClient.saveRanking({
          season_id: "season1",
          rows: {},
        }),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Rows array is required to save ranking"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("allows point_type_id to be null", async () => {
      const rows = [
        {
          queen_id: "queen1",
          episode_id: "episode1",
          point_type_id: null,
        },
      ];

      const data = { success: true };

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await ppeApiClient.saveRanking({
        season_id: "season1",
        rows,
      });

      expect(result).toEqual(data);
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error saving ranking from API",
        }),
      });

      await expect(
        ppeApiClient.saveRanking({
          season_id: "season1",
          rows: [],
        }),
      ).rejects.toThrow("Error saving ranking from API");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        ppeApiClient.saveRanking({
          season_id: "season1",
          rows: [],
        }),
      ).rejects.toThrow("Error saving ranking");
    });
  });

  describe("getRanking", () => {
    it("calls the API correctly and returns the data", async () => {
      const seasonId = "season1";

      const data = [
        {
          point_type_id: {
            id: "point1",
          },
          ppe_reference: {
            episode_id: {
              id: "episode1",
            },
            queen_id: {
              id: "queen1",
            },
          },
        },
      ];
      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await ppeApiClient.getRanking(seasonId);

      expect(fetch).toHaveBeenCalledWith(`/api/ppe?seasonId=${seasonId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(ppeApiClient.getRanking(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Season ID is required"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Unauthorized",
        }),
      });

      await expect(ppeApiClient.getRanking("season1")).rejects.toThrow(
        "Unauthorized",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(ppeApiClient.getRanking("season1")).rejects.toThrow(
        "Error getting ranking",
      );
    });
  });

  describe("getRankingUser", () => {
    it("calls the API correctly and returns the data", async () => {
      const seasonId = "season1";
      const userId = "user1";
      const data = [
        {
          point_type_id: {
            id: "point1",
          },
          ppe_reference: {
            episode_id: {
              id: "episode1",
            },
            queen_id: {
              id: "queen1",
            },
          },
        },
      ];
      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await ppeApiClient.getRankingUser(userId, seasonId);

      expect(fetch).toHaveBeenCalledWith(
        `/api/ppe/users?userId=${userId}&seasonId=${seasonId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(
        ppeApiClient.getRankingUser(null, null),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "User ID is required to get the ranking of a user",
          "Season ID is required to get the ranking of a user",
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Unauthorized",
        }),
      });

      await expect(
        ppeApiClient.getRankingUser("user1", "season1"),
      ).rejects.toThrow("Unauthorized");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        ppeApiClient.getRankingUser("user1", "season1"),
      ).rejects.toThrow("Error getting ranking of user");
    });
  });

  describe("publishRanking", () => {
    it("calls the API correctly and returns the data", async () => {
      const seasonId = "season1";
      const data = {
        success: true,
        created: 5,
        queens: 3,
        episodes: 4,
      };
      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await ppeApiClient.publishRanking(seasonId);

      expect(fetch).toHaveBeenCalledWith("/api/ppe_reference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seasonId }),
      });

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(ppeApiClient.publishRanking(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Season ID is required to publish ranking"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Unauthorized",
        }),
      });

      await expect(ppeApiClient.publishRanking("season1")).rejects.toThrow(
        "Unauthorized",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(ppeApiClient.publishRanking("season1")).rejects.toThrow(
        "Error publishing ranking",
      );
    });
  });

  describe("getHallOfFame", () => {
    it("calls the API correctly and returns the data of the user", async () => {
      const data = [
        {
          seasonId: "season1",
          winner: {
            id: "queen1",
            name: "Queen 1",
            image_url: "https://...",
            score: "4.125",
            season: "Season Name",
            franchise: "RuPaul's Drag Race",
            year: 2025,
            nEpisodes: 10,
            winner: true,
          },
        },
      ];
      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await ppeApiClient.getHallOfFame(null);

      expect(fetch).toHaveBeenCalledWith("/api/halloffame", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(result).toEqual(data);
    });

    it("calls the API correctly and returns the data of that user", async () => {
      const userId = "user1";
      const data = [
        {
          seasonId: "season1",
          winner: {
            id: "queen1",
            name: "Queen 1",
            image_url: "https://...",
            score: "4.125",
            season: "Season Name",
            franchise: "RuPaul's Drag Race",
            year: 2025,
            nEpisodes: 10,
            winner: true,
          },
        },
      ];
      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await ppeApiClient.getHallOfFame(userId);

      expect(fetch).toHaveBeenCalledWith(`/api/halloffame?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(ppeApiClient.getHallOfFame(123)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["User ID is required to get the ranking of a user"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "No autenticado",
        }),
      });

      await expect(ppeApiClient.getHallOfFame("user1")).rejects.toThrow(
        "No autenticado",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(ppeApiClient.getHallOfFame("user1")).rejects.toThrow(
        "Error obteniendo Hall of Fame",
      );
    });
  });
});
