import {useState, useCallback, useEffect} from "react";
import axios from "axios";
import styles from "./css/SignUp.module.css";
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/home');
        }
    }, [navigate]);

    const [form, setForm] = useState({ name: "" });
    const [modifyForm, setModifyForm] = useState({ newName: "", oldName: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleModifyChange = (e) => {
        setModifyForm({ ...modifyForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = useCallback(async () => {
        try {
            const res = await axios.post("http://localhost:3000/api/CreateCategory", form);
            setMessage(`Categoria modificada con éxito.`);
        } catch (error) {
            setMessage(error.response?.data?.error || "Error en el registro");
        }
    }, [form, navigate]);

    const handleModifySubmit = useCallback(async () => {
        try {
            const res = await axios.post("http://localhost:3000/api/CreateCategory", form);
            setMessage(`Categoria modificada con éxito.`);
        } catch (error) {
            setMessage(error.response?.data?.error || "Error en el registro");
        }
    }, [form, navigate]);

    return (
        <div className={styles.signUp}>

            <b className={styles.signUpPage}>Create category</b>

            <div className={styles.rectangleGroup}>
                <input
                    className={styles.frameChild}
                    type="text"
                    name="name"
                    placeholder="Enter category name..."
                    value={form.name}
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

            <button className={styles.signUpButton} onClick={handleSubmit}>Upload Category</button>

            <br></br>
            <br></br>

            <b className={styles.signUpPage}>Modify category</b>

            <div className={styles.rectangleGroup}>
                <input
                    className={styles.frameChild}
                    type="text"
                    name="name"
                    placeholder="Enter new category name..."
                    value={form.name}
                    onChange={handleModifyChange}
                    required
                />
            </div>
            <button className={styles.signUpButton} >Modify Category</button>
        </div>
    );
};

export default CreateCategory;
