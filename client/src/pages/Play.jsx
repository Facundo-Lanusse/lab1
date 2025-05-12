import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/GamePlay.module.css";
import NavigationBar from "./NavigationBar";


const Play = () => {
    const navigate = useNavigate();

    const [MainQuestion, setMainQuestion] = useState('');
    const [questionId, setQuestionId] = useState();
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);



    const FetchQuestionAndAnswers = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/PlayQuestions");

           if(res.data.allQuestionChecked){//Si ya se respondieron todas, vuelve al home y las deschequea
               handleQuestionUncheck()
               alert('Todas las preguntas respondidas bien')
               navigate('/home')
           }
           else{
               // Removemos las clases CSS de los botones
               const buttons = document.getElementsByClassName(styles.buttonAnswers);
               Array.from(buttons).forEach(button => {
                   button.classList.remove(styles.correct, styles.incorrect);
                   button.style.transform = 'scale(1)';
               });

               // Luego cargamos la nueva pregunta
               setMainQuestion(res.data.question.questiontext);
               setQuestionId(res.data.question.question_id);
               const shuffledAnswers = res.data.answers.sort(() => Math.random() - 0.5);
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
        if (!user) { //Si no lo está lo mando a su casa
            navigate('/login');
        }
        FetchQuestionAndAnswers();
    }, [FetchQuestionAndAnswers]);

    //Marco como respondida las preguntas
    const handleQuestionCheck = useCallback(async () => {
        const res = await axios.post("http://localhost:3000/api/CheckQuestion", {
            questionId: questionId,
        });
        console.log(res.data.message);
        console.log(res.data.id);
    }, [questionId]);

    //Desmarco todas las preguntas para poder volver a jugar
    const handleQuestionUncheck = useCallback(async () => {
        await axios.post("http://localhost:3000/api/UncheckQuestion");
        navigate('/home');
    }, [navigate]);

    const isCorrect = async (answer, index) => {
        setSelectedIndex(index);
        setIsAnswerCorrect(answer.is_correct);

        if (answer.is_correct) {
            setScore(score + 1);
            setTimeout(async () => {
                setSelectedIndex(null); //Resteo el index para volver a usarlo
                setIsAnswerCorrect(null);//Resteo el buleano para volver a usarlo
                await handleQuestionCheck(); //Marco la pregunta como ya respondida
                await FetchQuestionAndAnswers();//traigo la siguiente pregunta
            }, 1000);
        } else {
            setTimeout(async () => {
                setSelectedIndex(null);
                setIsAnswerCorrect(null);
                await handleQuestionUncheck();//Desmarco a todas las preguntas
                await handleScoreUpload();//Agrego el score al ranking del usuario

            }, 1000);
        }
    };

    async function handleScoreUpload(){
        const userId = JSON.parse(localStorage.getItem('user')).id
        const scoreMessage = await axios.post("http://localhost:3000/api/uploadUserScore", {score, userId});
        console.log(scoreMessage.data.message);
        await handleSoloHistoryUpload();
    }


    async function handleGoBackClick ()  {
        await handleQuestionUncheck()
        navigate('/home');
    }

    async function handleSoloHistoryUpload() {
        const userId = JSON.parse(localStorage.getItem('user')).id
        await axios.post("http://localhost:3000/api/SetSoloHistory", {score, userId});
        console.log('Solo history uploaded', userId);
    }

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
                            {ans.text}
                        </button>
                    );
                })}
            </div>
            <NavigationBar/>
        </div>
    );
};
export default Play;