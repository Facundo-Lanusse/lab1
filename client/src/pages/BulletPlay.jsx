import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/GamePlay.module.css";
import NavigationBar from "../components/NavigationBar";

const BulletPlay = () => {
    const navigate = useNavigate();

    const [MainQuestion, setMainQuestion] = useState('');
    const [questionId, setQuestionId] = useState();
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [timerActive, setTimerActive] = useState(false);
    const maxTime = 60; // Tiempo máximo en segundos

    const FetchQuestionAndAnswers = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/FetchBulletQuestion");

            if(res.data.allQuestionChecked){
                await handleQuestionUncheck()
                alert('Todas las preguntas respondidas bien')
                navigate('/Home')
            }
            else{
                const buttons = document.getElementsByClassName(styles.buttonAnswers);
                Array.from(buttons).forEach(button => {
                    button.classList.remove(styles.correct, styles.incorrect);
                    button.style.transform = 'scale(1)';
                });

                setMainQuestion(res.data.question.bullet_text);
                setQuestionId(res.data.question.bullet_question_id);
                console.log(res.data.bullet_answers)
                const shuffledAnswers = res.data.bullet_answers.sort(() => Math.random() - 0.5);
                setAnswers(shuffledAnswers);
                setSelectedIndex(null);
                setIsAnswerCorrect(null);
            }

        } catch (error) {
            console.log('Fallo la llamada a la consulta', error);
        }
    }, [navigate]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/Login');
        }
        FetchQuestionAndAnswers();
        setTimerActive(true);
        setTimeRemaining(maxTime);
    }, [FetchQuestionAndAnswers]);

    useEffect(() => {
        let timerId;

        if (timerActive && timeRemaining > 0) {
            timerId = setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            handleTimeUp();
        }

        return () => {
            clearInterval(timerId);
        };
    }, [timerActive, timeRemaining]);

    const handleTimeUp = async () => {
        setTimerActive(false);
        await handleScoreUpload();
        navigate('/Home');
    };

    const handleQuestionCheck = useCallback(async () => {
        const res = await axios.post("http://localhost:3000/api/CheckBulletQuestion", {
            questionId: questionId,
        });
        console.log(res.data.message);
        console.log(res.data.id);
    }, [questionId]);

    const handleQuestionUncheck = useCallback(async () => {
        await axios.post("http://localhost:3000/api/UncheckBulletQuestion");
        navigate('/Home');
    }, [navigate]);

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
                setTimeRemaining(currentTime => currentTime - 10);
                await handleQuestionCheck();
                await FetchQuestionAndAnswers();
            }, 1000);
        }
    };

    async function handleScoreUpload(){
        const userId = JSON.parse(localStorage.getItem('user')).user_id
        const scoreMessage = await axios.post("http://localhost:3000/api/UploadUserBulletBestScore", {score, userId});
        console.log(scoreMessage.data.message);

    }

    async function handleGoBackClick() {
        setTimerActive(false);
        await handleQuestionUncheck();
        navigate('/Play');
    }

    const timePercentage = (timeRemaining / maxTime) * 100;

    return (
        <div className={styles.gameContainer}>
            <div className={styles.header}>
                <img
                    className={styles.arrowLeftSolid1Icon}
                    alt="Back"
                    src="arrow-left-solid.svg"
                    onClick={() => handleGoBackClick()}
                />
                <p className={styles.score}>Score: {score}</p>

                {/* Barra de tiempo en vez del temporizador numérico */}
                <div className={styles.timerBarContainer}>
                    <div
                        className={timeRemaining <= 10 ? styles.timerBarWarning : styles.timerBar}
                        style={{ width: `${timePercentage}%` }}
                    />
                </div>
            </div>
            <div className={styles.questionContainer}>
                <h1 className={styles.titleDePrueba}>{MainQuestion}</h1>
            </div>
            <div className={styles.answersContainer} key={questionId}>
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
        </div>
    );
};

export default BulletPlay;