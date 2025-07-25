import React, {useCallback, useEffect, useState, useMemo} from "react";
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

    // Estados para el modo Bullet
    const [gameMode, setGameMode] = useState(null); // Cambiar a null inicialmente
    const [gameModeSet, setGameModeSet] = useState(false); // Nuevo estado para trackear si ya se estableció el modo
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [timerActive, setTimerActive] = useState(false);
    const [timePenalty, setTimePenalty] = useState(null);
    const [showScoreModal, setShowScoreModal] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const maxTime = 60;

    // Declarar handleQuestionUncheck PRIMERO
    const handleQuestionUncheck = useCallback(async () => {
        try {
            await axios.post("http://localhost:3000/api/UncheckCommunityQuestion");
            navigate('/Communities');
        } catch (error) {
            console.error("Error al desmarcar preguntas:", error);
            setError("Hubo un problema al desmarcar las preguntas. Inténtalo de nuevo.");
        }
    }, [navigate]);

    // Función para cerrar el modal de score (ahora puede usar handleQuestionUncheck)
    const handleCloseModal = useCallback(async () => {
        setShowScoreModal(false);
        // Asegurar que el uncheck se haga antes de navegar
        await handleQuestionUncheck();
        navigate('/Communities');
    }, [handleQuestionUncheck, navigate]);

    // Memoizar si es modo Bullet para evitar evaluaciones constantes
    const isBulletMode = useMemo(() => gameMode === 'Bullet', [gameMode]);

    // Memoizar los componentes de UI específicos para cada modo
    const timerUI = useMemo(() => {
        if (!isBulletMode) return null;

        return (
            <>
                {/* Barra de tiempo con indicador de penalización */}
                <div className={styles.timerBarContainer}>
                    <div
                        className={timeRemaining <= 10 ? styles.timerBarWarning : styles.timerBar}
                        style={{ width: `${(timeRemaining / maxTime) * 100}%` }}
                    />
                    {/* Mostrar penalización de tiempo */}
                    {timePenalty && (
                        <div className={styles.timePenaltyIndicator}>
                            {timePenalty} seg
                        </div>
                    )}
                </div>

                {/* Mostrar tiempo restante numéricamente */}
                <div className={styles.timeDisplay}>
                    {timeRemaining}s
                </div>
            </>
        );
    }, [isBulletMode, timeRemaining, timePenalty, maxTime]);

    // Modal unificado para ambos modos (igual al de BulletPlay.jsx)
    const scoreModal = useMemo(() => {
        if (!showScoreModal) return null;

        return (
            <div className={styles.modalOverlay}>
                <div className={styles.scoreModal}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>
                            {isBulletMode ? '¡Tiempo Agotado!' : '¡Juego Terminado!'}
                        </h2>
                        <div className={styles.scoreDisplay}>
                            <span className={styles.scoreLabel}>Tu puntuación final:</span>
                            <span className={styles.finalScore}>{finalScore}</span>
                        </div>
                        <button
                            className={styles.modalButton}
                            onClick={handleCloseModal}
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
        );
    }, [showScoreModal, isBulletMode, finalScore, handleCloseModal]);

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

    // Manejar cuando se agota el tiempo en modo Bullet
    const handleTimeUp = useCallback(async () => {
        setTimerActive(false);
        setFinalScore(score);
        setShowScoreModal(true);

        // Hacer el uncheck después de mostrar el modal para evitar problemas de renderizado
        setTimeout(async () => {
            await handleQuestionUncheck();
        }, 3000);
    }, [score, handleQuestionUncheck]);

    // Función separada SOLO para configurar el modo de juego (primera vez)
    const initializeGameMode = useCallback(async () => {
        if (!category_id || gameModeSet) return;

        try {
            const res = await axios.get(`http://localhost:3000/api/PlayCommunityQuestions/${category_id}`);

            if (res.data.gameMode) {
                setGameMode(res.data.gameMode);
                setGameModeSet(true); // Marcar que ya se estableció el modo

                // Si es modo Bullet, iniciar el timer
                if (res.data.gameMode === 'Bullet') {
                    setTimeRemaining(maxTime);
                    setTimerActive(true);
                }
            }
        } catch (error) {
            console.error('Error al obtener el modo de juego:', error);
            setError("Hubo un problema al configurar el juego. Inténtalo de nuevo.");
        }
    }, [category_id, gameModeSet, maxTime]);

    // Función optimizada SOLO para cargar preguntas (sin verificar modo)
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
                // Mostrar modal de score final para ambos modos
                setTimerActive(false);
                setFinalScore(score);
                setShowScoreModal(true);
                await handleQuestionUncheck();
            }
            else {
                // Solo actualizar la pregunta y respuestas, NO el modo de juego
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
    }, [category_id, score, handleQuestionUncheck]);

    // Optimizar la función isCorrect para reducir lag
    const isCorrect = useCallback(async (answer, index) => {
        // Prevenir clics múltiples
        if (selectedIndex !== null) return;

        setSelectedIndex(index);
        setIsAnswerCorrect(answer.is_correct);

        if (gameMode === 'Bullet') {
            // Lógica para modo Bullet
            if (answer.is_correct) {
                setScore(prevScore => prevScore + 1);
                setTimeout(async () => {
                    setSelectedIndex(null);
                    setIsAnswerCorrect(null);
                    await handleQuestionCheck();
                    await FetchQuestionAndAnswers();
                }, 250);
            } else {
                // Restar 10 segundos por respuesta incorrecta
                const newTime = Math.max(0, timeRemaining - 10);
                setTimeRemaining(newTime);

                // Mostrar penalización en la UI
                setTimePenalty(-10);
                setTimeout(() => {
                    setTimePenalty(null);
                }, 1500);

                // Si el tiempo llega a 0 o menos después de la penalización, terminar el juego
                if (newTime <= 0) {
                    setTimeout(async () => {
                        await handleTimeUp();
                    }, 250);
                } else {
                    // NO recargar la pregunta, solo resetear el estado visual como en BulletPlay
                    setTimeout(async () => {
                        setSelectedIndex(null);
                        setIsAnswerCorrect(null);
                        await handleQuestionCheck();
                        await FetchQuestionAndAnswers();
                    }, 250);
                }
            }
        } else {
            // Lógica para modo Solitary (actualizada para mostrar modal)
            if (answer.is_correct) {
                setScore(prevScore => prevScore + 1);
                setTimeout(async () => {
                    setSelectedIndex(null);
                    setIsAnswerCorrect(null);
                    await handleQuestionCheck();
                    await FetchQuestionAndAnswers();
                }, 800);
            } else {
                // En modo Solitary, mostrar modal al fallar
                setTimeout(async () => {
                    setSelectedIndex(null);
                    setIsAnswerCorrect(null);
                    setFinalScore(score);
                    await handleQuestionUncheck();
                    setShowScoreModal(true);
                }, 800);
            }
        }
    }, [selectedIndex, gameMode, timeRemaining, handleQuestionCheck, handleQuestionUncheck, FetchQuestionAndAnswers, handleTimeUp, score]);

    // Efecto para la carga inicial - SEPARADO en dos pasos
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }

        // Paso 1: Configurar el modo de juego
        if (category_id && !gameModeSet) {
            initializeGameMode();
        }
    }, [category_id, gameModeSet, navigate, initializeGameMode]);

    // Efecto separado para cargar la primera pregunta DESPUÉS de que se haya establecido el modo
    useEffect(() => {
        if (category_id && gameModeSet && gameMode) {
            FetchQuestionAndAnswers();
        }
    }, [category_id, gameModeSet, gameMode]); // Solo se ejecuta cuando el modo ya está establecido

    // Efecto para el timer del modo Bullet (optimizado)
    useEffect(() => {
        let timerId;

        if (timerActive && timeRemaining > 0 && gameMode === 'Bullet') {
            timerId = setInterval(() => {
                setTimeRemaining(prevTime => {
                    const newTime = prevTime - 1;
                    if (newTime <= 0) {
                        setTimerActive(false);
                        // Usar setTimeout para evitar problemas de concurrencia
                        setTimeout(() => handleTimeUp(), 0);
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
        }

        return () => {
            if (timerId) {
                clearInterval(timerId);
            }
        };
    }, [timerActive, gameMode, handleTimeUp]);

    // Actualizar handleGoBackClick para detener el timer
    async function handleGoBackClick() {
        setTimerActive(false);
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
                <p className={styles.score}>Score: {score}</p>

                {/* Usar el componente memoizado del timer */}
                {timerUI}
            </div>

            <div className={styles.questionContainer}>
                <h1 className={styles.titleDePrueba}>{MainQuestion}</h1>
            </div>

            <div className={styles.answersContainer} key={questionId}>
                {answers.map((answer, index) => {
                    let buttonClass = styles.buttonAnswers;

                    if (selectedIndex === index) {
                        buttonClass += answer.is_correct ? ` ${styles.correct}` : ` ${styles.incorrect}`;
                    }

                    return (
                        <button
                            key={index}
                            className={buttonClass}
                            onClick={() => isCorrect(answer, index)}
                            disabled={selectedIndex !== null}
                        >
                            {answer.answer_text}
                        </button>
                    );
                })}
            </div>

            {/* Usar el componente memoizado del modal */}
            {scoreModal}
        </div>
    );
};

export default PlayCommunityCategories;