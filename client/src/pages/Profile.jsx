import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import styles from "./css/Profile.module.css";

function Profile () {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: "", email: "", user_id: null });
    const [message, setMessage] = useState({ text: "", isError: false });
    const [nameForm, setNameForm] = useState({username:""});
    const [emailForm, setEmailForm] = useState({email:""});
    const [passwordForm, setPasswordForm] = useState({password:"", repeatPassword:""});

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        } else {
            navigate('/login');
        }
    },[navigate]);

    // Limpia el mensaje después de 5 segundos
    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => {
                setMessage({ text: "", isError: false });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleUsernameSubmit = async() => {
        if (!nameForm.username.trim()) {
            setMessage({ text: "Por favor ingresa un nombre de usuario", isError: true });
            return;
        }

        try {
            const res = await axios.put("http://localhost:3000/api/editProfile/username", {
                username: nameForm.username,
                userId: user.user_id
            });

            // Actualizo la variable del localStorage
            const updatedUser = { ...user, username: nameForm.username };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage({ text: res.data.message, isError: false });
            setNameForm({ username: "" }); // Limpia el campo después de éxito
        } catch (error) {
            setMessage({
                text: error.response?.data?.error || "Error al cambiar el nombre de usuario",
                isError: true
            });
        }
    }

    const handleEmailSubmit = async() => {
        if (!emailForm.email.trim()) {
            setMessage({ text: "Por favor ingresa un email", isError: true });
            return;
        }

        try {
            const res = await axios.put("http://localhost:3000/api/editProfile/email", {
                email: emailForm.email,
                userId: user.user_id
            });

            // Actualizo la variable del localStorage
            const updatedUser = { ...user, email: emailForm.email };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage({ text: res.data.message, isError: false });
            setEmailForm({ email: "" }); // Limpia el campo después de éxito
        } catch (error) {
            setMessage({
                text: error.response?.data?.error || "Error al modificar el email",
                isError: true
            });
        }
    }

    const handlePasswordSubmit = async() => {
        if (!passwordForm.password || !passwordForm.repeatPassword) {
            setMessage({ text: "Por favor completa ambos campos de contraseña", isError: true });
            return;
        }

        try {
            if(passwordForm.password === passwordForm.repeatPassword) {
                const res = await axios.put("http://localhost:3000/api/editProfile/password", {
                    password: passwordForm.password,
                    userId: user.user_id
                });

                setMessage({ text: res.data.message, isError: false });
                setPasswordForm({ password: "", repeatPassword: "" }); // Limpia los campos
            } else {
                setMessage({ text: "Las contraseñas no coinciden", isError: true });
            }
        } catch (error) {
            setMessage({
                text: error.response?.data?.error || "Error al modificar la contraseña",
                isError: true
            });
        }
    }

    return (
        <div className={styles.container}>
            <button
                className={styles.backButton}
                onClick={() => navigate('/home')}
                aria-label="Volver"
            >
                <img src="arrow-left-solid.svg" alt="Volver" />
            </button>

            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.avatarSection}>
                    <motion.img
                        className={styles.profileImage}
                        alt="Foto de perfil"
                        src="defaultProfileImage.png"
                        whileHover={{ scale: 1.05 }}
                    />
                    <motion.p
                        className={styles.usernameLabel}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        @{user.username}
                    </motion.p>
                    {user.email && (
                        <span className={styles.userInfoLabel}>
                            {user.email}
                        </span>
                    )}
                </div>

                <motion.div
                    className={styles.inputGroup}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <label>Nombre de usuario</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Nuevo nombre de usuario..."
                        value={nameForm.username}
                        onChange={(e) => setNameForm({ ...nameForm, [e.target.name]: e.target.value })}
                    />
                    <motion.button
                        whileHover={{ translateY: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleUsernameSubmit}
                    >
                        Actualizar
                    </motion.button>
                </motion.div>

                <motion.div
                    className={styles.inputGroup}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Nuevo email..."
                        value={emailForm.email}
                        onChange={(e) => setEmailForm({ ...emailForm, [e.target.name]: e.target.value })}
                    />
                    <motion.button
                        whileHover={{ translateY: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEmailSubmit}
                    >
                        Actualizar
                    </motion.button>
                </motion.div>

                <motion.div
                    className={styles.inputGroup}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <label>Nueva contraseña</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Nueva contraseña..."
                        value={passwordForm.password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })}
                    />
                    <input
                        type="password"
                        name="repeatPassword"
                        placeholder="Confirmar contraseña..."
                        value={passwordForm.repeatPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })}
                    />
                    <motion.button
                        whileHover={{ translateY: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePasswordSubmit}
                    >
                        Actualizar
                    </motion.button>
                </motion.div>

                {message.text && (
                    <motion.p
                        className={`${styles.message} ${message.isError ? styles.errorMessage : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                        {message.text}
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
}

export default Profile;

