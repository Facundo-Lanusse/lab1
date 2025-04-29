import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/SignUp.module.css";

function UploadQuestionForm(){

    const navegate = useNavigate();

    const [form, setForm] = useState({  //Lo que va a recibir el formulario para cargar los datos
        categoryName: "",
        questionText: "",
        answerCorrect: "",
        answerFalse1: "",
        answerFalse2: "",
        answerFalse3: ""
    });//Seteo el value inicial como vacio

    const [message, setMessage] = useState("");
    const [message1, setMessage1] = useState("");
    const [suggestedCategory, setSuggestedCategory] = useState([]);

    useEffect(() => { //Igual a las líneas de admin
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if(!user){
                navegate("/");
            }
            if (!user.is_admin) {
                navegate('/home');
            }
        }
        catch (err){
            console.log(err);
            navegate("/login");
        }


    }, [navegate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if(e.target.name === "categoryName"){
            if(value.length > 0){

            }
            setSuggestedCategory(e.target.value);
        }
    };

    const handleQuestionForm = useCallback(async () => {//Manejo la pregunta
        try {
            await axios.post("http://localhost:3000/api/uploadQuestion", form);
            setMessage(`Pregunta registrada con éxito`);
        } catch (error) {
            setMessage(error.response?.data?.error || "Error en el registro de pregunta");
        }

    }, [form]);




    const handleAnswersForm = useCallback(async () => {//Manejo las respuestas
        try {
            await axios.post("http://localhost:3000/api/uploadAnswers", form);
            setMessage1( `Respuestas registradas con éxito. `);
        } catch (error) {
            setMessage1(error.response?.data?.error || "Error en el registro de respuesta");
        }

    }, [form]);

     async function handleForm(){//Llamo a ambas funciones cuando llame a este funcion flecha
        await handleQuestionForm()
        handleAnswersForm()
    }

    return(
        <div className={styles.signUp}>
            <b className={styles.signUpPage}>Carga tus preguntas</b>

            <div className={styles.rectangleGroup}>
                <input
                    className={styles.frameChild}
                    type="text"
                    name="categoryName"
                    placeholder="Enter category name..."
                    value={form.categoryName}
                    onChange={handleChange}
                    required
                />

            </div>

            <div className={styles.rectangleGroup}>
                <input
                    className={styles.frameChild}
                    type="text"
                    name="questionText"
                    placeholder="Enter question..."
                    value={form.questionText}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.rectangleGroup}>
                <input
                    className={styles.frameChild}
                    type="text"
                    name="answerCorrect"
                    placeholder="Enter the correct answer..."
                    value={form.answerCorrect}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className={styles.rectangleGroup}>
                <input
                    className={styles.frameChild}
                    type="text"
                    name="answerFalse1"
                    placeholder="Enter a wrong answer..."
                    value={form.answerFalse1}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className={styles.rectangleGroup}>
                <input
                    className={styles.frameChild}
                    type="text"
                    name="answerFalse2"
                    placeholder="Enter a wrong answer..."
                    value={form.answerFalse2}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className={styles.rectangleGroup}>
                <input
                    className={styles.frameChild}
                    type="text"
                    name="answerFalse3"
                    placeholder="Enter a wrong answer..."
                    value={form.answerFalse3}
                    onChange={handleChange}
                    required
                />
            </div>


            <img
                className={styles.arrowLeftSolid1Icon}
                alt="Back"
                src="arrow-left-solid.svg"
                onClick={() => navegate('/home')}
            />


            {
                message1 && message && <p className={styles.message}> {message + ' y ' + message1} </p>

            }

            <button className={styles.signUpButton} onClick={handleForm}>Upload</button>
        </div>
    );
};

export default UploadQuestionForm;