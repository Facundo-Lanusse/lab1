import React, { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { BurgerMenu } from "../components/BurgerMenu";
import styles from "./css/Home.module.css";
import { motion } from "framer-motion";
import axios from "axios";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [activeBattles, setActiveBattles] = useState([]);
  const [completedBattles, setCompletedBattles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchBattles();
    }
  }, []);

  // Función para cargar todas las batallas (activas y completadas)
  const fetchBattles = async () => {
    try {
      setLoading(true);
      // Pedir batallas clásicas y bullet en paralelo
      const [classicRes, bulletRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/classic/battles`, {
          params: { userId: user.user_id },
        }),
        axios.get(`http://localhost:3000/api/bullet-online/user/${user.user_id}`)
      ]);

      // Procesar batallas clásicas
      const classicBattles = (classicRes.data.battles || []).map(battle => ({
        ...battle,
        type: 'classic',
      }));
      // Procesar batallas bullet online
      const bulletBattles = (bulletRes.data.battles || []).map(battle => ({
        ...battle,
        type: 'bullet',
        // opponent_name ya viene del backend como el nombre del usuario rival
      }));



      // Unir ambas listas
      const allBattles = [...classicBattles, ...bulletBattles];
      // Separar activas y completadas
      const active = [];
      const completed = [];
      allBattles.forEach((battle) => {
        if (battle.status === "completed" || battle.isCompleted) {
          completed.push(battle);
        } else {
          active.push(battle);
        }
      });
      setActiveBattles(active);
      setCompletedBattles(completed);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener batallas:", err);
      setError("No se pudieron cargar las partidas");
      setLoading(false);
    }
  };

  // Solo navegar a las batallas activas
  const handleBattleClick = (battle) => {
    if (battle.status !== "completed" && !battle.isCompleted) {
      navigate(`/Classic/${battle.battle_id}`);
    } else {
      // No hacemos nada si la batalla está completada
      console.log("Esta batalla ya ha finalizado");
    }
  };

  // PAGINADO
  const BATTLES_PER_PAGE = 2; // Número de batallas por página
  const [activePage, setActivePage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);

  // Calcular batallas a mostrar por página
  const paginatedActiveBattles = activeBattles.slice(
    (activePage - 1) * BATTLES_PER_PAGE,
    activePage * BATTLES_PER_PAGE
  );
  const paginatedCompletedBattles = completedBattles.slice(
    (completedPage - 1) * BATTLES_PER_PAGE,
    completedPage * BATTLES_PER_PAGE
  );
  const totalActivePages = Math.ceil(activeBattles.length / BATTLES_PER_PAGE);
  const totalCompletedPages = Math.ceil(completedBattles.length / BATTLES_PER_PAGE);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <BurgerMenu />
      <div className={styles.homeContainer}>
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
                  {paginatedActiveBattles.length > 0 ? (
                    <div className={styles.battlesList}>
                      {paginatedActiveBattles.map((battle) => (
                        <motion.div
                          key={battle.battle_id}
                          className={styles.battleCard}
                          onClick={() => {
                            if (battle.status !== "completed" && !battle.isCompleted) {
                              if (battle.type === 'bullet') {
                                navigate(`/BulletOnline/${battle.battle_id}`);
                              } else {
                                navigate(`/Classic/${battle.battle_id}`);
                              }
                            } else {
                              // No hacemos nada si la batalla está completada
                              console.log("Esta batalla ya ha finalizado");
                            }
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={styles.battleHeader}>
                            <span className={styles.opponentName}>
                              VS {battle.opponent_name}
                            </span>
                            <span
                              className={`${styles.turnIndicator} ${
                                battle.currentTurn === user.user_id
                                  ? styles.yourTurn
                                  : styles.opponentTurn
                              }`}
                            >
                              {battle.currentTurn === user.user_id
                                ? "¡Tu turno!"
                                : "Turno del oponente"}
                            </span>
                          </div>

                          {/* Mostrar puntaje simple si es bullet, barra si es classic */}
                          {battle.type === 'bullet' ? (
                            <div className={styles.bulletScoreRow}>
                              <span className={styles.playerName}>Tú:</span>
                              <span className={styles.bulletScore}>{battle.myScore ?? 0}</span>
                              <span style={{margin: '0 8px'}}>-</span>
                              <span className={styles.playerName}>Rival:</span>
                              <span className={styles.bulletScore}>{battle.opponentScore ?? 0}</span>
                            </div>
                          ) : (
                            <div className={styles.battleProgress}>
                              <div className={styles.progressRow}>
                                <span className={styles.playerName}>Tú:</span>
                                <div className={styles.progressBar}>
                                  <div
                                    className={styles.progressFill}
                                    style={{
                                      width: `${
                                        (battle.myCompletedCategories / 4) * 100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <span className={styles.categoryCount}>
                                  {battle.myCompletedCategories}/4
                                </span>
                              </div>

                              <div className={styles.progressRow}>
                                <span className={styles.playerName}>
                                  Rival:
                                </span>
                                <div className={styles.progressBar}>
                                  <div
                                    className={`${styles.progressFill} ${styles.opponentFill}`}
                                    style={{
                                      width: `${
                                        (battle.opponentCompletedCategories / 4) * 100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <span className={styles.categoryCount}>
                                  {battle.opponentCompletedCategories}/4
                                </span>
                              </div>
                            </div>
                          )}

                          <div className={styles.battleFooter}>
                            <span className={styles.battleDate}>
                              Iniciada:{" "}
                              {new Date(battle.date).toLocaleDateString()}
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
                  {/* Paginado de activas */}
                  {totalActivePages > 1 && (
                    <div className={styles.paginationContainer}>
                      <button onClick={() => setActivePage(p => Math.max(1, p - 1))} disabled={activePage === 1}>Anterior</button>
                      <span>Página {activePage} de {totalActivePages}</span>
                      <button onClick={() => setActivePage(p => Math.min(totalActivePages, p + 1))} disabled={activePage === totalActivePages}>Siguiente</button>
                    </div>
                  )}

                  {/* Partidas completadas */}
                  {paginatedCompletedBattles.length > 0 && (
                    <div
                      className={styles.completedBattlesSection}
                      style={{ marginTop: "2rem" }}
                    >
                      <h3 className={styles.sectionSubtitle}>
                        Partidas completadas
                      </h3>
                      <div className={styles.battlesList}>
                        {paginatedCompletedBattles.map((battle) => {
                          // Determinar scores y resultado para bullet
                          let myScore = null;
                          let opponentScore = null;
                          let resultLabel = null;
                          if (battle.type === 'bullet') {
                            const user = JSON.parse(localStorage.getItem("user"));
                            const userId = user?.user_id;
                            if (userId === battle.user_id1) {
                              myScore = battle.score1;
                              opponentScore = battle.score2;
                            } else {
                              myScore = battle.score2;
                              opponentScore = battle.score1;
                            }
                            if (battle.winner_id === userId) resultLabel = "¡Victoria!";
                            else if (battle.winner_id) resultLabel = "Derrota";
                            else resultLabel = "Empate";
                          }
                          return (
                            <div
                              key={battle.battle_id}
                              className={`${styles.battleCard} ${styles.completedBattle} ${styles.disabledBattle}`}
                            >
                              <div className={styles.battleHeader}>
                                <span className={styles.opponentName}>
                                  VS {battle.opponent_name}
                                </span>
                                <span
                                  className={`${styles.battleResult} ${
                                    battle.type === 'bullet'
                                      ? (resultLabel === "¡Victoria!" ? styles.winResult : resultLabel === "Derrota" ? styles.loseResult : styles.drawResult)
                                      : (battle.isWinner ? styles.winResult : styles.loseResult)
                                  }`}
                                >
                                  {battle.type === 'bullet' ? resultLabel : (battle.isWinner ? "¡Victoria!" : "Derrota")}
                                </span>
                              </div>

                              {/* Mostrar score bullet o progreso classic */}
                              {battle.type === 'bullet' ? (
                                <div className={styles.bulletScoreRow}>
                                  <span className={styles.playerName}>Tú:</span>
                                  <span className={styles.bulletScore}>{myScore ?? 0}</span>
                                  <span style={{margin: '0 8px'}}>-</span>
                                  <span className={styles.playerName}>Rival:</span>
                                  <span className={styles.bulletScore}>{opponentScore ?? 0}</span>
                                </div>
                              ) : (
                                <div className={styles.battleProgress}>
                                  <div className={styles.progressRow}>
                                    <span className={styles.playerName}>Tú:</span>
                                    <div className={styles.progressBar}>
                                      <div
                                        className={styles.progressFill}
                                        style={{
                                          width: `${(battle.myCompletedCategories / 4) * 100}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <span className={styles.categoryCount}>
                                      {battle.myCompletedCategories}/4
                                    </span>
                                  </div>
                                  <div className={styles.progressRow}>
                                    <span className={styles.playerName}>
                                      Rival:
                                    </span>
                                    <div className={styles.progressBar}>
                                      <div
                                        className={`${styles.progressFill} ${styles.opponentFill}`}
                                        style={{
                                          width: `${(battle.opponentCompletedCategories / 4) * 100}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <span className={styles.categoryCount}>
                                      {battle.opponentCompletedCategories}/4
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className={styles.battleFooter}>
                                <span className={styles.battleDate}>
                                  Finalizada: {new Date(battle.date).toLocaleDateString()}
                                </span>
                                <div className={styles.completedLabel}>
                                  Partida finalizada
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* Paginado de completadas */}
                      {totalCompletedPages > 1 && (
                        <div className={styles.paginationContainer}>
                          <button onClick={() => setCompletedPage(p => Math.max(1, p - 1))} disabled={completedPage === 1}>Anterior</button>
                          <span>Página {completedPage} de {totalCompletedPages}</span>
                          <button onClick={() => setCompletedPage(p => Math.min(totalCompletedPages, p + 1))} disabled={completedPage === totalCompletedPages}>Siguiente</button>
                        </div>
                      )}
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
                      <span className={styles.actionDesc}>
                        Gestionar amigos
                      </span>
                    </div>
                  </Link>

                  <Link to="/Profile" className={styles.actionButton}>
                    <div className={styles.actionIcon}>👤</div>
                    <div className={styles.actionText}>
                      <span className={styles.actionName}>Perfil</span>
                      <span className={styles.actionDesc}>
                        Ver estadísticas
                      </span>
                    </div>
                  </Link>

                  <Link to="/Communities" className={styles.actionButton}>
                    <div className={styles.actionIcon}>🌐</div>
                    <div className={styles.actionText}>
                      <span className={styles.actionName}>Comunidad</span>
                      <span className={styles.actionDesc}>
                        Categorías personalizadas
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className={styles.tipsContainer}>
                <div className={styles.tipBox}>
                  <div className={styles.tipIcon}>💡</div>
                  <div className={styles.tipContent}>
                    <h4>Consejo del día</h4>
                    <p>
                      Responde 3 preguntas correctamente para elegir una
                      categoría y ganar un punto.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
