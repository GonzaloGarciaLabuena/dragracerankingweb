
"use client";

import styles from "./RankingRow.module.css";
import RankingCell from "./RankingCell";
import { useState } from "react";

export default function RankingRow({
  queen,
  episodes,
  pointTypesNormal,
  pointTypesFinal,
  pointTypesFinalDraga,
  pointsMap,
  setPointsMap,
  activeCell,
  setActiveCell,
  position,
  onOpenLipsync,
}) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <tr className={styles.rankingRow}>
      <td className={styles.queenCell}>
        <div className={styles.queenContent}>
          <span className={styles.queenPosition}>{position}º</span>

          <div className={styles.imageContainer}>
            {imageLoading && <div className={styles.spinner}></div>}

            <img
              src={queen.image_url}
              alt={queen.name}
              className={`${styles.queenImage} ${
                imageLoading ? styles.imageHidden : ""
              }`}
              draggable={false}
              onLoad={() => setImageLoading(false)}
            />
          </div>

          <div className={styles.queenInfo}>
            <span className={styles.queenName}>{queen.name}</span>
            <span className={styles.separator}>&nbsp;</span>
            <span className={styles.queenScore}>{queen.score}</span>
          </div>
        </div>
      </td>

      {episodes.map((episode) => {
        const key = `${queen.id}|${episode.id}`;

        // Los episodios de Lipsync abren el modal.
        if (episode.esLalaparuza) {
          return (
            <td
              key={episode.id}
              className={`${styles.scoreCell} ${styles.lipsyncCell}`}
              onClick={() => onOpenLipsync(episode)}
              title="Abrir ranking de Lipsync"
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onOpenLipsync(episode);
                }
              }}
            >
              <span className={styles.lipsyncCellContent}>
                Lipsync
              </span>
            </td>
          );
        }

        const pointTypes = episode.esFinal
          ? pointTypesFinal
          : episode.esFinalDraga
            ? pointTypesFinalDraga
            : pointTypesNormal;

        return (
          <td key={episode.id} className={styles.scoreCell}>
            <RankingCell
              cellId={key}
              activeCell={activeCell}
              setActiveCell={setActiveCell}
              pointTypes={pointTypes}
              point={pointsMap.get(key)}
              setPoint={(point) => {
                setPointsMap((prev) => {
                  const copy = new Map(prev);

                  if (point) {
                    copy.set(key, point);
                  } else {
                    copy.delete(key);
                  }

                  return copy;
                });
              }}
            />
          </td>
        );
      })}
    </tr>
  );
}
