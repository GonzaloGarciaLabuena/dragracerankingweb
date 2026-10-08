import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { seasonService } from "../../lib/services/seasonService";
import { seasonApiClient } from "../../lib/client/season/seasonApiClient";
import { episodeService } from "../../lib/services/episodeService";

// Mock seasonApiClient
vi.mock("../../lib/client/season/seasonApiClient", () => ({
  seasonApiClient: {
    create: vi.fn(),
    getRankableSeasons: vi.fn(),
    update: vi.fn(),
    getAllSeasons: vi.fn(),
    getUserRankedSeasons: vi.fn(),
  },
}));

vi.mock("../../lib/services/episodeService", () => ({
  episodeService: {
    getEpisodes: vi.fn(),
  },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("seasonService", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createSeason", () => {
    it("call createSeason", async () => {
      const name = "nameSeason1";
      const franchise = "FR1";
      const year = 2026;

      const data = {
        id: "name1",
        name: "nameSeason1",
        franchise: "FR1",
        year: 2026,
      };

      seasonApiClient.create.mockResolvedValue(data);
      const result = await seasonService.createSeason(name, franchise, year);
      expect(seasonApiClient.create).toHaveBeenCalledWith({
        name,
        franchise,
        year,
      });

      expect(result.name).toEqual("nameSeason1");
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await seasonService
        .createSeason(null, null, null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Name is required to create the season",
        "Franchise is required to create the season",
        "Year is required to create the season",
      ]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error creating season");

      seasonApiClient.create.mockRejectedValue(apiError);

      const name = "nameSeason1";
      const franchise = "FR1";
      const year = 2026;

      await expect(
        seasonService.createSeason(name, franchise, year),
      ).rejects.toThrow("Error creating season");
    });
  });

  describe("getRankableSeasons", () => {
    it("call getRankableSeasons", async () => {
      seasonApiClient.getRankableSeasons.mockResolvedValue();
      const result = await seasonService.getRankableSeasons();
      expect(seasonApiClient.getRankableSeasons).toHaveBeenCalledWith();
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error fetching seasons");

      seasonApiClient.getRankableSeasons.mockRejectedValue(apiError);

      await expect(seasonService.getRankableSeasons()).rejects.toThrow(
        "Error fetching seasons",
      );
    });
  });

  describe("getSeasonsWithEpisodes", () => {
    it("call getSeasonsWithEpisodes", async () => {
      const seasons = [
        { id: "season1", name: "Season 1" },
        { id: "season2", name: "Season 2" },
      ];

      const episodesSeason1 = [{ id: "episode1", title: "Episode 1" }];

      const episodesSeason2 = [{ id: "episode2", title: "Episode 2" }];

      vi.spyOn(seasonService, "getAllSeasons").mockResolvedValue(seasons);

      episodeService.getEpisodes
        .mockResolvedValueOnce(episodesSeason1)
        .mockResolvedValueOnce(episodesSeason2);

      const result = await seasonService.getSeasonsWithEpisodes();

      expect(seasonService.getAllSeasons).toHaveBeenCalled();

      expect(episodeService.getEpisodes).toHaveBeenCalledWith("season1");
      expect(episodeService.getEpisodes).toHaveBeenCalledWith("season2");

      expect(result).toEqual(
        new Map([
          [seasons[0], episodesSeason1],
          [seasons[1], episodesSeason2],
        ]),
      );
    });
  });

  describe("updateSeason", () => {
    it("call updateSeason", async () => {
      const id = "season1";

      const newName = "newSeason1";
      const newFranchise = "NEWFR1";
      const newYear = 2027;

      const data = {
        id: "season1",
        name: "newSeason1",
        franchise: "NEWFR1",
        year: 2027,
      };

      seasonApiClient.update.mockResolvedValue({ success: true, data });
      const result = await seasonService.updateSeason(
        id,
        newName,
        newFranchise,
        newYear,
      );
      expect(seasonApiClient.update).toHaveBeenCalledWith({
        id,
        name: newName,
        franchise: newFranchise,
        year: newYear,
      });

      expect(result.success).toEqual(true);
      expect(result.data.id).toEqual(id);
      expect(result.data.name).toEqual(newName);
      expect(result.data.franchise).toEqual(newFranchise);
      expect(result.data.year).toEqual(newYear);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await seasonService
        .updateSeason(null, null, null, null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "ID is required to update the season",
        "Name is required to update the season",
        "Franchise is required to update the season",
        "Year is required to update the season",
      ]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error updating episode");

      const id = "season1";

      const newName = "newSeason1";
      const newFranchise = "NEWFR1";
      const newYear = 2027;

      seasonApiClient.update.mockRejectedValue(apiError);

      await expect(
        seasonService.updateSeason(id, newName, newFranchise, newYear),
      ).rejects.toThrow("Error updating episode");
    });
  });

  describe("getAllSeasons", () => {
    it("call getAllSeasons", async () => {
      const seasons = [
        { id: "season1", name: "Season 1" },
        { id: "season2", name: "Season 2" },
      ];

      seasonApiClient.getAllSeasons.mockResolvedValue(seasons);
      const result = await seasonService.getAllSeasons();
      expect(seasonApiClient.getAllSeasons).toHaveBeenCalledWith();
      expect(result).toEqual(seasons);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error fetching seasons");

      seasonApiClient.getAllSeasons.mockRejectedValue(apiError);

      await expect(
        seasonService.getAllSeasons(),
      ).rejects.toThrow("Error fetching seasons");
    });
  });

  describe("getRankableSeasonsWithEpisodes", () => {
    it("call getRankableSeasonsWithEpisodes", async () => {
      const seasons = [
        { id: "season1", name: "Season 1" },
        { id: "season2", name: "Season 2" },
      ];

      const episodesSeason1 = [{ id: "episode1", title: "Episode 1" }];

      const episodesSeason2 = [{ id: "episode2", title: "Episode 2" }];

      vi.spyOn(seasonService, "getRankableSeasons").mockResolvedValue(seasons);

      episodeService.getEpisodes
        .mockResolvedValueOnce(episodesSeason1)
        .mockResolvedValueOnce(episodesSeason2);

      const result = await seasonService.getRankableSeasonsWithEpisodes();

      expect(seasonService.getRankableSeasons).toHaveBeenCalled();

      expect(episodeService.getEpisodes).toHaveBeenCalledWith("season1");

      expect(episodeService.getEpisodes).toHaveBeenCalledWith("season2");

      expect(result).toEqual(
        new Map([
          [seasons[0], episodesSeason1],
          [seasons[1], episodesSeason2],
        ]),
      );
    });
  });

  describe("getUserRankedSeasons", () => {
    it("call getUserRankedSeasons", async () => {
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
      seasonApiClient.getUserRankedSeasons.mockResolvedValue(data);
      const result = await seasonService.getUserRankedSeasons(user);
      expect(seasonApiClient.getUserRankedSeasons).toHaveBeenCalledWith(
        user.id,
      );

      expect(result).toEqual(data);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await seasonService
        .getUserRankedSeasons(null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "User object is required to create the episode",
      ]);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await seasonService
        .getUserRankedSeasons({})
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual(["ID for the user is required"]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error fetching seasons");

      const user = { id: "user1", username: "username1" };

      seasonApiClient.getUserRankedSeasons.mockRejectedValue(apiError);

      await expect(
        seasonService.getUserRankedSeasons(user),
      ).rejects.toThrow("Error fetching seasons");
    });
  });
});
