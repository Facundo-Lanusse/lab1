import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/GamePlay.module.css';

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

  const userId = localStorage.getItem('userId'); // Asumiendo que guardas el userId en localStorage

  // Función para cargar el estado de la batalla - disponible en todo el componente
  const fetchBattleState = useCallback(async () => {
    if (!battleId) return;

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/classic/battle/${battleId}/state`);
      if (response.data.success) {
        setBattle(response.data.battle);

        // Determinar si es nuestro turno
        if (response.data.battle.currentTurn === parseInt(userId)) {
          setMessage('Es tu turno');
        } else {
          setMessage('Esperando a que juegue el oponente');
        }

        // Obtener información sobre el oponente
        const opponentId = response.data.battle.user_id1 === parseInt(userId)
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

  // Cargar el estado de la batalla al inicio
  useEffect(() => {
    fetchBattleState();
  }, [fetchBattleState]);

  // Obtener información del oponente
  const fetchOpponentInfo = async (opponentId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/${opponentId}`);
      setOpponentInfo(response.data);
    } catch (err) {
      console.error('Error al obtener información del oponente:', err);
    }
  };

  // Cargar pregunta aleatoria de una categoría
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

  // Manejar selección de categoría
  const handleCategorySelect = async (categoryId) => {
    if (canSelectCategory) {
      try {
        const response = await axios.post(`http://localhost:3000/api/classic/battle/${battleId}/select-category`, {
          categoryId,
          userId
        });

        if (response.data.success) {
          setCanSelectCategory(false);
          setMessage('Categoría seleccionada correctamente. Esperando al oponente.');
          // Refrescar el estado de la batalla
          fetchBattleState();
        }
      } catch (err) {
        console.error('Error al seleccionar categoría:', err);
        setError('No se pudo seleccionar la categoría');
      }
    } else {
      // Si no puede seleccionar categoría, cargar una pregunta
      loadQuestion(categoryId);
    }
  };

  // Manejar respuesta a pregunta
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

        if (response.data.correct) {
          if (response.data.canSelectCategory) {
            setCanSelectCategory(true);
            setCorrectCounter(0);
          } else {
            setCorrectCounter(response.data.correctCount);
            // Cargar otra pregunta de la misma categoría
            loadQuestion(selectedCategory);
          }
        } else {
          // Si respuesta incorrecta, esperar turno del oponente
          setMessage('Respuesta incorrecta. Turno del oponente.');
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

  // Iniciar una nueva batalla con un amigo
  const startNewBattle = async (opponentId) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/api/classic/start', {
        userId,
        opponentId
      });

      if (response.data.success) {
        navigate(`/classic/${response.data.battleId}`);
      }
    } catch (err) {
      console.error('Error al iniciar batalla:', err);
      setError('No se pudo iniciar la batalla');
    } finally {
      setLoading(false);
    }
  };

  // Verificar si es el turno del usuario
  const isMyTurn = battle && battle.currentTurn === parseInt(userId);

  // Renderizar categorías disponibles
  const renderCategories = () => {
    if (!battle) return null;

    const categories = battle.user_id1 === parseInt(userId)
      ? battle.user1Categories
      : battle.user2Categories;

    return (
      <div className="categories-container">
        <h3>Categorías</h3>
        <div className="categories-grid">
          {categories.map(category => (
            <div
              key={category.category_id}
              className={`category-card ${category.completed ? 'completed' : ''}`}
              onClick={() => !category.completed && isMyTurn && handleCategorySelect(category.category_id)}
            >
              <span>{category.name}</span>
              {category.completed && <span className="check-mark">✓</span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar pregunta actual
  const renderQuestion = () => {
    if (!question || !isMyTurn) return null;

    return (
      <div className="question-container">
        <h3>Pregunta:</h3>
        <p className="question-text">{question.questiontext}</p>
        <div className="answers-list">
          {answers.map(answer => (
            <button
              key={answer.answer_id}
              className="answer-button"
              onClick={() => handleAnswerQuestion(answer.answer_id)}
            >
              {answer.text}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar estado de la batalla
  const renderBattleStatus = () => {
    if (!battle) return null;

    // Obtener mis categorías completadas
    const myCategories = battle.user_id1 === parseInt(userId)
      ? battle.user1Categories
      : battle.user2Categories;

    // Obtener categorías del oponente
    const opponentCategories = battle.user_id1 === parseInt(userId)
      ? battle.user2Categories
      : battle.user1Categories;

    const myCompletedCount = myCategories.filter(c => c.completed).length;
    const opponentCompletedCount = opponentCategories.filter(c => c.completed).length;

    // Verificar si alguien ha ganado
    if (myCompletedCount >= 4) {
      return (
        <div className="battle-result winner">
          <h2>¡Felicidades! Has ganado la partida</h2>
          <button className="back-button" onClick={() => navigate('/play')}>
            Volver al menú
          </button>
        </div>
      );
    }

    if (opponentCompletedCount >= 4) {
      return (
        <div className="battle-result loser">
          <h2>Has perdido la partida contra {opponentInfo?.username || 'tu oponente'}</h2>
          <button className="back-button" onClick={() => navigate('/play')}>
            Volver al menú
          </button>
        </div>
      );
    }

    return (
      <div className="battle-status">
        <div className="player-status">
          <h4>Tu progreso:</h4>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(myCompletedCount / 4) * 100}%` }}></div>
          </div>
          <span>{myCompletedCount}/4 categorías</span>
        </div>

        <div className="player-status">
          <h4>{opponentInfo?.username || 'Oponente'}:</h4>
          <div className="progress-bar">
            <div className="progress opponent" style={{ width: `${(opponentCompletedCount / 4) * 100}%` }}></div>
          </div>
          <span>{opponentCompletedCount}/4 categorías</span>
        </div>
      </div>
    );
  };

  if (loading && !battle) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="classic-mode-container">
      <h2>Modo Clásico</h2>

      {message && <div className="message-box">{message}</div>}

      {renderBattleStatus()}

      {canSelectCategory ? (
        <div className="category-selection">
          <h3>¡Respuestas correctas! Selecciona una categoría para marcar:</h3>
          {renderCategories()}
        </div>
      ) : (
        <>
          {isMyTurn && !question && (
            <div className="category-selection">
              <h3>Es tu turno. Selecciona una categoría para jugar:</h3>
              {renderCategories()}
            </div>
          )}

          {renderQuestion()}

          {!isMyTurn && (
            <div className="waiting-message">
              <h3>Esperando a que {opponentInfo?.username || 'el oponente'} juegue su turno...</h3>
            </div>
          )}
        </>
      )}

      {correctCounter > 0 && (
        <div className="correct-counter">
          Respuestas correctas consecutivas: {correctCounter}/3
        </div>
      )}
    </div>
  );
};

export default ClassicMode;
