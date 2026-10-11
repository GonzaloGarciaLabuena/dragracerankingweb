"use client";

import { useState, useRef } from "react";
import styles from "./RankingCell.module.css";

export default function RankingCell({
  cellId,
  activeCell,
  setActiveCell,
  pointTypes,
  point,
  setPoint,
}) {
  const [openUp, setOpenUp] = useState(false);
  const cellRef = useRef(null);
  const open = activeCell === cellId;
  const [openLeft, setOpenLeft] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState(null);

  const handleOpen = () => {
    if (activeCell !== null) {
      if (open) {
        setActiveCell(false);
        setDropdownPosition(null);
        return;
      }

      if (cellRef.current) {
        const rect = cellRef.current.getBoundingClientRect();

        const zoomContainer = cellRef.current.closest("[data-zoom]");
        const zoomLevel = Number(zoomContainer?.dataset.zoom) || 1;

        const dropdownHeight = 250 * zoomLevel;
        const dropdownWidth = 170 * zoomLevel;

        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const spaceRight = window.innerWidth - rect.left;

        const openUp = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

        const openLeft = spaceRight < dropdownWidth;

        setOpenUp(openUp);
        setOpenLeft(openLeft);

        setDropdownPosition({
          top: (openUp ? rect.top : rect.bottom) / zoomLevel,
          left: openLeft ? undefined : rect.left / zoomLevel,
          right: openLeft
            ? (window.innerWidth - rect.right) / zoomLevel
            : undefined,
        });
      }

      setActiveCell(cellId);
    }
  };

  const handleSelect = (selectedPoint) => {
    setPoint(selectedPoint);
    setActiveCell(false);
  };

  const rect = cellRef.current?.getBoundingClientRect();

  return (
    <div ref={cellRef} className={styles.cell}>
      <button
        className={styles.scoreButton}
        style={{
          backgroundColor: point
            ? `#${point.hexaColor}`
            : "var(--color-score-empty)",
        }}
        onClick={handleOpen}
      >
        {point ? point.label : ""}
      </button>

      {open && dropdownPosition && (
        <div
          className={`${styles.dropdown} ${openUp ? styles.dropdownUp : ""}`}
          style={dropdownPosition}
        >
          <button
            className={`${styles.option} ${styles.emptyOption}`}
            onClick={() => handleSelect(null)}
          >
            EMPTY
          </button>

          {pointTypes.map((pointType) => (
            <button
              key={pointType.id}
              className={styles.option}
              style={{
                backgroundColor: `#${pointType.hexaColor}`,
              }}
              onClick={() => handleSelect(pointType)}
            >
              {pointType.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
