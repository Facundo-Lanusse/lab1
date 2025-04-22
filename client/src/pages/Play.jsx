import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/GamePlay.module.css";


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
               setMainQuestion(res.data.question.questiontext);
               setQuestionId(res.data.question.question_id);
               const shuffledAnswers = res.data.answers.sort(() => Math.random() - 0.5);
               setAnswers(shuffledAnswers);

           }

        } catch (error) {
            console.log('Fallo la llamada a la consulta', error);
        }
    }, [navigate]);

    useEffect(() => {
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
                await handleScoreUpload();
            }, 1000);
        }
    };

    async function handleScoreUpload(){
        const userId = JSON.parse(localStorage.getItem('user')).id
        const scoreMessage = await axios.post("http://localhost:3000/api/uploadUserScore", {score, userId});
        console.log(scoreMessage.data.message);
    }


    async function handleGoBackClick ()  {
        await handleQuestionUncheck()
        navigate('/home');
    }
    return (
        <div>
            <img
                className={styles.arrowLeftSolid1Icon}
                alt="Back"
                src="arrow-left-solid.svg"
                onClick={() => handleGoBackClick()}
            />
            <p className={styles.score}>Score: {score}</p>
            <div>
                <h1 className={styles.titleDePrueba}>{MainQuestion}</h1>

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
        </div>
    );
};
export default Play;