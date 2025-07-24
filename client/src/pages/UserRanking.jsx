import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/Ranking.module.css";

function UserRanking() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentUser, setCurrentUser] = useState(null);

    // Estados para paginado
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [usersPerPage] = useState(10); // Cantidad de usuarios por página
    const [pagination, setPagination] = useState({
        hasNextPage: false,
        hasPrevPage: false
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }
        setCurrentUser(user);
    }, [navigate]);

    // Función para hacer fetch con debounce en la búsqueda
    const fetchUsers = useCallback(async (page = 1, search = '', sort = 'desc') => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: usersPerPage.toString(),
                search: search,
                sort: sort
            });

            const res = await axios.get(`http://localhost:3000/api/users?${params}`, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });

            setUsers(res.data.users);
            setCurrentPage(res.data.pagination.currentPage);
            setTotalPages(res.data.pagination.totalPages);
            setTotalUsers(res.data.pagination.totalUsers);
            setPagination({
                hasNextPage: res.data.pagination.hasNextPage,
                hasPrevPage: res.data.pagination.hasPrevPage
            });

            setLoading(false);
        } catch (error) {
            console.error("Error al cargar usuarios", error);
            setError("No se pudieron cargar los datos del ranking. Por favor, intenta de nuevo más tarde.");
            setLoading(false);
        }
    }, [usersPerPage]);

    // Efecto para cargar usuarios cuando cambian los parámetros
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers(currentPage, searchTerm, sortDirection);
        }, 300); // Debounce de 300ms para la búsqueda

        return () => clearTimeout(timeoutId);
    }, [currentPage, searchTerm, sortDirection, fetchUsers]);

    const toggleSortDirection = () => {
        const newSort = sortDirection === 'desc' ? 'asc' : 'desc';
        setSortDirection(newSort);
        setCurrentPage(1); // Resetear a primera página al cambiar orden
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Resetear a primera página al buscar
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const isCurrentUser = (userId) => {
        return currentUser && currentUser.user_id === userId;
    };

    // Función para generar números de página
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Ajustar startPage si estamos cerca del final
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

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
                    <button onClick={() => fetchUsers(currentPage, searchTerm, sortDirection)} className={styles.retryButton}>
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
                onClick={() => navigate('/Home')}
                aria-label="Volver"
            >
                <img src="arrow-left-solid.svg" alt="Volver" />
            </button>

            <div className={styles.headerSection}>
                <h1 className={styles.gameTitle}>Ranking</h1>
                <h2 className={styles.subtitle}>Mejores puntuaciones históricas</h2>
                <p className={styles.totalCount}>Total de jugadores: {totalUsers}</p>
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
                    {users.length > 0 ? (
                        users.map((user, index) => {
                            // Calcular posición real en el ranking considerando la página
                            const realPosition = (currentPage - 1) * usersPerPage + index + 1;

                            return (
                                <div
                                    key={user.user_id}
                                    className={`${styles.rankingItem} 
                                        ${realPosition === 1 ? styles.firstPlace : ''} 
                                        ${realPosition === 2 ? styles.secondPlace : ''} 
                                        ${realPosition === 3 ? styles.thirdPlace : ''} 
                                        ${isCurrentUser(user.user_id) ? styles.currentUser : ''}`}
                                    onClick={() => navigate(`/profile/${user.user_id}`)}
                                >
                                    <div className={styles.rankNumber}>{realPosition}</div>
                                    <div className={styles.rankUsername}>{user.username}</div>
                                    <div className={styles.rankScore}>{user.rank_points}</div>

                                    {realPosition <= 3 && (
                                        <div className={styles.medal}>
                                            {realPosition === 1 ? '🥇' : realPosition === 2 ? '🥈' : '🥉'}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles.noResults}>
                            {searchTerm
                                ? `No se encontraron resultados para "${searchTerm}"`
                                : "No hay usuarios para mostrar"
                            }
                        </div>
                    )}
                </div>

                {/* Controles de paginado */}
                {totalPages > 1 && (
                    <div className={styles.paginationContainer}>
                        <div className={styles.paginationInfo}>
                            Página {currentPage} de {totalPages}
                        </div>

                        <div className={styles.paginationControls}>
                            {/* Botón Primera página */}
                            <button
                                className={`${styles.pageButton} ${!pagination.hasPrevPage ? styles.disabled : ''}`}
                                onClick={() => handlePageChange(1)}
                                disabled={!pagination.hasPrevPage}
                                aria-label="Primera página"
                            >
                                «
                            </button>

                            {/* Botón Página anterior */}
                            <button
                                className={`${styles.pageButton} ${!pagination.hasPrevPage ? styles.disabled : ''}`}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!pagination.hasPrevPage}
                                aria-label="Página anterior"
                            >
                                ‹
                            </button>

                            {/* Números de página */}
                            {getPageNumbers().map(pageNum => (
                                <button
                                    key={pageNum}
                                    className={`${styles.pageButton} ${pageNum === currentPage ? styles.active : ''}`}
                                    onClick={() => handlePageChange(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            {/* Botón Página siguiente */}
                            <button
                                className={`${styles.pageButton} ${!pagination.hasNextPage ? styles.disabled : ''}`}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                                aria-label="Página siguiente"
                            >
                                ›
                            </button>

                            {/* Botón Última página */}
                            <button
                                className={`${styles.pageButton} ${!pagination.hasNextPage ? styles.disabled : ''}`}
                                onClick={() => handlePageChange(totalPages)}
                                disabled={!pagination.hasNextPage}
                                aria-label="Última página"
                            >
                                »
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <button
                className={styles.playButton}
                onClick={() => navigate('/Play')}
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