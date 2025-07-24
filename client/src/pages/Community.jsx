import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/FriendsMenu.module.css";
import styles2 from "./css/CommunitySearch.module.css";
import {BurgerMenu} from "../components/BurgerMenu";

const Community = () => {
    const navigate = useNavigate();
    const [communityCategories, setCommunityCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para paginado
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCategories, setTotalCategories] = useState(0);
    const [categoriesPerPage] = useState(8); // 8 categorías por página (ideal para grilla de tarjetas)
    const [pagination, setPagination] = useState({
        hasNextPage: false,
        hasPrevPage: false
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/Home');
            return;
        }
    }, [navigate]);

    // Función para hacer fetch con debounce en la búsqueda
    const fetchCommunities = useCallback(async (page = 1, search = '') => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: categoriesPerPage.toString(),
                search: search
            });

            const res = await axios.get(`http://localhost:3000/api/FetchCommunityCategoriesApproved?${params}`);

            setCommunityCategories(res.data.categories);
            setCurrentPage(res.data.pagination.currentPage);
            setTotalPages(res.data.pagination.totalPages);
            setTotalCategories(res.data.pagination.totalCategories);
            setPagination({
                hasNextPage: res.data.pagination.hasNextPage,
                hasPrevPage: res.data.pagination.hasPrevPage
            });

            setLoading(false);
        } catch (error) {
            console.error("Error al cargar comunidades", error);
            setError("No se pudieron cargar las categorías. Por favor, intenta de nuevo más tarde.");
            setLoading(false);
        }
    }, [categoriesPerPage]);

    // Efecto para cargar categorías cuando cambian los parámetros
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchCommunities(currentPage, searchTerm);
        }, 300); // Debounce de 300ms para la búsqueda

        return () => clearTimeout(timeoutId);
    }, [currentPage, searchTerm, fetchCommunities]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Resetear a primera página al buscar
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
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
            <div className={styles.friendsContainer}>
                <BurgerMenu />
                <h2 className={styles.friendsTitle}>Comunidades</h2>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                    color: 'var(--text-color)'
                }}>
                    <div>Cargando categorías...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.friendsContainer}>
                <BurgerMenu />
                <h2 className={styles.friendsTitle}>Comunidades</h2>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                    color: 'var(--text-color)',
                    gap: '1rem'
                }}>
                    <div>{error}</div>
                    <button
                        onClick={() => fetchCommunities(currentPage, searchTerm)}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Intentar de nuevo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.friendsContainer}>
            <BurgerMenu />
            <h2 className={styles.friendsTitle}>Comunidades</h2>

            {/* Información de total de categorías */}
            <div style={{
                textAlign: 'center',
                color: 'var(--text-color)',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                opacity: 0.8
            }}>
                Total de categorías: {totalCategories}
            </div>

            <div className="centered-div" style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px'
            }}>
                <button onClick={()=>{navigate('/Create-Category')}} className={styles2.createCategoryButton}>
                    Crear categoria
                </button>
            </div>

            {/* Buscador */}
            <div className={styles.searchAndAddContainer}>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Buscar categoría..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {/* Tarjetas de categorías */}
            <div className={styles2.categoryCardsContainer}>
                {communityCategories.map((category) => (
                    <div
                        key={category.community_category_id}
                        className={styles2.categoryCard}
                        onClick={() => navigate(`/Play-Categories/${category.community_category_id}`)}
                    >
                        <div className={styles2.categoryIcon}>
                            {category.name.charAt(0).toUpperCase()}
                        </div>
                        <h3 className={styles2.categoryName}>
                            {category.name}
                        </h3>
                        <button
                            className={styles2.categoryButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/Play-Categories/${category.community_category_id}`);
                            }}
                        >
                            Jugar
                        </button>
                    </div>
                ))}
            </div>

            {/* Mensaje cuando no hay resultados */}
            {communityCategories.length === 0 && !loading && (
                <div style={{
                    textAlign: 'center',
                    marginTop: '40px',
                    color: 'var(--text-color)'
                }}>
                    {searchTerm
                        ? `No se encontraron categorías que coincidan con "${searchTerm}".`
                        : "No hay categorías disponibles."
                    }
                </div>
            )}

            {/* Controles de paginado */}
            {totalPages > 1 && (
                <div className={styles2.paginationContainer}>
                    <div className={styles2.paginationInfo}>
                        Página {currentPage} de {totalPages}
                    </div>

                    <div className={styles2.paginationControls}>
                        {/* Botón Primera página */}
                        <button
                            className={`${styles2.pageButton} ${!pagination.hasPrevPage ? styles2.disabled : ''}`}
                            onClick={() => handlePageChange(1)}
                            disabled={!pagination.hasPrevPage}
                            aria-label="Primera página"
                        >
                            «
                        </button>

                        {/* Botón Página anterior */}
                        <button
                            className={`${styles2.pageButton} ${!pagination.hasPrevPage ? styles2.disabled : ''}`}
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
                                className={`${styles2.pageButton} ${pageNum === currentPage ? styles2.active : ''}`}
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))}

                        {/* Botón Página siguiente */}
                        <button
                            className={`${styles2.pageButton} ${!pagination.hasNextPage ? styles2.disabled : ''}`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination.hasNextPage}
                            aria-label="Página siguiente"
                        >
                            ›
                        </button>

                        {/* Botón Última página */}
                        <button
                            className={`${styles2.pageButton} ${!pagination.hasNextPage ? styles2.disabled : ''}`}
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
    );
};

export default Community;