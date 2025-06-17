import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './css/ClassicMode.module.css';
import Wheel from '../components/Wheel';

const COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#32CD32', '#FF69B4', '#BA55D3', '#20B2AA'
];

const ClassicMode = () => {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [battle, setBattle] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [correctCounter, setCorrectCounter] = useState(0);
  const [canSelectCategory, setCanSelectCategory] = useState(false);
  const [message, setMessage] = useState('');
  const [opponentInfo, setOpponentInfo] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [showWheel, setShowWheel] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [activeBattles, setActiveBattles] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  let userId;
  const userStr = localStorage.getItem('user');
  console.log("Esto es lo que se guarda en localstorage" + userStr);
  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);
      userId = parseInt(userObj.user_id);
      console.log("ID de usuario obtenido del objeto user:", userId);
    } catch (e) {
      console.error("Error al parsear el usuario desde localStorage:", e);
    }
  }

  if (!userId || isNaN(userId)) {
    const userIdStr = localStorage.getItem('userId');
    userId = userIdStr ? parseInt(userIdStr) : null;
    console.log("ID de usuario obtenido directamente:", userId);
  }

  console.log("ID de usuario final:", userId, typeof userId);

  const isMyTurn = battle && battle.currentTurn === userId;

  useEffect(() => {
    if (!userId) {
      console.log("No se encontró ID de usuario, redirigiendo al login");
      navigate('/login');
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (!battleId) {
      fetchActiveBattles();
      fetchFriends();
    } else {
      const isNewBattle = sessionStorage.getItem('newBattle') === battleId;
      if (isNewBattle) {
        sessionStorage.removeItem('newBattle');
        setShowWheel(true);
      }
    }
  }, [battleId]);

  const fetchActiveBattles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/classic/battles`, {
        params: { userId }
      });
      setActiveBattles(response.data.battles || []);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener batallas activas:', err);
      setError('No se pudieron cargar las batallas activas');
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/friends', {
        params: { userId }
      });
      setFriends(response.data.friends || []);
    } catch (err) {
      console.error('Error al obtener amigos:', err);
    }
  };

  const startNewBattle = async () => {
    if (!selectedFriend) {
      setError('Selecciona un amigo para desafiar');
      return;
    }

    try {
      setLoading(true);
      console.log('Iniciando batalla con:', {
        miUserId: userId,
        tipoMiUserId: typeof userId,
        amigoSeleccionado: selectedFriend.user_id,
        tipoAmigoId: typeof selectedFriend.user_id
      });

      const response = await axios.post('http://localhost:3000/api/classic/start', {
        userId,
        opponentId: selectedFriend.user_id
      });

      console.log('Respuesta al crear batalla:', response.data);

      if (response.data.success) {
        console.log(`Batalla creada con éxito, redirigiendo a: /Classic/${response.data.battleId}`);
        sessionStorage.setItem('newBattle', response.data.battleId);
        navigate(`/Classic/${response.data.battleId}`);
      }
    } catch (err) {
      console.error('Error al iniciar batalla:', err);
      setError('No se pudo iniciar la batalla');
    } finally {
      setLoading(false);
    }
  };

  const fetchBattleState = useCallback(async () => {
    if (!battleId) return;

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/classic/battle/${battleId}/state`);
      if (response.data.success) {
        setBattle(response.data.battle);

        if (response.data.history) {
          setGameHistory(response.data.history);
        }

        const currentTurn = response.data.battle.currentTurn;

        console.log('Datos para comparación de turnos:', {
          userId: userId,
          userIdType: typeof userId,
          currentTurn: currentTurn,
          currentTurnType: typeof currentTurn,
          usuarioEnLocalStorage: localStorage.getItem('userId'),
          tipoEnLocalStorage: typeof localStorage.getItem('userId'),
          sonIgualesTripleIgual: userId === currentTurn,
          sonIgualesDobleIgual: userId == currentTurn,
          user_id1: response.data.battle.user_id1,
          user_id2: response.data.battle.user_id2
        });

        const isCurrentUserTurn = currentTurn === userId;

        if (isCurrentUserTurn) {
          setMessage('Es tu turno');

          const userCategories = response.data.battle.user_id1 === userId
            ? response.data.battle.user1Categories
            : response.data.battle.user2Categories;

          const availableCats = userCategories.filter(cat => !cat.completed);
          setAvailableCategories(availableCats);
        } else {
          setMessage('Esperando a que juegue el oponente');
        }

        const opponentId = response.data.battle.user_id1 === userId
          ? response.data.battle.user_id2
          : response.data.battle.user_id1;

        fetchOpponentInfo(opponentId);
      }
    } catch (err) {
      console.error('Error al cargar estado de la batalla:', err);
      setError('No se pudo cargar la batalla');
    } finally {
      setLoading(false);
    }
  }, [battleId, userId]);

  useEffect(() => {
    fetchBattleState();
  }, [fetchBattleState]);

  useEffect(() => {
    if (battleId && isMyTurn && !question && !showWheel && availableCategories.length > 0) {
      setShowWheel(true);
    }
  }, [battleId, isMyTurn, question, availableCategories]);

  const fetchOpponentInfo = async (opponentId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/${opponentId}`);
      setOpponentInfo(response.data);
    } catch (err) {
      console.error('Error al obtener información del oponente:', err);
    }
  };

  const loadQuestion = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/classic/battle/${battleId}/questions`, {
        params: { categoryId }
      });

      if (response.data.success) {
        setQuestion(response.data.question);
        setAnswers(response.data.answers);
        setSelectedCategory(categoryId);
      }
    } catch (err) {
      console.error('Error al cargar pregunta:', err);
      setError('No se pudo cargar la pregunta');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (categoryId) => {
    if (canSelectCategory) {
      try {
        const response = await axios.post(`http://localhost:3000/api/classic/battle/${battleId}/select-category`, {
          categoryId,
          userId
        });

        if (response.data.success) {
          setCanSelectCategory(false);

          const newHistoryItem = {
            userId: userId,
            action: 'mark_category',
            categoryId: categoryId,
            timestamp: new Date().toISOString()
          };

          setGameHistory(prevHistory => [...prevHistory, newHistoryItem]);

          setMessage('¡Categoría completada! Has ganado un punto.');

          fetchBattleState();
        }
      } catch (err) {
        console.error('Error al seleccionar categoría:', err);
        setError('No se pudo seleccionar la categoría');
      }
    } else {
      loadQuestion(categoryId);
    }
  };

  const handleAnswerQuestion = async (answerId) => {
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:3000/api/classic/battle/${battleId}/answer`, {
        questionId: question.question_id,
        answerId,
        userId
      });

      if (response.data.success) {
        setMessage(response.data.message);

        const newHistoryItem = {
          userId: userId,
          action: 'answer',
          correct: response.data.correct,
          questionId: question.question_id,
          categoryId: selectedCategory,
          timestamp: new Date().toISOString()
        };

        setGameHistory(prevHistory => [...prevHistory, newHistoryItem]);

        if (response.data.correct) {
          const newCorrectCount = correctCounter + 1;
          setCorrectCounter(newCorrectCount);

          if (newCorrectCount >= 3) {
            setCanSelectCategory(true);
            setMessage('¡Tres respuestas correctas consecutivas! Selecciona una categoría para marcar.');
            setCorrectCounter(0);
            setShowWheel(true);
            setQuestion(null);
          } else {
            setMessage(`¡Respuesta correcta! ${newCorrectCount}/3 respuestas correctas consecutivas.`);
            setQuestion(null);
          }
        } else {
          // Respuesta incorrecta: cambiar turno automáticamente
          setCorrectCounter(0);
          setMessage('Respuesta incorrecta. Turno del oponente.');
          setQuestion(null);
          setSelectedCategory(null); // Limpiar la categoría seleccionada

          // Actualizar el estado de la batalla para reflejar cambio de turno
          fetchBattleState();
        }
      }
    } catch (err) {
      console.error('Error al responder pregunta:', err);
      setError('No se pudo procesar la respuesta');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAnswering = () => {
    if (history.winner != null) {
        setMessage('La partida ha terminado. No puedes continuar respondiendo.');
        return;
    }
    if (selectedCategory) {
      loadQuestion(selectedCategory);
    }
  };

  const handlePassTurn = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:3000/api/classic/battle/${battleId}/pass-turn`, {
        userId
      });

      if (response.data.success) {
        setMessage('Has pasado el turno al oponente');
        fetchBattleState();
      }
    } catch (err) {
      console.error('Error al pasar turno:', err);
      setError('No se pudo pasar el turno');
    } finally {
      setLoading(false);
    }
  };

  const saveGameResult = async (isWinner) => {
    try {
      await axios.post(`http://localhost:3000/api/classic/battle/${battleId}/result`, {
        userId,
        isWinner,
        history: gameHistory
      });
    } catch (err) {
      console.error('Error al guardar resultado de la partida:', err);
    }
  };

  const handleStartWheel = () => {
    if (isMyTurn && !question) {
      setShowWheel(true);
    }
  };

  const handleFinishSpin = (segment) => {
    setIsWheelSpinning(false);

    const selectedCat = availableCategories.find(cat =>
      cat.name === segment ||
      cat.name.toLowerCase().trim() === segment.toLowerCase().trim()
    );

    if (selectedCat) {
      if (canSelectCategory) {
        handleCategorySelect(selectedCat.category_id);
      } else {
        loadQuestion(selectedCat.category_id);
      }
    } else {
      if (availableCategories.length > 0) {
        const fallbackCategory = availableCategories[0];
        if (canSelectCategory) {
          handleCategorySelect(fallbackCategory.category_id);
        } else {
          loadQuestion(fallbackCategory.category_id);
        }
      }
    }

    setShowWheel(false);
  };

  const getCategoryNames = () => {
    return availableCategories.map(cat => cat.name);
  };

  const getRandomWinningSegment = () => {
    if (availableCategories.length === 0) return '';
    const randomIndex = Math.floor(Math.random() * availableCategories.length);
    return availableCategories[randomIndex].name;
  };

  const renderCategories = () => {
    if (!battle) return null;

    const categories = battle.user_id1 === userId
      ? battle.user1Categories
      : battle.user2Categories;

    return (
      <div className={styles.categoriesContainer}>
        <h3>Categorías</h3>
        <div className={styles.categoriesGrid}>
          {categories.map(category => (
            <div
              key={category.category_id}
              className={`${styles.categoryCard} ${category.completed ? styles.completed : ''}`}
              onClick={() => !category.completed && isMyTurn && handleCategorySelect(category.category_id)}
            >
              <span>{category.name}</span>
              {category.completed && <span className={styles.checkMark}>✓</span>}
            </div>
          ))}
        </div>

        {isMyTurn && !question && !canSelectCategory && (
          <button
            className={styles.wheelButton}
            onClick={handleStartWheel}
            disabled={availableCategories.length === 0}
          >
            Usar ruleta para elegir categoría
          </button>
        )}
      </div>
    );
  };

  const renderQuestion = () => {
    if (!question || !isMyTurn) return null;

    return (
      <div className={styles.questionContainer}>
        <h3>Pregunta:</h3>
        <p className={styles.questionText}>{question.questiontext}</p>
        <div className={styles.answersList}>
          {answers.map(answer => (
            <button
              key={answer.answer_id}
              className={styles.answerButton}
              onClick={() => handleAnswerQuestion(answer.answer_id)}
            >
              {answer.text}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderBattleStatus = () => {
    if (!battle) return null;

    const myCategories = battle.user_id1 === userId
      ? battle.user1Categories
      : battle.user2Categories;

    const opponentCategories = battle.user_id1 === userId
      ? battle.user2Categories
      : battle.user1Categories;

    const myCompletedCount = myCategories.filter(c => c.completed).length;
    const opponentCompletedCount = opponentCategories.filter(c => c.completed).length;

    if (myCompletedCount >= 4) {
      if (gameHistory.length > 0 && !gameHistory.some(h => h.action === 'game_end')) {
        saveGameResult(true);
        setGameHistory(prevHistory => [...prevHistory, {
          action: 'game_end',
          winner: userId,
          timestamp: new Date().toISOString()
        }]);
      }

      return (
        <div className={`${styles.battleResult} ${styles.winner}`}>
          <h2>¡Felicidades! Has ganado la partida</h2>
          <button className={styles.backButton} onClick={() => navigate('/Play')}>
            Volver al menú
          </button>
        </div>
      );
    }

    if (opponentCompletedCount >= 4) {
      if (gameHistory.length > 0 && !gameHistory.some(h => h.action === 'game_end')) {
        saveGameResult(false);
        setGameHistory(prevHistory => [...prevHistory, {
          action: 'game_end',
          winner: battle.user_id1 === userId ? battle.user_id2 : battle.user_id1,
          timestamp: new Date().toISOString()
        }]);
      }

      return (
        <div className={`${styles.battleResult} ${styles.loser}`}>
          <h2>Has perdido la partida contra {opponentInfo?.username || 'tu oponente'}</h2>
          <button className={styles.backButton} onClick={() => navigate('/Play')}>
            Volver al menú
          </button>
        </div>
      );
    }

    return (
      <div className={styles.battleStatus}>
        <div className={styles.playerStatus}>
          <h4>Tu progreso:</h4>
          <div className={styles.progressBar}>
            <div className={styles.progress} style={{ width: `${(myCompletedCount / 4) * 100}%` }}></div>
          </div>
          <span>{myCompletedCount}/4 categorías</span>
        </div>

        <div className={styles.playerStatus}>
          <h4>{opponentInfo?.username || 'Oponente'}:</h4>
          <div className={styles.progressBar}>
            <div className={`${styles.progress} ${styles.opponent}`} style={{ width: `${(opponentCompletedCount / 4) * 100}%` }}></div>
          </div>
          <span>{opponentCompletedCount}/4 categorías</span>
        </div>
      </div>
    );
  };

  const renderClassicModeHome = () => {
    return (
      <div className={styles.classicModeHome}>
        <h2>Modo Clásico</h2>

        <div className={styles.activeBattlesSection}>
          <h3>Tus partidas activas</h3>
          {activeBattles.length > 0 ? (
            <div className={styles.activeBattlesList}>
              {activeBattles.map(battle => (
                <div
                  key={battle.battle_id}
                  className={styles.battleItem}
                  onClick={() => navigate(`/Classic/${battle.battle_id}`)}
                >
                  <div className={styles.battleOpponent}>
                    <span className={styles.opponentName}>{battle.opponent_name}</span>
                    {battle.currentTurn === userId ? (
                      <span className={`${styles.turnIndicator} ${styles.yourTurn}`}>Tu turno</span>
                    ) : (
                      <span className={styles.turnIndicator}>Turno del oponente</span>
                    )}
                  </div>
                  <div className={styles.battleStatus}>
                    <span className={styles.statusDate}>Iniciado: {new Date(battle.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noBattles}>No tienes partidas activas</p>
          )}
        </div>

        <div className={styles.startBattleSection}>
          <h3>Iniciar una nueva batalla</h3>
          <div className={styles.friendsSelector}>
            <p>Elige un amigo para desafiar:</p>
            <div className={styles.friendsList}>
              {friends.length > 0 ? (
                friends.map(friend => (
                  <div
                    key={friend.user_id}
                    className={`${styles.friendItem} ${selectedFriend && selectedFriend.user_id === friend.user_id ? styles.selected : ''}`}
                    onClick={() => setSelectedFriend(friend)}
                  >
                    <img
                      src={friend.profile_picture || "defaultProfileImage.png"}
                      alt={friend.username}
                      className={styles.friendAvatar}
                    />
                    <span className={styles.friendName}>{friend.username}</span>
                  </div>
                ))
              ) : (
                <p className={styles.noFriends}>No tienes amigos para desafiar. ¡Agrega algunos amigos primero!</p>
              )}
            </div>
          </div>

          <button
            className={styles.startBattleButton}
            disabled={!selectedFriend || friends.length === 0}
            onClick={startNewBattle}
          >
            Iniciar Batalla
          </button>
        </div>
      </div>
    );
  };

  if (!battleId) {
    return (
      <div className={styles.classicModeContainer}>
        {loading ? (
          <div className={styles.loading}>Cargando...</div>
        ) : error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : (
          renderClassicModeHome()
        )}
      </div>
    );
  }

  if (loading && !battle) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.classicModeContainer}>
      <h2>Modo Clásico</h2>

      {message && <div className={styles.messageBox}>{message}</div>}

      {renderBattleStatus()}

      {showWheel ? (
        <div className={styles.wheelContainer}>
          <h3>Gira la ruleta para seleccionar una categoría</h3>
          <Wheel
            segments={getCategoryNames()}
            segColors={COLORS}
            winningSegment={getRandomWinningSegment()}
            onFinished={handleFinishSpin}
            primaryColor="#30609b"
            contrastColor="#ffffff"
            buttonText="Girar"
            size={350}
          />
          <button className={styles.cancelWheelButton} onClick={() => setShowWheel(false)}>
            Cancelar
          </button>
        </div>
      ) : (
        <>
          {canSelectCategory ? (
            <div className={styles.categorySelection}>
              <h3>¡Respuestas correctas! Selecciona una categoría para marcar:</h3>
              {renderCategories()}
              <button
                className={styles.wheelButton}
                onClick={handleStartWheel}
                disabled={availableCategories.length === 0}
              >
                Usar ruleta para elegir categoría
              </button>
            </div>
          ) : (
            <>
              {isMyTurn && !question && (
                <div className={styles.categorySelection}>
                  <h3>Es tu turno. Selecciona una categoría para jugar:</h3>
                  {renderCategories()}
                </div>
              )}

              {renderQuestion()}

              {!isMyTurn && (
                <div className={styles.waitingMessage}>
                  <h3>Esperando a que {opponentInfo?.username || 'el oponente'} juegue su turno...</h3>
                </div>
              )}

              {correctCounter > 0 && question === null && (
                <div className={styles.continueOptions}>
                  <button className={styles.continueButton} onClick={handleContinueAnswering}>
                    Continuar respondiendo
                  </button>
                  <button className={styles.passTurnButton} onClick={handlePassTurn}>
                    Pasar turno
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {correctCounter > 0 && (
        <div className={styles.correctCounter}>
          Respuestas correctas consecutivas: {correctCounter}/3
        </div>
      )}
    </div>
  );
};

export default ClassicMode;
