import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/GamePlay.module.css";
import NavigationBar from "../components/NavigationBar";
import {BurgerMenu} from "../components/BurgerMenu";

const PlayMenu = () => {
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [showFriendSelector, setShowFriendSelector] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar amigos al iniciar
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
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
            // Redireccionar a la página de ruleta pasando el ID del amigo seleccionado
            navigate('/roulette', { state: { friendId: selectedFriend.user_id }});

            /* Comentando el código original que iniciaba el modo clásico
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await axios.post('http://localhost:3000/api/classic/start', {
                userId: Number(user.user_id),
                opponentId: Number(selectedFriend.user_id)
            });
            if (response.data.success) {
                navigate(`/classic/${response.data.battleId}`);
            }
            */
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
        <div className={`${styles.gameContainer} ${styles.modeSelection}`}>
            <BurgerMenu />
            <div className={styles.header}>
                <h2>Selecciona un modo de juego</h2>
            </div>

            <div className={styles.gameModes}>
                <div
                    className={styles.gameModeCard}
                    onClick={() => navigate('/solitary')}
                >
                    <h3>Modo Solo</h3>
                    <p>Responde preguntas aleatorias y consigue puntos</p>
                </div>

                <div
                    className={styles.gameModeCard}
                    onClick={() => setShowFriendSelector(true)}
                >
                    <h3>Modo Clásico</h3>
                    <p>Compite con un amigo para ver quién completa primero las categorías</p>
                </div>
            </div>

            {showFriendSelector && (
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
                            Desafiar y Comenzar Juego
                        </button>
                    </div>
                </div>
            )}

            <NavigationBar/>
        </div>
    );
};

export default PlayMenu;
