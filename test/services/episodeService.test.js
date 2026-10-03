import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { episodeService } from "../../lib/services/episodeService";
import { episodeApiClient } from "../../lib/client/episode/episodeApiClient";

// Mock episodeApiClient
vi.mock("../../lib/client/episode/episodeApiClient", () => ({
  episodeApiClient: {
    create: vi.fn(),
    get: vi.fn(),
    getAdmin: vi.fn(),
    deleteLast: vi.fn(),
    update: vi.fn(),
  },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("episodeService", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("createEpisode", () => {
    it("call createEpisode", async () => {
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

      episodeApiClient.create.mockResolvedValue(data);
      const result = await episodeService.createEpisode(seasonId, newEpisode);
      expect(episodeApiClient.create).toHaveBeenCalledWith({
        seasonId,
        newEpisode,
      });

      expect(result.seasonId).toEqual(seasonId);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await episodeService
        .createEpisode(null, null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Season ID is required to create the episode",
        "Episode object is required to create the episode",
      ]);
    });

    it("devuelve todos los errores cuando el objeto episode está vacio", async () => {
      const error = await episodeService
        .createEpisode("season1", {})
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Title for the episode is required",
        "Final values for the episode are required",
      ]);
    });

    it("devuelve error cuando son más de un tipo de final a la vez", async () => {
      const error = await episodeService
        .createEpisode("season1", {
          title: "title",
          esFinal: true,
          esFinalDraga: true,
        })
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "An episode cannot be both final and final Draga",
      ]);
    });
  });

  describe("getEpisodes", () => {
    it("call getEpisodes", async () => {
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
      episodeApiClient.get.mockResolvedValue(data);
      const result = await episodeService.getEpisodes(seasonId);
      expect(episodeApiClient.get).toHaveBeenCalledWith(seasonId);

      expect(result[0].id).toEqual("episode1");
      expect(result[1].id).toEqual("episode2");
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await episodeService
        .getEpisodes(null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Season ID is required to fetch the episodes",
      ]);
    });
  });

  describe("getEpisodesAdmin", () => {
    it("call getEpisodesAdmin", async () => {
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

      episodeApiClient.getAdmin.mockResolvedValue(data);
      const result = await episodeService.getEpisodesAdmin(seasonId);
      expect(episodeApiClient.getAdmin).toHaveBeenCalledWith(seasonId);

      expect(result[0].id).toEqual("episode1");
      expect(result[1].id).toEqual("episode2");
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await episodeService
        .getEpisodesAdmin(null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Season ID is required to fetch the episodes",
      ]);
    });
  });

  describe("deleteLastEpisode", () => {
    it("call deleteLastEpisode", async () => {
      const seasonId = "season1";
      const data = {
        deleted: true,
        id: "episode1",
        number: 1,
        title: "title1",
      };

      episodeApiClient.deleteLast.mockResolvedValue(data);
      const result = await episodeService.deleteLastEpisode(seasonId);
      expect(episodeApiClient.deleteLast).toHaveBeenCalledWith(seasonId);

      expect(result.deleted).toEqual(true);
      expect(result.id).toEqual("episode1");
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await episodeService
        .deleteLastEpisode(null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Season ID is required to delete the episode",
      ]);
    });
  });

  describe("updateEpisode", () => {
    it("call updateEpisode", async () => {
      const episodeOld = {
        id: "episode1",
        title: "title1",
        esFinal: false,
        esFinalDraga: false,
      };
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

      episodeApiClient.update.mockResolvedValue({ success: true, data });
      const result = await episodeService.updateEpisode(episodeNew);
      expect(episodeApiClient.update).toHaveBeenCalledWith({
        episode: episodeNew,
      });

      expect(result.success).toEqual(true);
      expect(result.data.id).toEqual(episodeNew.id);
      expect(result.data.title).not.toEqual(episodeOld.title);
      expect(result.data.title).toEqual(episodeNew.title);
      expect(result.data.esFinal).not.toEqual(episodeOld.esFinal);
      expect(result.data.esFinal).toEqual(episodeNew.esFinal);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await episodeService
        .updateEpisode(null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Episode object is required to update episode",
      ]);
    });

    it("devuelve los errores cuando el objeto episode es inválido", async () => {
      const error = await episodeService
        .updateEpisode({})
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Season ID is required to create the episode",
        "Title for the episode is required",
        "Final values for the episode are required",
      ]);
    });

    it("devuelve error cuando episode tiene mas de un tipo de final a la vez", async () => {
      const error = await episodeService
        .updateEpisode({
          id: "episode",
          title: "title",
          esFinal: true,
          esFinalDraga: true,
        })
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "An episode cannot be both final and final Draga",
      ]);
    });
  });
});
