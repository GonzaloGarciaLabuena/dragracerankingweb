import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { pointTypeService } from "../../lib/services/pointTypeService";
import { pointtypeApiClient } from "../../lib/client/episode/pointtypeApiClient";

// Mock episodeApiClient
vi.mock("../../lib/client/episode/pointtypeApiClient", () => ({
  pointtypeApiClient: {
    getAll: vi.fn(),
  },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("pointTypeService", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("getPointTypes", () => {
    it("call getPointTypes", async () => {
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
      pointtypeApiClient.getAll.mockResolvedValue(data);
      const result = await pointTypeService.getPointTypes(mode);
      expect(pointtypeApiClient.getAll).toHaveBeenCalledWith(mode);

      expect(result[0].id).toEqual("point1");
      expect(result[1].id).toEqual("point2");
    });

    it("devuelve los errores cuando la entrada es inválida", async () => {
      const error = await pointTypeService
        .getPointTypes(null)
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Mode is required to fetch point types for the ranking",
      ]);
    });

    it("devuelve los errores cuando el mode no es permitido", async () => {
      const error = await pointTypeService
        .getPointTypes('test')
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Mode not permited (default, final, finalDraga)",
      ]);
    });
  });
});
