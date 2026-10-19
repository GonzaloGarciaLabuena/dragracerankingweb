"use client";

import { useEffect, useState } from "react";
import styles from "./LipsyncBattleModal.module.css";
import CButton from "@/components/CButton/CButton";

export default function LipsyncBattleModal({
  children,
  episode,
  queens,
  battles,
  onClose,
  onSave,
}) {
  const [battleList, setBattleList] = useState(battles ?? []);

  useEffect(() => {
    setBattleList(battles ?? []);
  }, [battles]);

  const handleAddBattle = () => {
    const roundNumber = Math.max(
      1,
      ...battleList.map((battle) => Number(battle.round_number) || 1),
    );

    const battlesInRound = battleList.filter(
      (battle) => Number(battle.round_number) === roundNumber,
    );

    setBattleList((previous) => [
      ...previous,
      {
        round_number: roundNumber,
        number:
          Math.max(
            0,
            ...battlesInRound.map((battle) => Number(battle.number) || 0),
          ) + 1,
        queen1_id: "",
        queen2_id: "",
        queen3_id: null,
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    setBattleList((previous) =>
      previous.map((battle, i) => {
        if (i !== index) return battle;

        const updated = { ...battle, [field]: value };

        if (field === "queen1_id" && value === updated.queen2_id) {
          updated.queen2_id = "";
        }

        if (field === "queen2_id" && value === updated.queen1_id) {
          updated.queen1_id = "";
        }

        if (
          field === "queen3_id" &&
          value &&
          [updated.queen1_id, updated.queen2_id].includes(value)
        ) {
          updated.queen3_id = null;
        }

        if (field === "queen1_id" && value === updated.queen3_id) {
          updated.queen3_id = null;
        }

        if (field === "queen2_id" && value === updated.queen3_id) {
          updated.queen3_id = null;
        }

        return updated;
      }),
    );
  };

  const handleRemoveBattle = (index) => {
    setBattleList((previous) => previous.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const battlesToSave = battleList.map((battle) => ({
      ...(battle.id ? { id: battle.id } : {}),
      episode_id: episode.id,
      round_number: Number(battle.round_number),
      number: Number(battle.number),
      queen1_id: battle.queen1_id,
      queen2_id: battle.queen2_id,
      queen3_id: battle.queen3_id || null,
    }));

    onSave(battlesToSave);
  };

  const isValid =
    battleList.every((battle) => {
      const round = Number(battle.round_number);
      const number = Number(battle.number);

      const selectedQueens = [
        battle.queen1_id,
        battle.queen2_id,
        battle.queen3_id || null,
      ].filter(Boolean);

      return (
        Number.isInteger(round) &&
        round > 0 &&
        Number.isInteger(number) &&
        number > 0 &&
        Boolean(battle.queen1_id) &&
        Boolean(battle.queen2_id) &&
        battle.queen1_id !== battle.queen2_id &&
        new Set(selectedQueens).size === selectedQueens.length
      );
    }) &&
    new Set(
      battleList.map((battle) => `${battle.round_number}-${battle.number}`),
    ).size === battleList.length;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{children}</h3>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            {battleList.map((battle, index) => (
              <div
                key={battle.id ?? `new-${index}`}
                className={styles.formInputContainer}
              >
                <h4>Batalla {index + 1}</h4>

                <div className={styles.formInputContainer}>
                  <label className={styles.formLabel}>Ronda</label>

                  <input
                    type="number"
                    min="1"
                    value={battle.round_number}
                    onChange={(e) =>
                      handleChange(index, "round_number", e.target.value)
                    }
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formInputContainer}>
                  <label className={styles.formLabel}>
                    Orden de la batalla
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={battle.number}
                    onChange={(e) =>
                      handleChange(index, "number", e.target.value)
                    }
                    className={styles.formInput}
                    required
                  />
                </div>

                {[
                  { field: "queen1_id", label: "Reina 1" },
                  { field: "queen2_id", label: "Reina 2" },
                  { field: "queen3_id", label: "Reina 3 (opcional)" },
                ].map(({ field, label }) => (
                  <div key={field} className={styles.formInputContainer}>
                    <label className={styles.formLabel}>{label}</label>

                    <select
                      value={battle[field] ?? ""}
                      onChange={(e) =>
                        handleChange(index, field, e.target.value)
                      }
                      className={styles.formInput}
                      required={field !== "queen3_id"}
                    >
                      <option value="">
                        {field === "queen3_id"
                          ? "Sin tercera reina"
                          : "Selecciona una reina"}
                      </option>

                      {queens
                        .filter(
                          (queen) =>
                            queen.id === battle[field] ||
                            ![
                              battle.queen1_id,
                              battle.queen2_id,
                              battle.queen3_id,
                            ]
                              .filter(Boolean)
                              .includes(queen.id),
                        )
                        .map((queen) => (
                          <option key={queen.id} value={queen.id}>
                            {queen.name}
                          </option>
                        ))}
                    </select>
                  </div>
                ))}

                <CButton
                  type="button"
                  onClick={() => handleRemoveBattle(index)}
                >
                  Eliminar batalla
                </CButton>
              </div>
            ))}
          </div>

          <div className={styles.modalActions}>
            <CButton type="button" onClick={handleAddBattle}>
              Añadir batalla
            </CButton>

            <CButton type="button" onClick={onClose}>
              Cancelar
            </CButton>

            <CButton type="submit" disabled={!isValid}>
              Guardar
            </CButton>
          </div>
        </form>
      </div>
    </div>
  );
}
