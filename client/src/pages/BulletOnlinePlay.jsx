import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styles from "./css/GamePlay.module.css";
import BackButton from "../components/BackButton";

const BulletOnlinePlay = () => {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [allQuestionsChecked, setAllQuestionsChecked] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [timePenalty, setTimePenalty] = useState(null);
  const [opponentScore, setOpponentScore] = useState(null);
  const [winner, setWinner] = useState(null);
  const [myTurn, setMyTurn] = useState(false);
  const [socket, setSocket] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;

  // Fetch battle state
  const fetchBattle = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/bullet-online/${battleId}/state`
      );
      if (res.data.success) {
        setBattle(res.data.battle);
        setMyTurn(res.data.battle.current_turn === userId);
        setOpponentScore(
          userId === res.data.battle.user_id1
            ? res.data.battle.score2
            : res.data.battle.score1
        );
        setWinner(res.data.battle.winner_id);
      }
    } catch (err) {
      setError("No se pudo cargar la partida");
    } finally {
      setLoading(false);
    }
  }, [battleId, userId]);

  // WebSocket connection
  useEffect(() => {
    if (!battleId) return;
    const s = io("http://localhost:3000");
    setSocket(s);
    s.on("connect", async () => {
      await axios.post(
        `http://localhost:3000/api/bullet-online/${battleId}/join`,
        { socketId: s.id }
      );
    });
    s.on("bulletOnlineUpdated", (data) => {
      if (data.battleId === Number(battleId) || data.battleId === battleId) {
        fetchBattle();
      }
    });
    return () => s.disconnect();
  }, [battleId, fetchBattle]);

  useEffect(() => {
    fetchBattle();
  }, [fetchBattle]);

  // Timer logic
  useEffect(() => {
    let timerId;
    if (timerActive && timer > 0) {
      timerId = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      handleTimeUp();
    }
    return () => clearInterval(timerId);
  }, [timerActive, timer]);

  // Fetch question
  const fetchQuestion = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/FetchBulletQuestion"
      );
      if (res.data.allQuestionChecked) {
        setAllQuestionsChecked(true);
        setQuestion(null);
        setAnswers([]);
      } else {
        setQuestion(res.data.question);
        setAnswers(res.data.bullet_answers.sort(() => Math.random() - 0.5));
        setSelectedIndex(null);
        setIsAnswerCorrect(null);
      }
    } catch (err) {
      setError("No se pudo cargar la pregunta");
    }
  }, []);

  // Start turn
  useEffect(() => {
    if (myTurn && battle && battle.status === "ongoing") {
      setScore(0);
      setTimer(60);
      setTimerActive(true);
      fetchQuestion();
    } else {
      setTimerActive(false);
    }
  }, [myTurn, battle, fetchQuestion]);

  // Handle answer
  const isCorrect = async (answer, index) => {
    setSelectedIndex(index);
    setIsAnswerCorrect(answer.is_correct);
    if (answer.is_correct) {
      setScore((s) => s + 1);
      setTimeout(async () => {
        setSelectedIndex(null);
        setIsAnswerCorrect(null);
        await axios.post("http://localhost:3000/api/CheckBulletQuestion", {
          questionId: question.bullet_question_id,
        });
        fetchQuestion();
      }, 300);
    } else {
      const newTime = Math.max(0, timer - 10);
      setTimer(newTime);
      setTimePenalty(-10);
      setTimeout(() => setTimePenalty(null), 2000);
      if (newTime <= 0) {
        setTimeout(async () => {
          await handleTimeUp();
        }, 300);
      } else {
        setTimeout(async () => {
          setSelectedIndex(null);
          setIsAnswerCorrect(null);
          await axios.post("http://localhost:3000/api/CheckBulletQuestion", {
            questionId: question.bullet_question_id,
          });
          fetchQuestion();
        }, 300);
      }
    }
  };

  // End turn
  const handleTimeUp = async () => {
    setTimerActive(false);
    setFinalScore(score);
    setShowScoreModal(true);
    // Save score and pass turn
    await axios.post(
      `http://localhost:3000/api/bullet-online/${battleId}/score`,
      { userId, score }
    );
    handleAllQuestionsChecked();
  };

  // UI
  if (loading) return <div className={styles.loading}>Cargando...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;
  if (!battle) return null;

  // Show winner
  if (battle.status === "completed") {
    let msg = "";
    if (battle.winner_id === userId) msg = "¡Ganaste!";
    else if (battle.winner_id) msg = "Perdiste.";
    else msg = "Empate.";
    return (
      <div className={styles.statusCard}>
        <h2 className={styles.statusTitle}>Resultado</h2>
        <div className={styles.statusSubtitle}>{msg}</div>
        <div className={styles.statusScore}>
          Tu puntaje: {userId === battle.user_id1 ? battle.score1 : battle.score2}
        </div>
        <div className={styles.statusScore}>
          Puntaje rival: {userId === battle.user_id1 ? battle.score2 : battle.score1}
        </div>
        <button className={styles.statusButton} onClick={() => navigate("/Play")}>Volver al menú</button>
      </div>
    );
  }

  // Wait for your turn
  if (!myTurn) {
    return (
      <div className={styles.statusCard}>
        <h2 className={styles.statusTitle}>Esperando tu turno...</h2>
        <div className={styles.statusSubtitle}>El oponente está jugando.</div>
        <div className={styles.statusScore}>Puntaje rival: {opponentScore ?? "-"}</div>
        <button className={styles.statusButton} onClick={() => navigate("/Play")}>Volver al menú</button>
      </div>
    );
  }

  const handleAllQuestionsChecked = async () => {
    await axios.post("http://localhost:3000/api/UncheckBulletQuestion" );
  }

  // All questions checked
  if (allQuestionsChecked) {
    handleAllQuestionsChecked().then()
    return (
      <div className={styles.gameContainer}>
        <h2>No hay más preguntas disponibles.</h2>
        <button className={styles.modalButton} onClick={() => navigate("/Play")}>Volver al menú</button>
      </div>
    );
  }

  // Game UI
  const timePercentage = (timer / 60) * 100;
  return (
    <div className={styles.gameContainer}>
      <BackButton onClick={() => navigate("/Play")} ariaLabel="Volver al menú" />
      <div className={styles.header}>
        <p className={styles.score}>Score: {score}</p>
        <div className={styles.timerBarContainer}>
          <div
            className={timer <= 10 ? styles.timerBarWarning : styles.timerBar}
            style={{ width: `${timePercentage}%` }}
          />
          {timePenalty && (
            <div className={styles.timePenaltyIndicator}>{timePenalty} seg</div>
          )}
        </div>
        <div className={styles.timeDisplay}>{timer}s</div>
      </div>
      <div className={styles.questionContainer}>
        <h1 className={styles.titleDePrueba}>{question?.bullet_text}</h1>
      </div>
      <div className={styles.answersContainer} key={question?.bullet_question_id}>
        {answers.map((ans, index) => {
          let buttonClass = styles.buttonAnswers;
          if (selectedIndex === index) {
            buttonClass += ans.is_correct ? ` ${styles.correct}` : ` ${styles.incorrect}`;
          }
          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => isCorrect(ans, index)}
              disabled={selectedIndex !== null}
            >
              {ans.answer_text}
            </button>
          );
        })}
      </div>
      {showScoreModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.scoreModal}>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>¡Turno finalizado!</h2>
              <div className={styles.scoreDisplay}>
                <span className={styles.scoreLabel}>Tu puntuación:</span>
                <span className={styles.finalScore}>{finalScore}</span>
              </div>
              <button className={styles.modalButton} onClick={() => setShowScoreModal(false)}>
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulletOnlinePlay;

