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
import MobileOptionsSelector from "@/components/MobileOptionsSelector/MobileOptionsSelector";
import useIsMobile from "@/hooks/useIsMobile";

export default function RankingPage() {
  const tableRef = useRef(null);
  const optionsRef = useRef(null);

  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [pointTypesNormal, setPointTypesNormal] = useState([]);
  const [pointTypesFinal, setPointTypesFinal] = useState([]);
  const [pointTypesFinalDraga, setPointTypesFinalDraga] = useState([]);
  const [pointTypesLipsync, setPointTypesLipsync] = useState([]);
  const [pointTypesAll, setPointTypesAll] = useState([]);
  const [activeCell, setActiveCell] = useState(false);
  const [pointsMap, setPointsMap] = useState(new Map());
  const [pointsMapLipsync, setPointsMapLipsync] = useState(new Map());
  const [queens, setQueens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("score");
  const [openDropdown, setOpenDropdown] = useState(null);

  const isMobile = useIsMobile();

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
    const typesFinal = await pointTypeService.getPointTypes("final");
    const typesFinalDraga = await pointTypeService.getPointTypes("finalDraga");
    const typesLipsync = await pointTypeService.getPointTypes("lipsync");

    const allPointTypes = [
      ...typesNormal,
      ...typesFinal,
      ...typesFinalDraga,
      ...typesLipsync,
    ];

    setPointTypesNormal(typesNormal);
    setPointTypesFinal(typesFinal);
    setPointTypesFinalDraga(typesFinalDraga);
    setPointTypesLipsync(typesLipsync);
    setPointTypesAll(allPointTypes);

    return allPointTypes;
  };

  const fetchQueens = async (season) => {
    const data = await queenService.listQueens(season, null);
    setQueens(data.data);
  };

  const fetchPPE = async (season, pointTypes = pointTypesAll) => {
    const map = await ppeService.getRanking(season, pointTypes);
    setPointsMap(map.pointsMap);
    setPointsMapLipsync(map.lipsyncPointsMap)
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
      setError("No se ha podido cargar el ranking de la temporada.");
    } finally {
      setLoading(false);
    }
  };

  const saveRanking = async () => {
    try {
      await ppeService.saveRanking(selectedSeason, queens, episodes, pointsMap, pointsMapLipsync);

      alert("Ranking guardado correctamente");
    } catch (error) {
      const details = Array.isArray(error.cause) ? error.cause.join("\n") : "";

      alert(details ? `${error.message}\n\n${details}` : error.message);
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
        setError("No se han podido cargar los datos del ranking.");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const handleClick = (event) => {
      if (!optionsRef.current?.contains(event.target)) {
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
  }, [initialDataLoaded, seasons]);

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
        <div className={styles.seasonOptions}>
          <SeasonSelector
            seasons={seasons}
            selectedSeason={selectedSeason}
            dropdownOpen={openDropdown === "season"}
            setDropdownOpen={() => handleDropdown("season")}
            setOpenDropdown={setOpenDropdown}
            handleSeasonChange={handleSeasonChange}
          >
            Temporada
          </SeasonSelector>
        </div>
        {isMobile === null ? null : isMobile ? (
          <div className={styles.mobileOptions}>
            <MobileOptionsSelector
              selectedMode={sortBy}
              handleModeChange={setSortBy}
              saveRanking={saveRanking}
              downloadRanking={downloadRanking}
              dropdownOpen={openDropdown === "mobileOptions"}
              setDropdownOpen={() => handleDropdown("mobileOptions")}
            ></MobileOptionsSelector>
          </div>
        ) : (
          <div className={styles.desktopOptions}>
            <RankingModeSelector
              selectedMode={sortBy}
              dropdownOpen={openDropdown === "mode"}
              setDropdownOpen={() => handleDropdown("mode")}
              setOpenDropdown={setOpenDropdown}
              handleModeChange={setSortBy}
            >
              Ordenar por
            </RankingModeSelector>

            <button
              type="button"
              className={styles.optionButton}
              onClick={saveRanking}
            >
              Guardar
            </button>

            <button
              type="button"
              className={styles.optionButton}
              onClick={downloadRanking}
            >
              Descargar
            </button>
          </div>
        )}
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
          pointTypesLipsync={pointTypesLipsync}
          pointsMap={pointsMap}
          pointsMapLipsync={pointsMapLipsync}
          setPointsMap={setPointsMap}
          setPointsMapLipsync={setPointsMapLipsync}
          activeCell={activeCell}
          setActiveCell={setActiveCell}
          tableRef={tableRef}
          sortBy={sortBy}
        />
      )}
    </div>
  );
}
