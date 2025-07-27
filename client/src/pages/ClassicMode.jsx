<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./css/ClassicMode.module.css";
import Wheel from "../components/Wheel";
=======
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import styles from './css/ClassicMode.module.css';
import Wheel from '../components/Wheel';
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5

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
  const [activeBattles, setActiveBattles] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const timeoutRef = useRef(null);

  // Obtener userId desde localStorage
  let userId;
<<<<<<< HEAD
  const userStr = localStorage.getItem("user");
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
    const userIdStr = localStorage.getItem("userId");
    userId = userIdStr ? parseInt(userIdStr) : null;
    console.log("ID de usuario obtenido directamente:", userId);
=======
  try {
    const userObj = JSON.parse(localStorage.getItem('user'));
    userId = parseInt(userObj?.user_id);
  } catch {}
  if (!userId || isNaN(userId)) {
    userId = parseInt(localStorage.getItem('userId')) || null;
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
  }

  const isMyTurn = battle && battle.currentTurn === userId;

  // Redirigir si no hay usuario
  useEffect(() => {
<<<<<<< HEAD
    if (!userId) {
      console.log("No se encontró ID de usuario, redirigiendo al login");
      navigate("/login");
    }
=======
    if (!userId) navigate('/login');
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
  }, [userId, navigate]);

  // Cargar batallas y amigos si no hay battleId
  useEffect(() => {
    if (!battleId) {
      fetchActiveBattles();
      fetchFriends();
<<<<<<< HEAD
    } else {
      const isNewBattle = sessionStorage.getItem("newBattle") === battleId;
      if (isNewBattle) {
        sessionStorage.removeItem("newBattle");
        setShowWheel(true);
      }
=======
    } else if (sessionStorage.getItem('newBattle') === battleId) {
      sessionStorage.removeItem('newBattle');
      setShowWheel(true);
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
    }
  }, [battleId]);

  // WebSocket para actualizaciones en tiempo real
  useEffect(() => {
    if (!battleId) return;
    const socket = io('http://localhost:3000');
    socket.on('connect', async () => {
      try {
        await axios.post(`http://localhost:3000/api/classic/battle/${battleId}/join`, { socketId: socket.id });
      } catch {}
    });
    socket.on('battleUpdated', (data) => {
      if (data.battleId === Number(battleId) || data.battleId === battleId) fetchBattleState();
    });
    return () => { socket.disconnect(); };
    // eslint-disable-next-line
  }, [battleId]);

  // Persistencia del contador de respuestas correctas
  useEffect(() => {
    if (!battleId || !userId) return;
    // Solo restaurar el contador si es mi turno
    if (battle && battle.currentTurn === userId) {
      const stored = localStorage.getItem(`correctCounter_${battleId}_${userId}`);
      setCorrectCounter(stored !== null ? Number(stored) : 0);
      // Mostrar mensaje si hay respuestas correctas acumuladas
      if (stored && Number(stored) > 0) {
        setMessage(`¡Respuesta correcta! ${Number(stored)}/3 respuestas correctas consecutivas.`);
      }
    } else {
      setCorrectCounter(0);
    }
  }, [battleId, userId, battle && battle.currentTurn]);

  useEffect(() => {
    if (!battleId || !userId) return;
    // Solo guardar el contador si es mi turno
    if (battle && battle.currentTurn === userId) {
      localStorage.setItem(`correctCounter_${battleId}_${userId}`, correctCounter);
    }
  }, [correctCounter, battleId, userId, battle && battle.currentTurn]);

  useEffect(() => {
    if (!battle) return;
    if (!isMyTurn) {
      setCorrectCounter(0);
      if (battleId && userId) localStorage.setItem(`correctCounter_${battleId}_${userId}`, 0);
    }
  }, [battle, isMyTurn, battleId, userId]);

  // Fetch helpers
  const fetchActiveBattles = async () => {
    try {
      setLoading(true);
<<<<<<< HEAD
      const response = await axios.get(
        `http://localhost:3000/api/classic/battles`,
        {
          params: { userId },
        }
      );
      setActiveBattles(response.data.battles || []);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener batallas activas:", err);
      setError("No se pudieron cargar las batallas activas");
      setLoading(false);
    }
=======
      const { data } = await axios.get(`http://localhost:3000/api/classic/battles`, { params: { userId } });
      setActiveBattles(data.battles || []);
    } catch (err) {
      setError('No se pudieron cargar las batallas activas');
    } finally { setLoading(false); }
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
  };
  const fetchFriends = async () => {
    try {
<<<<<<< HEAD
      const response = await axios.get("http://localhost:3000/api/friends", {
        params: { userId },
      });
      setFriends(response.data.friends || []);
    } catch (err) {
      console.error("Error al obtener amigos:", err);
    }
  };

  const startNewBattle = async () => {
    if (!selectedFriend) {
      setError("Selecciona un amigo para desafiar");
      return;
    }

    try {
      setLoading(true);
      console.log("Iniciando batalla con:", {
        miUserId: userId,
        tipoMiUserId: typeof userId,
        amigoSeleccionado: selectedFriend.user_id,
        tipoAmigoId: typeof selectedFriend.user_id,
      });

      const response = await axios.post(
        "http://localhost:3000/api/classic/start",
        {
          userId,
          opponentId: selectedFriend.user_id,
        }
      );

      console.log("Respuesta al crear batalla:", response.data);

      if (response.data.success) {
        console.log(
          `Batalla creada con éxito, redirigiendo a: /Classic/${response.data.battleId}`
        );
        sessionStorage.setItem("newBattle", response.data.battleId);
        navigate(`/Classic/${response.data.battleId}`);
      }
    } catch (err) {
      console.error("Error al iniciar batalla:", err);
      setError("No se pudo iniciar la batalla");
    } finally {
      setLoading(false);
    }
=======
      const { data } = await axios.get('http://localhost:3000/api/friends', { params: { userId } });
      setFriends(data.friends || []);
    } catch {}
  };
  const fetchOpponentInfo = async (opponentId) => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/users/${opponentId}`);
      setOpponentInfo(data);
    } catch {}
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
  };
  const fetchBattleState = useCallback(async () => {
    if (!battleId) return;
    try {
      setLoading(true);
<<<<<<< HEAD
      const response = await axios.get(
        `http://localhost:3000/api/classic/battle/${battleId}/state`
      );
      if (response.data.success) {
        setBattle(response.data.battle);

        if (response.data.history) {
          setGameHistory(response.data.history);
        }

        const currentTurn = response.data.battle.currentTurn;

        console.log("Datos para comparación de turnos:", {
          userId: userId,
          userIdType: typeof userId,
          currentTurn: currentTurn,
          currentTurnType: typeof currentTurn,
          usuarioEnLocalStorage: localStorage.getItem("userId"),
          tipoEnLocalStorage: typeof localStorage.getItem("userId"),
          sonIgualesTripleIgual: userId === currentTurn,
          sonIgualesDobleIgual: userId == currentTurn,
          user_id1: response.data.battle.user_id1,
          user_id2: response.data.battle.user_id2,
        });

        const isCurrentUserTurn = currentTurn === userId;

        if (isCurrentUserTurn) {
          setMessage("Es tu turno");

          const userCategories =
            response.data.battle.user_id1 === userId
              ? response.data.battle.user1Categories
              : response.data.battle.user2Categories;

          const availableCats = userCategories.filter((cat) => !cat.completed);
          setAvailableCategories(availableCats);
=======
      const { data } = await axios.get(`http://localhost:3000/api/classic/battle/${battleId}/state`);
      if (data.success) {
        setBattle(data.battle);
        if (data.history) setGameHistory(data.history);
        const isCurrentUserTurn = data.battle.currentTurn === userId;
        if (isCurrentUserTurn) {
          setMessage('Es tu turno');
          const userCategories = data.battle.user_id1 === userId ? data.battle.user1Categories : data.battle.user2Categories;
          setAvailableCategories(userCategories.filter(cat => !cat.completed));
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
        } else {
          setMessage("Esperando a que juegue el oponente");
        }
<<<<<<< HEAD

        const opponentId =
          response.data.battle.user_id1 === userId
            ? response.data.battle.user_id2
            : response.data.battle.user_id1;

        fetchOpponentInfo(opponentId);
      }
    } catch (err) {
      console.error("Error al cargar estado de la batalla:", err);
      setError("No se pudo cargar la batalla");
    } finally {
      setLoading(false);
    }
=======
        const opponentId = data.battle.user_id1 === userId ? data.battle.user_id2 : data.battle.user_id1;
        fetchOpponentInfo(opponentId);
      }
    } catch {
      modalAfterWin();
      setError('No se pudo cargar la batalla');
    } finally { setLoading(false); }
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
  }, [battleId, userId]);
  useEffect(() => { fetchBattleState(); }, [fetchBattleState]);

