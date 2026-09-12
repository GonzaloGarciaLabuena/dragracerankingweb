import styles from './page.module.css'
import { FaCaretDown } from 'react-icons/fa'
import { useEffect, useState } from 'react'

export default function SeasonSelector({
    seasons,
    selectedSeason,
    dropdownOpen,
    setDropdownOpen,
    handleSeasonChange
}) {
    const [seasonSearch, setSeasonSearch] = useState('')

    const filteredSeasons = seasons.filter(season =>
        season.name.toLowerCase().includes(seasonSearch.toLowerCase())
    )

    return (
        <div className={styles.selector}>

            <button
                type="button"
                className={styles.selectorButton}
                onClick={() => setDropdownOpen(prev => !prev)}
            >
                <span>
                    {selectedSeason
                        ? selectedSeason.name
                        : 'Selecciona una temporada'}
                </span>

                <FaCaretDown
                    className={`${styles.caret} ${
                        dropdownOpen ? styles.caretOpen : ''
                    }`}
                />
            </button>

            {dropdownOpen && (
                <div className={styles.dropdown}>

                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Buscar temporada..."
                            value={seasonSearch}
                            onChange={(e) => setSeasonSearch(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    {filteredSeasons.map(season => (
                        <button
                            key={season.id}
                            type="button"
                            className={`${styles.dropdownItem} ${
                                selectedSeason?.id === season.id
                                    ? styles.selected
                                    : ''
                            }`}
                            onClick={() => {
                                handleSeasonChange(season)
                                setSeasonSearch('')
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
            )}

        </div>
    )
}