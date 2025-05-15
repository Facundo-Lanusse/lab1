import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/FriendsMenu.css'; // Crearemos este archivo CSS a continuación
import styles from './css/GamePlay.module.css';

function Friends() {
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Verificar si el usuario está logueado
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

    // Filtrar amigos por nombre de usuario
    const filteredFriends = friends.filter(friend =>
        friend.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (


        <div className="friends-container">
            <h1 className="friends-title">Mis Amigos</h1>
            <img
                className={styles.arrowLeftSolid1Icon}
                alt="Back"
                src="arrow-left-solid.svg"
                onClick={() => navigate("/home")}
            />
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar amigos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {loading ? (
                <div className="loading">Cargando amigos...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <>
                    {filteredFriends.length > 0 ? (
                        <div className="friends-grid">
                            {filteredFriends.map(friend => (
                                <div key={friend.user_id} className="friend-card">
                                    <div className="friend-avatar">
                                        {friend.image_path ? (
                                            <img
                                                src={friend.image_path}
                                                alt={`${friend.username}`}
                                                className="avatar-img"
                                            />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {friend.username.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="friend-info">
                                        <h3 className="friend-name">{friend.username}</h3>
                                        <p className="friend-email">{friend.email}</p>
                                        {friend.rank_points && (
                                            <p className="friend-rank">
                                                <span className="rank-label">Puntos:</span> {friend.rank_points}
                                            </p>
                                        )}
                                    </div>
                                    <div className="friend-actions">
                                        <button className="action-btn battle-btn">
                                            Desafiar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-friends">
                            <p>No tienes amigos en tu lista o ninguno coincide con tu búsqueda.</p>
                            <button
                                className="primary-btn"
                                onClick={() => navigate('/find-friends')}
                            >
                                Encontrar amigos
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Friends;