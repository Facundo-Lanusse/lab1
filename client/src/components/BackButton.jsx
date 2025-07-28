import React from "react";
import styles from "./BackButton.module.css";

const BackButton = ({
  onClick,
  style = {},
  className = "",
  ariaLabel = "Volver atrás",
  size = "medium", // 'small', 'medium', 'large'
}) => {
  const sizeClass =
    styles[`backButton${size.charAt(0).toUpperCase() + size.slice(1)}`];

  return (
    <button
      className={`${styles.backButton} ${sizeClass} ${className}`}
      onClick={onClick}
      style={style}
      aria-label={ariaLabel}
    >
      <img
        src="../arrow-left-solid.svg"
        alt="Volver"
        className={styles.backButtonIcon}
      />
    </button>
  );
};

export default BackButton;
