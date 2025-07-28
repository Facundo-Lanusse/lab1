import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GameEndScreen.module.css";

// Función para normalizar nombres (quitar acentos y convertir a minúsculas)
const normalizeString = (str) => {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remover acentos
};

const GameEndScreen = ({ gameEndData, onClose }) => {
  const navigate = useNavigate();

  console.log("🎮 GameEndScreen renderizado con:", gameEndData);

  if (!gameEndData) {
    console.log("❌ No hay gameEndData, retornando null");
    return null;
  }

  const {
    isWinner,
    myScore,
    opponentScore,
    myCategories,
    opponentCategories,
    opponentName,
  } = gameEndData;

  const handleBackToHome = () => {
    console.log("🏠 Volviendo al Home...");
    if (onClose) {
      console.log("🔄 Ejecutando callback onClose");
      onClose();
    }
    navigate("/Home");
  };

  return (
    <div className={styles.gameEndScreenOverlay}>
      <div className={styles.gameEndScreen}>
        <div className={styles.gameEndHeader}>
          <h1
            className={`${styles.gameEndTitle} ${
              isWinner ? styles.winner : styles.loser
            }`}
          >
            {isWinner ? "¡VICTORIA!" : "DERROTA"}
          </h1>
          <div className={styles.finalScore}>
            <span className={styles.scoreLabel}>Resultado Final</span>
            <div className={styles.scoreDisplay}>
              <div className={styles.playerScore}>
                <span className={styles.playerName}>Tú</span>
                <span
                  className={`${styles.score} ${
                    isWinner ? styles.winnerScore : ""
                  }`}
                >
                  {myScore}
                </span>
              </div>
              <div className={styles.scoreSeparator}>-</div>
              <div className={styles.playerScore}>
                <span
                  className={`${styles.score} ${
                    !isWinner ? styles.winnerScore : ""
                  }`}
                >
                  {opponentScore}
                </span>
                <span className={styles.playerName}>{opponentName}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.gameEndContent}>
          <div className={styles.resultMessage}>
            {isWinner
              ? `¡Felicidades! Has derrotado a ${opponentName} por ${myScore} a ${opponentScore}`
              : `${opponentName} te ha derrotado por ${opponentScore} a ${myScore}`}
          </div>

          <div className={styles.categoriesComparison}>
            <h3>Resumen de Categorías</h3>
            <div className={styles.categoriesGrid}>
              <div className={styles.playerCategories}>
                <h4>Tus Categorías ({myScore}/4)</h4>
                <div className={styles.categoryList}>
                  {myCategories
                    .sort((a, b) =>
                      normalizeString(a.name).localeCompare(
                        normalizeString(b.name)
                      )
                    )
                    .map((category) => (
                      <div
                        key={category.category_id}
                        className={`${styles.categoryItem} ${
                          category.completed
                            ? styles.completed
                            : styles.incomplete
                        }`}
                      >
                        <span className={styles.categoryName}>
                          {category.name}
                        </span>
                        {category.completed && (
                          <span className={styles.checkMark}>✓</span>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              <div className={styles.playerCategories}>
                <h4>
                  {opponentName} ({opponentScore}/4)
                </h4>
                <div className={styles.categoryList}>
                  {opponentCategories
                    .sort((a, b) =>
                      normalizeString(a.name).localeCompare(
                        normalizeString(b.name)
                      )
                    )
                    .map((category) => (
                      <div
                        key={category.category_id}
                        className={`${styles.categoryItem} ${
                          category.completed
                            ? styles.completed
                            : styles.incomplete
                        }`}
                      >
                        <span className={styles.categoryName}>
                          {category.name}
                        </span>
                        {category.completed && (
                          <span className={styles.checkMark}>✓</span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.gameEndActions}>
          <button className={styles.playAgainButton} onClick={handleBackToHome}>
            Volver al Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameEndScreen;
