import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/SignUp.module.css";

function UploadQuestionForm(){

    const navigate = useNavigate();

    const [form, setForm] = useState({  categoryName: "", questionText: "" });
    const [message, setMessage] = useState("");

    useEffect(() => { //Igual a las líneas de home
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && !user.is_admin) {
            navigate('/home');
        }

    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleQuestionForm = useCallback(async () => {
        try {
            const res = await axios.post("http://localhost:3000/api/uploadQuestion", form);
            setMessage(`Pregunta ${res.data.questionText} registrada con éxito.`);
            navigate('/login')
        } catch (error) {
            setMessage(error.response?.data?.error || "Error en el registro");
        }
    }, [form, navigate]);

    return(
        <div className={styles.signUp}>
            <b className={styles.signUpPage}>Carga tus preguntas</b>

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
                    name="categoryName"
                    placeholder="Enter category name..."
                    value={form.categoryName}
                    onChange={handleChange}
                    required
                />
            </div>

            <img
                className={styles.arrowLeftSolid1Icon}
                alt="Back"
                src="arrow-left-solid.svg"
                onClick={() => window.history.back()}
            />


            {message && <p className={styles.message}>{message}</p>}

            <button className={styles.signUpButton} onClick={handleQuestionForm}>Upload</button>
        </div>
    );
};
export default UploadQuestionForm;