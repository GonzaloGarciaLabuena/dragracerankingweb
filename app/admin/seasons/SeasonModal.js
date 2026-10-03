"use client";

import { useEffect, useState } from "react";
import styles from "./modal.module.css";
import CButton from "@/components/CButton/CButton";

export default function SeasonModal({ season = {}, onClose, onSave }) {
  const [name, setName] = useState(season.name || "");
  const [franchise, setFranchise] = useState(season.franchise || "");
  const [year, setYear] = useState(season.year || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      name: name.trim(),
      franchise: franchise.trim(),
      year: Number(year),
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Añadir nuevo temporada</h3>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <div className={styles.formInputContainer}>
              <label className={styles.formLabel}>Nombre</label>

              <input
                id="seasonName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.formInput}
                autoFocus
              />
            </div>
            <div className={styles.formInputContainer}>
              <label className={styles.formLabel}>Franquicia (abreviada)</label>

              <input
                id="franchise"
                type="text"
                value={franchise}
                onChange={(e) => setFranchise(e.target.value)}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formInputContainer}>
              <label className={styles.formLabel}>Año</label>

              <input
                id="year"
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={styles.formInput}
              />
            </div>
          </div>
          <div className={styles.modalActions}>
            <CButton onClick={onClose}>Cancelar</CButton>
            <CButton
              type="submit"
              disabled={!name.trim() || !franchise.trim() || !year}
            >
              Guardar
            </CButton>
          </div>
        </form>
      </div>
    </div>
  );
}
