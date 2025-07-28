import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./css/GamePlay.module.css";
import BackButton from "../components/BackButton";

const Solitary = () => {
  const navigate = useNavigate();
  const [MainQuestion, setMainQuestion] = useState("");
  const [questionId, setQuestionId] = useState();
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para cargar preguntas y respuestas
  const FetchQuestionAndAnswers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/PlayQuestions");

      if (res.data.allQuestionChecked) {
        // Si ya se respondieron todas, vuelve al home y las deschequea
        handleQuestionUncheck();
        alert("Todas las preguntas respondidas bien");
        navigate("/Play");
      } else {
        // Removemos las clases CSS de los botones
        const buttons = document.getElementsByClassName(styles.buttonAnswers);
        Array.from(buttons).forEach((button) => {
          button.classList.remove(styles.correct, styles.incorrect);
          button.style.transform = "scale(1)";
        });

        // Luego cargamos la nueva pregunta
        setMainQuestion(res.data.question.questiontext);
        setQuestionId(res.data.question.question_id);
        const shuffledAnswers = res.data.answers.sort(
          () => Math.random() - 0.5
        );
        setAnswers(shuffledAnswers);
        setSelectedIndex(null);
        setIsAnswerCorrect(null);
      }
      setLoading(false);
    } catch (error) {
      console.log("Fallo la llamada a la consulta", error);
      setLoading(false);
    }
  }, [navigate]);

  // Cargar preguntas al iniciar
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/Login");
      return;
    }
    FetchQuestionAndAnswers();
  }, [FetchQuestionAndAnswers, navigate]);

  // Marco como respondida las preguntas
  const handleQuestionCheck = useCallback(async () => {
    if (!questionId) return;

    const res = await axios.post("http://localhost:3000/api/CheckQuestion", {
      questionId: questionId,
    });
    console.log(res.data.message);
  }, [questionId]);

  // Desmarco todas las preguntas para poder volver a jugar
  const handleQuestionUncheck = useCallback(async () => {
    await axios.post("http://localhost:3000/api/UncheckQuestion");
  }, []);

  const isCorrect = async (answer, index) => {
    setSelectedIndex(index);
    setIsAnswerCorrect(answer.is_correct);

    if (answer.is_correct) {
      setScore(score + 1);
      setTimeout(async () => {
        setSelectedIndex(null); // Reseteo el index para volver a usarlo
        setIsAnswerCorrect(null); // Reseteo el booleano para volver a usarlo
        await handleQuestionCheck(); // Marco la pregunta como ya respondida
        await FetchQuestionAndAnswers(); // Traigo la siguiente pregunta
      }, 1000);
    } else {
      setTimeout(async () => {
        setSelectedIndex(null);
        setIsAnswerCorrect(null);
        await handleQuestionUncheck(); // Desmarco a todas las preguntas
        await handleScoreUpload(); // Agrego el score al ranking del usuario
        navigate("/Play"); // Volver al menú de juego
      }, 1000);
    }
  };

  async function handleScoreUpload() {
    const userId = JSON.parse(localStorage.getItem("user")).user_id;
    const username = JSON.parse(localStorage.getItem("user")).username;
    if (username.includes("Guest")) {
      return;
    }
    const scoreMessage = await axios.post(
      "http://localhost:3000/api/uploadUserScore",
      { score, userId }
    );
    console.log(scoreMessage.data.message);
    await handleSoloHistoryUpload();
  }

  async function handleGoBackClick() {
    await handleQuestionUncheck();
    navigate("/Play");
  }

  async function handleSoloHistoryUpload() {
    const userId = JSON.parse(localStorage.getItem("user")).user_id;
    console.log("Attempting to save solo history:", { score, userId });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/SetSoloHistory",
        { score, userId }
      );
      console.log("Solo history uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading solo history:", error);
      console.error("Error response:", error.response?.data);
    }
  }

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  return (
    <div className={styles.gameContainer}>
      <BackButton
        onClick={() => handleGoBackClick()}
        ariaLabel="Volver al menú de juego"
      />
      <div className={styles.header}>
        <p className={styles.score}>Score: {score}</p>
      </div>
      <div className={styles.questionContainer}>
        <h1 className={styles.titleDePrueba}>{MainQuestion}</h1>
      </div>
      <div className={styles.answersContainer} key={questionId}>
        {answers.map((ans, index) => {
          let buttonClass = styles.buttonAnswers;

          if (selectedIndex === index) {
            buttonClass += ans.is_correct
              ? ` ${styles.correct}`
              : ` ${styles.incorrect}`;
          }

          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => isCorrect(ans, index)}
              disabled={selectedIndex !== null}
            >
              {ans.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Solitary;
