import { describe, it, expect, vi, beforeEach } from "vitest";
import { episodeApiClient } from "../../lib/client/episode/episodeApiClient";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("episodeApiClient", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("create", () => {
    it("calls the API correctly and returns the data", async () => {
      const seasonId = "season1";
      const newEpisode = {
        title: "episodeTitle",
        esFinal: false,
        esFinalDraga: false,
      };

      const data = {
        seasonId: "season1",
        title: "episodeTitle",
        esFinal: false,
        esFinalDraga: false,
      };

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await episodeApiClient.create({
        seasonId,
        newEpisode,
      });

      expect(fetch).toHaveBeenCalledWith("/api/episode/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seasonId, newEpisode }),
      });

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(
        episodeApiClient.create({
          seasonId: null,
          newEpisode: {},
        }),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "Season ID is required to create episode",
          "Title is required to create episode",
          "esFinal must be a boolean to create episode",
          "esFinalDraga must be a boolean to create episode",
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when data is not an object", async () => {
      await expect(episodeApiClient.create(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Data object is required to create episode"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when newEpisode is not an object", async () => {
      await expect(
        episodeApiClient.create({
          seasonId: "season1",
          newEpisode: null,
        }),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Data NewEpisode object is required to create episode"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error creating episode",
        }),
      });

      await expect(
        episodeApiClient.create({
          seasonId: "season1",
          newEpisode: {
            title: "episodeTitle",
            esFinal: false,
            esFinalDraga: false,
          },
        }),
      ).rejects.toThrow("Error creating episode");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        episodeApiClient.create({
          seasonId: "season1",
          newEpisode: {
            title: "episodeTitle",
            esFinal: false,
            esFinalDraga: false,
          },
        }),
      ).rejects.toThrow("Error creating episode");
    });
  });

  describe("get", () => {
    it("calls the API correctly and returns the data", async () => {
      const seasonId = "season1";

      const data = [
        {
          id: "episode1",
          number: 1,
          title: "title1",
          esFinal: false,
          esFinalDraga: false,
        },
        {
          id: "episode2",
          number: 2,
          title: "title2",
          esFinal: true,
          esFinalDraga: false,
        },
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await episodeApiClient.get(seasonId);

      expect(fetch).toHaveBeenCalledWith(`/api/episode?seasonId=${seasonId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(episodeApiClient.get(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Season ID is required to get episode"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error getting episode",
        }),
      });

      await expect(episodeApiClient.get("season1")).rejects.toThrow(
        "Error getting episode",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(episodeApiClient.get("season1")).rejects.toThrow(
        "Error getting episode",
      );
    });
  });

  describe("getAdmin", () => {
    it("calls the API correctly and returns the data", async () => {
      const seasonId = "season1";

      const data = [
        {
          id: "episode1",
          number: 1,
          title: "title1",
          esFinal: false,
          esFinalDraga: false,
        },
        {
          id: "episode2",
          number: 2,
          title: "title2",
          esFinal: true,
          esFinalDraga: false,
        },
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await episodeApiClient.getAdmin(seasonId);

      expect(fetch).toHaveBeenCalledWith(
        `/api/episode/admin?seasonId=${seasonId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(episodeApiClient.getAdmin(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Season ID is required to get episode"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error getting episode",
        }),
      });

      await expect(episodeApiClient.getAdmin("season1")).rejects.toThrow(
        "Error getting episode",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(episodeApiClient.getAdmin("season1")).rejects.toThrow(
        "Error getting episode",
      );
    });
  });

  describe("deleteLast", () => {
    it("calls the API correctly and returns the data", async () => {
      const seasonId = "season1";

      const data = {
        deleted: true,
        id: "episode1",
        number: 1,
        title: "title1",
      };

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await episodeApiClient.deleteLast(seasonId);

      expect(fetch).toHaveBeenCalledWith(
        `/api/episode/admin?seasonId=${seasonId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(episodeApiClient.deleteLast(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Season ID is required to delete episode"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error deleting episode",
        }),
      });

      await expect(episodeApiClient.deleteLast("season1")).rejects.toThrow(
        "Error deleting episode",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(episodeApiClient.deleteLast("season1")).rejects.toThrow(
        "Error deleting episode",
      );
    });
  });

  describe("update", () => {
    it("calls the API correctly and returns the data", async () => {
      const episodeNew = {
        id: "episode1",
        title: "titleNew",
        esFinal: true,
        esFinalDraga: false,
      };

      const data = {
        id: "episode1",
        title: "titleNew",
        esFinal: true,
        esFinalDraga: false,
      };

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await episodeApiClient.update({ episode: episodeNew });

      expect(fetch).toHaveBeenCalledWith("/api/episode/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episode: episodeNew }),
      });

      expect(result).toEqual(data);
    });

    it("throws an error when episode is not an object", async () => {
      await expect(episodeApiClient.update({})).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "Data Episode object is required to update episode"
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(episodeApiClient.update({episode: {}})).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "ID is required to update episode",
          "Title is required to update episode",
          "esFinal must be a boolean to update episode",
          "esFinalDraga must be a boolean to update episode",
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error updating episode",
        }),
      });

      await expect(
        episodeApiClient.update({
          episode: {
            id: "episode1",
            title: "titleNew",
            esFinal: true,
            esFinalDraga: false,
          },
        }),
      ).rejects.toThrow("Error updating episode");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        episodeApiClient.update({
          episode: {
            id: "episode1",
            title: "titleNew",
            esFinal: true,
            esFinalDraga: false,
          },
        }),
      ).rejects.toThrow("Error updating episode");
    });
  });
});
