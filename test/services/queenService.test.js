import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { queenService } from "../../lib/services/queenService";
import { participateService } from "../../lib/services/participateService";
import { supabaseStorageService } from "../../lib/services/supabaseStorageService";
import { queenApiClient } from "../../lib/client/queen/queenApiClient";

// Mock profileApiClient
vi.mock("../../lib/client/queen/queenApiClient", () => ({
  queenApiClient: {
    get: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
    existsQueen: vi.fn(),
    updateName: vi.fn(),
  },
}));

vi.mock("../../lib/services/participateService");
vi.mock("../../lib/services/supabaseStorageService");

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("queenService", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("listQueens", () => {
    it("call listQueens", async () => {
      const SeasonSelected = {
        id: "season1",
        name: "Drag Season 1",
        franchise: "Franchise 1",
        year: "2026",
      };
      const page = null;

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

      queenApiClient.get.mockResolvedValue({ data, totalPages });
      const result = await queenService.listQueens(SeasonSelected, page);
      expect(queenApiClient.get).toHaveBeenCalledWith(SeasonSelected, page);

      expect(result.data[0].season).toEqual(SeasonSelected.id);
      expect(result.totalPages).toEqual(1);
      expect(result.data[0]).toEqual({
        id: "queen1",
        name: "name1",
        image_url: "image_url1",
        season: "season1",
      });
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await queenService
        .listQueens({}, null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Selected Season ID is required to list the queens",
      ]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error fetching queens");

      queenApiClient.get.mockRejectedValue(apiError);

      const SeasonSelected = {
        id: "season1",
        name: "Drag Season 1",
        franchise: "Franchise 1",
        year: "2026",
      };
      const page = null;

      await expect(
        queenService.listQueens(SeasonSelected, page),
      ).rejects.toThrow("Error fetching queens");
    });
  });

  describe("createQueen", () => {
    it("call create when queen does not exist", async () => {
      const name = "name";
      const season = { id: "season1", franchise: "FR1" };
      const image_Url = "image1";

      vi.spyOn(supabaseStorageService, "uploadImgQueen").mockResolvedValue(
        "imgPath",
      );

      vi.spyOn(supabaseStorageService, "getQueenImg").mockResolvedValue(
        "imgUrl",
      );

      vi.spyOn(queenService, "existsQueen").mockResolvedValue(false);

      queenApiClient.create.mockResolvedValue({
        exists: true,
      });

      const result = await queenService.createQueen(name, season, image_Url);

      expect(supabaseStorageService.uploadImgQueen).toHaveBeenCalledWith(
        season,
        "name",
        image_Url,
      );

      expect(supabaseStorageService.getQueenImg).toHaveBeenCalledWith(
        "imgPath",
      );

      expect(queenService.existsQueen).toHaveBeenCalledWith(name);

      expect(queenApiClient.create).toHaveBeenCalledWith({
        name: "name",
        seasonId: "season1",
        image_url: "imgUrl",
      });

      expect(result.exists).toBe(true);
    });

    it("adds participation when queen already exists", async () => {
      const name = "name";
      const season = { id: "season1", franchise: "FR1" };
      const image_Url = "image1";

      vi.spyOn(supabaseStorageService, "uploadImgQueen").mockResolvedValue(
        "imgPath",
      );

      vi.spyOn(supabaseStorageService, "getQueenImg").mockResolvedValue(
        "imgUrl",
      );

      vi.spyOn(queenService, "existsQueen").mockResolvedValue({
        id: "queen1",
      });

      participateService.addParticipation.mockResolvedValue({
        exists: true,
      });

      const result = await queenService.createQueen(name, season, image_Url);

      expect(queenService.existsQueen).toHaveBeenCalledWith(name);

      expect(participateService.addParticipation).toHaveBeenCalledWith(
        "queen1",
        "season1",
        "imgUrl",
      );

      expect(result.exists).toEqual(true);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await queenService
        .createQueen(null, null, null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Name is required",
        "Season is required to create queen",
        "Image is required",
      ]);
    });

    it("devuelve todos los errores cuando season es inválida", async () => {
      const error = await queenService
        .createQueen("name1", {}, "url1")
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Season Id is required to create queen",
        "Season franchise is required to create queen",
      ]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error creating queen");

      queenApiClient.create.mockRejectedValue(apiError);

      const name = "name";
      const season = {
        id: "season1",
        franchise: "FR1",
      };
      const image_Url = "image1";

      vi.spyOn(supabaseStorageService, "uploadImgQueen").mockResolvedValue(
        "imgPath",
      );

      vi.spyOn(supabaseStorageService, "getQueenImg").mockResolvedValue(
        "imgUrl",
      );

      vi.spyOn(queenService, "existsQueen").mockResolvedValue(false);

      await expect(
        queenService.createQueen(name, season, image_Url),
      ).rejects.toThrow("Error creating queen");
    });

    it("propaga el error al subir la imagen", async () => {
      const uploadError = new Error("Error uploading image");

      vi.spyOn(supabaseStorageService, "uploadImgQueen").mockRejectedValue(
        uploadError,
      );

      const name = "name";
      const season = {
        id: "season1",
        franchise: "FR1",
      };
      const image_Url = "image1";

      await expect(
        queenService.createQueen(name, season, image_Url),
      ).rejects.toThrow("Error uploading image");
    });

    it("propaga el error aunque falle al borrar la imagen", async () => {
      const imageError = new Error("Error getting image");
      const deleteError = new Error("Error deleting image");

      vi.spyOn(supabaseStorageService, "uploadImgQueen").mockResolvedValue(
        "imgPath",
      );

      vi.spyOn(supabaseStorageService, "getQueenImg").mockRejectedValue(
        imageError,
      );

      vi.spyOn(supabaseStorageService, "deleteImgQueen").mockRejectedValue(
        deleteError,
      );

      const name = "name";
      const season = {
        id: "season1",
        franchise: "FR1",
      };
      const image_Url = "image1";

      await expect(
        queenService.createQueen(name, season, image_Url),
      ).rejects.toThrow("Error getting image");

      expect(supabaseStorageService.deleteImgQueen).toHaveBeenCalledWith(
        "name",
        season,
      );
    });
  });

  describe("deleteQueen", () => {
    it("call deleteQueen", async () => {
      const queen = {
        id: "queen1",
        name: "name1",
      };

      queenApiClient.remove.mockResolvedValue({
        exists: true,
      });
      const result = await queenService.deleteQueen(queen.id);
      expect(queenApiClient.remove).toHaveBeenCalledWith(queen.id);

      expect(result.exists).toEqual(true);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await queenService
        .deleteQueen(null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual(["Queen ID is required to delete queen"]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error deleting queen");

      queenApiClient.remove.mockRejectedValue(apiError);

      const queen = {
        id: "queen1",
        name: "name1",
      };

      await expect(queenService.deleteQueen(queen.id)).rejects.toThrow(
        "Error deleting queen",
      );
    });
  });

  describe("existsQueen", () => {
    it("call existsQueen", async () => {
      const queen = {
        id: "queen1",
        name: "name1",
      };

      const data = {
        id: "queen1",
        name: "name1",
      };
      queenApiClient.existsQueen.mockResolvedValue(data);
      const result = await queenService.existsQueen(queen.name);
      expect(queenApiClient.existsQueen).toHaveBeenCalledWith(queen.name);

      expect(result.id).toEqual(queen.id);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await queenService
        .existsQueen(null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Queen Name is required to check if the queen exists",
      ]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error findin queen");

      queenApiClient.existsQueen.mockRejectedValue(apiError);

      const queen = {
        id: "queen1",
        name: "name1",
      };

      await expect(queenService.existsQueen(queen.name)).rejects.toThrow(
        "Error findin queen",
      );
    });
  });

  describe("updateQueen", () => {
    it("updates queen name and image", async () => {
      const queen = {
        id: "queen1",
        name: "Queen Name",
      };

      const season = {
        id: "season1",
        franchise: "FR1",
      };

      const editData = {
        name: "New Name",
        image_url: "newImage",
      };

      vi.spyOn(supabaseStorageService, "updateImgQueen").mockResolvedValue(
        "imgPath",
      );

      vi.spyOn(supabaseStorageService, "getQueenImg").mockResolvedValue(
        "imgUrl",
      );

      await queenService.updateQueen(queen, season, editData);

      expect(queenApiClient.updateName).toHaveBeenCalledWith(
        "queen1",
        "New Name",
      );

      expect(supabaseStorageService.updateImgQueen).toHaveBeenCalledWith(
        queen,
        season,
        "newImage",
      );

      expect(participateService.updateParticipationImg).toHaveBeenCalledWith(
        "queen1",
        "season1",
        "imgUrl",
      );
    });
  });
});
