"use client";

import { queenService } from "@/lib/services/queenService";
import { seasonService } from "@/lib/services/seasonService";
import { useEffect, useState } from "react";
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
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [seasons, setSeasons] = useState([]);

  const fetchAllQueens = async (currentPage) => {
    try {
      setLoading(true);

      const queensList = await queenService.listQueens(null, currentPage);

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

  useEffect(() => {
    fetchAllQueens(page);
    fetchSeasons();
  }, [page]);

  const handleDownload = async (name, season) => {
    const urlQueenName = name.replace(/\s+/g, "");
    const imgBlob = await wikiImgService.getQueenImgWiki(urlQueenName, season);
    console.log(imgBlob);
    const imgPath = await supabaseStorageService.uploadImgQueen(
      season,
      urlQueenName,
      imgBlob,
    );
    console.log(imgPath);
    const imgUrl = await supabaseStorageService.getQueenImg(imgPath);
    console.log(imgUrl);
    return imgUrl;
  };

  const handleSeasonChange = (season) => {
    setSelectedSeason(season);
    fetchQueensOnlySeason(season);
    setDropdownOpen(false);
  };

  return (
    <div>
      <div className={styles.queensHeader}>
        <SeasonSelector
          seasons={seasons}
          selectedSeason={selectedSeason}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
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
      {newQueen && (
        <QueenNewModal
          season={selectedSeason}
          onClose={() => setNewQueen(false)}
          onSave={async ({ name, url, season }) => {
            if (await queenService.createQueen(name, season.id, url)) {
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
        />
      )}
    </div>
  );
}
