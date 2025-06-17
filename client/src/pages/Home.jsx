import React, { useEffect, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { BurgerMenu } from "../components/BurgerMenu";
import styles from "./css/Home.module.css";
import { motion } from 'framer-motion';
import axios from 'axios';

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const [activeBattles, setActiveBattles] = useState([]);
    const [completedBattles, setCompletedBattles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar partidas si el usuario está autenticado
        if (user) {
            fetchBattles();
        }
    }, []);

    // Función para cargar todas las batallas (activas y completadas)
    const fetchBattles = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/api/classic/battles`, {
                params: { userId: user.user_id }
            });

            // Separar batallas activas y completadas
            const active = [];
            const completed = [];

            if (response.data.battles && response.data.battles.length > 0) {
                response.data.battles.forEach(battle => {
                    if (battle.status === 'completed' || battle.isCompleted) {
                        completed.push(battle);
                    } else {
                        active.push(battle);
                    }
                });
            }

            setActiveBattles(active);
            setCompletedBattles(completed);
            setLoading(false);
        } catch (err) {
            console.error('Error al obtener batallas:', err);
            setError('No se pudieron cargar las partidas');
            setLoading(false);
        }
    };

    // Solo navegar a las batallas activas
    const handleBattleClick = (battle) => {
        if (battle.status !== 'completed' && !battle.isCompleted) {
            navigate(`/Classic/${battle.battle_id}`);
        } else {
            // No hacemos nada si la batalla está completada
            console.log('Esta batalla ya ha finalizado');
        }
    };

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className={styles.homeContainer}>
            <div className={styles.overlay}></div>
            <BurgerMenu />

            <div className={styles.homeContent}>
                <motion.div
                    className={styles.headerSection}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className={styles.welcomeTitle}>
                        ¡Hola, <span>{user.username}</span>!
                    </h1>
                    <p className={styles.welcomeSubtitle}>
                        Bienvenido a tu dashboard de Preguntados
                    </p>
                </motion.div>

                <div className={styles.dashboardLayout}>
                    {/* Panel principal - Partidas en curso */}
                    <motion.div
                        className={styles.mainPanel}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className={styles.panelHeader}>
                            <h2 className={styles.sectionTitle}>Tus partidas</h2>
                            <Link to="/Play" className={styles.newGameButton}>
                                Nueva partida +
                            </Link>
                        </div>

                        {loading ? (
                            <div className={styles.loadingContainer}>
                                <div className={styles.loadingSpinner}></div>
                                <p>Cargando tus partidas...</p>
                            </div>
                        ) : error ? (
                            <div className={styles.errorMessage}>
                                <span className={styles.errorIcon}>⚠️</span>
                                <p>{error}</p>
                                <button onClick={fetchBattles} className={styles.retryButton}>
                                    Reintentar
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Partidas activas */}
                                <h3 className={styles.sectionSubtitle}>Partidas en curso</h3>
                                {activeBattles.length > 0 ? (
                                    <div className={styles.battlesList}>
                                        {activeBattles.map(battle => (
                                            <motion.div
                                                key={battle.battle_id}
                                                className={styles.battleCard}
                                                onClick={() => handleBattleClick(battle)}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className={styles.battleHeader}>
                                                    <span className={styles.opponentName}>VS {battle.opponent_name}</span>
                                                    <span className={`${styles.turnIndicator} ${battle.currentTurn === user.user_id ? styles.yourTurn : styles.opponentTurn}`}>
                                                        {battle.currentTurn === user.user_id ? '¡Tu turno!' : 'Turno del oponente'}
                                                    </span>
                                                </div>

                                                <div className={styles.battleProgress}>
                                                    <div className={styles.progressRow}>
                                                        <span className={styles.playerName}>Tú:</span>
                                                        <div className={styles.progressBar}>
                                                            <div
                                                                className={styles.progressFill}
                                                                style={{width: `${(battle.myCompletedCategories / 4) * 100}%`}}
                                                            ></div>
                                                        </div>
                                                        <span className={styles.categoryCount}>{battle.myCompletedCategories}/4</span>
                                                    </div>

                                                    <div className={styles.progressRow}>
                                                        <span className={styles.playerName}>Rival:</span>
                                                        <div className={styles.progressBar}>
                                                            <div
                                                                className={`${styles.progressFill} ${styles.opponentFill}`}
                                                                style={{width: `${(battle.opponentCompletedCategories / 4) * 100}%`}}
                                                            ></div>
                                                        </div>
                                                        <span className={styles.categoryCount}>{battle.opponentCompletedCategories}/4</span>
                                                    </div>
                                                </div>

                                                <div className={styles.battleFooter}>
                                                    <span className={styles.battleDate}>
                                                        Iniciada: {new Date(battle.date).toLocaleDateString()}
                                                    </span>
                                                    <div className={styles.continueButton}>
                                                        Continuar
                                                        <span className={styles.arrowIcon}>→</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.emptyStateContainer}>
                                        <div className={styles.emptyState}>
                                            <div className={styles.emptyStateIcon}>🎮</div>
                                            <h3>No tienes partidas activas</h3>
                                            <p>Desafía a tus amigos para empezar a jugar</p>
                                            <Link to="/Play" className={styles.startGameButton}>
                                                Iniciar una partida
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Partidas completadas */}
                                {completedBattles.length > 0 && (
                                    <div className={styles.completedBattlesSection} style={{marginTop: '2rem'}}>
                                        <h3 className={styles.sectionSubtitle}>Partidas completadas</h3>
                                        <div className={styles.battlesList}>
                                            {completedBattles.map(battle => (
                                                <div
                                                    key={battle.battle_id}
                                                    className={`${styles.battleCard} ${styles.completedBattle} ${styles.disabledBattle}`}
                                                >
                                                    <div className={styles.battleHeader}>
                                                        <span className={styles.opponentName}>VS {battle.opponent_name}</span>
                                                        <span className={`${styles.battleResult} ${battle.isWinner ? styles.winResult : styles.loseResult}`}>
                                                            {battle.isWinner ? '¡Victoria!' : 'Derrota'}
                                                        </span>
                                                    </div>

                                                    <div className={styles.battleProgress}>
                                                        <div className={styles.progressRow}>
                                                            <span className={styles.playerName}>Tú:</span>
                                                            <div className={styles.progressBar}>
                                                                <div
                                                                    className={styles.progressFill}
                                                                    style={{width: `${(battle.myCompletedCategories / 4) * 100}%`}}
                                                                ></div>
                                                            </div>
                                                            <span className={styles.categoryCount}>{battle.myCompletedCategories}/4</span>
                                                        </div>

                                                        <div className={styles.progressRow}>
                                                            <span className={styles.playerName}>Rival:</span>
                                                            <div className={styles.progressBar}>
                                                                <div
                                                                    className={`${styles.progressFill} ${styles.opponentFill}`}
                                                                    style={{width: `${(battle.opponentCompletedCategories / 4) * 100}%`}}
                                                                ></div>
                                                            </div>
                                                            <span className={styles.categoryCount}>{battle.opponentCompletedCategories}/4</span>
                                                        </div>
                                                    </div>

                                                    <div className={styles.battleFooter}>
                                                        <span className={styles.battleDate}>
                                                            Finalizada: {new Date(battle.date).toLocaleDateString()}
                                                        </span>
                                                        <div className={styles.completedLabel}>
                                                            Partida finalizada
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>

                    {/* Panel lateral - Accesos rápidos */}
                    <motion.div
                        className={styles.sidePanel}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div className={styles.quickActions}>
                            <h3 className={styles.quickActionsTitle}>Acciones rápidas</h3>

                            <div className={styles.actionButtons}>
                                <Link to="/Play" className={styles.actionButton}>
                                    <div className={styles.actionIcon}>🎲</div>
                                    <div className={styles.actionText}>
                                        <span className={styles.actionName}>Jugar</span>
                                        <span className={styles.actionDesc}>Modo Clásico</span>
                                    </div>
                                </Link>

                                <Link to="/Friends" className={styles.actionButton}>
                                    <div className={styles.actionIcon}>👥</div>
                                    <div className={styles.actionText}>
                                        <span className={styles.actionName}>Amigos</span>
                                        <span className={styles.actionDesc}>Gestionar amigos</span>
                                    </div>
                                </Link>

                                <Link to="/Profile" className={styles.actionButton}>
                                    <div className={styles.actionIcon}>👤</div>
                                    <div className={styles.actionText}>
                                        <span className={styles.actionName}>Perfil</span>
                                        <span className={styles.actionDesc}>Ver estadísticas</span>
                                    </div>
                                </Link>

                                <Link to="/Communities" className={styles.actionButton}>
                                    <div className={styles.actionIcon}>🌐</div>
                                    <div className={styles.actionText}>
                                        <span className={styles.actionName}>Comunidad</span>
                                        <span className={styles.actionDesc}>Categorías personalizadas</span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className={styles.tipsContainer}>
                            <div className={styles.tipBox}>
                                <div className={styles.tipIcon}>💡</div>
                                <div className={styles.tipContent}>
                                    <h4>Consejo del día</h4>
                                    <p>Responde 3 preguntas correctamente para elegir una categoría y ganar un punto.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Home;
