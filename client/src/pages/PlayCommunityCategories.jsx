import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import styles from "./css/GamePlay.module.css";

const PlayCommunityCategories = () => {
    const navigate = useNavigate();


    const [MainQuestion, setMainQuestion] = useState('');
    const [questionId, setQuestionId] = useState();
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const { category_id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleQuestionUncheck = useCallback(async () => {
        try {
            await axios.post("http://localhost:3000/api/UncheckCommunityQuestion");
            navigate('/Communities');
        } catch (error) {
            console.error("Error al desmarcar preguntas:", error);
            setError("Hubo un problema al desmarcar las preguntas. Inténtalo de nuevo.");
        }
    }, [navigate]);


    const handleQuestionCheck = useCallback(async () => {
        try {
            console.log("id",questionId);
            const res = await axios.post("http://localhost:3000/api/CheckCommunityQuestion", {
                question_id: questionId,
            });
            console.log(res.data.message);
        } catch (error) {
            console.error("Error al marcar pregunta como respondida:", error);
        }
    }, [questionId]);

    const FetchQuestionAndAnswers = useCallback(async () => {
        if (!category_id) {
            setError("No se especificó una categoría válida.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.get(`http://localhost:3000/api/PlayCommunityQuestions/${category_id}`);

            if(res.data.allQuestionChecked) {
                await handleQuestionUncheck();
                alert('Todas las preguntas respondidas bien');
                navigate('/Communities');
            }
            else {
                const buttons = document.getElementsByClassName(styles.buttonAnswers);
                Array.from(buttons).forEach(button => {
                    button.classList.remove(styles.correct, styles.incorrect);
                    button.style.transform = 'scale(1)';
                });

                setMainQuestion(res.data.question.question_text);
                setQuestionId(res.data.question.community_question_id);
                const shuffledAnswers = res.data.answers.sort(() => Math.random() - 0.5);
                setAnswers(shuffledAnswers);
                setSelectedIndex(null);
                setIsAnswerCorrect(null);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Fallo la llamada a la consulta', error);
            if (error.response && error.response.status === 404) {
                setError("No se encontró la categoría especificada.");
            } else {
                setError("Hubo un problema al cargar las preguntas. Inténtalo de nuevo.");
            }
            setIsLoading(false);
        }
    }, [navigate, category_id, handleQuestionUncheck]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }
        const loadData = async () => {
            await FetchQuestionAndAnswers();
        };

        loadData();
    }, [FetchQuestionAndAnswers, navigate]);

    const isCorrect = async (answer, index) => {
        setSelectedIndex(index);
        setIsAnswerCorrect(answer.is_correct);

        if (answer.is_correct) {
            setScore(score + 1);
            setTimeout(async () => {
                setSelectedIndex(null);
                setIsAnswerCorrect(null);
                await handleQuestionCheck();
                await FetchQuestionAndAnswers();
            }, 1000);
        } else {
            setTimeout(async () => {
                setSelectedIndex(null);
                setIsAnswerCorrect(null);
                await handleQuestionUncheck();
            }, 1000);
        }
    };

    async function handleGoBackClick() {
        await handleQuestionUncheck();
        navigate('/Communities');
    }

    if (isLoading) {
        return (
            <div className={styles.gameContainer}>
                <div className={styles.message}>
                    <h2>Cargando preguntas...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.gameContainer}>
                <div className={styles.errorMessage}>
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button className={styles.arrowLeftSolid1Icon} onClick={() => navigate('/home')}>
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.gameContainer}>
            <div className={styles.header}>
                <img
                    className={styles.arrowLeftSolid1Icon}
                    alt="Go back"
                    src="/arrow-left-solid.svg"
                    onClick={handleGoBackClick}
                />
                <h2 className={styles.score}>Puntuación: {score}</h2>
            </div>

            <div className={styles.questionContainer}>
                <h1 className={styles.titleDePrueba}>{MainQuestion}</h1>
            </div>

            <div className={styles.answersContainer}>
                {answers.map((answer, index) => (
                    <button
                        key={index}
                        className={`${styles.buttonAnswers} ${
                            selectedIndex === index
                                ? isAnswerCorrect
                                    ? styles.correct
                                    : styles.incorrect
                                : ""
                        }`}
                        onClick={() => isCorrect(answer, index)}
                        disabled={selectedIndex !== null}
                    >
                        {answer.answer_text}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PlayCommunityCategories;