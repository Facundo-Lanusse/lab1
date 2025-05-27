import React, {useEffect, useState, useRef} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import styles from "./css/Profile.module.css";
import fetchProfileImage from "../components/FetchProfileImage";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: "", email: "", user_id: null });
    const [message, setMessage] = useState({ text: "", isError: false });
    const [nameForm, setNameForm] = useState({username:""});
    const [emailForm, setEmailForm] = useState({email:""});
    const [passwordForm, setPasswordForm] = useState({password:"", repeatPassword:""});
    const [selectedImage, setSelectedImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imageName, setImageName] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        } else {
            navigate('/login');
        }
    },[navigate]);

    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => {
                setMessage({ text: "", isError: false });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        const loadProfileImage = async () => {
            if (user?.user_id) {
                try {
                    const path = await fetchProfileImage(user.user_id);
                    setProfileImage(path);
                } catch (error) {
                    console.error("Error loading profile image:", error);
                    setProfileImage('/defaultProfileImage.png');
                }
            }
        };

        loadProfileImage();
    }, [user?.user_id]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);

            // Limita el nombre del archivo a 15 caracteres
            let displayName = file.name;
            if (displayName.length > 15) {
                const ext = displayName.split('.').pop();
                displayName = `${displayName.substring(0, 12)}...${ext}`;
            }
            setImageName(displayName);
        }
    };

    const handleClickFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = async () => {
        if (!selectedImage) {
            setMessage({ text: "Por favor selecciona una imagen", isError: true });
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('profileImage', selectedImage);
        formData.append('userId', user.user_id);

        try {
            const response = await axios.post("http://localhost:3000/api/editProfile/upload-image", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setProfileImage(response.data.imagePath);
                setMessage({ text: response.data.message, isError: false });
                setSelectedImage(null);
                setImageName("");
            } else {
                setMessage({ text: response.data.message || "Error al subir la imagen", isError: true });
            }
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || "Error al subir la imagen",
                isError: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUsernameSubmit = async() => {
        if (!nameForm.username.trim()) {
            setMessage({ text: "Por favor ingresa un nombre de usuario", isError: true });
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.put("http://localhost:3000/api/editProfile/username", {
                username: nameForm.username,
                userId: user.user_id
            });

            const updatedUser = { ...user, username: nameForm.username };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage({ text: res.data.message, isError: false });
            setNameForm({ username: "" });
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || "Error al actualizar el nombre de usuario",
                isError: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSubmit = async() => {
        if (!emailForm.email.trim()) {
            setMessage({ text: "Por favor ingresa un correo electrónico", isError: true });
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.put("http://localhost:3000/api/editProfile/email", {
                email: emailForm.email,
                userId: user.user_id
            });

            const updatedUser = { ...user, email: emailForm.email };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage({ text: res.data.message, isError: false });
            setEmailForm({ email: "" });
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || "Error al actualizar el correo electrónico",
                isError: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async() => {
        if (!passwordForm.password || !passwordForm.repeatPassword) {
            setMessage({ text: "Por favor completa todos los campos", isError: true });
            return;
        }

        if (passwordForm.password !== passwordForm.repeatPassword) {
            setMessage({ text: "Las contraseñas no coinciden", isError: true });
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.put("http://localhost:3000/api/editProfile/password", {
                password: passwordForm.password,
                userId: user.user_id
            });

            setMessage({ text: res.data.message, isError: false });
            setPasswordForm({ password: "", repeatPassword: "" });
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || "Error al actualizar la contraseña",
                isError: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const goBack = () => {
        navigate("/Home");
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <motion.button
                className={styles.backButton}
                onClick={goBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Volver"
            >
                <img src="arrow-left-solid.svg" alt="volver"/>
            </motion.button>

            <motion.div
                className={styles.headerSection}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                <h1 className={styles.profileTitle}>Mi Perfil</h1>
            </motion.div>

            <AnimatePresence>
                {message.text && (
                    <motion.div
                        className={`${styles.message} ${message.isError ? styles.error : styles.success}`}
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.mainContentContainer}>
                {/* Columna izquierda - Información del usuario */}
                <motion.div
                    className={styles.infoContainer}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <div className={styles.profileContentContainer}>
                        <h3 className={styles.sectionTitle}>Información actual</h3>

                        <div className={styles.profileImageContainer}>
                            {profileImage ? (
                                <motion.img
                                    src={`${profileImage}`}
                                    alt="Foto de perfil"
                                    className={styles.profileImage}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            ) : (
                                <div className={styles.noImage}>
                                    Sin imagen
                                </div>
                            )}
                        </div>

                        <div className={styles.userInfo}>
                            <p><strong>Usuario:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                        </div>

                        <div className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>Cambiar imagen</h3>
                            <div className={styles.uploadSection}>
                                <div
                                    className={styles.fileInput}
                                    onClick={handleClickFileInput}
                                >
                                    {imageName || "Seleccionar archivo..."}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        style={{display: 'none'}}
                                    />
                                </div>
                                <motion.button
                                    onClick={handleImageUpload}
                                    className={`${styles.button} ${styles.buttonSmall}`}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    disabled={isLoading || !selectedImage}
                                >
                                    {isLoading ? "..." : "Subir"}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Columna derecha - Formularios */}
                <motion.div
                    className={styles.formsContainer}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                >
                    <div className={styles.profileContentContainer}>
                        <h3 className={styles.sectionTitle}>Gestión de cuenta</h3>

                        <div className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>Cambiar nombre de usuario</h3>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    placeholder="Nuevo nombre de usuario"
                                    value={nameForm.username}
                                    onChange={(e) => setNameForm({username: e.target.value})}
                                    className={styles.input}
                                />
                                <motion.button
                                    onClick={handleUsernameSubmit}
                                    className={styles.button}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    disabled={isLoading || !nameForm.username.trim()}
                                >
                                    {isLoading ? "..." : "Actualizar"}
                                </motion.button>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>Cambiar correo electrónico</h3>
                            <div className={styles.inputGroup}>
                                <input
                                    type="email"
                                    placeholder="Nuevo correo electrónico"
                                    value={emailForm.email}
                                    onChange={(e) => setEmailForm({email: e.target.value})}
                                    className={styles.input}
                                />
                                <motion.button
                                    onClick={handleEmailSubmit}
                                    className={styles.button}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    disabled={isLoading || !emailForm.email.trim()}
                                >
                                    {isLoading ? "..." : "Actualizar"}
                                </motion.button>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>Cambiar contraseña</h3>
                            <div className={styles.passwordInputs}>
                                <input
                                    type="password"
                                    placeholder="Nueva contraseña"
                                    value={passwordForm.password}
                                    onChange={(e) => setPasswordForm({...passwordForm, password: e.target.value})}
                                    className={styles.input}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirmar contraseña"
                                    value={passwordForm.repeatPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, repeatPassword: e.target.value})}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.buttonContainer}>
                                <motion.button
                                    onClick={handlePasswordSubmit}
                                    className={styles.button}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    disabled={isLoading || !passwordForm.password || !passwordForm.repeatPassword}
                                >
                                    {isLoading ? "Actualizando..." : "Actualizar contraseña"}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default Profile;
