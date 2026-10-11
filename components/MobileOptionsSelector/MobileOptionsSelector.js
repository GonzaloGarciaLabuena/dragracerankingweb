"use client";

import styles from "./MobileOptionsSelector.module.css";
import { FaCaretDown } from "react-icons/fa";

export default function MobileOptionsSelector({
  children,
  selectedMode,
  handleModeChange,
  saveRanking,
  downloadRanking,
  dropdownOpen,
  setDropdownOpen,
}) {
  const modes = [
    { value: "score", label: "Puntuación" },
    { value: "episodes", label: "Nº de episodios" },
    { value: "lastEpisode", label: "Último episodio" },
  ];

  return (
    <div className={styles.selector}>
      <button
        type="button"
        className={styles.selectorButton}
        onClick={setDropdownOpen}
      >
        <span>{children}</span>

        <FaCaretDown
          className={`${styles.caret} ${dropdownOpen ? styles.caretOpen : ""}`}
        />
      </button>

      {dropdownOpen && (
        <div className={styles.dropdown}>
          <div className={styles.sectionTitle}>Ordenar por</div>

          {modes.map((mode) => (
            <button
              key={mode.value}
              type="button"
              className={`${styles.dropdownItem} ${
                selectedMode === mode.value ? styles.selected : ""
              }`}
              onClick={() => {
                handleModeChange(mode.value);
                setDropdownOpen(false);
              }}
            >
              {mode.label}
            </button>
          ))}

          {saveRanking && <div className={styles.divider} />}

          {saveRanking && (
            <button
              type="button"
              className={styles.dropdownItem}
              onClick={() => {
                setDropdownOpen(false);
                saveRanking();
              }}
            >
              Guardar
            </button>
          )}

          {downloadRanking && <div className={styles.divider} />}

          {downloadRanking && (
            <button
              type="button"
              className={styles.dropdownItem}
              onClick={() => {
                setDropdownOpen(false);
                downloadRanking();
              }}
            >
              Descargar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
