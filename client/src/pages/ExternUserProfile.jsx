import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './css/ExternUserProfile.module.css';

const ExternUserProfile = () => {
    const { userId } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [soloHistory, setSoloHistory] = useState([]);
    const [battleHistory, setBattleHistory] = useState([]);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);

                // Solicitudes en paralelo para mejorar el rendimiento
                const [profileRes, soloHistoryRes, battleHistoryRes, friendsRes] = await Promise.all([
                    axios.get(`http://localhost:3000/api/profile/${userId}`),
                    axios.get(`http://localhost:3000/api/profile/${userId}/solo-history`),
                    axios.get(`http://localhost:3000/api/profile/${userId}/battle-history`),
                    axios.get(`http://localhost:3000/api/profile/${userId}/friends`)
                ]);

                setProfileData(profileRes.data);
                setSoloHistory(soloHistoryRes.data);
                setBattleHistory(battleHistoryRes.data);
                setFriends(friendsRes.data);
                setError(null);
            } catch (err) {
                console.error('Error al cargar los datos del perfil:', err);
                setError('No se pudo cargar el perfil del usuario');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [userId]);

    if (loading) return <div>Cargando perfil...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!profileData) return <div>No se encontró el perfil</div>;

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
                {profileData.profileImage ? (
                    <img
                        src={profileData.profileImage}
                        alt={`${profileData.username}'s profile`}
                        className={styles.profileImage}
                    />
                ) : (
                    <div className={styles.profileImage}>
                        {profileData.username.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className={styles.profileInfo}>
                    <h1>{profileData.username}</h1>
                    <p className={styles.rankPoints}>Puntos de rango: {profileData.rank_points}</p>
                    <p>Email: {profileData.email}</p>
                </div>
            </div>

            <div className={styles.profileContent}>
                <div className={styles.profileSection}>
                    <h2>Historial de juegos en solitario</h2>
                    {soloHistory.length > 0 ? (
                        <ul className={styles.historyList}>
                            {soloHistory.map(game => (
                                <li key={game.game_id}>
                                    <span>Fecha: {game.game_date}</span>
                                    <span>Puntuación: {game.score}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.emptyMessage}>No hay juegos en solitario registrados</p>
                    )}
                </div>

                <div className={styles.profileSection}>
                    <h2>Historial de batallas</h2>
                    {battleHistory.length > 0 ? (
                        <ul className={styles.historyList}>
                            {battleHistory.map(battle => (
                                <li key={battle.battle_id} className={battle.is_winner ? styles.winner : styles.loser}>
                                    <span>{battle.user1_name} vs {battle.user2_name}</span>
                                    <span>Resultado: {battle.result}</span>
                                    <span>Fecha: {battle.date}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.emptyMessage}>No hay batallas registradas</p>
                    )}
                </div>

                <div className={styles.profileSection}>
                    <h2>Amigos</h2>
                    {friends.length > 0 ? (
                        <div className={styles.friendsList}>
                            {friends.map(friend => (
                                <div key={friend.user_id} className={styles.friendCard}>
                                    <div className={styles.friendAvatar}>
                                        {friend.username.charAt(0).toUpperCase()}
                                    </div>
                                    <p className={styles.friendUsername}>{friend.username}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyMessage}>No hay amigos para mostrar</p>
                    )}
                </div>
            </div>
        </div>
    );

};

export default ExternUserProfile;