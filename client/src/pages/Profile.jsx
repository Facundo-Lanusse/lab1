import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import styles from "./css/Profile.module.css";

function Profile () {

    const navigate = useNavigate();

    const [user, setUser] = useState({ username: "", email: "", user_id: null });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    },[]);

    const [message, setMessage] = useState("");
    const [nameForm, setNameForm] = useState({username:""});
    const [emailForm, setEmailForm] = useState({email:""});
    const [passwordForm, setPasswordForm] = useState({password:"", repeatPassword:""});

    const handleUsernameSubmit = async() =>{
        try {
            const res = await axios.put("http://localhost:3000/api/editProfile/username", {
                username: nameForm.username,
                userId: user.user_id
            });
            //Actualizo la variable del localStorage
            const updatedUser = { ...user, username: nameForm.username };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage(res.data.message);

        } catch (error) {
            setMessage(error.response?.data?.error || "Error al cambiar");
        }
    }

    const handleEmailSubmit = async() =>{
        try {
            const res = await axios.put("http://localhost:3000/api/editProfile/email", {
                email: emailForm.email,
                userId: user.user_id
            });
            setMessage(res.data.message);
            //Actualizo la variable del localStorage
            const updatedUser = { ...user, email: emailForm.email };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || "Error al modificar");
        }
    }

    const handlePasswordSubmit = async() =>{
        try {
            if(passwordForm.password === passwordForm.repeatPassword){const res = await axios.put("http://localhost:3000/api/editProfile/password", {
                password: passwordForm.password,
                userId: user.user_id
            });
                setMessage(res.data.message);

            }
            else{
                setMessage("Las constrseñas no coinciden");
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Error al modificar");
        }
    }

    const handleNameChange = (e) =>{
        setNameForm({...nameForm, [e.target.name]: e.target.value});
    }

    const handleEmailChange = (e) =>{
        setEmailForm({...emailForm, [e.target.name]: e.target.value});
    }

    const handlePasswordChange = (e) =>{
        setPasswordForm({...passwordForm, [e.target.name]: e.target.value});
    }

    return (
        <div className={styles.container}>
            <img
                className={styles.backButton}
                alt="Volver"
                src="arrow-left-solid.svg"
                onClick={() => navigate('/home')}
            />

            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.avatarSection}>
                    <img
                        className={styles.profileImage}
                        alt="Foto de perfil"
                        src={`defaultProfileImage.png`}
                    />
                    <p className={styles.usernameLabel}>@{user.username}</p>
                </div>

                <div className={styles.inputGroup}>
                    <label>Name</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="New name..."
                        value={nameForm.username}
                        onChange={(e) => setNameForm({ ...nameForm, [e.target.name]: e.target.value })}
                    />
                    <motion.button whileTap={{ scale: 0.95 }} onClick={handleUsernameSubmit}>Submit</motion.button>
                </div>

                <div className={styles.inputGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="New email..."
                        value={emailForm.email}
                        onChange={(e) => setEmailForm({ ...emailForm, [e.target.name]: e.target.value })}
                    />
                    <motion.button whileTap={{ scale: 0.95 }} onClick={handleEmailSubmit}>Submit</motion.button>
                </div>

                <div className={styles.inputGroup}>
                    <label>New password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="New password..."
                        value={passwordForm.password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })}
                    />
                    <input
                        type="password"
                        name="repeatPassword"
                        placeholder="Repete password..."
                        value={passwordForm.repeatPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })}
                    />
                    <motion.button whileTap={{ scale: 0.95 }} onClick={handlePasswordSubmit}>Submit</motion.button>
                </div>

                {message && <motion.p className={styles.message} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{message}</motion.p>}
            </motion.div>
        </div>
    );

}

export default Profile;