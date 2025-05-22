import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import styles from "./css/Profile.module.css";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: "", email: "", user_id: null });
    const [message, setMessage] = useState({ text: "", isError: false });
    const [nameForm, setNameForm] = useState({username:""});
    const [emailForm, setEmailForm] = useState({email:""});
    const [passwordForm, setPasswordForm] = useState({password:"", repeatPassword:""});
    const [selectedImage, setSelectedImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

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
        const fetchProfileImage = async () => {
            if (user.user_id) {
                try {
                    const response = await axios.get(`http://localhost:3000/api/profile-image/${user.user_id}`);
                    console.log("Response:", response);
                    if (response.data.success) {
                        setProfileImage(response.data.imagePath);
                    } else {
                        setProfileImage('/defaultProfileImage.png');
                    }
                } catch (error) {
                    console.log("Error al cargar la imagen de perfil:", error);
                    setProfileImage('/defaultProfileImage.png');
                }
            }
        };

        fetchProfileImage();
    }, [user.user_id]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleImageUpload = async () => {
        if (!selectedImage) {
            setMessage({ text: "Por favor selecciona una imagen", isError: true });
            return;
        }

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
            } else {
                setMessage({ text: response.data.message || "Error al subir la imagen", isError: true });
            }
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || "Error al subir la imagen",
                isError: true
            });
        }
    };

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
        }
    };

    const handleEmailSubmit = async() => {
        if (!emailForm.email.trim()) {
            setMessage({ text: "Por favor ingresa un correo electrónico", isError: true });
            return;
        }

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
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <button className={styles.backButton} onClick={goBack}>
                <img src="/icons/back-arrow.svg"  alt={"volver"}/>
            </button>

            <div className={styles.headerSection}>
                <h1 className={styles.profileTitle}>Mi Perfil</h1>
            </div>

            {message.text && (
                <div className={`${styles.message} ${message.isError ? styles.error : styles.success}`}>
                    {message.text}
                </div>
            )}

            <div className={styles.profileImageContainer} >
                {profileImage ? (
                    <img
                        src={`${profileImage}`}
                        alt="Foto de perfil"
                        className={styles.profileImage}
                    />
                ) : (
                    <div className={styles.noImage}>
                        Sin imagen
                    </div>
                )}
            </div>

            <div className={styles.profileContentContainer} >
                <h3 className={styles.sectionTitle}>Información actual</h3>
                <p><strong>Usuario:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>

            </div>

            <div className={styles.profileContentContainer}>
                <p className={styles.subtitle}>Gestiona tu información personal</p>

                <div className={styles.formSection}>

                    <div className={styles.uploadSection}>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className={styles.fileInput}
                            accept="image/*"
                        />
                        <motion.button
                            onClick={handleImageUpload}
                            className={styles.button}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Subir imagen
                        </motion.button>
                    </div>
                </div>

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
                            whileTap={{ scale: 0.98 }}
                        >
                            Actualizar
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
                            whileTap={{ scale: 0.98 }}
                        >
                            Actualizar
                        </motion.button>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Cambiar contraseña</h3>
                    <div className={styles.inputGroup}>
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
                        <motion.button
                            onClick={handlePasswordSubmit}
                            className={styles.button}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Actualizar
                        </motion.button>
                    </div>
                </div>

            </div>
        </motion.div>
    );
}

export default Profile;