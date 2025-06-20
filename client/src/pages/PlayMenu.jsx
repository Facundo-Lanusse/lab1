import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/GamePlay.module.css";
import {BurgerMenu} from "../components/BurgerMenu";

const PlayMenu = () => {
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [showFriendSelector, setShowFriendSelector] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/Login');
            return;
        }

        const fetchFriends = async () => {
            try {
                setLoading(true);
                const userId = Number(user.user_id);

                const response = await axios.get('http://localhost:3000/api/friends', {
                    params: { userId }
                });

                setFriends(response.data.friends);
                setLoading(false);
            } catch (err) {
                console.error('Error al obtener amigos:', err);
                setError('No se pudieron cargar tus amigos. Por favor, intenta de nuevo más tarde.');
                setLoading(false);
            }
        };

        fetchFriends();
    }, [navigate]);

    // Función para iniciar una partida clásica
    const startClassicGame = useCallback(async () => {
        if (!selectedFriend) return;

        try {
            // Iniciar una batalla en el modo clásico
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user.user_id;

            const response = await axios.post('http://localhost:3000/api/classic/start', {
                userId: userId,
                opponentId: selectedFriend.user_id
            });

            if (response.data.success) {
                // Redireccionar directamente al modo clásico con el ID de la batalla
                navigate(`/Classic/${response.data.battleId}`);
            } else {
                throw new Error(response.data.message || 'No se pudo iniciar la batalla');
            }
        } catch (error) {
            console.error('Error al iniciar partida:', error);
            // Mostrar más detalles del error para debugging
            console.log('Estructura completa del error:', JSON.stringify(error, null, 2));

            if (error.response) {
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
                console.log('Response headers:', error.response.headers);

                // Verificar si el mensaje existe en cualquier nivel de la respuesta
                const errorMessage = error.response.data?.message ||
                                    error.response.data?.error ||
                                    'Error desconocido';

                alert(`No se pudo iniciar la partida: ${errorMessage}`);
            } else if (error.request) {
                // La solicitud se realizó pero no se recibió respuesta
                console.log('Request data:', error.request);
                alert('No se pudo iniciar la partida: No se recibió respuesta del servidor');
            } else {
                // Error al configurar la solicitud
                alert(`No se pudo iniciar la partida: ${error.message}`);
            }
        }
    }, [selectedFriend, navigate]);

    return (
        <div className={styles.playMenuContainer}>
            <div className={styles.burgerMenuWrapper}>
                <BurgerMenu />
            </div>

            <div className={styles.playMenuContent}>
                <div className={styles.menuHeader}>
                    <h2>Selecciona un modo de juego</h2>
                </div>

                <div className={styles.gameModeCards}>
                    <div
                        className={styles.gameModeCard}
                        onClick={() => navigate('/Solitary')}
                    >
                        <div className={styles.cardIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#16b3b9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 8v4l3 3"></path>
                            </svg>
                        </div>
                        <h3>Modo Solo</h3>
                        <p>Responde preguntas aleatorias y consigue puntos</p>
                    </div>

                    <div
                        className={styles.gameModeCard}
                        onClick={() => navigate('/BulletPLay')}
                    >
                        <div className={styles.cardIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#16b3b9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 8v4l3 3"></path>
                            </svg>
                        </div>
                        <h3>Modo Bala</h3>
                        <p>Responde preguntas en poco tiempo y haz tu mejor marca</p>
                    </div>

                    <div
                        className={styles.gameModeCard}
                        onClick={() => setShowFriendSelector(true)}
                    >
                        <div className={styles.cardIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#16b3b9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <h3>Modo Clásico</h3>
                        <p>Compite con un amigo para ver quién completa primero las categorías</p>
                    </div>
                </div>

                {showFriendSelector && (
                    <div className={styles.friendSelectorOverlay}>
                        <div className={styles.friendSelector}>
                            <h3>Desafía a un amigo</h3>
                            {friends.length > 0 ? (
                                <div className={styles.friendsList}>
                                    {friends.map(friend => (
                                        <div
                                            key={friend.user_id}
                                            className={`${styles.friendCard} ${selectedFriend && selectedFriend.user_id === friend.user_id ? styles.selectedFriend : ''}`}
                                            onClick={() => setSelectedFriend(friend)}
                                        >
                                            <img
                                                src={friend.profile_picture || "defaultProfileImage.png"}
                                                alt={friend.username}
                                                className={styles.friendAvatar}
                                            />
                                            <span>{friend.username}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.noFriends}>No tienes amigos para jugar. ¡Agrega algunos amigos primero!</p>
                            )}

                            <div className={styles.actionButtons}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => {
                                        setShowFriendSelector(false);
                                        setSelectedFriend(null);
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className={styles.startButton}
                                    disabled={!selectedFriend}
                                    onClick={startClassicGame}
                                >
                                    Desafiar y Comenzar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>


        </div>
    );
};

export default PlayMenu;
