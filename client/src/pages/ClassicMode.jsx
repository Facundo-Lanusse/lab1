import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import styles from "./css/ClassicMode.module.css";
import gameStyles from "./css/GamePlay.module.css"; // Estilos para las preguntas
import Wheel from "../components/Wheel";
import BackButton from "../components/BackButton";

// Función para normalizar nombres (quitar acentos y convertir a minúsculas)
const normalizeString = (str) => {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remover acentos
};

// Mapeo específico de colores por categoría
const getCategoryColor = (categoryName) => {
  const colorMap = {
    historia: "#f39c12", // Naranja cálido que complementa el turquesa
    geografia: "#3498db", // Azul que armoniza con el turquesa #16b3b9 (normalizado)
    entretenimiento: "#e74c3c", // Rojo coral que contrasta bien
    ciencia: "#27ae60", // Verde que complementa la paleta turquesa
  };

  const key = normalizeString(categoryName);
  return colorMap[key] || "#16b3b9"; // Color turquesa por defecto
};

// Función para obtener colores ordenados según las categorías
const getCategoryColors = (categories) => {
  return categories.map((category) => getCategoryColor(category.name));
};

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#32CD32",
  "#FF69B4",
  "#BA55D3",
  "#20B2AA",
];

// mezclar orden de las respuestas
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

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
  const [message, setMessage] = useState("");
  const [opponentInfo, setOpponentInfo] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [showWheel, setShowWheel] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // Todas las categorías para mostrar en la ruleta
  const [activeBattles, setActiveBattles] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [showQuestionView, setShowQuestionView] = useState(false); // Nueva vista para preguntas
  const [selectedIndex, setSelectedIndex] = useState(null); // Para el feedback visual de respuestas
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null); // Para mostrar respuesta correcta/incorrecta
  const timeoutRef = useRef(null);

  // Obtener userId desde localStorage
  let userId;
  try {
    const userObj = JSON.parse(localStorage.getItem("user"));
    userId = parseInt(userObj?.user_id);
  } catch {}
  if (!userId || isNaN(userId)) {
    userId = parseInt(localStorage.getItem("userId")) || null;
  }

  const isMyTurn = battle && battle.currentTurn === userId;

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!userId) navigate("/login");
  }, [userId, navigate]);

  // Cargar batallas y amigos si no hay battleId
  useEffect(() => {
    if (!battleId) {
      fetchActiveBattles();
      fetchFriends();
    } else if (sessionStorage.getItem("newBattle") === battleId) {
      sessionStorage.removeItem("newBattle");
      setShowWheel(true);
    }
  }, [battleId]);

  // WebSocket para actualizaciones en tiempo real
  useEffect(() => {
    if (!battleId) return;
    const socket = io("http://localhost:3000");
    socket.on("connect", async () => {
      try {
        await axios.post(
          `http://localhost:3000/api/classic/battle/${battleId}/join`,
          { socketId: socket.id }
        );
      } catch {}
    });
    socket.on("battleUpdated", (data) => {
      if (data.battleId === Number(battleId) || data.battleId === battleId)
        fetchBattleState();
    });
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [battleId]);

  // Persistencia del contador de respuestas correctas
  useEffect(() => {
    if (!battleId || !userId) return;
    // Solo restaurar el contador si es mi turno
    if (battle && battle.currentTurn === userId) {
      const stored = localStorage.getItem(
        `correctCounter_${battleId}_${userId}`
      );
      setCorrectCounter(stored !== null ? Number(stored) : 0);
      // Mostrar mensaje si hay respuestas correctas acumuladas
      if (stored && Number(stored) > 0) {
        setMessage(
          `¡Respuesta correcta! ${Number(
            stored
          )}/3 respuestas correctas consecutivas.`
        );
      }
    } else {
      setCorrectCounter(0);
    }
  }, [battleId, userId, battle && battle.currentTurn]);

  useEffect(() => {
    if (!battleId || !userId) return;
    // Solo guardar el contador si es mi turno
    if (battle && battle.currentTurn === userId) {
      localStorage.setItem(
        `correctCounter_${battleId}_${userId}`,
        correctCounter
      );
    }
  }, [correctCounter, battleId, userId, battle && battle.currentTurn]);

  useEffect(() => {
    if (!battle) return;
    if (!isMyTurn) {
      setCorrectCounter(0);
      if (battleId && userId)
        localStorage.setItem(`correctCounter_${battleId}_${userId}`, 0);
    }
  }, [battle, isMyTurn, battleId, userId]);

  // Fetch helpers
  const fetchActiveBattles = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/classic/battles`,
        { params: { userId } }
      );
      setActiveBattles(data.battles || []);
    } catch (err) {
      setError("No se pudieron cargar las batallas activas");
    } finally {
      setLoading(false);
    }
  };
  const fetchFriends = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/friends", {
        params: { userId },
      });
      setFriends(data.friends || []);
    } catch {}
  };
  const fetchOpponentInfo = async (opponentId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/users/${opponentId}`
      );
      setOpponentInfo(data);
    } catch {}
  };
  const fetchBattleState = useCallback(async () => {
    if (!battleId) return;
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/classic/battle/${battleId}/state`
      );
      if (data.success) {
        setBattle(data.battle);
        if (data.history) setGameHistory(data.history);
        const isCurrentUserTurn = data.battle.currentTurn === userId;
        if (isCurrentUserTurn) {
          setMessage("Es tu turno");
          const userCategories =
            data.battle.user_id1 === userId
              ? data.battle.user1Categories
              : data.battle.user2Categories;

          // Ordenar las categorías inmediatamente para consistencia
          const sortedUserCategories = [...userCategories].sort((a, b) =>
            normalizeString(a.name).localeCompare(normalizeString(b.name))
          );

          console.log("=== BACKEND CATEGORIES DEBUG ===");
          console.log(
            "Categorías del backend (original):",
            userCategories.map((cat) => cat.name)
          );
          console.log(
            "Categorías del backend (ordenadas):",
            sortedUserCategories.map((cat) => cat.name)
          );
          console.log("=================================");

          // Guardar todas las categorías ordenadas para mostrar en la ruleta
          setAllCategories(sortedUserCategories);
          // Guardar solo las disponibles (no completadas) para la lógica del juego
          setAvailableCategories(
            sortedUserCategories.filter((cat) => !cat.completed)
          );
        } else {
          setMessage("Esperando a que juegue el oponente");
        }
        const opponentId =
          data.battle.user_id1 === userId
            ? data.battle.user_id2
            : data.battle.user_id1;
        fetchOpponentInfo(opponentId);
      }
    } catch {
      modalAfterWin();
      setError("No se pudo cargar la batalla");
    } finally {
      setLoading(false);
    }
  }, [battleId, userId]);
  useEffect(() => {
    fetchBattleState();
  }, [fetchBattleState]);

  // Acciones de juego
  const startNewBattle = async () => {
    if (!selectedFriend) return setError("Selecciona un amigo para desafiar");
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:3000/api/classic/start",
        { userId, opponentId: selectedFriend.user_id }
      );
      if (data.success) {
        sessionStorage.setItem("newBattle", data.battleId);
        navigate(`/Classic/${data.battleId}`);
      }
    } catch {
      setError("No se pudo iniciar la batalla");
    } finally {
      setLoading(false);
    }
  };
  const loadQuestion = async (categoryId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/classic/battle/${battleId}/questions`,
        { params: { categoryId } }
      );
      if (data.success) {
        setQuestion(data.question);
        // Shuffle answers before setting state
        const shuffledAnswers = shuffleArray(data.answers);
        setAnswers(shuffledAnswers);
        setSelectedCategory(categoryId);
        setShowQuestionView(true); // Cambiar a vista de preguntas
        setSelectedIndex(null); // Reset del estado visual
        setIsAnswerCorrect(null); // Reset del estado visual
      }
    } catch {
      setError("No se pudo cargar la pregunta");
    } finally {
      setLoading(false);
    }
  };
  const handleCategorySelect = async (categoryId) => {
    if (canSelectCategory) {
      try {
        const { data } = await axios.post(
          `http://localhost:3000/api/classic/battle/${battleId}/select-category`,
          { categoryId, userId }
        );
        if (data.success) {
          setCanSelectCategory(false);
          setGameHistory((prev) => [
            ...prev,
            {
              userId,
              action: "mark_category",
              categoryId,
              timestamp: new Date().toISOString(),
            },
          ]);
          setMessage("¡Categoría completada! Has ganado un punto.");
          fetchBattleState();
          setShowQuestionView(false); // Volver a la vista principal
        }
      } catch {
        setError("No se pudo seleccionar la categoría");
      }
    } else {
      loadQuestion(categoryId);
    }
  };
  const handleAnswerQuestion = async (answerId, answerIndex) => {
    // Mostrar feedback visual inmediato
    setSelectedIndex(answerIndex);
    const selectedAnswer = answers[answerIndex];
    setIsAnswerCorrect(selectedAnswer.is_correct);

    try {
      setLoading(true);
      const { data } = await axios.post(
        `http://localhost:3000/api/classic/battle/${battleId}/answer`,
        { questionId: question.question_id, answerId, userId }
      );
      if (data.success) {
        setMessage(data.message);
        setGameHistory((prev) => [
          ...prev,
          {
            userId,
            action: "answer",
            correct: data.correct,
            questionId: question.question_id,
            categoryId: selectedCategory,
            timestamp: new Date().toISOString(),
          },
        ]);

        // Esperar un poco para mostrar el feedback visual
        setTimeout(() => {
          if (data.correct) {
            const newCorrectCount = correctCounter + 1;
            setCorrectCounter(newCorrectCount);
            localStorage.setItem(
              `correctCounter_${battleId}_${userId}`,
              newCorrectCount
            );
            if (newCorrectCount >= 3) {
              setCanSelectCategory(true);
              setMessage(
                "¡Tres respuestas correctas consecutivas! Selecciona una categoría para marcar."
              );
              setCorrectCounter(0);
              localStorage.setItem(`correctCounter_${battleId}_${userId}`, 0);
              setShowWheel(false);
              setQuestion(null);
              setShowQuestionView(false); // Volver a la vista principal
            } else {
              setMessage(
                `¡Respuesta correcta! ${newCorrectCount}/3 respuestas correctas consecutivas.`
              );
              setQuestion(null);
              setShowQuestionView(false); // Volver a la vista principal
            }
          } else {
            setCorrectCounter(0);
            localStorage.setItem(`correctCounter_${battleId}_${userId}`, 0);
            setMessage("Respuesta incorrecta. Turno del oponente.");
            setQuestion(null);
            setSelectedCategory(null);
            setShowQuestionView(false); // Volver a la vista principal
            fetchBattleState(); // Forzar actualización inmediata del estado
          }
        }, 1500); // Esperar 1.5 segundos para mostrar el feedback
      }
    } catch {
      setError("No se pudo procesar la respuesta");
      setShowQuestionView(false); // Volver a la vista principal en caso de error
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };
  const handleContinueAnswering = () => {
    if (battle?.winner != null)
      return setMessage("The game has ended. You cannot continue answering.");

    // Si solo queda una categoría disponible, cargar directamente la pregunta
    if (availableCategories.length === 1) {
      const lastCategory = availableCategories[0];
      if (canSelectCategory) {
        handleCategorySelect(lastCategory.category_id);
      } else {
        loadQuestion(lastCategory.category_id);
      }
      return;
    }

    // Si hay más de una categoría, mostrar la ruleta
    setShowWheel(true);
    setShowQuestionView(false);
  };
  const handlePassTurn = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `http://localhost:3000/api/classic/battle/${battleId}/pass-turn`,
        { userId }
      );
      if (data.success) {
        setMessage("Has pasado el turno al oponente");
        fetchBattleState();
      }
    } catch {
      setError("No se pudo pasar el turno");
    } finally {
      setLoading(false);
    }
  };
  const saveGameResult = async (isWinner) => {
    try {
      await axios.post(
        `http://localhost:3000/api/classic/battle/${battleId}/result`,
        { userId, isWinner }
      );
      if (isWinner) {
        navigate("/Home");
      }
    } catch {}
  };
  const handleStartWheel = () => {
    if (isMyTurn && !question) {
      // Si solo queda una categoría disponible, cargar directamente la pregunta
      if (availableCategories.length === 1) {
        const lastCategory = availableCategories[0];
        if (canSelectCategory) {
          handleCategorySelect(lastCategory.category_id);
        } else {
          loadQuestion(lastCategory.category_id);
        }
        return;
      }

      // Si hay más de una categoría, mostrar la ruleta
      setShowWheel(true);
      setShowQuestionView(false); // Asegurar que estamos en la vista de ruleta
    }
  };
  const handleFinishSpin = (segment) => {
    setShowWheel(false);

    console.log("Segmento de la ruleta:", segment);

    // Usar categorías ordenadas consistentemente
    const sortedCategories = getSortedAvailableCategories();
    console.log(
      "Categorías disponibles (ordenadas):",
      sortedCategories.map((cat) => cat.name)
    );

    // Buscar la categoría seleccionada en las categorías disponibles ordenadas
    const selectedCat = sortedCategories.find(
      (cat) => normalizeString(cat.name) === normalizeString(segment)
    );

    console.log("Categoría encontrada:", selectedCat);

    if (selectedCat) {
      // La categoría está disponible por definición (ya que viene de la ruleta de disponibles)
      if (canSelectCategory) {
        handleCategorySelect(selectedCat.category_id);
      } else {
        loadQuestion(selectedCat.category_id);
      }
    } else {
      // Fallback más robusto: buscar por coincidencia parcial
      console.log("Buscando con coincidencia parcial...");
      const partialMatch = sortedCategories.find(
        (cat) =>
          normalizeString(cat.name).includes(normalizeString(segment)) ||
          normalizeString(segment).includes(normalizeString(cat.name))
      );

      if (partialMatch) {
        console.log("Coincidencia parcial encontrada:", partialMatch);
        if (canSelectCategory) {
          handleCategorySelect(partialMatch.category_id);
        } else {
          loadQuestion(partialMatch.category_id);
        }
      } else if (sortedCategories.length > 0) {
        // Último fallback: elegir una categoría aleatoria de las disponibles ordenadas
        console.log("Usando fallback aleatorio");
        const randomCategory =
          sortedCategories[Math.floor(Math.random() * sortedCategories.length)];
        if (canSelectCategory) {
          handleCategorySelect(randomCategory.category_id);
        } else {
          loadQuestion(randomCategory.category_id);
        }
      }
    }
  };

  // Render helpers
  const getSortedAvailableCategories = () => {
    // Ordenar alfabéticamente para asegurar consistencia entre usuarios
    return [...availableCategories].sort((a, b) =>
      normalizeString(a.name).localeCompare(normalizeString(b.name))
    );
  };

  const getSortedAllCategories = () => {
    // Ordenar todas las categorías alfabéticamente para consistencia visual
    return [...allCategories].sort((a, b) =>
      normalizeString(a.name).localeCompare(normalizeString(b.name))
    );
  };

  const getCategoryNames = () => {
    const sortedCategories = getSortedAvailableCategories();
    return sortedCategories.map((cat) => cat.name);
  };
  const getRandomWinningSegment = () => {
    // Solo seleccionar de las categorías disponibles (no completadas)
    const sortedCategories = getSortedAvailableCategories();
    if (sortedCategories.length === 0) return "";
    const randomSegment =
      sortedCategories[Math.floor(Math.random() * sortedCategories.length)]
        .name;
    console.log("Segmento ganador aleatorio:", randomSegment);
    return randomSegment;
  };

  // Nueva función para renderizar la vista de preguntas estilo bullet/solitario
  const renderQuestionView = () => {
    if (!question || !showQuestionView) return null;

    const myCategories =
      battle.user_id1 === userId
        ? battle.user1Categories
        : battle.user2Categories;
    const opponentCategories =
      battle.user_id1 === userId
        ? battle.user2Categories
        : battle.user1Categories;
    const myCompletedCount = myCategories.filter((c) => c.completed).length;
    const opponentCompletedCount = opponentCategories.filter(
      (c) => c.completed
    ).length;

    // Encontrar la información de la categoría actual para mostrar en la pregunta
    const currentQuestionCategory = allCategories.find(
      (cat) => cat.category_id === selectedCategory
    );

    return (
      <div className={gameStyles.gameContainer}>
        <div className={gameStyles.header}>
          <BackButton
            onClick={() => {
              setShowQuestionView(false);
              setQuestion(null);
              setSelectedIndex(null);
              setIsAnswerCorrect(null);
            }}
            ariaLabel="Volver a la ruleta"
          />

          <div className={styles.classicModeProgress}>
            <div className={styles.progressItem}>
              <span className={styles.playerLabel}>
                Tú: {myCompletedCount}/4
              </span>
            </div>
            <div className={styles.vsIndicatorSmall}>VS</div>
            <div className={styles.progressItem}>
              <span className={styles.playerLabel}>
                {opponentInfo?.username || "Oponente"}: {opponentCompletedCount}
                /4
              </span>
            </div>
          </div>

          <div className={styles.correctCounterSmall}>
            <span>{correctCounter}/3</span>
          </div>
        </div>

        {/* Indicador de categoría - posicionado debajo del header */}
        {currentQuestionCategory && (
          <div className={gameStyles.categoryIndicator}>
            <span className={gameStyles.categoryLabel}>Categoría:</span>
            <span className={gameStyles.categoryName}>
              {currentQuestionCategory.name}
            </span>
          </div>
        )}

        <div className={gameStyles.questionContainer}>
          <h1 className={gameStyles.titleDePrueba}>{question.questiontext}</h1>
        </div>

        <div className={gameStyles.answersContainer} key={question.question_id}>
          {answers.map((answer, index) => {
            let buttonClass = gameStyles.buttonAnswers;

            // Aplicar estilos de feedback visual
            if (selectedIndex === index) {
              buttonClass += isAnswerCorrect
                ? ` ${gameStyles.correct}`
                : ` ${gameStyles.incorrect}`;
            }

            return (
              <button
                key={answer.answer_id}
                className={buttonClass}
                onClick={() => handleAnswerQuestion(answer.answer_id, index)}
                disabled={selectedIndex !== null || loading}
              >
                {answer.text}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Nueva función para renderizar solo la ruleta
  const renderWheelView = () => {
    if (!showWheel || showQuestionView) return null;

    return (
      <div className={styles.wheelContainer}>
        <h3>
          {canSelectCategory
            ? "Gira la ruleta para marcar una categoría"
            : `Gira la ruleta para obtener una pregunta (${availableCategories.length} categorías disponibles)`}
        </h3>

        {/* Indicador de categorías completadas */}
        {allCategories.length > 0 && (
          <div className={styles.categoriesStatus}>
            <p>Estado de categorías:</p>
            <div className={styles.categoryIndicators}>
              {getSortedAllCategories().map((category) => (
                <div
                  key={category.category_id}
                  className={`${styles.categoryIndicator} ${
                    category.completed ? styles.completed : styles.available
                  }`}
                >
                  {category.name}
                  {category.completed && (
                    <span className={styles.checkMark}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Wheel
          segments={getCategoryNames()}
          segColors={getCategoryColors(getSortedAvailableCategories())}
          winningSegment={getRandomWinningSegment()}
          onFinished={handleFinishSpin}
          primaryColor="#30609b"
          contrastColor="#ffffff"
          buttonText="Girar"
          size={350}
        />

        <button
          className={styles.cancelWheelButton}
          onClick={() => {
            setShowWheel(false);
            setShowQuestionView(false);
          }}
        >
          Cancelar
        </button>
      </div>
    );
  };
  const renderCategories = () => {
    if (!battle || !canSelectCategory) return null;
    const categories =
      battle.user_id1 === userId
        ? battle.user1Categories
        : battle.user2Categories;

    // Ordenar categorías alfabéticamente para consistencia
    const sortedCategories = [...categories].sort((a, b) =>
      normalizeString(a.name).localeCompare(normalizeString(b.name))
    );

    return (
      <div className={styles.categoriesContainer}>
        <h3>Elige una categoría para marcar</h3>
        <div className={styles.categoriesGrid}>
          {sortedCategories.map((category) => (
            <div
              key={category.category_id}
              className={`${styles.categoryCard} ${
                category.completed ? styles.completed : ""
              }`}
              onClick={() =>
                !category.completed &&
                isMyTurn &&
                handleCategorySelect(category.category_id)
              }
              style={{
                cursor:
                  !category.completed && isMyTurn ? "pointer" : "not-allowed",
              }}
            >
              <span>{category.name}</span>
              {category.completed && (
                <span className={styles.checkMark}>✓</span>
              )}
            </div>
          ))}
        </div>
        <button
          className={styles.wheelButton}
          onClick={handleStartWheel}
          disabled={availableCategories.length === 0}
        >
          Usar ruleta para elegir categoría
        </button>
      </div>
    );
  };

  const renderBattleStatus = () => {
    if (!battle) return null;
    const myCategories =
      battle.user_id1 === userId
        ? battle.user1Categories
        : battle.user2Categories;
    const opponentCategories =
      battle.user_id1 === userId
        ? battle.user2Categories
        : battle.user1Categories;
    const myCompletedCount = myCategories.filter((c) => c.completed).length;
    const opponentCompletedCount = opponentCategories.filter(
      (c) => c.completed
    ).length;
    if (myCompletedCount >= 4) {
      if (
        gameHistory.length > 0 &&
        !gameHistory.some((h) => h.action === "game_end")
      ) {
        saveGameResult(true);
        setGameHistory((prev) => [
          ...prev,
          {
            action: "game_end",
            winner: userId,
            timestamp: new Date().toISOString(),
          },
        ]);
        setShowWheel(false);
      }
      return (
        <div className={`${styles.battleResult} ${styles.winner}`}>
          <h2>¡Felicidades! Has ganado la partida</h2>
          <BackButton
            onClick={() => navigate("/Play")}
            style={{
              position: "relative",
              top: "20px",
              left: "0",
              margin: "0 auto",
            }}
          />
          <button
            className={styles.backButton}
            onClick={() => navigate("/Play")}
            style={{ marginTop: "20px" }}
          >
            Volver al menú
          </button>
        </div>
      );
    }
    if (opponentCompletedCount >= 4) {
      if (
        gameHistory.length > 0 &&
        !gameHistory.some((h) => h.action === "game_end")
      ) {
        saveGameResult(false);
        setGameHistory((prev) => [
          ...prev,
          {
            action: "game_end",
            winner:
              battle.user_id1 === userId ? battle.user_id2 : battle.user_id1,
            timestamp: new Date().toISOString(),
          },
        ]);
        setShowWheel(false);
      }
      return (
        <div className={`${styles.battleResult} ${styles.loser}`}>
          <h2>
            Has perdido la partida contra{" "}
            {opponentInfo?.username || "tu oponente"}
          </h2>
          <BackButton
            onClick={() => navigate("/Play")}
            style={{
              position: "relative",
              top: "20px",
              left: "0",
              margin: "0 auto",
            }}
          />
          <button
            className={styles.backButton}
            onClick={() => navigate("/Play")}
            style={{ marginTop: "20px" }}
          >
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
            <div
              className={styles.progress}
              style={{ width: `${(myCompletedCount / 4) * 100}%` }}
            ></div>
          </div>
          <span>{myCompletedCount}/4 categorías</span>
        </div>
        <div className={styles.playerStatus}>
          <h4>{opponentInfo?.username || "Oponente"}:</h4>
          <div className={styles.progressBar}>
            <div
              className={`${styles.progress} ${styles.opponent}`}
              style={{ width: `${(opponentCompletedCount / 4) * 100}%` }}
            ></div>
          </div>
          <span>{opponentCompletedCount}/4 categorías</span>
        </div>
      </div>
    );
  };

  const renderClassicModeHome = () => (
    <div className={styles.classicModeHome}>
      <h2>Modo Clásico</h2>
      <div className={styles.activeBattlesSection}>
        <h3>Tus partidas activas</h3>
        {activeBattles.length > 0 ? (
          <div className={styles.activeBattlesList}>
            {activeBattles.map((battle) => (
              <div
                key={battle.battle_id}
                className={styles.battleItem}
                onClick={() => navigate(`/Classic/${battle.battle_id}`)}
              >
                <div className={styles.battleOpponent}>
                  <span className={styles.opponentName}>
                    {battle.opponent_name}
                  </span>
                  {battle.currentTurn === userId ? (
                    <span
                      className={`${styles.turnIndicator} ${styles.yourTurn}`}
                    >
                      Tu turno
                    </span>
                  ) : (
                    <span className={styles.turnIndicator}>
                      Turno del oponente
                    </span>
                  )}
                </div>
                <div className={styles.battleStatus}>
                  <span className={styles.statusDate}>
                    Iniciado: {new Date(battle.date).toLocaleDateString()}
                  </span>
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
              friends.map((friend) => (
                <div
                  key={friend.user_id}
                  className={`${styles.friendItem} ${
                    selectedFriend && selectedFriend.user_id === friend.user_id
                      ? styles.selected
                      : ""
                  }`}
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
              <p className={styles.noFriends}>
                No tienes amigos para desafiar. ¡Agrega algunos amigos primero!
              </p>
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

  // Función para mostrar el modal de resultado y redirigir
  const modalAfterWin = (win = null) => {
    if (showResultModal) return;
    if (win === true) {
      setResultMessage("¡Felicidades! Has ganado la partida");
    } else if (win === false) {
      setResultMessage(
        `Has perdido la partida contra ${
          opponentInfo?.username || "tu oponente"
        }`
      );
    } else {
      setResultMessage("La partida ha finalizado");
    }
    setShowResultModal(true);
    timeoutRef.current = setTimeout(() => {
      setShowResultModal(false);
      navigate("/Play");
    }, 3000);
  };

  // Evitar doble llamado a saveGameResult si la batalla ya está completada
  useEffect(() => {
    if (!battle) return;
    // Solo guardar resultado si la batalla está en curso
    if (battle.status !== "ongoing") return;
    if (battle.user_id1 === userId || battle.user_id2 === userId) {
      const myCategories =
        battle.user_id1 === userId
          ? battle.user1Categories
          : battle.user2Categories;
      const opponentCategories =
        battle.user_id1 === userId
          ? battle.user2Categories
          : battle.user1Categories;
      const myCompletedCount = myCategories.filter((c) => c.completed).length;
      const opponentCompletedCount = opponentCategories.filter(
        (c) => c.completed
      ).length;
      // Solo llamar a saveGameResult si el modal ya se mostró (es decir, después de 3 segundos)
      if (
        (myCompletedCount === 4 || opponentCompletedCount === 4) &&
        !showResultModal
      ) {
        saveGameResult(myCompletedCount === 4);
      }
    }
  }, [battle, userId, showResultModal]);

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
  if (loading && !battle)
    return <div className={styles.loading}>Cargando...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;

  // Si estamos en la vista de preguntas, mostrar solo esa vista
  if (showQuestionView && question) {
    return renderQuestionView();
  }

  // Si estamos mostrando la ruleta, mostrar solo esa vista
  if (showWheel && !showQuestionView) {
    return (
      <div className={styles.classicModeContainer}>
        {showResultModal && (
          <div className={styles.resultModal}>
            <div className={styles.resultModalContent}>
              <h2>{resultMessage}</h2>
              <p>Serás redirigido al menú principal...</p>
            </div>
          </div>
        )}
        {renderWheelView()}
      </div>
    );
  }

  return (
    <div className={styles.classicModeContainer}>
      {showResultModal && (
        <div className={styles.resultModal}>
          <div className={styles.resultModalContent}>
            <h2>{resultMessage}</h2>
            <p>Serás redirigido al menú principal...</p>
          </div>
        </div>
      )}
      <h2>Modo Clásico</h2>
      {message && <div className={styles.messageBox}>{message}</div>}
      <BackButton onClick={() => navigate(-1)} ariaLabel="Volver atrás" />
      {renderBattleStatus()}
      {/* Mostrar contenido basado en el estado del juego */}
      {canSelectCategory ? (
        <div className={styles.categorySelection}>
          <h3>
            ¡3 respuestas correctas consecutivas! Puedes elegir una categoría
            para marcar:
          </h3>
          {renderCategories()}
        </div>
      ) : (
        <>
          {isMyTurn && !question && !showWheel && correctCounter === 0 && (
            <div className={styles.turnStartContainer}>
              <h3>Es tu turno</h3>
              <p>
                {availableCategories.length === 1
                  ? `Solo queda la categoría ${availableCategories[0].name}. Presiona continuar para obtener una pregunta.`
                  : "Presiona continuar para girar la ruleta y obtener una categoría aleatoria"}
              </p>
              <button
                className={styles.continueButton}
                onClick={handleStartWheel}
                disabled={availableCategories.length === 0}
              >
                Continuar
              </button>
            </div>
          )}

          {!isMyTurn && (
            <div className={styles.waitingMessage}>
              <h3>
                Esperando a que {opponentInfo?.username || "el oponente"} juegue
                su turno...
              </h3>
            </div>
          )}

          {correctCounter > 0 &&
            question === null &&
            isMyTurn &&
            !showWheel && (
              <div className={styles.continueOptions}>
                <button
                  className={styles.continueButton}
                  onClick={handleContinueAnswering}
                >
                  Continuar respondiendo
                </button>
                <button
                  className={styles.passTurnButton}
                  onClick={handlePassTurn}
                >
                  Pasar turno
                </button>
              </div>
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
