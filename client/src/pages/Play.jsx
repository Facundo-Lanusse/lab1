import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/GamePlay.module.css";

//Todo:Que sume puntos del ranking al usuario

const Play = () => {
    const navigate = useNavigate();

    const [MainQuestion, setMainQuestion] = useState('');
    const [questionId, setQuestionId] = useState();
    const [answers, setAnswers] = useState([]);
    const [message, setMessage] = useState('');
    const [score, setScore] = useState(0);


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

               setMessage('');
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

    const isCorrect = async (answerIsCorrect) => {
        if (answerIsCorrect.is_correct) {
            setMessage('Es correcta');
            setScore(score + 1);
            setTimeout(async () => {
                handleQuestionCheck();
                await FetchQuestionAndAnswers();
            }, 1000)
        } else {
            setMessage('Mal');
            alert('Mal');
            handleQuestionUncheck();
        }
    };




    return(
        <div>
            <p className={styles.score}>Score: {score}</p>
            <div>
            <h1 className={styles.titleDePrueba}>{MainQuestion}</h1>

            {answers.map((ans, index) => (//Mapa de las respuestas, lo hace para cada elemento del map
                <button className={styles.buttonAnswers} key={index} onClick={() => isCorrect(ans)}>
                    {ans.text}
                </button>
            ))}
            {message && <p className={styles.message}>{message}</p>}
            </div>
        </div>
    )
}
export default Play;