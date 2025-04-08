import {useState, useCallback, useEffect} from "react";
import axios from "axios";
import styles from "./css/SignUp.module.css";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();

    useEffect(() => { //Igual a las líneas de home
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            navigate('/home');
        }
    }, [navigate]);

    const [form, setForm] = useState({ username: "", password: "", email: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = useCallback(async () => {
        try {
            const res = await axios.post("http://localhost:3000/api/register", form);
            setMessage(`Usuario ${res.data.username} registrado con éxito.`);
        } catch (error) {
            setMessage(error.response?.data?.error || "Error en el registro");
        }
    }, [form]);

    return (
        <div className={styles.signUp}>
            <img
                className={styles.undrawAccessAccountAydp1Icon}
                alt="Illustration"
                src="undraw_access-account_aydp.svg"
            />

            <b className={styles.signUpPage}>Sign up page</b>

            <div className={styles.rectangleGroup}>
                <input
                    className={styles.frameChild}
                    type="text"
                    name="username"
                    placeholder="Enter username..."
                    value={form.username}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.rectangleGroup}>
                <input
                    className={styles.frameChild}
                    type="email"
                    name="email"
                    placeholder="Enter email..."
                    value={form.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.rectangleGroup}>
                <input
                    className={styles.frameChild}
                    type="password"
                    name="password"
                    placeholder="Enter password..."
                    value={form.password}
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

            <button className={styles.signUpButton} onClick={handleSubmit}>Sign Up</button>
        </div>
    );
};

export default SignUp;
