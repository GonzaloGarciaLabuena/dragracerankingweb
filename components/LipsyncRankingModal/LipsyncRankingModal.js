"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./LipsyncRankingModal.module.css";
import CButton from "@/components/CButton/CButton";

export default function LipsyncRankingModal({
  episode,
  battles,
  queens,
  pointTypesLipsync,
  pointsMapLipsync,
  setPointsMapLipsync,
  onClose,
}) {
  const [selectedPoints, setSelectedPoints] = useState(new Map());
  const [saving, setSaving] = useState(false);

  const orderedBattles = useMemo(
    () =>
      [...battles].sort(
        (a, b) => a.round_number - b.round_number || a.number - b.number,
      ),
    [battles],
  );

  const getPointKey = (battleId, queenId) =>
    `${episode.id}|${battleId}|${queenId}`;

  useEffect(() => {
    const initialPoints = new Map();

    for (const battle of orderedBattles) {
      const queenIds = [
        battle.queen1_id,
        battle.queen2_id,
        battle.queen3_id,
      ].filter(Boolean);

      for (const queenId of queenIds) {
        const key = `${battle.id}|${queenId}`;
        const point = pointsMapLipsync.get(key);

        if (point) {
          initialPoints.set(key, point.id);
        }
      }
    }

    setSelectedPoints(initialPoints);
  }, [orderedBattles, episode.id]);

  const getQueen = (queenId) => queens.find((queen) => queen.id === queenId);

  const handlePointChange = (battleId, queenId, pointTypeId) => {
    const key = `${battleId}|${queenId}`;

    setSelectedPoints((previous) => {
      const updated = new Map(previous);

      if (pointTypeId) {
        updated.set(key, pointTypeId);
      } else {
        updated.delete(key);
      }

      return updated;
    });
  };

  const handleSave = () => {
    setPointsMapLipsync((previous) => {
      const updated = new Map(previous);

      for (const battle of orderedBattles) {
        const queenIds = [
          battle.queen1_id,
          battle.queen2_id,
          battle.queen3_id,
        ].filter(Boolean);

        for (const queenId of queenIds) {
          const key = getPointKey(battle.id, queenId);
          const keyPoint = `${battle.id}|${queenId}`;
          const pointTypeId = selectedPoints.get(keyPoint);

          const pointType = pointTypesLipsync.find(
            (point) => point.id === pointTypeId,
          );

          if (pointType) {
            updated.set(key, pointType);
          } else {
            updated.set(key, null);
          }

          updated.delete(keyPoint);
        }
      }

      return updated;
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={saving ? undefined : onClose}>
      <section
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.heading}>
            <h2>{episode.title}</h2>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar modal"
            disabled={saving}
          >
            &times;
          </button>
        </header>

        <div className={`${styles.battleList} ${styles.viewMode}`}>
          {orderedBattles.map((battle) => {
            const queenIds = [
              battle.queen1_id,
              battle.queen2_id,
              battle.queen3_id,
            ].filter(Boolean);

            return (
              <section key={battle.id} className={styles.battle}>
                <div className={styles.battleHeading}>
                  <h3>
                    Round {battle.round_number}
                    <span> · </span>
                    Battle {battle.number}
                  </h3>
                </div>

                <div
                  className={styles.participants}
                  data-count={queenIds.length}
                >
                  {queenIds.map((queenId, index) => {
                    const queen = getQueen(queenId);

                    if (!queen) return null;

                    const key = getPointKey(battle.id, queenId);

                    return (
                      <div key={queenId} className={styles.participantWrapper}>
                        {index > 0 && <span className={styles.vs}>VS.</span>}

                        <div className={styles.participant}>
                          {queen.image_url ? (
                            <img
                              className={styles.queenImage}
                              src={queen.image_url}
                              alt={queen.name}
                            />
                          ) : (
                            <div className={styles.imagePlaceholder}>—</div>
                          )}

                          <div className={styles.queenInfo}>
                            <p className={styles.queenName}>{queen.name}</p>

                            <select
                              value={
                                selectedPoints.get(`${battle.id}|${queenId}`) ??
                                ""
                              }
                              onChange={(event) =>
                                handlePointChange(
                                  battle.id,
                                  queenId,
                                  event.target.value,
                                )
                              }
                              aria-label={
                                `Puntuación de ${queen.name}, ` +
                                `Round ${battle.round_number}, ` +
                                `Battle ${battle.number}`
                              }
                              disabled={saving}
                            >
                              <option value="">EMPTY</option>

                              {pointTypesLipsync.map((pointType) => (
                                <option key={pointType.id} value={pointType.id}>
                                  {pointType.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <footer className={styles.footer}>
          <CButton onClick={onClose}>Cancelar</CButton>

          <CButton type="button" disabled={saving} onClick={handleSave}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </CButton>
        </footer>
      </section>
    </div>
  );
}