<<<<<<< HEAD
  useEffect(() => {
    fetchBattleState();
  }, [fetchBattleState]);

  useEffect(() => {
    if (
      battleId &&
      isMyTurn &&
      !question &&
      !showWheel &&
      availableCategories.length > 0
    ) {
      setShowWheel(true);
    }
  }, [battleId, isMyTurn, question, availableCategories]);

  const fetchOpponentInfo = async (opponentId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${opponentId}`
      );
      setOpponentInfo(response.data);
    } catch (err) {
      console.error("Error al obtener información del oponente:", err);
    }
=======
  // Acciones de juego
  const startNewBattle = async () => {
    if (!selectedFriend) return setError('Selecciona un amigo para desafiar');
    try {
      setLoading(true);
      const { data } = await axios.post('http://localhost:3000/api/classic/start', { userId, opponentId: selectedFriend.user_id });
      if (data.success) {
        sessionStorage.setItem('newBattle', data.battleId);
        navigate(`/Classic/${data.battleId}`);
      }
    } catch { setError('No se pudo iniciar la batalla'); }
    finally { setLoading(false); }
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
  };
  const loadQuestion = async (categoryId) => {
    try {
      setLoading(true);
<<<<<<< HEAD
      const response = await axios.get(
        `http://localhost:3000/api/classic/battle/${battleId}/questions`,
        {
          params: { categoryId },
        }
      );

      if (response.data.success) {
        setQuestion(response.data.question);
        setAnswers(response.data.answers);
        setSelectedCategory(categoryId);
      }
    } catch (err) {
      console.error("Error al cargar pregunta:", err);
      setError("No se pudo cargar la pregunta");
    } finally {
      setLoading(false);
    }
