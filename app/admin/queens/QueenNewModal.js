"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./modal.module.css";
import { FaCaretDown } from "react-icons/fa";
import { seasonService } from "@/lib/services/seasonService";
import { wikiImgService } from "@/lib/services/wikiImgService";
import SeasonSelector from "@/components/SeasonSelector/SeasonSelector";
import CButton from "@/components/CButton/CButton";

export default function QueenNewModal({
  children,
  season,
  queen = {},
  onClose,
  onSave,
}) {
  const [name, setName] = useState(queen.name || "");
  const [url, setUrl] = useState(queen.image_url || "");
  const [imagePreview, setImagePreview] = useState(queen.image_url || null);
  const [selectedSeason, setSelectedSeason] = useState(queen.season || season);
  const [seasons, setSeasons] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const optionsRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({ name: name, image_url: url, season: selectedSeason });
  };

  const handleSeasonChange = (seasonChange) => {
    setSelectedSeason(seasonChange);
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
  }, []);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{children}</h3>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <div className={styles.formInputContainer}>
              <label className={styles.formLabel}>Nombre</label>

              <input
                id="queenName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.formInput}
                autoFocus
              />
            </div>

            <div className={styles.formInputContainer}>
              <label className={styles.formLabel}>Temporada</label>

              <div ref={optionsRef} className={styles.seasonContainer}>
                <span className={styles.seasonName}>
                  {selectedSeason?.name}
                </span>

                <SeasonSelector
                  seasons={seasons}
                  selectedSeason={selectedSeason}
                  dropdownOpen={openDropdown === "user"}
                  setDropdownOpen={() => handleDropdown("user")}
                  setOpenDropdown={setOpenDropdown}
                  handleSeasonChange={handleSeasonChange}
                  dropLeft
                />
              </div>
            </div>

            <div className={styles.formInputContainer}>
              <label className={styles.formLabel}>Url</label>

              <input
                id="urlImg"
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setImagePreview(e.target.value);
                }}
                className={styles.formInput}
              />
            </div>
            <div className={styles.ImgContainer}>
              {imagePreview ? (
                <img
                  className={styles.queenimg}
                  src={imagePreview}
                  alt="Imagen de la reina"
                />
              ) : (
                <>
                  <img
                    className={`${styles.queenimg} ${styles.defaultAvatarBlack}`}
                    src="/default-avatar-black.svg"
                    alt="Imagen por defecto"
                  />

                  <img
                    className={`${styles.queenimg} ${styles.defaultAvatarWhite}`}
                    src="/default-avatar-white.svg"
                    alt="Imagen por defecto"
                  />
                </>
              )}
            </div>
          </div>
          <div className={styles.modalActions}>
            <CButton onClick={onClose}>Cancelar</CButton>
            <CButton type="submit" disabled={!name.trim() || !selectedSeason}>
              Guardar
            </CButton>
          </div>
        </form>
      </div>
    </div>
  );
}
