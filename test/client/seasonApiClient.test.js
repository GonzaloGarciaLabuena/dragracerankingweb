import { describe, it, expect, vi, beforeEach } from "vitest";
import { seasonApiClient } from "../../lib/client/season/seasonApiClient";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("seasonApiClient", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("create", () => {
    it("calls the API correctly and returns the data", async () => {
      const name = "nameSeason1";
      const franchise = "FR1";
      const year = 2026;

      const data = {
        id: "name1",
        name: "nameSeason1",
        franchise: "FR1",
        year: 2026,
      };

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await seasonApiClient.create({ name, franchise, year });

      expect(fetch).toHaveBeenCalledWith("/api/season", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, franchise, year }),
      });

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(
        seasonApiClient.create({
          name: null,
          franchise: null,
          year: null,
        }),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "Name is required to create episode",
          "Franchise is required to create episode",
          "Year is required to create episode",
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when data is not an object", async () => {
      await expect(seasonApiClient.create(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Data object is required to create season"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error creating season",
        }),
      });

      await expect(
        seasonApiClient.create({
          name: "name1",
          franchise: "franchise1",
          year: 2026,
        }),
      ).rejects.toThrow("Error creating season");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        seasonApiClient.create({
          name: "name1",
          franchise: "franchise1",
          year: 2026,
        }),
      ).rejects.toThrow("Error creating season");
    });
  });

  describe("getRankableSeasons", () => {
    it("calls the API correctly and returns the data", async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(undefined),
      });

      await seasonApiClient.getRankableSeasons();

      expect(fetch).toHaveBeenCalledWith("/api/season/rankeable", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error fetching seasons",
        }),
      });

      await expect(seasonApiClient.getRankableSeasons()).rejects.toThrow(
        "Error fetching seasons",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(seasonApiClient.getRankableSeasons()).rejects.toThrow(
        "Error fetching seasons",
      );
    });
  });

  describe("update", () => {
    it("calls the API correctly and returns the data", async () => {
      const id = "season1";

      const name = "newSeason1";
      const franchise = "NEWFR1";
      const year = 2027;

      const data = {
        id: "season1",
        name: "newSeason1",
        franchise: "NEWFR1",
        year: 2027,
      };

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true, data }),
      });

      const result = await seasonApiClient.update({
        id,
        name,
        franchise,
        year,
      });

      expect(fetch).toHaveBeenCalledWith("/api/season", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          franchise,
          year,
        }),
      });

      expect(result.success).toEqual(true);
      expect(result.data).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(
        seasonApiClient.update({
          id: null,
          name: null,
          franchise: null,
          year: null,
        }),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "Season Id is required to update episode",
          "Name is required to update episode",
          "Franchise is required to update episode",
          "Year is required to update episode",
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when data is not an object", async () => {
      await expect(seasonApiClient.update(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Data object is required to update season"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error updating seasons",
        }),
      });

      await expect(
        seasonApiClient.update({
          id: "user1",
          name: "name1",
          franchise: "franchise1",
          year: 2026,
        }),
      ).rejects.toThrow("Error updating seasons");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        seasonApiClient.update({
          id: "user1",
          name: "name1",
          franchise: "franchise1",
          year: 2026,
        }),
      ).rejects.toThrow("Error updating seasons");
    });
  });

  describe("getAllSeasons", () => {
    it("calls the API correctly and returns the data", async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(undefined),
      });

      await seasonApiClient.getAllSeasons();

      expect(fetch).toHaveBeenCalledWith("/api/season", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error fetching seasons",
        }),
      });

      await expect(seasonApiClient.getAllSeasons()).rejects.toThrow(
        "Error fetching seasons",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(seasonApiClient.getAllSeasons()).rejects.toThrow(
        "Error fetching seasons",
      );
    });
  });

  describe("getUserRankedSeasons", () => {
    it("calls the API correctly and returns the data", async () => {
      const user = { id: "user1", username: "username1" };

      const data = [
        {
          id: "season1",
          name: "seasonName1",
          franchise: "FR1",
          year: 2026,
        },
        {
          id: "season2",
          name: "seasonName2",
          franchise: "FR2",
          year: 2026,
        },
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await seasonApiClient.getUserRankedSeasons(user.id);

      expect(fetch).toHaveBeenCalledWith(
        `/api/season/other?userId=${user.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(
        seasonApiClient.getUserRankedSeasons(null),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["User Id is required to update episode"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error fetching seasons",
        }),
      });

      await expect(
        seasonApiClient.getUserRankedSeasons("user1"),
      ).rejects.toThrow("Error fetching seasons");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        seasonApiClient.getUserRankedSeasons("user1"),
      ).rejects.toThrow("Error fetching seasons");
    });
  });
});