=======
      const { data } = await axios.get(`http://localhost:3000/api/classic/battle/${battleId}/questions`, { params: { categoryId } });
      if (data.success) {
        setQuestion(data.question);
        // Shuffle answers before setting state
        const shuffledAnswers = shuffleArray(data.answers);
        setAnswers(shuffledAnswers);
        setSelectedCategory(categoryId);
      }
    } catch { setError('No se pudo cargar la pregunta'); }
    finally { setLoading(false); }
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
  };
  const handleCategorySelect = async (categoryId) => {
    if (canSelectCategory) {
      try {
<<<<<<< HEAD
        const response = await axios.post(
          `http://localhost:3000/api/classic/battle/${battleId}/select-category`,
          {
            categoryId,
            userId,
          }
        );

        if (response.data.success) {
          setCanSelectCategory(false);

          const newHistoryItem = {
            userId: userId,
            action: "mark_category",
            categoryId: categoryId,
            timestamp: new Date().toISOString(),
          };

          setGameHistory((prevHistory) => [...prevHistory, newHistoryItem]);

          setMessage("¡Categoría completada! Has ganado un punto.");

          fetchBattleState();
        }
      } catch (err) {
        console.error("Error al seleccionar categoría:", err);
        setError("No se pudo seleccionar la categoría");
      }
=======
        const { data } = await axios.post(`http://localhost:3000/api/classic/battle/${battleId}/select-category`, { categoryId, userId });
        if (data.success) {
          setCanSelectCategory(false);
          setGameHistory(prev => [...prev, { userId, action: 'mark_category', categoryId, timestamp: new Date().toISOString() }]);
          setMessage('¡Categoría completada! Has ganado un punto.');
          fetchBattleState();
        }
      } catch { setError('No se pudo seleccionar la categoría'); }
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
    } else {
      loadQuestion(categoryId);
    }
  };
  const handleAnswerQuestion = async (answerId) => {
    try {
      setLoading(true);
<<<<<<< HEAD
      const response = await axios.post(
        `http://localhost:3000/api/classic/battle/${battleId}/answer`,
        {
          questionId: question.question_id,
          answerId,
          userId,
        }
      );

      if (response.data.success) {
        setMessage(response.data.message);

        const newHistoryItem = {
          userId: userId,
          action: "answer",
          correct: response.data.correct,
          questionId: question.question_id,
          categoryId: selectedCategory,
          timestamp: new Date().toISOString(),
        };

        setGameHistory((prevHistory) => [...prevHistory, newHistoryItem]);

        if (response.data.correct) {
=======
      const { data } = await axios.post(`http://localhost:3000/api/classic/battle/${battleId}/answer`, { questionId: question.question_id, answerId, userId });
      if (data.success) {
        setMessage(data.message);
        setGameHistory(prev => [...prev, { userId, action: 'answer', correct: data.correct, questionId: question.question_id, categoryId: selectedCategory, timestamp: new Date().toISOString() }]);
        if (data.correct) {
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
          const newCorrectCount = correctCounter + 1;
          setCorrectCounter(newCorrectCount);
          localStorage.setItem(`correctCounter_${battleId}_${userId}`, newCorrectCount);
          if (newCorrectCount >= 3) {
            setCanSelectCategory(true);
            setMessage(
              "¡Tres respuestas correctas consecutivas! Selecciona una categoría para marcar."
            );
            setCorrectCounter(0);
            localStorage.setItem(`correctCounter_${battleId}_${userId}`, 0);
            setShowWheel(false);
            setQuestion(null);
          } else {
            setMessage(
              `¡Respuesta correcta! ${newCorrectCount}/3 respuestas correctas consecutivas.`
            );
            setQuestion(null);
          }
        } else {
          setCorrectCounter(0);
<<<<<<< HEAD
          setMessage("Respuesta incorrecta. Turno del oponente.");
=======
          localStorage.setItem(`correctCounter_${battleId}_${userId}`, 0);
          setMessage('Respuesta incorrecta. Turno del oponente.');
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
          setQuestion(null);
          setSelectedCategory(null);
          fetchBattleState(); // <-- Forzar actualización inmediata del estado para que el render muestre "no es tu turno"
        }
      }
<<<<<<< HEAD
    } catch (err) {
      console.error("Error al responder pregunta:", err);
      setError("No se pudo procesar la respuesta");
    } finally {
      setLoading(false);
    }
=======
    } catch { setError('No se pudo procesar la respuesta'); }
    finally { setLoading(false); }
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
  };
  const handleContinueAnswering = () => {
<<<<<<< HEAD
    if (battle?.winner != null) {
      setMessage("The game has ended. You cannot continue answering.");
      return;
    }
    if (selectedCategory) {
      loadQuestion(selectedCategory);
    }
=======
    if (battle?.winner != null) return setMessage('The game has ended. You cannot continue answering.');
    if (selectedCategory) loadQuestion(selectedCategory);
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
  };
  const handlePassTurn = async () => {
    try {
      setLoading(true);
<<<<<<< HEAD
      const response = await axios.post(
        `http://localhost:3000/api/classic/battle/${battleId}/pass-turn`,
        {
          userId,
        }
      );

      if (response.data.success) {
        setMessage("Has pasado el turno al oponente");
        fetchBattleState();
      }
    } catch (err) {
      console.error("Error al pasar turno:", err);
      setError("No se pudo pasar el turno");
    } finally {
      setLoading(false);
    }
=======
      const { data } = await axios.post(`http://localhost:3000/api/classic/battle/${battleId}/pass-turn`, { userId });
      if (data.success) {
        setMessage('Has pasado el turno al oponente');
        fetchBattleState();
      }
    } catch { setError('No se pudo pasar el turno'); }
    finally { setLoading(false); }
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
  };
  const saveGameResult = async (isWinner) => {
    try {
<<<<<<< HEAD
      await axios.post(
        `http://localhost:3000/api/classic/battle/${battleId}/result`,
        {
          userId,
          isWinner,
          history:
            JSON.stringify(battle.user2Categories) +
            JSON.stringify(battle.user1Categories),
        }
      );
    } catch (err) {
      console.error("Error al guardar resultado de la partida:", err);
    }
=======
      await axios.post(`http://localhost:3000/api/classic/battle/${battleId}/result`, { userId, isWinner });
      if(isWinner){navigate('/Home')}
    } catch {}
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
  };
  const handleStartWheel = () => { if (isMyTurn && !question) setShowWheel(true); };
  const handleFinishSpin = (segment) => {
<<<<<<< HEAD
    setIsWheelSpinning(false);

    const selectedCat = availableCategories.find(
      (cat) =>
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

=======
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
    setShowWheel(false);
    const selectedCat = availableCategories.find(cat => cat.name.toLowerCase().trim() === segment.toLowerCase().trim());
    if (selectedCat) {
      canSelectCategory ? handleCategorySelect(selectedCat.category_id) : loadQuestion(selectedCat.category_id);
    } else if (availableCategories.length > 0) {
      canSelectCategory ? handleCategorySelect(availableCategories[0].category_id) : loadQuestion(availableCategories[0].category_id);
    }
  };

<<<<<<< HEAD
  const getCategoryNames = () => {
    return availableCategories.map((cat) => cat.name);
  };

  const getRandomWinningSegment = () => {
    if (availableCategories.length === 0) return "";
    const randomIndex = Math.floor(Math.random() * availableCategories.length);
    return availableCategories[randomIndex].name;
  };

  const renderCategories = () => {
    if (!battle) return null;

    const categories =
      battle.user_id1 === userId
        ? battle.user1Categories
        : battle.user2Categories;

=======
  // Render helpers
  const getCategoryNames = () => availableCategories.map(cat => cat.name);
  const getRandomWinningSegment = () => availableCategories.length === 0 ? '' : availableCategories[Math.floor(Math.random() * availableCategories.length)].name;

  const renderCategories = () => {
    if (!battle) return null;
    const categories = battle.user_id1 === userId ? battle.user1Categories : battle.user2Categories;
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
    return (
      <div className={styles.categoriesContainer}>
        <h3>Categorías</h3>
        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
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
            >
              <span>{category.name}</span>
              {category.completed && (
                <span className={styles.checkMark}>✓</span>
              )}
            </div>
          ))}
        </div>
        {isMyTurn && !question && !canSelectCategory && (
          <button className={styles.wheelButton} onClick={handleStartWheel} disabled={availableCategories.length === 0}>
            Usar ruleta para elegir categoría
          </button>
        )}
      </div>
    );
  };

  const renderQuestion = () => {
    if (!question || !isMyTurn) return null;
    const opponentCategories = battle?.user_id1 === userId ? battle?.user2Categories : battle?.user1Categories;
    const opponentCompletedCount = opponentCategories?.filter(c => c.completed).length || 0;
    if (opponentCompletedCount >= 4) return null;
    return (
      <div className={styles.questionContainer}>
        <h3>Pregunta:</h3>
        <p className={styles.questionText}>{question.questiontext}</p>
        <div className={styles.answersList}>
<<<<<<< HEAD
          {answers.map((answer) => (
            <button
              key={answer.answer_id}
              className={styles.answerButton}
              onClick={() => handleAnswerQuestion(answer.answer_id)}
            >
=======
          {answers.map(answer => (
            <button key={answer.answer_id} className={styles.answerButton} onClick={() => handleAnswerQuestion(answer.answer_id)}>
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
              {answer.text}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderBattleStatus = () => {
    if (!battle) return null;
<<<<<<< HEAD

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

=======
    const myCategories = battle.user_id1 === userId ? battle.user1Categories : battle.user2Categories;
    const opponentCategories = battle.user_id1 === userId ? battle.user2Categories : battle.user1Categories;
    const myCompletedCount = myCategories.filter(c => c.completed).length;
    const opponentCompletedCount = opponentCategories.filter(c => c.completed).length;
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
    if (myCompletedCount >= 4) {
      if (
        gameHistory.length > 0 &&
        !gameHistory.some((h) => h.action === "game_end")
      ) {
        saveGameResult(true);
<<<<<<< HEAD
        setGameHistory((prevHistory) => [
          ...prevHistory,
          {
            action: "game_end",
            winner: userId,
            timestamp: new Date().toISOString(),
          },
        ]);
=======
        setGameHistory(prev => [...prev, { action: 'game_end', winner: userId, timestamp: new Date().toISOString() }]);
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
        setShowWheel(false);
      }
      return (
        <div className={`${styles.battleResult} ${styles.winner}`}>
          <h2>¡Felicidades! Has ganado la partida</h2>
<<<<<<< HEAD
          <button
            className={styles.backButton}
            onClick={() => navigate("/Play")}
          >
            Volver al menú
          </button>
=======
          <button className={styles.backButton} onClick={() => navigate('/Play')}>Volver al menú</button>
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
        </div>
      );
    }
    if (opponentCompletedCount >= 4) {
      if (
        gameHistory.length > 0 &&
        !gameHistory.some((h) => h.action === "game_end")
      ) {
        saveGameResult(false);
<<<<<<< HEAD
        setGameHistory((prevHistory) => [
          ...prevHistory,
          {
            action: "game_end",
            winner:
              battle.user_id1 === userId ? battle.user_id2 : battle.user_id1,
            timestamp: new Date().toISOString(),
          },
        ]);
=======
        setGameHistory(prev => [...prev, { action: 'game_end', winner: battle.user_id1 === userId ? battle.user_id2 : battle.user_id1, timestamp: new Date().toISOString() }]);
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
        setShowWheel(false);
      }
      return (
        <div className={`${styles.battleResult} ${styles.loser}`}>
<<<<<<< HEAD
          <h2>
            Has perdido la partida contra{" "}
            {opponentInfo?.username || "tu oponente"}
          </h2>
          <button
            className={styles.backButton}
            onClick={() => navigate("/Play")}
          >
            Volver al menú
          </button>
=======
          <h2>Has perdido la partida contra {opponentInfo?.username || 'tu oponente'}</h2>
          <button className={styles.backButton} onClick={() => navigate('/Play')}>Volver al menú</button>
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
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

<<<<<<< HEAD
  const renderClassicModeHome = () => {
    return (
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
                      selectedFriend &&
                      selectedFriend.user_id === friend.user_id
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
                  No tienes amigos para desafiar. ¡Agrega algunos amigos
                  primero!
                </p>
              )}
            </div>
=======
  const renderClassicModeHome = () => (
    <div className={styles.classicModeHome}>
      <h2>Modo Clásico</h2>
      <div className={styles.activeBattlesSection}>
        <h3>Tus partidas activas</h3>
        {activeBattles.length > 0 ? (
          <div className={styles.activeBattlesList}>
            {activeBattles.map(battle => (
              <div key={battle.battle_id} className={styles.battleItem} onClick={() => navigate(`/Classic/${battle.battle_id}`)}>
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
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
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
                <div key={friend.user_id} className={`${styles.friendItem} ${selectedFriend && selectedFriend.user_id === friend.user_id ? styles.selected : ''}`} onClick={() => setSelectedFriend(friend)}>
                  <img src={friend.profile_picture || 'defaultProfileImage.png'} alt={friend.username} className={styles.friendAvatar} />
                  <span className={styles.friendName}>{friend.username}</span>
                </div>
              ))
            ) : (
              <p className={styles.noFriends}>No tienes amigos para desafiar. ¡Agrega algunos amigos primero!</p>
            )}
          </div>
        </div>
        <button className={styles.startBattleButton} disabled={!selectedFriend || friends.length === 0} onClick={startNewBattle}>
          Iniciar Batalla
        </button>
      </div>
    </div>
  );

  // Función para mostrar el modal de resultado y redirigir
  const modalAfterWin = (win = null) => {
    if (showResultModal) return;
    if (win === true) {
      setResultMessage('¡Felicidades! Has ganado la partida');
    } else if (win === false) {
      setResultMessage(`Has perdido la partida contra ${opponentInfo?.username || 'tu oponente'}`);
    } else {
      setResultMessage('La partida ha finalizado');
    }
    setShowResultModal(true);
    timeoutRef.current = setTimeout(() => {
      setShowResultModal(false);
      navigate('/Play');
    }, 3000);
  };

  // Evitar doble llamado a saveGameResult si la batalla ya está completada
  useEffect(() => {
    if (!battle) return;
    // Solo guardar resultado si la batalla está en curso
    if (battle.status !== 'ongoing') return;
    if ((battle.user_id1 === userId || battle.user_id2 === userId)) {
      const myCategories = battle.user_id1 === userId ? battle.user1Categories : battle.user2Categories;
      const opponentCategories = battle.user_id1 === userId ? battle.user2Categories : battle.user1Categories;
      const myCompletedCount = myCategories.filter(c => c.completed).length;
      const opponentCompletedCount = opponentCategories.filter(c => c.completed).length;
      // Solo llamar a saveGameResult si el modal ya se mostró (es decir, después de 3 segundos)
      if ((myCompletedCount === 4 || opponentCompletedCount === 4) && !showResultModal) {
        saveGameResult(myCompletedCount === 4);
      }
    }
  }, [battle, userId, showResultModal]);

  if (!battleId) {
    return (
      <div className={styles.classicModeContainer}>
        {loading ? <div className={styles.loading}>Cargando...</div> : error ? <div className={styles.errorMessage}>{error}</div> : renderClassicModeHome()}
      </div>
    );
  }
  if (loading && !battle) return <div className={styles.loading}>Cargando...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;

  return (
    <div className={styles.classicModeContainer}>
<<<<<<< HEAD
=======
      {showResultModal && (
        <div className={styles.resultModal}>
          <div className={styles.resultModalContent}>
            <h2>{resultMessage}</h2>
            <p>Serás redirigido al menú principal...</p>
          </div>
        </div>
      )}
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
      <h2>Modo Clásico</h2>
      {message && <div className={styles.messageBox}>{message}</div>}
<<<<<<< HEAD
      <button
        className={styles.backButton}
        onClick={() => navigate("/Play")}
        aria-label="Volver atrás"
      >
=======
      <button className={styles.backButton} onClick={() => navigate(-1)} aria-label="Volver atrás">
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
        <img src="../arrow-left-solid.svg" alt="Volver" />
      </button>
      {renderBattleStatus()}
      {showWheel || (isMyTurn && !question && !canSelectCategory) ? (
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
<<<<<<< HEAD
          <button
            className={styles.cancelWheelButton}
            onClick={() => setShowWheel(false)}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <>
          {canSelectCategory ? (
            <div className={styles.categorySelection}>
              <h3>
                ¡Respuestas correctas! Selecciona una categoría para marcar:
              </h3>
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
                  <h3>
                    Esperando a que {opponentInfo?.username || "el oponente"}{" "}
                    juegue su turno...
                  </h3>
                </div>
              )}

              {correctCounter > 0 && question === null && (
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
=======
        </div>
      ) : canSelectCategory ? (
        <div className={styles.categorySelection}>
          <h3>¡Respuestas correctas! Selecciona una categoría para marcar:</h3>
          {renderCategories()}
        </div>
      ) : (
        <>
          {renderQuestion()}
          {!isMyTurn && (
            <div className={styles.waitingMessage}>
              <h3>Esperando a que {opponentInfo?.username || 'el oponente'} juegue su turno...</h3>
            </div>
>>>>>>> a9a6da4ef1a0cf2c4a3e882e90ad2033dbf48fe5
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
