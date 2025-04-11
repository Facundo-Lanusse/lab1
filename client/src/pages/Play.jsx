import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/GamePlay.module.css";


const Play = () =>{

    const navegate = useNavigate();

    const [MainQuestion, setMainQuestion] = useState([]);
    const [questionId, setQuestionId] = useState();
    const [answers, setAnswers] = useState([]);
    const [message, setMessage] = useState('');


    useEffect(() => {
        FetchQuestionAndAnswers()
    },[]);


    const FetchQuestionAndAnswers = async () => {

        try{
            const res = await axios.get("http://localhost:3000/api/PlayQuestions")
            console.log()
            setMainQuestion(res.data.question.questiontext)
            setQuestionId(res.data.question.question_id)
            const shuffledAnswers = res.data.answers.sort(() => Math.random() - 0.5);
            setAnswers(shuffledAnswers);
            setMessage('');
            }
            catch (error){
            console.log('Fallo la llamada a la consulta', error)
            }

    }

    const handleQuestionCheck = useCallback(async () => {
        const res = await axios.post("http://localhost:3000/api/CheckQuestion", {questionId: questionId})
        console.log(res.data.message)
        console.log(res.data.id)
    }, [questionId]);

    const handleQuestionUncheck = useCallback(async  () =>{
        await axios.post("http://localhost:3000/api/UncheckQuestion")
    }, [])


    const isCorrect = (answerIsCorrect) => {
        if(answerIsCorrect.is_correct){
            handleQuestionCheck()
            setMessage('Es correcta')
            FetchQuestionAndAnswers();
        }
        else {
            setMessage('Mal')
            handleQuestionUncheck()
            alert('Mal')
            navegate('/home')
        }
    }



    //Todo:Que sume puntos del ranking al usuario
    //Todo:Si pifió la respuesta que corte el juego con un mensaje PARCIAL

    return(
        <div>
            <h1 className={styles.titleDePrueba}>{MainQuestion}</h1>

            {answers.map((ans, index) => (//Mapa de las respuestas, lo hace para cada elemento del map
                <button className={styles.buttonAnswers} key={index} onClick={() => isCorrect(ans)}>
                    {ans.text}
                </button>
            ))}
            {message && <p className={styles.message}>{message}</p>}
        </div>
    )
}
export default Play;