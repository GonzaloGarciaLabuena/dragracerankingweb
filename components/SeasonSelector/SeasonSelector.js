import styles from "./SeasonSelector.module.css";
import { FaCaretDown } from "react-icons/fa";
import { useState, useRef } from "react";

export default function SeasonSelector({
  children,
  seasons,
  selectedSeason,
  dropdownOpen,
  setDropdownOpen,
  setOpenDropdown,
  handleSeasonChange,
  dropLeft = false,
}) {
  const [seasonSearch, setSeasonSearch] = useState("");
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownTop, setDropdownTop] = useState(0);

  const filteredSeasons = seasons.filter((season) =>
    season.name.toLowerCase().includes(seasonSearch.toLowerCase()),
  );

  return (
    <div className={`${styles.selector} ${dropLeft ? styles.dropLeft : ""}`}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.selectorButton}
        onClick={() => {
          if (!dropdownOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownTop(rect.bottom + 5);
          }

          setDropdownOpen();
        }}
      >
        <span className={styles.selectorText}>{children}</span>

        <FaCaretDown
          className={`${styles.caret} ${dropdownOpen ? styles.caretOpen : ""}`}
        />
      </button>

      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className={`${styles.dropdown} ${styles.mobileFullWidth}`}
          style={{ "--dropdown-top": `${dropdownTop}px` }}
        >
          {/* Buscador fijo */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Buscar temporada..."
              value={seasonSearch}
              onChange={(e) => setSeasonSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Lista con scroll independiente */}
          <div className={styles.dropdownList}>
            {filteredSeasons.map((season) => (
              <button
                key={season.id}
                type="button"
                className={`${styles.dropdownItem} ${
                  selectedSeason?.id === season.id ? styles.selected : ""
                }`}
                onClick={() => {
                  handleSeasonChange(season);
                  setSeasonSearch("");
                  setOpenDropdown(null);
                }}
              >
                <span>{season.name}</span>
              </button>
            ))}

            {filteredSeasons.length === 0 && (
              <div className={styles.noResults}>
                No se encontraron temporadas
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
