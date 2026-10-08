import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { participateService } from "../../lib/services/participateService";
import { participateApiClient } from "../../lib/client/participate/participateApiClient";

// Mock seasonApiClient
vi.mock("../../lib/client/participate/participateApiClient", () => ({
  participateApiClient: {
    create: vi.fn(),
    getAll: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("participateService", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("addParticipation", () => {
    it("call addParticipation", async () => {
      const queenId = "queen1";
      const seasonId = "season1";
      const image_url = "image_url1";

      participateApiClient.create.mockResolvedValue({ exists: true });
      const result = await participateService.addParticipation(
        queenId,
        seasonId,
        image_url,
      );
      expect(participateApiClient.create).toHaveBeenCalledWith({
        queenId: queenId,
        seasonId: seasonId,
        image_url: image_url,
      });

      expect(result.exists).toEqual(true);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await participateService
        .addParticipation(null, null, null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Queen ID is required to add a participation",
        "Season ID is required to add a participation",
        "Image Url is required to add a participation",
      ]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error creating participate");

      participateApiClient.create.mockRejectedValue(apiError);

      const queenId = "queen1";
      const seasonId = "season1";
      const image_url = "image_url1";

      await expect(
        participateService.addParticipation(queenId, seasonId, image_url),
      ).rejects.toThrow("Error creating participate");
    });
  });

  describe("deleteParticipation", () => {
    it("call deleteParticipation - true", async () => {
      const queenId = "queen1";
      const seasonId = "season1";

      participateApiClient.delete.mockResolvedValue(true);
      const result = await participateService.deleteParticipation(
        queenId,
        seasonId,
      );
      expect(participateApiClient.delete).toHaveBeenCalledWith({
        queenId: queenId,
        seasonId: seasonId,
      });

      expect(result).toEqual(true);
    });

    it("call deleteParticipation - false", async () => {
      const queenId = "queen1";
      const seasonId = "season1";

      participateApiClient.delete.mockResolvedValue(false);

      const result = await participateService.deleteParticipation(
        queenId,
        seasonId,
      );

      expect(result).toEqual(false);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await participateService
        .deleteParticipation(null, null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Queen ID is required to delete a participation",
        "Season ID is required to delete a participation",
      ]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error deleting participate");

      participateApiClient.delete.mockRejectedValue(apiError);

      const queenId = "queen1";
      const seasonId = "season1";

      await expect(
        participateService.deleteParticipation(queenId, seasonId),
      ).rejects.toThrow("Error deleting participate");
    });
  });

  describe("updateParticipationImg", () => {
    it("updates participation image", async () => {
      const queenId = "queen1";
      const seasonId = "season1";
      const imgPath = "imgPath";

      const data = { queenId: queenId, seasonId: seasonId, imgPath: imgPath };

      participateApiClient.update.mockResolvedValue({
        success: true,
        data,
      });

      const result = await participateService.updateParticipationImg(
        queenId,
        seasonId,
        imgPath,
      );

      expect(participateApiClient.update).toHaveBeenCalledWith({
        queenId: "queen1",
        seasonId: "season1",
        imgPath: "imgPath",
      });

      expect(result.success).toEqual(true);
      expect(result.data).toEqual(data);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await participateService
        .updateParticipationImg(null, null, null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Queen ID is required to delete a participation",
        "Season ID is required to delete a participation",
        "Image path is required to update a participation",
      ]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error updating participation");

      participateApiClient.update.mockRejectedValue(apiError);

      await expect(
        participateService.updateParticipationImg(
          "queen1",
          "season1",
          "imgPath",
        ),
      ).rejects.toThrow("Error updating participation");
    });
  });
});
