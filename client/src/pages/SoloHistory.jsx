import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./css/SoloHistory.module.css";
import BackButton from "../components/BackButton";

const SoloHistory = () => {
  const navigate = useNavigate();
  const [allGames, setAllGames] = useState([]); // Todos los juegos
  const [filteredGames, setFilteredGames] = useState([]);
  const [sortBy, setSortBy] = useState(null); // null, 'date' o 'score'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' o 'desc'
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchAllUserHistory(user.user_id);
    }
  }, [navigate]);

  const fetchAllUserHistory = async (userId) => {
    setLoading(true);
    console.log("Fetching all user history for userId:", userId);

    try {
      const res = await axios.get(
        "http://localhost:3000/api/FetchSoloHistory",
        {
          params: { userId, page: 1, limit: 1000 }, // Traer muchos registros
        }
      );
      console.log("Response received:", res.data);
      setAllGames(res.data.games);
      setFilteredGames(res.data.games);
    } catch (error) {
      console.error("Error al cargar partidas:", error);
      console.error("Error response:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const sortGames = (gamesToSort, sortType, order) => {
    return [...gamesToSort].sort((a, b) => {
      let valueA, valueB;

      if (sortType === "score") {
        valueA = a.score;
        valueB = b.score;
      } else {
        valueA = new Date(a.game_date);
        valueB = new Date(b.game_date);
      }

      if (order === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const handleSortChange = (newSortBy) => {
    // Si se hace clic en el mismo filtro activo, lo desactivamos
    if (newSortBy === sortBy) {
      if (sortOrder === "asc") {
        // Si está en asc, pasar a desc
        setSortOrder("desc");
        const sorted = sortGames(allGames, newSortBy, "desc");
        setFilteredGames(sorted);
      } else {
        // Si está en desc, desactivar filtro
        setSortBy(null);
        setSortOrder("desc");
        setFilteredGames(allGames); // Volver al orden original
      }
    } else {
      // Si es un filtro diferente, activarlo en desc
      setSortBy(newSortBy);
      setSortOrder("desc");
      const sorted = sortGames(allGames, newSortBy, "desc");
      setFilteredGames(sorted);
    }
  };

  // Efecto para aplicar filtros cuando cambian los juegos
  React.useEffect(() => {
    if (allGames.length > 0) {
      if (sortBy) {
        const sorted = sortGames(allGames, sortBy, sortOrder);
        setFilteredGames(sorted);
      } else {
        setFilteredGames(allGames); // Sin filtro, orden original
      }
    }
  }, [allGames, sortBy, sortOrder]);

  const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Argentina/Buenos_Aires",
    };
    return new Intl.DateTimeFormat("es-AR", options).format(date);
  };

  return (
    <div className={styles.historyContainer}>
      <BackButton
        onClick={() => navigate("/Home")}
        ariaLabel="Volver al inicio"
      />
      <h2 className={styles.historyTitle}>Solo History</h2>

      {!loading && allGames.length > 0 && (
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Ordenar por:</span>
            <button
              className={`${styles.filterButton} ${
                sortBy === "date" ? styles.active : ""
              }`}
              onClick={() => handleSortChange("date")}
            >
              Fecha {sortBy === "date" && (sortOrder === "desc" ? "↓" : "↑")}
            </button>
            <button
              className={`${styles.filterButton} ${
                sortBy === "score" ? styles.active : ""
              }`}
              onClick={() => handleSortChange("score")}
            >
              Puntos {sortBy === "score" && (sortOrder === "desc" ? "↓" : "↑")}
            </button>
            {sortBy && (
              <button
                className={styles.clearFilterButton}
                onClick={() => {
                  setSortBy(null);
                  setSortOrder("desc");
                  setFilteredGames(allGames);
                }}
              >
                ✕ Limpiar
              </button>
            )}
          </div>
          <div className={styles.totalCount}>
            Total de partidas: {filteredGames.length}
            {sortBy && (
              <span className={styles.filterStatus}>
                {" "}
                • Filtrado por {sortBy === "date" ? "fecha" : "puntos"}
              </span>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingMessage}>Cargando...</div>
      ) : (
        <>
          <div className={styles.gamesList}>
            {filteredGames.length > 0 ? (
              filteredGames.map((game, index) => (
                <div
                  key={`${game.game_date}-${index}`}
                  className={styles.gameCard}
                >
                  <p className={styles.score}>
                    <strong>Score:</strong> {game.score}
                  </p>
                  <p className={styles.date}>
                    <strong>Date:</strong> {formatDate(game.game_date)}
                  </p>
                </div>
              ))
            ) : (
              <p className={styles.noGamesMessage}>No game registered.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SoloHistory;
