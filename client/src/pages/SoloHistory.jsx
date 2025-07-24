import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/SoloHistory.module.css";

const SoloHistory = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchUserHistory(user.user_id, 1);
        }
    }, [navigate]);

    const fetchUserHistory = async (userId, page = 1) => {
        setLoading(true);
        console.log('Fetching user history for userId:', userId, 'page:', page);

        try {
            const res = await axios.get("http://localhost:3000/api/FetchSoloHistory", {
                params: { userId, page, limit: 5 }
            });
            console.log('Response received:', res.data);
            setGames(res.data.games);
            setPagination(res.data.pagination);
        } catch (error) {
            console.error("Error al cargar partidas:", error);
            console.error("Error response:", error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchUserHistory(user.user_id, newPage);
        }
    };

    const formatDate = (rawDate) => {
        const date = new Date(rawDate);
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'America/Argentina/Buenos_Aires'
        };
        return new Intl.DateTimeFormat('es-AR', options).format(date);
    };

    return (
        <div className={styles.historyContainer}>
            <img
                className={styles.arrow}
                alt="Volver"
                src="arrow-left-solid.svg"
                onClick={() => navigate('/Home')}
            />
            <h2 className={styles.historyTitle}>Solo history</h2>

            {loading ? (
                <div className={styles.loadingMessage}>Cargando...</div>
            ) : (
                <>
                    <div className={styles.gamesList}>
                        {games.length > 0 ? (
                            games.map((game, index) => (
                                <div key={`${game.game_date}-${index}`} className={styles.gameCard}>
                                    <p className={styles.score}><strong>Score:</strong> {game.score}</p>
                                    <p className={styles.date}><strong>Date:</strong> {formatDate(game.game_date)}</p>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noGamesMessage}>
                                No game registered.
                            </p>
                        )}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className={styles.paginationContainer}>
                            <button
                                className={`${styles.paginationButton} ${!pagination.hasPrevPage ? styles.disabled : ''}`}
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={!pagination.hasPrevPage}
                            >
                                Anterior
                            </button>

                            <div className={styles.pageNumbers}>
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
                                    <button
                                        key={pageNum}
                                        className={`${styles.pageNumber} ${pageNum === pagination.currentPage ? styles.active : ''}`}
                                        onClick={() => handlePageChange(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>

                            <button
                                className={`${styles.paginationButton} ${!pagination.hasNextPage ? styles.disabled : ''}`}
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}

                    <div className={styles.paginationInfo}>
                        Mostrando página {pagination.currentPage} de {pagination.totalPages}
                        ({pagination.totalRecords} partidas en total)
                    </div>
                </>
            )}
        </div>
    );
};

export default SoloHistory;
