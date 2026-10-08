"use client";

import { queenService } from "@/lib/services/queenService";
import { seasonService } from "@/lib/services/seasonService";
import { useEffect, useRef, useState } from "react";
import styles from "./queens.module.css";
import QueenNewModal from "./QueenNewModal";
import { participateService } from "@/lib/services/participateService";
import { supabaseStorageService } from "@/lib/services/supabaseStorageService";
import { wikiImgService } from "@/lib/services/wikiImgService";
import SeasonSelector from "@/components/SeasonSelector/SeasonSelector";
import CButton from "@/components/CButton/CButton";

export default function QueensAdmin() {
  const [queens, setQueens] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newQueen, setNewQueen] = useState(null);
  const [editQueen, setEditQueen] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedQueen, setSelectedQueen] = useState(null);

  const optionsRef = useRef(null);

  const fetchAllQueens = async (currentPage) => {
    try {
      setLoading(true);

      const queensList = await queenService.listQueens(
        { id: "all" },
        currentPage,
      );

      setQueens(queensList.data);
      setTotalPages(queensList.totalPages);
    } catch (error) {
      console.error("Error fetching queens list:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQueensOnlySeason = async (season) => {
    try {
      setLoading(true);

      const queensList = await queenService.listQueens(season, null);

      setQueens(queensList.data);
      setTotalPages(1);
    } catch (error) {
      console.error("Error fetching queens list:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasons = async () => {
    try {
      const seasonList = await seasonService.getAllSeasons();
      setSeasons(seasonList);
    } catch (error) {
      console.error("Error fetching queens list:", error);
    }
  };

  const handleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  useEffect(() => {
    fetchAllQueens(page);
    fetchSeasons();

    const handleClick = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [page]);

  const handleSeasonChange = (season) => {
    setSelectedSeason(season);
    fetchQueensOnlySeason(season);
  };

  return (
    <div>
      <div ref={optionsRef} className={styles.queensHeader}>
        <SeasonSelector
          seasons={seasons}
          selectedSeason={selectedSeason}
          dropdownOpen={openDropdown === "user"}
          setDropdownOpen={() => handleDropdown("user")}
          setOpenDropdown={setOpenDropdown}
          handleSeasonChange={handleSeasonChange}
        >
          Seleccionar una temporada
        </SeasonSelector>
        <CButton
          onClick={() => {
            fetchAllQueens(1);
            setSelectedSeason(null);
          }}
        >
          Limpiar Filtros
        </CButton>
        <CButton
          onClick={() => {
            setNewQueen(true);
          }}
        >
          Añadir Reina
        </CButton>
      </div>

      <div className={styles.queensList}>
        {loading ? (
          <p className={styles.loading}>Cargando...</p>
        ) : queens.length === 0 ? (
          <p className={styles.empty}>No hay reinas.</p>
        ) : (
          queens.map((queen) => (
            <button
              key={queen.id + "-" + queen.season.name}
              type="button"
              className={styles.queen}
              onClick={() => {
                setSelectedQueen(queen);
                setEditQueen(true);
              }}
            >
              <img src={queen.image_url} alt={queen.name} />

              <span>{queen.name}</span>

              <small>{queen.season.name}</small>
            </button>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <CButton
            disabled={page === 1 || loading}
            onClick={() => setPage(page - 1)}
            className={styles.paginationButton}
          >
            ←
          </CButton>
          <span>
            Página {page} de {totalPages}
          </span>

          <CButton
            disabled={page === totalPages || loading}
            onClick={() => setPage(page + 1)}
            className={styles.paginationButton}
          >
            →
          </CButton>
        </div>
      )}
      {editQueen && (
        <QueenNewModal
          season={selectedSeason}
          queen={selectedQueen}
          onClose={() => setEditQueen(false)}
          onSave={async ({ name, image_url, season }) => {
            await queenService.updateQueen(selectedQueen, selectedSeason, {
              name,
              image_url,
              season,
            });
            if (selectedSeason) {
              fetchQueensOnlySeason(selectedSeason);
            } else {
              fetchAllQueens(page);
            }
            setEditQueen(false);
          }}
        >
          Editar reina
        </QueenNewModal>
      )}

      {newQueen && (
        <QueenNewModal
          season={selectedSeason}
          onClose={() => setNewQueen(false)}
          onSave={async ({ name, url, season }) => {
            if (await queenService.createQueen(name, season, url)) {
              alert(`Reina ${name} creada correctamente`);
              if (selectedSeason) {
                fetchQueensOnlySeason(selectedSeason);
              } else {
                fetchAllQueens(page);
              }
              setNewQueen(false);
            } else {
              alert(`Error creando la Reina ${name}`);
            }
          }}
        >
          Añadir nueva reina
        </QueenNewModal>
      )}
    </div>
  );
}
