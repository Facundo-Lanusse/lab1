import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/AdminUser.module.css";
import fetchProfileImage from "../components/FetchProfileImage";

function Admin() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        userId: null,
        username: '',
        profileImage: null
    });
    const [userImages, setUserImages] = useState({});

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.is_admin) {
            navigate('/Home');
        } else {
            fetchUsers();
        }
    }, [navigate]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("http://localhost:3000/api/users", {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            setUsers(res.data);

            // Cargar las imágenes de perfil de todos los usuarios
            const imagePromises = res.data.map(async (user) => {
                const imagePath = await fetchProfileImage(user.user_id);
                return { userId: user.user_id, imagePath };
            });

            const imageResults = await Promise.all(imagePromises);
            const imageMap = {};
            imageResults.forEach(result => {
                imageMap[result.userId] = result.imagePath;
            });

            setUserImages(imageMap);
        } catch (error) {
            console.error("Error al cargar usuarios", error);
        } finally {
            setIsLoading(false);
        }
    };

    const openDeleteConfirmation = (id, username) => {
        setConfirmModal({
            isOpen: true,
            userId: id,
            username: username,
            profileImage: userImages[id] || '/defaultProfileImage.png'
        });
    };

    const closeDeleteConfirmation = () => {
        setConfirmModal({
            isOpen: false,
            userId: null,
            username: '',
            profileImage: null
        });
    };

    const confirmDeleteUser = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/users/${confirmModal.userId}`, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            setUsers(users.filter((user) => user.user_id !== confirmModal.userId));
            closeDeleteConfirmation();
        } catch (error) {
            console.error("Error al eliminar usuario", error);
        }
    };

    const handleBackClick = () => {
        navigate('/Home');
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (username) => {
        if (!username) return "?";
        return username.split(' ').map(name => name[0]).join('').toUpperCase();
    };

    const getRandomColor = (userId) => {
        const colors = [
            '#16B3B9', // primary color
            '#F5C43C', // secondary color
            '#FF5A5F', // accent
            '#45B69C', // teal
            '#7F6CFC', // purple
            '#FFA07A', // light salmon
            '#20B2AA', // light sea green
        ];

        // Use userId to pick a consistent color for each user
        const colorIndex = userId % colors.length;
        return colors[colorIndex];
    };

    return (
        <div className={styles.adminContainer}>
            {/* Modal de confirmación */}
            {confirmModal.isOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>Confirmar eliminación</h3>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.modalUserInfo}>
                                <img
                                    src={confirmModal.profileImage}
                                    alt={confirmModal.username}
                                    className={styles.modalUserImage}
                                />
                                <div>
                                    <p>¿Estás seguro de que deseas eliminar al usuario <strong>{confirmModal.username}</strong>?</p>
                                    <p className={styles.modalWarning}>Esta acción no se puede deshacer.</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className={styles.cancelButton}
                                onClick={closeDeleteConfirmation}
                            >
                                Cancelar
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={confirmDeleteUser}
                            >
                                Eliminar usuario
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button className={styles.backButton} onClick={handleBackClick}>
                <img src="arrow-left-solid.svg" alt="Volver" />
            </button>

            <h2 className={styles.adminTitle}>Panel de Administración</h2>

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar usuario por nombre o email..."
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className={styles.loadingSpinner}>Cargando usuarios...</div>
            ) : (
                <div className={styles.userStatsContainer}>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{users.length}</span>
                        <span className={styles.statLabel}>Usuarios Totales</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>
                            {users.filter(user => user.is_admin).length}
                        </span>
                        <span className={styles.statLabel}>Administradores</span>
                    </div>
                </div>
            )}

            <ul className={styles.usersList}>
                {filteredUsers.map((user) => (
                    <li key={user.user_id} className={styles.userItem}>
                        {userImages[user.user_id] ? (
                            <img
                                src={userImages[user.user_id]}
                                alt={user.username}
                                className={styles.userProfileImage}
                            />
                        ) : (
                            <div
                                className={styles.userAvatar}
                                style={{ backgroundColor: getRandomColor(user.user_id) }}
                            >
                                {getInitials(user.username)}
                            </div>
                        )}

                        <div className={styles.userInfo}>
                            <h3 className={styles.userName}>{user.username}</h3>
                            <p className={styles.userEmail}>{user.email}</p>
                            <div className={styles.userMeta}>
                                <span className={styles.userRole}>
                                    {user.is_admin ? 'Administrador' : 'Usuario'}
                                </span>
                                <span className={styles.userJoined}>
                                    ID: {user.user_id}
                                </span>
                            </div>
                        </div>

                        <div className={styles.userActions}>
                            {!user.is_admin && (
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => openDeleteConfirmation(user.user_id, user.username)}
                                >
                                    <img
                                        src="cross.png"
                                        alt="Eliminar"
                                    />
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {filteredUsers.length === 0 && !isLoading && (
                <div className={styles.noResults}>
                    No se encontraron usuarios que coincidan con tu búsqueda.
                </div>
            )}
        </div>
    );
}

export default Admin;