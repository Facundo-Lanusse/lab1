import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/GamePlay.module.css";
import inviteStyle from  './css/inviteSection.module.css'
import {BurgerMenu} from "../components/BurgerMenu";

const PlayMenu = () => {
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [showFriendSelector, setShowFriendSelector] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //estados para las invites
    const [inviteCode, setInviteCode] = useState('');
    const [generatedInviteCode, setGeneratedInviteCode] = useState('');
    const [showInviteSection, setShowInviteSection] = useState(false);

    const [pendingBattle, setPendingBattle] = useState(null);
    const [showBattleNotification, setShowBattleNotification] = useState(false)
    const [notifiedBattles, setNotifiedBattles] = useState(new Set());

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


    //chequea invitaciones
    // Reemplazar el useEffect completo de checkUsedInvitations
    useEffect(() => {
        const checkUsedInvitations = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) return;

                const response = await axios.get('http://localhost:3000/api/check-used-invitations', {
                    params: { userId: user.user_id }
                });

                if (response.data.success && response.data.newBattles.length > 0) {
                    // Filtrar solo las batallas que NO han sido notificadas
                    const unnotifiedBattles = response.data.newBattles.filter(
                        battle => !notifiedBattles.has(battle.battleId)
                    );

                    if (unnotifiedBattles.length > 0) {
                        const newBattle = unnotifiedBattles[0];
                        setPendingBattle(newBattle);
                        setShowBattleNotification(true);

                        // Marcar esta batalla como notificada
                        setNotifiedBattles(prev => new Set([...prev, newBattle.battleId]));
                    }
                }
            } catch (error) {
                console.error('Error verificando invitaciones:', error);
            }
        };

        // Verificar cada 3 segundos
        const interval = setInterval(checkUsedInvitations, 3000);

        return () => clearInterval(interval);
    }, [notifiedBattles]);

    const joinPendingBattle = () => {
        if (pendingBattle) {
            navigate(`/Classic/${pendingBattle.battleId}`);
            setShowBattleNotification(false);
            setPendingBattle(null);
        }
    };

    const dismissBattleNotification = () => {
        setShowBattleNotification(false);
        setPendingBattle(null);
    };

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

    // Func para generar un código
    const generateInviteCode = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                setError('Debes estar logueado para generar invitaciones');
                return;
            }

            const userObj = JSON.parse(userStr);
            const userId = parseInt(userObj.user_id);

            const response = await fetch('http://localhost:3000/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setGeneratedInviteCode(data.inviteCode);
                setShowInviteSection(true);
            } else {
                setError('No se pudo generar el código de invitación');
            }
        } catch (err) {
            console.error('Error al generar código:', err);
            setError('Error al generar código de invitación');
        }
    };

// con esto me uno
    const joinWithInviteCode = async () => {
        if (!inviteCode.trim()) {
            setError('Ingresa un código de invitación válido');
            return;
        }

        navigate(`/invite/${inviteCode.trim()}`);
    };

// Copia al portapapeles la invitación
    const copyInviteCode = () => {
        navigator.clipboard.writeText(generatedInviteCode);
        alert('Código copiado al portapapeles');
    };

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
                    {showBattleNotification && pendingBattle && (
                        <div className={inviteStyle.battleNotification}>
                            <div className={inviteStyle.notificationContent}>
                                <h3>¡Alguien se unió a tu partida!</h3>
                                <p>Un jugador usó tu código de invitación</p>
                                <div className={inviteStyle.notificationButtons}>
                                    <button
                                        onClick={joinPendingBattle}
                                        className={inviteStyle.joinBattleButton}
                                    >
                                        Unirse a la partida
                                    </button>
                                    <button
                                        onClick={dismissBattleNotification}
                                        className={inviteStyle.dismissButton}
                                    >
                                        Más tarde
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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
                        <div className={styles.modeSection}>

                            {/* Sección de invitaciones */}
                            <div className={inviteStyle.inviteSection}>
                                <div className={inviteStyle.inviteRow}>
                                    <input
                                        type="text"
                                        placeholder="Código de invitación"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value)}
                                        className={inviteStyle.inviteInput}
                                    />
                                    <button
                                        onClick={joinWithInviteCode}
                                        className={inviteStyle.joinButton}
                                    >
                                        Unirse
                                    </button>
                                </div>

                                <button
                                    onClick={generateInviteCode}
                                    className={inviteStyle.generateButton}
                                >
                                    Generar código de invitación
                                </button>

                                {showInviteSection && generatedInviteCode && (
                                    <div className={inviteStyle.inviteDisplay}>
                                        <p>Comparte este código:</p>
                                        <div className={inviteStyle.codeContainer}>
                                            <code className={inviteStyle.inviteCodeDisplay}>{generatedInviteCode}</code>
                                            <button onClick={copyInviteCode} className={inviteStyle.copyButton}>
                                                Copiar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>


        </div>
    );
};

export default PlayMenu;
