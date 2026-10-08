import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  rowsToSave,
  createPPEMap,
  ppeService,
} from "../../lib/services/ppeService";
import { ppeApiClient } from "../../lib/client/ppe/ppeApiClient";

// Mock ppeApiClient
vi.mock("../../lib/client/ppe/ppeApiClient", () => ({
  ppeApiClient: {
    saveRanking: vi.fn(),
    getRanking: vi.fn(),
    getRankingUser: vi.fn(),
    publishRanking: vi.fn(),
    getHallOfFame: vi.fn(),
  },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ppeService", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("saveRanking", () => {
    it("call", async () => {
      ppeApiClient.saveRanking.mockResolvedValue({
        success: true,
      });

      const season = { id: "season1" };

      const queens = [{ id: "queen1" }, { id: "queen2" }];

      const episodes = [{ id: "episode1" }];

      const pointsMap = new Map([["queen1|episode1", { id: "point1" }]]);

      const result = await ppeService.saveRanking(
        season,
        queens,
        episodes,
        pointsMap,
      );

      expect(ppeApiClient.saveRanking).toHaveBeenCalledWith({
        season_id: "season1",
        rows: [
          {
            queen_id: "queen1",
            episode_id: "episode1",
            point_type_id: "point1",
          },
          {
            queen_id: "queen2",
            episode_id: "episode1",
            point_type_id: null,
          },
        ],
      });

      expect(result).toEqual({
        success: true,
      });
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await ppeService
        .saveRanking({}, [], [], {})
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Season ID is required to save ranking",
        "Queens Array is required to save ranking",
        "Episodes Array is required to save ranking",
        "Points Map is required to save ranking",
      ]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error saving ranking");

      ppeApiClient.saveRanking.mockRejectedValue(apiError);

      const season = { id: "season1" };
      const queens = [{ id: "queen1" }];
      const episodes = [{ id: "episode1" }];
      const pointsMap = new Map();

      await expect(
        ppeService.saveRanking(season, queens, episodes, pointsMap),
      ).rejects.toThrow("Error saving ranking");
    });
  });

  describe("getRanking", () => {
    it("call", async () => {
      const season = { id: "season1" };

      const pointTypes = [
        {
          id: "point1",
          name: "WIN",
          value: 5,
        },
        {
          id: "point9",
          name: "WINNER",
          value: 0,
        },
      ];

      const ranking = [
        {
          ppe_reference: {
            queen_id: {
              id: "queen1",
            },
            episode_id: {
              id: "episode1",
            },
          },
          point_type_id: {
            id: "point1",
          },
        },
      ];
      ppeApiClient.getRanking.mockResolvedValue(ranking);
      const result = await ppeService.getRanking(season, pointTypes);

      expect(ppeApiClient.getRanking).toHaveBeenCalledWith(season.id);

      expect(result.get("queen1|episode1")).toEqual(pointTypes[0]);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await ppeService.getRanking({}, {}).catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Season ID is required to get ranking",
        "Point Types Array is required to get ranking",
      ]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error getting ranking");

      ppeApiClient.getRanking.mockRejectedValue(apiError);

      const season = { id: "season1" };
      const pointTypes = [{ id: "point1" }];
      await expect(
        ppeService.getRanking(season, pointTypes),
      ).rejects.toThrow("Error getting ranking");
    });
  });

  describe("getRankingOfUser", () => {
    it("call", async () => {
      const user = { id: "user1" };
      const season = { id: "season1" };
      const pointTypes = [
        {
          id: "point1",
          name: "WIN",
          value: 5,
        },
        {
          id: "point9",
          name: "WINNER",
          value: 0,
        },
      ];

      const ranking = [
        {
          ppe_reference: {
            queen_id: {
              id: "queen1",
            },
            episode_id: {
              id: "episode1",
            },
          },
          point_type_id: {
            id: "point1",
          },
        },
      ];

      ppeApiClient.getRankingUser.mockResolvedValue(ranking);
      const result = await ppeService.getRankingOfUser(
        user,
        season,
        pointTypes,
      );

      expect(ppeApiClient.getRankingUser).toHaveBeenCalledWith(
        user.id,
        season.id,
      );
      expect(result.get("queen1|episode1")).toEqual(pointTypes[0]);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await ppeService
        .getRankingOfUser({}, {}, {})
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "User ID is required to get the ranking of a user",
        "Season ID is required to get the ranking of a user",
        "Point Types Array is required to get the ranking of a user",
      ]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error getting ranking of user");

      ppeApiClient.getRankingUser.mockRejectedValue(apiError);

      const user = { id: "user1" };
      const season = { id: "season1" };
      const pointTypes = [{ id: "point1" }];
      await expect(
        ppeService.getRankingOfUser(user, season, pointTypes),
      ).rejects.toThrow("Error getting ranking of user");
    });
  });

  describe("publishRanking", () => {
    it("call", async () => {
      const season = { id: "season1" };
      const output = {
        success: true,
        created: 5,
        queens: 3,
        episodes: 4,
      };
      ppeApiClient.publishRanking.mockResolvedValue(output);
      const result = await ppeService.publishRanking(season);
      expect(ppeApiClient.publishRanking).toHaveBeenCalledWith(season.id);

      expect(result).toEqual({
        success: true,
        created: 5,
        queens: 3,
        episodes: 4,
      });
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await ppeService.publishRanking({}).catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual(["Season ID is required to publish ranking"]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error publishing ranking");

      ppeApiClient.publishRanking.mockRejectedValue(apiError);

      const season = { id: "season1" };
      await expect(
        ppeService.publishRanking(season),
      ).rejects.toThrow("Error publishing ranking");
    });
  });

  describe("getSeasonWinner", () => {
    it("devuelve la queen con point9 como ganadora", async () => {
      const ranking = new Map([
        [
          "queen1|episode1",
          {
            id: "point1",
            name: "WIN",
            value: 5,
          },
        ],
        [
          "queen2|episode1",
          {
            id: "point9",
            name: "WINNER",
            value: 0,
          },
        ],
      ]);

      ppeService.getRanking = async () => ranking;

      const season = {
        id: "season1",
      };

      const pointTypes = [
        {
          id: "point1",
          name: "WIN",
          value: 5,
        },
        {
          id: "point9",
          name: "WINNER",
          value: 0,
        },
      ];

      const result = await ppeService.getSeasonWinner(season, pointTypes);

      expect(result).toBe("queen2");
    });

    it("devuelve la queen con mayor puntuación cuando no existe point9", async () => {
      const ranking = new Map([
        [
          "queen1|episode1",
          {
            id: "point1",
            name: "WIN",
            value: 5,
          },
        ],
        [
          "queen1|episode2",
          {
            id: "point2",
            name: "TOP2",
            value: 4.5,
          },
        ],
        [
          "queen2|episode1",
          {
            id: "point1",
            name: "WIN",
            value: 5,
          },
        ],
        [
          "queen2|episode2",
          {
            id: "point1",
            name: "WIN",
            value: 5,
          },
        ],
      ]);

      ppeService.getRanking = async () => ranking;

      const season = { id: "season1" };
      const pointTypes = [
        {
          id: "point1",
          name: "WIN",
          value: 5,
        },
        {
          id: "point2",
          name: "TOP2",
          value: 4.5,
        },
      ];

      const result = await ppeService.getSeasonWinner(season, pointTypes);

      expect(result).toBe("queen2");
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await ppeService
        .getSeasonWinner({}, [])
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "Season ID is required to get the winner of the Season",
        "Point Types Array is required to get the winner of the Season",
      ]);
    });
  });

  describe("getHallOfFame", () => {
    it("call user", async () => {
      const user = { id: "user1" };
      ppeApiClient.getHallOfFame.mockResolvedValue(user.id);
      const result = await ppeService.getHallOfFame(user);
      expect(ppeApiClient.getHallOfFame).toHaveBeenCalledWith(user.id);
    });

    it("call user is null", async () => {
      const user = null;
      ppeApiClient.getHallOfFame.mockResolvedValue(user);
      const result = await ppeService.getHallOfFame(user);
      expect(ppeApiClient.getHallOfFame).toHaveBeenCalledWith(user);
    });

    it("devuelve todos los errores cuando la entrada es inválida", async () => {
      const error = await ppeService
        .getHallOfFame({id: 123})
        .catch((error) => error);

      expect(error.message).toBe("Invalid data");

      expect(error.cause).toEqual([
        "User ID is required to get the ranking of a user"
      ]);
    });

    it("propaga el error del apiClient", async () => {
      const apiError = new Error("Error obteniendo Hall of Fame");

      ppeApiClient.getHallOfFame.mockRejectedValue(apiError);

      const user = { id: "user1" };
      await expect(
        ppeService.getHallOfFame(user),
      ).rejects.toThrow("Error obteniendo Hall of Fame");
    });
  });

  describe("createPPEMap", () => {
    it("crea un mapa con las puntuaciones de cada queen y episodio", () => {
      const ranking = [
        {
          ppe_reference: {
            queen_id: {
              id: "queen1",
            },
            episode_id: {
              id: "episode1",
            },
          },
          point_type_id: {
            id: "point1",
          },
        },
      ];

      const pointTypes = [
        {
          id: "point1",
          name: "WIN",
          value: 5,
        },
      ];

      const result = createPPEMap(ranking, pointTypes);

      expect(result.get("queen1|episode1")).toEqual(pointTypes[0]);
    });

    it("ignora una puntuación cuyo point_type no existe", () => {
      const ranking = [
        {
          ppe_reference: {
            queen_id: {
              id: "queen1",
            },
            episode_id: {
              id: "episode1",
            },
          },
          point_type_id: {
            id: "point999",
          },
        },
      ];

      const pointTypes = [
        {
          id: "point1",
          name: "WIN",
          value: 5,
        },
      ];

      const result = createPPEMap(ranking, pointTypes);

      expect(result.has("queen1|episode1")).toBe(false);
    });
  });

  describe("rowsToSave", () => {
    it("crea una fila por cada combinación de queen y episodio", () => {
      const queens = [{ id: "queen1" }, { id: "queen2" }];

      const episodes = [{ id: "episode1" }, { id: "episode2" }];

      const pointsMap = new Map();

      const result = rowsToSave(queens, episodes, pointsMap);

      expect(result).toHaveLength(4);

      expect(result).toEqual([
        {
          queen_id: "queen1",
          episode_id: "episode1",
          point_type_id: null,
        },
        {
          queen_id: "queen1",
          episode_id: "episode2",
          point_type_id: null,
        },
        {
          queen_id: "queen2",
          episode_id: "episode1",
          point_type_id: null,
        },
        {
          queen_id: "queen2",
          episode_id: "episode2",
          point_type_id: null,
        },
      ]);
    });

    it("asigna el point_type_id cuando existe una puntuación", () => {
      const queens = [{ id: "queen1" }];

      const episodes = [{ id: "episode1" }, { id: "episode2" }];

      const pointsMap = new Map();

      pointsMap.set("queen1|episode1", {
        id: "point1",
      });

      const result = rowsToSave(queens, episodes, pointsMap);

      expect(result).toEqual([
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
      ]);
    });
  });
});
