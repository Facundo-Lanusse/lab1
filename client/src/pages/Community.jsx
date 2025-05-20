import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/FriendsMenu.module.css"; // Usando los estilos de FriendsMenu
import styles2 from "./css/CommunitySearch.module.css";

const Community = () => {

    const navigate = useNavigate();
    const [communityCategories, setCommunityCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        fetchCommunities().then();
        if (!user) {
            navigate('/home');
        }
    }, []);

    useEffect(() => {

        // Filtrar categorías según el término de búsqueda
        const filtered = communityCategories.filter(category =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [searchTerm, communityCategories]);

    const fetchCommunities = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/FetchCommunityCategories");
            setCommunityCategories(res.data);
        } catch (error) {
            console.error("Error al cargar comunidades", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className={styles.friendsContainer}>

            <h2 className={styles.friendsTitle}>Comunidades</h2>
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
                {filteredCategories.map((category) => (
                    <div
                        key={category.community_category_id}
                        className={styles2.categoryCard}
                        onClick={() => navigate(`/category/${category.community_category_id}`)}
                    >
                        <div
                            className={styles2.categoryIcon}
                        >
                            {category.name.charAt(0).toUpperCase()}
                        </div>
                        <h3 className={styles2.categoryName}>
                            {category.name}
                        </h3>
                        <button
                            className={styles2.categoryButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/category/${category.community_category_id}`);
                            }}
                        >
                            Ver Detalles
                        </button>
                    </div>
                ))}
            </div>

            {filteredCategories.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    marginTop: '40px',
                    color: 'var(--text-color)'
                }}>
                    No se encontraron categorías que coincidan con tu búsqueda.
                </div>
            )}
        </div>
    );
};

export default Community;