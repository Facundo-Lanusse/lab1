
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const InviteHandler = () => {
    const { inviteCode } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleInvite = async () => {
            try {
                // Verificar si el usuario está logueado
                const userStr = localStorage.getItem('user');
                let userId = null;

                if (userStr) {
                    const userObj = JSON.parse(userStr);
                    userId = parseInt(userObj.user_id);
                } else {
                    // Si no está logueado, redirigir al login
                    navigate('/login');
                    return;
                }

                // Validar y unirse a la partida
                const response = await fetch('http://localhost:3000/api/join', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        inviteCode,
                        userId
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Redirigir a la partida de ClassicMode
                    navigate(`/Classic/${data.battleId}`);
                } else {
                    setError(data.error || 'Invitación inválida o expirada');
                }
            } catch (err) {
                console.error('Error al procesar invitación:', err);
                setError('Error al procesar la invitación');
            } finally {
                setLoading(false);
            }
        };

        handleInvite();
    }, [inviteCode, navigate]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Procesando invitación...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>{error}</p>
                <button onClick={() => navigate('/Play')}>
                    Ir al menú de juego
                </button>
            </div>
        );
    }

    return null;
};

export default InviteHandler;