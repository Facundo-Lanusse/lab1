import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/Ranking.module.css";

function UserRanking() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState('desc'); // desc o asc
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }

        setCurrentUser(user);
        fetchUsers();
    }, [navigate]);

    // Filtrar y ordenar usuarios cuando cambian los criterios
    useEffect(() => {
        if (!users.length) return;

        let result = [...users];

        // Aplicar filtro de búsqueda
        if (searchTerm) {
            result = result.filter(user =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Aplicar ordenamiento
        result.sort((a, b) => {
            if (sortDirection === 'desc') {
                return b.rank_points - a.rank_points;
            } else {
                return a.rank_points - b.rank_points;
            }
        });

        setFilteredUsers(result);
    }, [users, searchTerm, sortDirection]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:3000/api/users", {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });

            setUsers(res.data);
            setFilteredUsers(res.data.sort((a, b) => b.rank_points - a.rank_points));
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar usuarios", error);
            setError("No se pudieron cargar los datos del ranking. Por favor, intenta de nuevo más tarde.");
            setLoading(false);
        }
    };

    const toggleSortDirection = () => {
        setSortDirection(prevSort => prevSort === 'desc' ? 'asc' : 'desc');
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const isCurrentUser = (userId) => {
        return currentUser && currentUser.user_id === userId;
    };

    // Renderizado condicional para estados de carga y error
    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Cargando ranking...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <p>{error}</p>
                    <button onClick={fetchUsers} className={styles.retryButton}>
                        Intentar de nuevo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <button
                className={styles.backButton}
                onClick={() => navigate('/home')}
                aria-label="Volver"
            >
                <img src="arrow-left-solid.svg" alt="Volver" />
            </button>

            <div className={styles.headerSection}>
                <h1 className={styles.gameTitle}>Ranking</h1>
                <h2 className={styles.subtitle}>Mejores puntuaciones históricas</h2>
            </div>

            <div className={styles.rankingContainer}>
                <div className={styles.filterControls}>
                    <input
                        type="text"
                        placeholder="Buscar jugador..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button
                        className={styles.sortButton}
                        onClick={toggleSortDirection}
                        aria-label={sortDirection === 'desc' ? 'Ordenar ascendente' : 'Ordenar descendente'}
                    >
                        {sortDirection === 'desc' ? '↓ Puntos' : '↑ Puntos'}
                    </button>
                </div>

                <div className={styles.rankingHeader}>
                    <div className={styles.rankNumber}>#</div>
                    <div className={styles.rankUsername}>Jugador</div>
                    <div className={styles.rankScore}>Puntos</div>
                </div>

                <div className={styles.rankingList}>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                            <div
                                key={user.user_id}
                                className={`${styles.rankingItem} 
                                    ${index === 0 ? styles.firstPlace : ''} 
                                    ${index === 1 ? styles.secondPlace : ''} 
                                    ${index === 2 ? styles.thirdPlace : ''} 
                                    ${isCurrentUser(user.user_id) ? styles.currentUser : ''}`}
                                onClick={() => navigate(`/profile/${user.user_id}`)}
                            >
                                <div className={styles.rankNumber}>{index + 1}</div>
                                <div className={styles.rankUsername}>{user.username}</div>
                                <div className={styles.rankScore}>{user.rank_points}</div>

                                {index < 3 && (
                                    <div className={styles.medal}>
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className={styles.noResults}>
                            No se encontraron resultados para "{searchTerm}"
                        </div>
                    )}
                </div>
            </div>

            <button
                className={styles.playButton}
                onClick={() => navigate('/play')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                Jugar
            </button>
        </div>
    );
}

export default UserRanking;

