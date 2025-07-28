import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./css/GamePlay.module.css";
import inviteStyle from "./css/inviteSection.module.css";
import { BurgerMenu } from "../components/BurgerMenu";

const PlayMenu = () => {
  const navigate = useNavigate();

  // Estados para amigos y selector
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showFriendSelector, setShowFriendSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para invitaciones
  const [inviteCode, setInviteCode] = useState("");
  const [generatedInviteCode, setGeneratedInviteCode] = useState("");
  const [showInviteSection, setShowInviteSection] = useState(false);

  // Estados para notificaciones de batalla
  const [pendingBattle, setPendingBattle] = useState(null);
  const [showBattleNotification, setShowBattleNotification] = useState(false);
  const [notifiedBattles, setNotifiedBattles] = useState(new Set());

  // Estado para indicar si es bullet o clásico
  const [isBulletMode, setIsBulletMode] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const friendsPerPage = 3;

  // Estado para búsqueda de amigos
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para mostrar modal de jugar solo o con amigo en modo bala
  const [showSoloBulletModal, setShowSoloBulletModal] = useState(false);

  // Efecto para cargar amigos al montar el componente
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/Login");
      return;
    }

    const fetchFriends = async () => {
      try {
        setLoading(true);
        const userId = Number(user.user_id);

        const response = await axios.get("http://localhost:3000/api/friends", {
          params: { userId },
        });

        setFriends(response.data.friends);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener amigos:", err);
        setError(
          "No se pudieron cargar tus amigos. Por favor, intenta de nuevo más tarde."
        );
        setLoading(false);
      }
    };

    fetchFriends();
  }, [navigate]);

  // Efecto para verificar invitaciones usadas
  useEffect(() => {
    const checkUsedInvitations = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const response = await axios.get(
          "http://localhost:3000/api/check-used-invitations",
          {
            params: { userId: user.user_id },
          }
        );

        if (response.data.success && response.data.newBattles.length > 0) {
          const unnotifiedBattles = response.data.newBattles.filter(
            (battle) => !notifiedBattles.has(battle.battleId)
          );

          if (unnotifiedBattles.length > 0) {
            const newBattle = unnotifiedBattles[0];
            setPendingBattle(newBattle);
            setShowBattleNotification(true);
            setNotifiedBattles(
              (prev) => new Set([...prev, newBattle.battleId])
            );
          }
        }
      } catch (error) {
        console.error("Error verificando invitaciones:", error);
      }
    };

    const interval = setInterval(checkUsedInvitations, 3000);
    return () => clearInterval(interval);
  }, [notifiedBattles]);

  // Función para unirse a una batalla pendiente
  const joinPendingBattle = () => {
    if (pendingBattle) {
      navigate(`/Classic/${pendingBattle.battleId}`);
      setShowBattleNotification(false);
      setPendingBattle(null);
    }
  };

  // Función para descartar notificación de batalla
  const dismissBattleNotification = () => {
    setShowBattleNotification(false);
    setPendingBattle(null);
  };

  // Función para iniciar una partida clásica con un amigo
  const startMode = useCallback(async () => {
    if (!selectedFriend) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.user_id;

      let res;
      if (!isBulletMode) {
        res = await axios.post(
          "http://localhost:3000/api/classic/start",
          {
            userId: userId,
            opponentId: selectedFriend.user_id,
          }
        );
      } else {
        res = await axios.post(
          "http://localhost:3000/api/bullet/start",
          {
            userId: userId,
            opponentId: selectedFriend.user_id,
          }
        );
      }
      const response = res.data;

      if (response.success) {
        navigate(`/Classic/${response.battleId}`);
      } else {
        throw new Error(
          response.message || "No se pudo iniciar la batalla"
        );
      }
    } catch (error) {
      console.error("Error al iniciar partida:", error);

      let errorMessage = "Error desconocido";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`No se pudo iniciar la partida: ${errorMessage}`);
    }
  }, [selectedFriend, navigate, isBulletMode]);

  // Función para iniciar una partida bullet online con un amigo
  const startBulletOnline = useCallback(async () => {
    if (!selectedFriend) return;
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.user_id;
      const res = await axios.post(
        "http://localhost:3000/api/bullet-online/start",
        {
          userId: userId,
          opponentId: selectedFriend.user_id,
        }
      );
      const response = res.data;
      if (response.success) {
        navigate(`/BulletOnline/${response.battle.battle_id}`);
      } else {
        throw new Error(response.message || "No se pudo iniciar la partida");
      }
    } catch (error) {
      let errorMessage = "Error desconocido";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert(`No se pudo iniciar la partida: ${errorMessage}`);
    }
  }, [selectedFriend, navigate]);

  // Función para generar un código de invitación
  const generateInviteCode = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setError("Debes estar logueado para generar invitaciones");
        return;
      }

      const userObj = JSON.parse(userStr);
      const userId = parseInt(userObj.user_id);

      const response = await fetch("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setGeneratedInviteCode(data.inviteCode);
        setShowInviteSection(true);
      } else {
        setError("No se pudo generar el código de invitación");
      }
    } catch (err) {
      console.error("Error al generar código:", err);
      setError("Error al generar código de invitación");
    }
  };

  // Función para unirse con código de invitación
  const joinWithInviteCode = async () => {
    if (!inviteCode.trim()) {
      setError("Ingresa un código de invitación válido");
      return;
    }
    navigate(`/invite/${inviteCode.trim()}`);
  };

  // Función para copiar código al portapapeles
  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedInviteCode);
      // Aquí podrías mostrar una notificación más elegante en lugar del alert
      alert("¡Código copiado al portapapeles! 📋");
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err);
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = generatedInviteCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("¡Código copiado al portapapeles! 📋");
    }
  };

  // Función para cerrar el selector de amigos
  const closeFriendSelector = () => {
    setShowFriendSelector(false);
    setSelectedFriend(null);
    setInviteCode("");
    setGeneratedInviteCode("");
    setShowInviteSection(false);
    setError(null);
    setIsBulletMode(null);
  };

  // Filtrar amigos por búsqueda antes de paginar
  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredFriends.length / friendsPerPage);
  const paginatedFriends = filteredFriends.slice(
    (currentPage - 1) * friendsPerPage,
    currentPage * friendsPerPage
  );

  // Reiniciar página si cambia la lista de amigos
  useEffect(() => {
    setCurrentPage(1);
  }, [friends]);

  return (
    <div className={styles.playMenuContainer}>
      {/* Menú hamburguesa */}
      <div className={styles.burgerMenuWrapper}>
        <BurgerMenu />
      </div>

      {/* Notificación de batalla pendiente */}
      {showBattleNotification && pendingBattle && (
        <BattleNotification
          onJoin={joinPendingBattle}
          onDismiss={dismissBattleNotification}
        />
      )}

      {/* Contenido principal */}
      <div className={styles.playMenuContent}>
        <div className={styles.menuHeader}>
          <h2>Selecciona un modo de juego</h2>
        </div>

        {/* Tarjetas de modos de juego */}
        <div className={styles.gameModeCards}>
          <GameModeCard
            icon={<SolitaryIcon />}
            title="Modo Solo"
            description="Responde preguntas aleatorias y consigue puntos"
            onClick={() => navigate("/Solitary")}
          />

          <GameModeCard
            icon={<BulletIcon />}
            title="Modo Bala"
            description="Responde preguntas en poco tiempo y haz tu mejor marca"
            onClick={() => {
              setShowSoloBulletModal(true);
              setIsBulletMode(true);
            }}
          />

          <GameModeCard
            icon={<ClassicIcon />}
            title="Modo Clásico"
            description="Compite con un amigo para ver quién completa primero las categorías"
            onClick={() => {
              setShowFriendSelector(true);
              setIsBulletMode(false);
            }}
          />
        </div>
      </div>

      {/* Modal selector de amigos */}
      {showFriendSelector && (
        <FriendSelectorModal
          friends={paginatedFriends}
          selectedFriend={selectedFriend}
          onSelectFriend={setSelectedFriend}
          onStartGame={isBulletMode ? startBulletOnline : startMode}
          onClose={closeFriendSelector}
          loading={loading}
          error={error}
          inviteCode={inviteCode}
          onInviteCodeChange={setInviteCode}
          onJoinWithCode={joinWithInviteCode}
          onGenerateCode={generateInviteCode}
          generatedInviteCode={generatedInviteCode}
          showInviteSection={showInviteSection}
          onCopyCode={copyInviteCode}
          isBulletMode={isBulletMode}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />
      )}

      {/* Modal para elegir entre jugar solo o con amigo en bullet */}
      {showSoloBulletModal && isBulletMode && (
        <div className={styles.friendSelectorOverlay}>
          <div className={styles.friendSelector} style={{ maxWidth: 420, minWidth: 320, padding: '2.5rem 2rem', boxShadow: '0 4px 24px rgba(22,179,185,0.13)', borderRadius: 18, background: 'linear-gradient(135deg, #f8fdfd 0%, #f0fafa 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ marginBottom: '1.2rem', color: '#16b3b9', fontWeight: 700 }}>¿Cómo quieres jugar el modo bala?</h3>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', width: '100%' }}>
              <button
                className={styles.friendSelectorButton}
                style={{ flex: 1, minWidth: 0, fontSize: 16, padding: '1rem 0.5rem', borderRadius: 10, fontWeight: 600 }}
                onClick={() => {
                  setShowSoloBulletModal(false);
                  setShowFriendSelector(true);
                }}
              >
                Jugar con amigo
              </button>
              <button
                className={styles.friendSelectorButton}
                style={{ flex: 1, minWidth: 0, fontSize: 16, padding: '1rem 0.5rem', borderRadius: 10, fontWeight: 600 }}
                onClick={() => {
                  setShowSoloBulletModal(false);
                  navigate('/BulletPlay');
                }}
              >
                Jugar en solitario
              </button>
            </div>
            <button className={styles.cancelButton} style={{ marginTop: '2.2rem', width: '100%' }} onClick={() => setShowSoloBulletModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para la notificación de batalla
const BattleNotification = ({ onJoin, onDismiss }) => (
  <div className={inviteStyle.battleNotification}>
    <div className={inviteStyle.notificationContent}>
      <h3>¡Alguien se unió a tu partida!</h3>
      <p>Un jugador usó tu código de invitación</p>
      <div className={inviteStyle.notificationButtons}>
        <button onClick={onJoin} className={inviteStyle.joinBattleButton}>
          Unirse a la partida
        </button>
        <button onClick={onDismiss} className={inviteStyle.dismissButton}>
          Más tarde
        </button>
      </div>
    </div>
  </div>
);

// Componente para las tarjetas de modo de juego
const GameModeCard = ({ icon, title, description, onClick }) => (
  <div
    className={styles.gameModeCard}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }}
    aria-label={`Seleccionar ${title}: ${description}`}
  >
    <div className={styles.cardIcon} aria-hidden="true">
      {icon}
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

// Íconos SVG como componentes
const SolitaryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="48"
    height="48"
    fill="none"
    stroke="#16b3b9"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12l2 2 4-4"></path>
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

const BulletIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="48"
    height="48"
    fill="none"
    stroke="#16b3b9"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const ClassicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="48"
    height="48"
    fill="none"
    stroke="#16b3b9"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

// Componente para el modal de selector de amigos
const FriendSelectorModal = ({
  friends,
  selectedFriend,
  onSelectFriend,
  onStartGame,
  onClose,
  loading,
  error,
  inviteCode,
  onInviteCodeChange,
  onJoinWithCode,
  onGenerateCode,
  generatedInviteCode,
  showInviteSection,
  onCopyCode,
  isBulletMode,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchTermChange,
}) => (

  <div className={styles.friendSelectorOverlay}>
    <div className={styles.friendSelector}>
      <h3>Desafía a un amigo</h3>

      {/* Buscador de amigos */}
      <input
          className={styles.cancelButton}
        type="text"
        placeholder="Buscar amigo por nombre..."
        value={searchTerm}
        onChange={e => onSearchTermChange(e.target.value)}
      />


      <br/>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {/* Lista de amigos */}
      {loading ? (
        <div className={styles.loadingMessage}>Cargando amigos...</div>
      ) : totalPages > 0 ? (
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectFriend={onSelectFriend}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      ) : (
        <p className={styles.noFriends}>
          No tienes amigos para jugar. ¡Agrega algunos amigos primero!
        </p>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={inviteStyle.joinButton}
          >
            Anterior
          </button>
          <span style={{ padding: "0 10px" }}>
             {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={inviteStyle.joinButton}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Botones de acción */}
      <div className={styles.actionButtons}>
        <button className={styles.cancelButton} onClick={onClose}>
          Cancelar
        </button>
        <button
          className={styles.startButton}
          disabled={!selectedFriend}
          onClick={onStartGame}
        >
          Desafiar y Comenzar
        </button>
      </div>

      {/* Sección de invitaciones */}
      <InviteSection
        inviteCode={inviteCode}
        onInviteCodeChange={onInviteCodeChange}
        onJoinWithCode={onJoinWithCode}
        onGenerateCode={onGenerateCode}
        generatedInviteCode={generatedInviteCode}
        showInviteSection={showInviteSection}
        onCopyCode={onCopyCode}
      />
    </div>
  </div>
);

// Componente para la lista de amigos
const FriendsList = ({ friends, selectedFriend, onSelectFriend, currentPage, totalPages, onPageChange }) => (
  <div className={styles.friendsList}>
    {friends.map((friend) => (
      <div
        key={friend.user_id}
        className={`${styles.friendCard} ${
          selectedFriend && selectedFriend.user_id === friend.user_id
            ? styles.selectedFriend
            : ""
        }`}
        onClick={() => onSelectFriend(friend)}
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
);

// Componente para la sección de invitaciones
const InviteSection = ({
  inviteCode,
  onInviteCodeChange,
  onJoinWithCode,
  onGenerateCode,
  generatedInviteCode,
  showInviteSection,
  onCopyCode,
}) => (
  <div className={inviteStyle.inviteSection}>
    <div className={inviteStyle.inviteRow}>
      <input
        type="text"
        placeholder="Ingresa el código de invitación"
        value={inviteCode}
        onChange={(e) => onInviteCodeChange(e.target.value)}
        className={inviteStyle.inviteInput}
        aria-label="Código de invitación"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onJoinWithCode();
          }
        }}
      />
      <button
        onClick={onJoinWithCode}
        className={inviteStyle.joinButton}
        disabled={!inviteCode.trim()}
        aria-label="Unirse con código de invitación"
      >
        Unirse
      </button>
    </div>

    <button onClick={onGenerateCode} className={inviteStyle.generateButton}>
      Generar código de invitación
    </button>

    {showInviteSection && generatedInviteCode && (
      <div className={inviteStyle.inviteDisplay}>
        <p>Comparte este código:</p>
        <div className={inviteStyle.codeContainer}>
          <code className={inviteStyle.inviteCodeDisplay}>
            {generatedInviteCode}
          </code>
          <button onClick={onCopyCode} className={inviteStyle.copyButton}>
            Copiar
          </button>
        </div>
      </div>
    )}
  </div>
);

export default PlayMenu;
