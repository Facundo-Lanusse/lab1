import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/Ranking.module.css";


function UserRanking() {
    const navigate = useNavigate();

    useEffect(() => { //Igual a las líneas de home
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
        }
        else {
            fetchUsers();
        }
    }, [navigate]);

    const [users, setUsers] = useState([]);



    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/users",
                {
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                });
            setUsers(res.data);
        } catch (error) {
            console.error("Error al cargar usuarios", error);
        }
    };

    return (
        <div className={styles.container}>
            <img
                className={styles.backButton}
                alt="Volver"
                src="arrow-left-solid.svg"
                onClick={() => navigate('/home')}
            />

            <div className={styles.headerSection}>
                <h1 className={styles.gameTitle}>Ranking</h1>
                <h2 className={styles.subtitle}>Best historical scores</h2>
            </div>

            <div className={styles.rankingList}>
                {users.map((user, index) => (
                    <div key={user.id} className={`${styles.rankingItem} ${index === 0 ? styles.firstPlace : ''}`}>
                        <div className={styles.rankNumber}>{index + 1}</div>
                        <div className={styles.rankUsername}>{user.username}</div>
                        <div className={styles.rankScore}>{user.rank_points}</div>
                    </div>
                ))}
            </div>

            <button className={styles.playButton} onClick={() => navigate('/play')}>Play</button>
        </div>
    );
}

export default UserRanking;