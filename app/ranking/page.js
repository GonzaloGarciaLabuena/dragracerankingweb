"use client";

import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { seasonService } from "@/lib/services/seasonService";
import { episodeService } from "@/lib/services/episodeService";
import { pointTypeService } from "@/lib/services/pointTypeService";
import { queenService } from "@/lib/services/queenService";
import { ppeService } from "@/lib/services/ppeService";
import { profileService } from "@/lib/services/profileService";
import SeasonSelector from "@/components/SeasonSelector/SeasonSelector";
import RankingModeSelector from "@/components/RankingModeSelector/RankingModeSelector";
import RankingTable from "./RankingTable";

export default function RankingPage() {
  const tableRef = useRef(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [pointTypesNormal, setPointTypesNormal] = useState([]);
  const [pointTypesFinal, setPointTypesFinal] = useState([]);
  const [pointTypesFinalDraga, setPointTypesFinalDraga] = useState([]);
  const [pointTypesAll, setPointTypesAll] = useState([]);
  const [activeCell, setActiveCell] = useState(false);
  const [pointsMap, setPointsMap] = useState(new Map());
  const [queens, setQueens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("score");
  const [openDropdown, setOpenDropdown] = useState(null);

  const optionsRef = useRef(null);

  const fetchSeasons = async () => {
    const map = await seasonService.getRankableSeasons();
    setSeasons(map);
  };

  const fetchEpisodes = async (season) => {
    const map = await episodeService.getEpisodes(season.id);
    setEpisodes(map);
  };

  const fetchPointTypes = async () => {
    const typesNormal = await pointTypeService.getPointTypes("default");
    setPointTypesNormal(typesNormal);
    const typesFinal = await pointTypeService.getPointTypes("final");
    setPointTypesFinal(typesFinal);
    const typesFinalDraga = await pointTypeService.getPointTypes("finalDraga");
    setPointTypesFinalDraga(typesFinalDraga);
    const allPointTypes = [...typesNormal, ...typesFinal, ...typesFinalDraga];
    setPointTypesAll(allPointTypes);
  };

  const fetchQueens = async (season) => {
    const data = await queenService.listQueens(season, null);
    setQueens(data.data);
  };

  const fetchPPE = async (season) => {
    const map = await ppeService.getRanking(season, pointTypesAll);
    setPointsMap(map);
  };

  const getProfile = async () => {
    const profileData = await profileService.getProfileData();
    setProfile(profileData);
  };

  const handleSeasonChange = async (season) => {
    setLoading(true);

    setSelectedSeason(season);

    try {
      await Promise.all([
        fetchEpisodes(season),
        fetchQueens(season),
        fetchPPE(season),
      ]);
    } catch (error) {
      console.error("Error loading queens:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveRanking = async () => {
    try {
      await ppeService.saveRanking(selectedSeason, queens, episodes, pointsMap);
      alert("Ranking guardado correctamente");
    } catch (error) {
      alert(`${error.message}\n\n${error.cause.join("\n")}`);
    }
  };

  const downloadRanking = async () => {
    if (!tableRef.current) return;
    const table = tableRef.current;
    try {
      const backgroundColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-table-background")
        .trim();

      const dataUrl = await toPng(table, {
        pixelRatio: 2,
        backgroundColor,
        cacheBust: true,

        style: {
          boxShadow: "none",
        },
      });

      const link = document.createElement("a");

      const seasonName = selectedSeason?.name
        ?.replace(/^rupaul's /i, "")
        ?.replace(/\s+/g, "-");

      link.download = `${profile?.username}-${seasonName}-ranking.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error al descargar el ranking:", error);
    }
  };

  const handleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        await Promise.all([getProfile(), fetchSeasons(), fetchPointTypes()]);
        setInitialDataLoaded(true);
      } catch (error) {
        console.error("Error loading ranking:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const handleClick = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const seasonId = new URLSearchParams(window.location.search).get(
      "seasonId",
    );

    if (!initialDataLoaded || !seasonId || seasons.length === 0) {
      return;
    }

    const season = seasons.find(
      (season) => String(season.id) === String(seasonId),
    );

    if (season) {
      handleSeasonChange(season);
    }
  }, [initialDataLoaded]);

  return (
    <div className={styles.pageContent}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          <span>Cargando...</span>
        </div>
      )}
      {error && (
        <div className="error-modal">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => setError(null)}>Cerrar</button>
        </div>
      )}
      <div ref={optionsRef} className={styles.options}>
        <SeasonSelector
          seasons={seasons}
          selectedSeason={selectedSeason}
          dropdownOpen={openDropdown === "season"}
          setDropdownOpen={() => handleDropdown("season")}
          setOpenDropdown={setOpenDropdown}
          handleSeasonChange={handleSeasonChange}
        >
          Seleccionar temporada
        </SeasonSelector>

        <RankingModeSelector
          selectedMode={sortBy}
          dropdownOpen={openDropdown === "mode"}
          setDropdownOpen={() => handleDropdown("mode")}
          setOpenDropdown={setOpenDropdown}
          handleModeChange={setSortBy}
        />

        <button
          type="button"
          className={styles.optionButton}
          onClick={saveRanking}
        >
          Guardar ranking
        </button>

        <button
          type="button"
          className={styles.optionButton}
          onClick={downloadRanking}
        >
          Descargar ranking
        </button>
      </div>

      {selectedSeason && (
        <RankingTable
          user={profile}
          season={selectedSeason}
          queens={queens}
          episodes={episodes}
          pointTypesNormal={pointTypesNormal}
          pointTypesFinal={pointTypesFinal}
          pointTypesFinalDraga={pointTypesFinalDraga}
          pointsMap={pointsMap}
          setPointsMap={setPointsMap}
          activeCell={activeCell}
          setActiveCell={setActiveCell}
          tableRef={tableRef}
          sortBy={sortBy}
        />
      )}
    </div>
  );
}
