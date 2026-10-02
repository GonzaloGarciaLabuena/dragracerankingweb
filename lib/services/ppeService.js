import { ppeApiClient } from "../client/ppe/ppeApiClient";

export const ppeService = {
  async saveRanking(season, queens, episodes, pointsMap) {
    const errors = [];

    if (season?.id == null) {
      errors.push("Season ID is required to save ranking");
    }

    if (!Array.isArray(queens) || queens.length === 0) {
      errors.push("Queens Array is required to save ranking");
    }

    if (!Array.isArray(episodes) || episodes.length === 0) {
      errors.push("Episodes Array is required to save ranking");
    }

    if (!(pointsMap instanceof Map)) {
      errors.push("Points Map is required to save ranking");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const rows = rowsToSave(queens, episodes, pointsMap);
    return await ppeApiClient.saveRanking({ season_id: season.id, rows });
  },

  async getRanking(season, pointTypes) {
    const errors = [];

    if (season?.id == null) {
      errors.push("Season ID is required to get ranking");
    }

    if (!Array.isArray(pointTypes) || pointTypes.length === 0) {
      errors.push("Point Types Array is required to get ranking");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const ranking = await ppeApiClient.getRanking(season.id);
    return createPPEMap(ranking, pointTypes);
  },

  async getRankingOfUser(user, season, pointTypes) {
    const errors = [];

    if (user?.id == null) {
      errors.push("User ID is required to get the ranking of a user");
    }

    if (season?.id == null) {
      errors.push("Season ID is required to get the ranking of a user");
    }

    if (!Array.isArray(pointTypes) || pointTypes.length === 0) {
      errors.push("Point Types Array is required to get the ranking of a user");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const ranking = await ppeApiClient.getRankingUser(user.id, season.id);
    return createPPEMap(ranking, pointTypes);
  },

  async publishRanking(season) {
    const errors = [];

    if (season?.id == null) {
      errors.push("Season ID is required to publish ranking");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }
    return await ppeApiClient.publishRanking(season.id);
  },

  async getSeasonWinner(season, pointTypes) {
    const errors = [];

    if (season?.id == null) {
      errors.push("Season ID is required to get the winner of the Season");
    }

    if (!Array.isArray(pointTypes) || pointTypes.length === 0) {
      errors.push("Point Types Array is required to get the winner of the Season");
    }

    if (errors.length > 0) {
      throw new Error("Invalid data", {
        cause: errors,
      });
    }

    const ranking = await this.getRanking(season, pointTypes);

    const queenScores = new Map();
    let winner = null;

    for (const [key, pointType] of ranking) {
      const [queenId, episodeId] = key.split("|");

      // Si tiene WINNER
      if (pointType.id === "point9") {
        winner = queenId;
        break;
      }

      // Sumar puntuación
      const currentScore = queenScores.get(queenId) || 0;
      queenScores.set(queenId, currentScore + pointType.value);
    }

    // Si hay WINNER explícito
    if (winner) {
      return winner;
    }

    // Si no hay WINNER, buscar la que más puntos tenga
    let highestScore = -Infinity;
    let highestQueen = null;

    for (const [queenId, score] of queenScores) {
      if (score > highestScore) {
        highestScore = score;
        highestQueen = queenId;
      }
    }

    return highestQueen;
  },

  getHallOfFame: async (user) => {
    const userId = user ? user.id : null;
    return await ppeApiClient.getHallOfFame(userId);
  },
};

export const createPPEMap = (ranking, pointTypes) => {
  const map = new Map();

  ranking.forEach((item) => {
    const queenId = item.ppe_reference.queen_id.id;
    const episodeId = item.ppe_reference.episode_id.id;

    const key = `${queenId}|${episodeId}`;

    const pointType = pointTypes.find(
      (type) => type.id === item.point_type_id.id,
    );

    if (pointType) {
      map.set(key, pointType);
    }
  });

  return map;
};

export const rowsToSave = (queens, episodes, pointsMap) => {
  const rows = queens.flatMap((queen) =>
    episodes.map((episode) => {
      const key = `${queen.id}|${episode.id}`;
      const point = pointsMap.get(key);

      return {
        queen_id: queen.id,
        episode_id: episode.id,
        point_type_id: point?.id ?? null,
      };
    }),
  );
  return rows;
};
