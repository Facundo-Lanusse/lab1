import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/GamePlay.module.css";

const SoloHistory = () => {
    const navigate = useNavigate();

    const [games, setGames] = useState([])

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) { //Si no lo está lo mando a su casa
            navigate('/login');
        }
        fetchUserHistory()
    }, [navigate]);


    const fetchUserHistory = async () => {
        try {
            const userId = JSON.parse(localStorage.getItem('user')).id
            const res = await axios.get("http://localhost:3000/api/FetchSoloHistory", {
                params: {
                    userId: userId
                }
            });
            setGames(res.data);
        } catch (error) {
            console.error("Error al cargar partidas", error);
        }
    }

    function formatDate(rawDate) {
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
    }

    return(
        <div>
            <h2 className={styles.titleDePrueba}>Historial de partidas en solo</h2>
            <ul>
                {games.map((game) => (
                    <button key={game.game_id} className={styles.score} >
                        Score: {game.score} Fecha: ({formatDate(game.game_date)})
                    </button>
                ))}
            </ul>
        </div>
    );


}


export default SoloHistory;
