import { useState, useCallback } from "react";
import axios from "axios";
import styles from "./css/SignUp.module.css";

const SignUp = () => {
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
            <b className={styles.signUpPage}>Sign up page</b>

            <div className={styles.rectangleParent}>
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

            <div className={styles.rectangleContainer}>
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

            <div className={styles.signUpChild} onClick={handleSubmit} />
            <b className={styles.signUp1}>Sign up</b>

            <img
                className={styles.arrowLeftSolid1Icon}
                alt="Back"
                src="arrow-left-solid.svg"
                onClick={() => window.history.back()}
            />

            <img
                className={styles.undrawAccessAccountAydp1Icon}
                alt="Illustration"
                src="undraw_access-account_aydp.svg"
            />

            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default SignUp;
