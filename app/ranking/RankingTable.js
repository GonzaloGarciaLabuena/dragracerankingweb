import styles from "./RankingTable.module.css";
import RankingRow from "./RankingRow";
import { useEffect, useState, useRef } from "react";

export default function RankingTable({
  user,
  season,
  queens,
  episodes,
  pointTypesNormal,
  pointTypesFinal,
  pointTypesFinalDraga,
  pointsMap,
  setPointsMap,
  activeCell,
  setActiveCell,
  tableRef,
  sortBy,
}) {
  const [mainTitle, setMainTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const calculateStats = (queenId) => {
    let totalScore = 0;
    let totalEpisodes = 0;
    let totalEpisodesRanked = 0;

    for (const [currentKey, point] of pointsMap) {
      const currentQueenId = currentKey.split("|")[0];
      const currentEpisodeId = currentKey.split("|")[1];

      if (currentQueenId !== queenId) continue;

      const episode = episodes.find(
        (episode) => episode.id === currentEpisodeId,
      );

      // El episodio ya no existe en la temporada actual
      if (!episode) continue;

      if (episode.esFinal || episode.esFinalDraga) {
        totalEpisodes++;
        continue;
      }

      if (point.id === "point7") continue;

      totalScore += point.value;
      totalEpisodesRanked++;
      totalEpisodes++;
    }

    return {
      score:
        totalEpisodesRanked > 0
          ? (totalScore / totalEpisodesRanked).toFixed(3)
          : (0.0).toFixed(3),
      episodes: totalEpisodes,
    };
  };

  const getLastRankedEpisode = () => {
    let lastEpisode = null;
    let lastEpisodeNumber = 0;

    for (const [currentKey, point] of pointsMap) {
      const currentEpisodeId = currentKey.split("|")[1];

      const episode = episodes.find(
        (episode) => episode.id === currentEpisodeId,
      );

      // El punto pertenece a otra temporada / episodio que ya no está cargado
      if (!episode) continue;

      if (point.id === "point7") continue;

      if (episode.number > lastEpisodeNumber) {
        lastEpisodeNumber = episode.number;
        lastEpisode = episode;
      }
    }

    return lastEpisode;
  };

  const lastRankedEpisode = getLastRankedEpisode();

  const rankedQueens = [...queens]
    .map((queen) => {
      const stats = calculateStats(queen.id);

      const point = lastRankedEpisode
        ? pointsMap.get(`${queen.id}|${lastRankedEpisode.id}`)
        : null;

      return {
        ...queen,
        ...stats,
        lastEpisodeScore: point && point.id !== "point7" ? point.value : 0,
      };
    })
    .sort((a, b) => {
      if (sortBy === "episodes") {
        if (b.episodes !== a.episodes) {
          return b.episodes - a.episodes;
        }

        return b.score - a.score;
      }

      if (sortBy === "lastEpisode") {
        if (b.lastEpisodeScore !== a.lastEpisodeScore) {
          return b.lastEpisodeScore - a.lastEpisodeScore;
        }

        if (b.episodes !== a.episodes) {
          return b.episodes - a.episodes;
        }

        return b.score - a.score;
      }

      return b.score - a.score;
    });

  const getPosition = (index) => {
    if (index === 0) return 1;

    const current = rankedQueens[index];
    const previous = rankedQueens[index - 1];

    if (sortBy === "lastEpisode") {
      if (
        current.lastEpisodeScore === previous.lastEpisodeScore &&
        current.episodes === previous.episodes &&
        current.score === previous.score
      ) {
        return getPosition(index - 1);
      }

      return index + 1;
    }

    if (current.score === previous.score) {
      return getPosition(index - 1);
    }

    return index + 1;
  };

  const setTableName = (seasonName, username) => {
    if (!seasonName || !username) return;

    const name = seasonName.replace(/^rupaul's /i, "");
    const rankingTitle = `${username}'s ${name}`;
    const [main, sub] = rankingTitle.split(/(?<=Drag Race) /);

    setMainTitle(main);
    setSubtitle(sub);
  };

  useEffect(() => {
    setTableName(season?.name, user?.username);
  }, [season, user]);

  return (
    <div className={styles.tableContainer}>
      <table ref={tableRef} className={styles.rankingTable}>
        <thead>
          <tr>
            <th className={styles.rankingHeader}>
              <span>{mainTitle}</span>
              <span>{subtitle}</span>
            </th>

            {episodes.map((episode) => (
              <th key={episode.id} className={styles.episodeHeader}>
                {episode.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rankedQueens.map((queen, index) => (
            <RankingRow
              key={queen.id}
              queen={queen}
              episodes={episodes}
              pointTypesNormal={pointTypesNormal}
              pointTypesFinal={pointTypesFinal}
              pointTypesFinalDraga={pointTypesFinalDraga}
              pointsMap={pointsMap}
              setPointsMap={setPointsMap}
              activeCell={activeCell}
              setActiveCell={setActiveCell}
              position={getPosition(index)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
