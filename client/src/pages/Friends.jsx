import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './css/FriendsMenu.module.css';
import fetchProfileImage from "../components/FetchProfileImage";

function Friends() {
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const friendsPerPage = 5; // Número de amigos por página

    const [pendingRequests, setPendingRequests] = useState([]);
    const [showRequestsMenu, setShowRequestsMenu] = useState(false);
    const [requestsLoading, setRequestsLoading] = useState(false);
    const [requestActionStatus, setRequestActionStatus] = useState(null);

    const [showAddFriendMenu, setShowAddFriendMenu] = useState(false);
    const [newFriendUsername, setNewFriendUsername] = useState('');
    const [friendRequestStatus, setFriendRequestStatus] = useState(null);

    // Solo actualiza esta parte del código manteniendo todas las clases existentes exactamente iguales
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

                const friendsWithImages = await Promise.all(response.data.friends.map(async (friend) => {
                    try {
                        const imagePath = await fetchProfileImage(friend.user_id);
                        return { ...friend, profileImage: imagePath };
                    } catch (error) {
                        return { ...friend, profileImage: '/defaultProfileImage.png' };
                    }
                }));

                setFriends(friendsWithImages);
                setLoading(false);
            } catch (err) {
                console.error('Error al obtener amigos:', err);
                setError('No se pudieron cargar tus amigos. Por favor, intenta de nuevo más tarde.');
                setLoading(false);
            }
        };

        fetchFriends();
    }, [navigate]);

    const fetchPendingRequests = async () => {
        try {
            setRequestsLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = Number(user.user_id);

            const response = await axios.get('http://localhost:3000/api/pendingRequests', {
                params: { userId }
            });

            setPendingRequests(response.data.pendingRequests);
            setRequestsLoading(false);
        } catch (err) {
            console.error('Error al obtener solicitudes:', err);
            setRequestsLoading(false);
        }
    };

    const toggleRequestsMenu = () => {
        if (!showRequestsMenu) {
            fetchPendingRequests();
        }
        setShowRequestsMenu(!showRequestsMenu);
    };

    const acceptFriendRequest = async (requestId) => {
        try {
            await axios.put('http://localhost:3000/api/acceptRequest', { requestId });

            setPendingRequests(pendingRequests.filter(req => req.request_id !== requestId));

            const user = JSON.parse(localStorage.getItem('user'));
            const userId = Number(user.user_id);
            const response = await axios.get('http://localhost:3000/api/friends', {
                params: { userId }
            });
            setFriends(response.data.friends);

            setRequestActionStatus({
                success: true,
                message: 'Solicitud aceptada'
            });

            setTimeout(() => {
                setRequestActionStatus(null);
            }, 3000);
        } catch (err) {
            console.error('Error al aceptar solicitud:', err);
            setRequestActionStatus({
                success: false,
                message: 'Error al aceptar la solicitud'
            });
        }
    };

    const rejectFriendRequest = async (requestId) => {
        try {
            console.log(requestId);
            await axios.delete('http://localhost:3000/api/rejectRequest', {
                data: { requestId }
            });

            setPendingRequests(pendingRequests.filter(req => req.request_id !== requestId));

            setRequestActionStatus({
                success: true,
                message: 'Solicitud rechazada'
            });

            setTimeout(() => {
                setRequestActionStatus(null);
            }, 3000);
        } catch (err) {
            console.error('Error al rechazar solicitud:', err);
            setRequestActionStatus({
                success: false,
                message: 'Error al rechazar la solicitud'
            });
        }
    };

    const sendFriendRequest = async () => {
        if (!newFriendUsername.trim()) {
            setFriendRequestStatus({
                success: false,
                message: 'Por favor, ingresa un nombre de usuario'
            });
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));

            // Primero obtenemos el ID del amigo
            const friendIdResponse = await axios.get('http://localhost:3000/api/getFriendId/', {
                params: { username: newFriendUsername }
            });

            const friendId = friendIdResponse.data.user_id;

            // Enviamos la solicitud de amistad
            const response = await axios.post(`http://localhost:3000/api/friendRequest:id`, {
                username: user.username,
                friendId: friendId
            });

            setFriendRequestStatus({
                success: true,
                message: 'Solicitud enviada con éxito'
            });

            // Limpiamos el campo después de enviar
            setNewFriendUsername('');

            // Cerramos el menú después de unos segundos
            setTimeout(() => {
                setShowAddFriendMenu(false);
                setFriendRequestStatus(null);
            }, 3000);
        } catch (err) {
            console.error('Error al enviar solicitud:', err);
            setFriendRequestStatus({
                success: false,
                message: err.response?.data?.message || 'Error al enviar la solicitud'
            });
        }
    };

    // Filtrar amigos por nombre de usuario
    const filteredFriends = friends.filter(friend =>
        friend.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Lógica de paginación
    const totalPages = Math.ceil(filteredFriends.length / friendsPerPage);
    const indexOfLastFriend = currentPage * friendsPerPage;
    const indexOfFirstFriend = indexOfLastFriend - friendsPerPage;
    const currentFriends = filteredFriends.slice(indexOfFirstFriend, indexOfLastFriend);

    // Resetear página cuando se busca
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const deleteFriend = async (friend) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = Number(user.user_id);
            const friendId = Number(friend.user_id);
            console.log(friendId);
            console.log(userId);

            const response = await axios.delete('http://localhost:3000/api/deleteFriend:id', {
                data: { userId, friendId }
            });

            setFriends(friends.filter(f => f.user_id !== friendId));
        } catch (error) {
            console.error('Error al eliminar amigo:', error);
            alert(error.response?.data?.message || 'Error al eliminar amigo');
        }
    };

    const handleGoBack = () => {
        navigate("/Home"); // Navega a la página anterior
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.friendsContainer}>

                <button
                    className={styles.backButton}
                    onClick={handleGoBack}
                    aria-label="Volver atrás">
                    <img src="arrow-left-solid.svg" alt="Volver" />
                </button>

                <h1 className={styles.friendsTitle}>Mis Amigos</h1>

                {/* Contenedor de búsqueda con botones para añadir amigos y ver solicitudes */}
                <div className={styles.searchAndAddContainer}>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Buscar amigos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.actionButtons}>
                        <button
                            className={styles.requestsButton}
                            onClick={toggleRequestsMenu}
                            aria-label="Ver solicitudes de amistad"
                        >
                            📩
                        </button>

                        <button
                            className={styles.addFriendButton}
                            onClick={() => setShowAddFriendMenu(!showAddFriendMenu)}
                            aria-label="Añadir amigo"
                        >
                            +
                        </button>
                    </div>

                    {/* Menú de solicitudes de amistad pendientes */}
                    {showRequestsMenu && (
                        <div className={styles.requestsMenu}>
                            <h3>Solicitudes de amistad</h3>

                            {requestsLoading ? (
                                <div className={styles.menuLoadingState}>
                                    <p>Cargando solicitudes...</p>
                                </div>
                            ) : pendingRequests.length === 0 ? (
                                <div className={styles.emptyRequestsMessage}>
                                    <p>No tienes solicitudes de amistad pendientes</p>
                                </div>
                            ) : (
                                <ul className={styles.requestsList}>
                                    {pendingRequests.map(request => (
                                        <li key={request.request_id} className={styles.requestItem}>
                                            <div >
                                                <img className={styles.requestAvatar} src={request.profileImage || '/defaultProfileImage.png'} alt={`${request.sender_username} avatar`} />
                                            </div>
                                            <div className={styles.requestInfo}>
                                                <div className={styles.requestUsername}>{request.username}</div>
                                            </div>
                                            <div className={styles.requestActions}>
                                                <button
                                                    className={`${styles.requestActionButton} ${styles.acceptButton}`}
                                                    onClick={() => acceptFriendRequest(request.request_id)}
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    className={`${styles.requestActionButton} ${styles.rejectButton}`}
                                                    onClick={() => rejectFriendRequest(request.request_id)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {requestActionStatus && (
                                <div className={`${styles.actionStatus} ${
                                    requestActionStatus.success
                                        ? styles.statusSuccess
                                        : styles.statusError
                                }`}>
                                    {requestActionStatus.message}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Menú para añadir amigos */}
                    {showAddFriendMenu && (
                        <div className={styles.addFriendMenu}>
                            <h3>Añadir un amigo</h3>
                            <input
                                type="text"
                                placeholder="Nombre de usuario"
                                value={newFriendUsername}
                                onChange={(e) => setNewFriendUsername(e.target.value)}
                                className={styles.addFriendInput}
                            />
                            <button
                                className={styles.sendRequestButton}
                                onClick={sendFriendRequest}
                            >
                                Enviar solicitud
                            </button>

                            {friendRequestStatus && (
                                <div className={`${styles.requestStatus} ${
                                    friendRequestStatus.success
                                        ? styles.statusSuccess
                                        : styles.statusError
                                }`}>
                                    {friendRequestStatus.message}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Estados de carga y error */}
                {loading && (
                    <div className={styles.loadingState}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Cargando amigos...</p>
                    </div>
                )}

                {error && (
                    <div className={styles.errorState}>
                        <p>{error}</p>
                    </div>
                )}

                {/* Lista de amigos */}
                {!loading && !error && (
                    <>
                        {filteredFriends.length > 0 ? (
                            <ul className={styles.friendsList}>
                                {currentFriends.map(friend => (
                                    <li key={friend.user_id} className={styles.friendItem}>
                                        <div className={styles.friendAvatar}>
                                            <img className={styles.friendAvatar} src={friend.profileImage || '/defaultProfileImage.png'} alt={`${friend.username} avatar`} />
                                        </div>
                                        <div className={styles.friendInfo}>
                                            <div className={styles.friendUsername}>{friend.username}</div>
                                            <div className={styles.friendStatus}>
                                                {friend.status || 'En línea'}
                                            </div>
                                        </div>
                                        <div className={styles.friendActions}>
                                            <button
                                                className={styles.actionButton}
                                                aria-label="Ver perfil"
                                                onClick={() => navigate(`/Profile/${friend.user_id}`)}
                                            >
                                                👤
                                            </button>
                                            <button
                                                className={styles.actionButton}
                                                aria-label="Eliminar amigo"
                                                onClick={() => deleteFriend(friend)}
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className={styles.emptyState}>
                                <p>No se encontraron amigos.</p>
                                {searchTerm && (
                                    <p>Intenta con otra búsqueda o añade nuevos amigos.</p>
                                )}
                            </div>
                        )}

                        {/* Controles de paginación */}
                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    className={styles.pageButton}
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </button>

                                {/* Números de página */}
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    className={styles.pageButton}
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Friends;
