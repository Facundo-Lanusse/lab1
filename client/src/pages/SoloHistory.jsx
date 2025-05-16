import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/SoloHistory.module.css";

const SoloHistory = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchUserHistory(user.user_id).then(r => {});
        }
    }, [navigate]);

    const fetchUserHistory = async (userId) => {
        try {
            const res = await axios.get("http://localhost:3000/api/FetchSoloHistory", {
                params: { userId }
            });
            setGames(res.data);
        } catch (error) {
            console.error("Error al cargar partidas:", error);
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
                onClick={() => navigate('/home')}
            />
            <h2 className={styles.historyTitle}>Solo history</h2>
            <div className={styles.gamesList}>
                {games.length > 0 ? (
                    games.map((game) => (
                        <div key={game.game_id} className={styles.gameCard}>
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
        </div>
    );
};

export default SoloHistory;
