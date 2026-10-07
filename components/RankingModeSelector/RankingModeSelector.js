import styles from "./RankingModeSelector.module.css";
import { FaCaretDown } from "react-icons/fa";

export default function RankingModeSelector({
  children,
  selectedMode,
  dropdownOpen,
  setDropdownOpen,
  handleModeChange,
  dropLeft = false,
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
    <div className={`${styles.selector} ${dropLeft ? styles.dropLeft : ""}`}>
      <button
        type="button"
        className={styles.selectorButton}
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        <span>{selectedModeLabel}</span>

        <FaCaretDown
          className={`${styles.caret} ${dropdownOpen ? styles.caretOpen : ""}`}
        />
      </button>

      {dropdownOpen && (
        <div className={styles.dropdown}>
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
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
