import { describe, it, expect, vi, beforeEach } from "vitest";
import { pointtypeApiClient } from "../../lib/client/episode/pointtypeApiClient";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("pointtypeApiClient", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("getAll", () => {
    it("calls the API correctly and returns the data", async () => {
      const mode = "default";
      const data = [
        {
          id: "point1",
          label: "WIN",
          value: 5,
          hexaColor: "#ffffff",
          esParaFinal: "false",
          esParaFinalDraga: "false",
        },
        {
          id: "point2",
          label: "HIGH",
          value: 4,
          hexaColor: "#fffff0",
          esParaFinal: "false",
          esParaFinalDraga: "false",
        },
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      });

      const result = await pointtypeApiClient.getAll(mode);

      expect(fetch).toHaveBeenCalledWith(`/api/pointtype?mode=${mode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(result).toEqual(data);
    });

    it("throws validation errors when the data is invalid", async () => {
      await expect(pointtypeApiClient.getAll(null)).rejects.toMatchObject({
        message: "Invalid data",
        cause: [
          "Mode is required to fetch point types for the ranking"
        ],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws an error when mode is not permited", async () => {
      await expect(pointtypeApiClient.getAll('test')).rejects.toMatchObject({
        message: "Invalid data",
        cause: ["Mode not permited (default, final, finalDraga)"],
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws the API error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Error fetching point types",
        }),
      });

      await expect(pointtypeApiClient.getAll("default")).rejects.toThrow(
        "Error fetching point types",
      );
    });

    it("throws the default error if the API does not provide an error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      await expect(pointtypeApiClient.getAll("default")).rejects.toThrow(
        "Error fetching point types",
      );
    });
  });
});
