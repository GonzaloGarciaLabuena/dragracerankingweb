"use client";

import { useEffect, useState } from "react";
import styles from "./modal.module.css";
import CButton from "@/components/CButton/CButton";
import LipsyncBattleModal from "./LipsyncBattleModal";
import { lipsyncService } from "@/lib/services/lipsyncService";

export default function EpisodeModal({
  children,
  episode,
  queens,
  onClose,
  onSave,
}) {
  const [title, setTitle] = useState(episode?.title ?? "");
  const [final, setFinal] = useState(episode?.esFinal ?? false);
  const [finalDraga, setFinalDraga] = useState(episode?.esFinalDraga ?? false);
  const [lalaparuza, setLalaparuza] = useState(episode?.esLalaparuza ?? false);
  const [showLipsyncModal, setShowLipsyncModal] = useState(false);
  const [battles, setBattles] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...(episode || {}),
      title: title.trim(),
      esFinal: final,
      esFinalDraga: finalDraga,
      esLalaparuza: lalaparuza,
    });
  };

  const fetchLipSyncBattles = async (episode) => {
    const data = await lipsyncService.getBattles(episode);
    setBattles(data);
  };

  const handleSaveLipsyncBattles = async (data) => {
    for (const battle of data) {
      const originalBattle = battles.find(
        (original) => original.id === battle.id,
      );

      // Si no existe, es una batalla nueva
      if (!originalBattle) {
        await lipsyncService.createBattle(battle);
        continue;
      }

      // Comprobar si ha cambiado algún campo
      const hasChanged =
        Number(originalBattle.round_number) !== battle.round_number ||
        Number(originalBattle.number) !== battle.number ||
        originalBattle.queen1_id !== battle.queen1_id ||
        originalBattle.queen2_id !== battle.queen2_id ||
        (originalBattle.queen3_id || null) !== battle.queen3_id;

      // Si no ha cambiado nada, saltar
      if (!hasChanged) continue;

      await lipsyncService.updateBattle(battle);
    }
  };

  useEffect(() => {
    if (episode?.esLalaparuza) {
      fetchLipSyncBattles(episode);
    }
  }, [episode]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{children}</h3>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <div className={styles.formInputContainer}>
              <label className={styles.formLabel}>Nombre</label>

              <input
                id="episodeTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.formInput}
                autoFocus
              />
            </div>
            <div className={styles.formInputContainer}>
              <label className={styles.formLabel}>¿Episodio final?</label>

              <input
                id="checkboxFinal"
                type="checkbox"
                checked={final}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFinal(checked);

                  if (checked) {
                    setFinalDraga(false);
                  }
                }}
                className={styles.checkbox}
              />
            </div>
            <div className={styles.formInputContainer}>
              <label className={styles.formLabel}>
                ¿Episodio final La Mas Draga?
              </label>

              <input
                id="checkboxFinalDraga"
                type="checkbox"
                checked={finalDraga}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFinalDraga(checked);

                  if (checked) {
                    setFinal(false);
                  }
                }}
                className={styles.checkbox}
              />
            </div>
            <div className={styles.formInputContainer}>
              <label className={styles.formLabel}>
                ¿Lalaparuza (lip sync battle)?
              </label>

              <input
                id="checkboxLalaparuza"
                type="checkbox"
                checked={lalaparuza}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setLalaparuza(checked);

                  if (!checked) {
                    setShowLipsyncModal(false);
                  }
                }}
                className={styles.checkbox}
              />
            </div>

            {lalaparuza && (
              <CButton type="button" onClick={() => setShowLipsyncModal(true)}>
                Editar Lipsync Battles
              </CButton>
            )}
          </div>

          <div className={styles.modalActions}>
            <CButton onClick={onClose}>Cancelar</CButton>
            <CButton type="submit" disabled={!title}>
              Guardar
            </CButton>
          </div>
        </form>

        {showLipsyncModal && (
          <LipsyncBattleModal
            episode={episode}
            queens={queens}
            battles={battles}
            onClose={() => setShowLipsyncModal(false)}
            onSave={async (data) => {
              await handleSaveLipsyncBattles(data);
              await fetchLipSyncBattles(episode);
              setShowLipsyncModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
