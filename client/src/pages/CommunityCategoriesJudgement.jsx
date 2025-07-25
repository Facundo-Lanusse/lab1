import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/CommunityCategoriesJudgement.module.css";
import styles2 from "./css/FriendsMenu.module.css";

const CommunityCategoriesJudgement = () => {
    const navigate = useNavigate();
    const [communityCategories, setCommunityCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [categoryUserMap, setCategoryUserMap] = useState(new Map());


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        fetchCommunities()
        if (!user || !user.is_admin) {
            navigate('/Home');
        }
    }, [navigate]);

    useEffect(() => {
        const filtered = communityCategories.filter(category =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [searchTerm, communityCategories, navigate]);

    const fetchCommunities = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/FetchCommunityCategoriesPending");
            setCommunityCategories(res.data);
        } catch (error) {
            console.error("Error al cargar comunidades", error);
        }
    };

    const fetchUser = async (userId) => {
        try{
            const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
            console.log(response.data);
            return response.data.username;
        }
        catch (error) {
            console.error("Error al cargar usuario", error);

        }
    }

    useEffect(() => {
        const fetchAndMap = async () => {
            const res = await axios.get("http://localhost:3000/api/FetchCommunityCategoriesPending");
            setCommunityCategories(res.data);
            const map = await createCategoryUserMap(res.data, fetchUser);
            setCategoryUserMap(map);
        };
        fetchAndMap();
    }, []);

    async function createCategoryUserMap(categories, fetchUser) {
        const map = new Map();
        for (const category of categories) {
            const username = await fetchUser(category.user_id);
            map.set(category.community_category_id, username);
        }
        return map;
    }



    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className={styles.container}>
            <button
                className={styles2.backButton}
                onClick={() => navigate('/Communities')}
                aria-label="Volver"
            >
                <img src="arrow-left-solid.svg" alt="Volver" />
            </button>
            <h1 className={styles.pageTitle}>Solicitudes Pendientes</h1>
            <p className={styles.subTitle}>Revisa y aprueba las categorías de preguntas subidas por los usuarios</p>

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Buscar por nombre de categoría..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <div className={styles.categoriesList}>
                {filteredCategories.map((category) => (
                    <div key={category.community_category_id} className={styles.categoryCard}>
                        <div className={styles.categoryHeader}>
                            <div className={styles.categoryIcon}>
                                {category.name.charAt(0).toUpperCase()}
                            </div>
                            <h3 className={styles.categoryName}>
                                {category.name}
                            </h3>
                        </div>
                        <div className={styles.pendingQuestions}>
                            <strong>Creada por:</strong> {categoryUserMap.get(category.community_category_id) || 'Usuario anónimo'}
                        </div>
                        <div className={styles.pendingQuestions}>
                            <strong>Preguntas propuestas:</strong> {category.question_count || 0}
                        </div>
                        <div className={styles.buttonsContainer}>
                            <button
                                className={styles.reviewButton}
                                onClick={() => navigate(`/Review-Category/${category.community_category_id}`)}
                            >
                                Revisar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCategories.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyStateText}>
                        No hay categorías pendientes de revisión en este momento
                    </p>
                </div>
            )}
        </div>
    );
};

export default CommunityCategoriesJudgement;