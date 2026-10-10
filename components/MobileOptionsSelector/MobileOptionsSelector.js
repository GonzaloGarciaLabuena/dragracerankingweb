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

  const selectedModeLabel = modes.find(
    (mode) => mode.value === selectedMode,
  )?.label;

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

          <div className={styles.divider} />

          <button
            type="button"
            className={styles.dropdownItem}
            onClick={() => {
              setDropdownOpen(false);
              saveRanking();
            }}
          >
            Guardar ranking
          </button>

          <div className={styles.divider} />

          <button
            type="button"
            className={styles.dropdownItem}
            onClick={() => {
              setDropdownOpen(false);
              downloadRanking();
            }}
          >
            Descargar ranking
          </button>
        </div>
      )}
    </div>
  );
}
