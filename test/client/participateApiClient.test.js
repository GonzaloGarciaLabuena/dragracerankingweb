import { describe, it, expect, vi, beforeEach } from "vitest";
import { participateApiClient } from "../../lib/client/participate/participateApiClient";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("participateApiClient", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("create", () => {
    it("calls the API correctly and returns the data", async () => {
      const input = {
        queenId: "queen1",
        seasonId: "season1",
        image_url: "image_url1",
      };

      const data = { exists: true };

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await participateApiClient.create({
        queenId: input.queenId,
        seasonId: input.seasonId,
        image_url: input.image_url,
      });

      expect(fetch).toHaveBeenCalledWith("/api/participate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(
        participateApiClient.create({
          queenId: null,
          seasonId: null,
          image_url: null,
        }),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "Queen ID is required to create participate",
          "Season ID is required to create participate",
          "Image Url is required to create participate",
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when data is not an object", async () => {
      await expect(participateApiClient.create(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Data object is required to create participate"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error creating participate",
        }),
      });

      await expect(
        participateApiClient.create({
          queenId: "queen1",
          seasonId: "season1",
          image_url: "image_url1",
        }),
      ).rejects.toThrow("Error creating participate");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        participateApiClient.create({
          queenId: "queen1",
          seasonId: "season1",
          image_url: "image_url1",
        }),
      ).rejects.toThrow("Error creating participate");
    });
  });

  describe("getAll", () => {
    it("calls the API correctly and returns the data", async () => {
      const data = { exists: true };

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await participateApiClient.getAll();

      expect(fetch).toHaveBeenCalledWith("/api/participate", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      expect(result).toEqual(data);
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error fetching seasons",
        }),
      });

      await expect(participateApiClient.getAll()).rejects.toThrow(
        "Error fetching seasons",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(participateApiClient.getAll()).rejects.toThrow(
        "Error fetching seasons",
      );
    });
  });

  describe("delete", () => {
    it("calls the API correctly and returns the data", async () => {
      const input = {
        queenId: "queen1",
        seasonId: "season1",
      };

      const data = true;

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await participateApiClient.delete({
        queenId: input.queenId,
        seasonId: input.seasonId,
      });

      expect(fetch).toHaveBeenCalledWith("/api/participate", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(
        participateApiClient.delete({
          queenId: null,
          seasonId: null,
        }),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "Queen ID is required to delete participate",
          "Season ID is required to delete participate",
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when data is not an object", async () => {
      await expect(participateApiClient.delete(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Data object is required to delete participate"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error deleting participate",
        }),
      });

      await expect(
        participateApiClient.delete({
          queenId: "queen1",
          seasonId: "season1",
        }),
      ).rejects.toThrow("Error deleting participate");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        participateApiClient.delete({
          queenId: "queen1",
          seasonId: "season1",
        }),
      ).rejects.toThrow("Error deleting participate");
    });
  });

  describe("update", () => {
    it("calls the API correctly and returns the data", async () => {
      const input = {
        queenId: "queen1",
        seasonId: "season1",
        imgPath: "image/path.jpg",
      };

      const data = { exists: true };

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await participateApiClient.update({
        queenId: input.queenId,
        seasonId: input.seasonId,
        imgPath: input.imgPath,
      });

      expect(fetch).toHaveBeenCalledWith("/api/participate", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(
        participateApiClient.update({
          queenId: null,
          seasonId: null,
          imgPath: null,
        }),
      ).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "Queen ID is required to update participate",
          "Season ID is required to update participate",
          "Image Path is required to update participate",
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when data is not an object", async () => {
      await expect(participateApiClient.update(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Data object is required to delete participate"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error updating participate",
        }),
      });

      await expect(
        participateApiClient.update({
          queenId: "queen1",
          seasonId: "season1",
          imgPath: "image/path.jpg",
        }),
      ).rejects.toThrow("Error updating participate");
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(
        participateApiClient.update({
          queenId: "queen1",
          seasonId: "season1",
          imgPath: "image/path.jpg",
        }),
      ).rejects.toThrow("Error deleting participate");
    });
  });
});
