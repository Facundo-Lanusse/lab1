import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from "./css/Profile.module.css";


function Profile () {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    const username = user.username;
    const mail = user.email;
    const userId = user.user_id;

    const [message, setMessage] = useState("");

    const [nameForm, setNameForm] = useState({username:""});
    const [emailForm, setEmailForm] = useState({email:""});
    const [passwordForm, setPasswordForm] = useState({password:"", repeatPassword:""});

    const handleUsernameSumbit = async() =>{
        try {
            const res = await axios.post("http://localhost:3000/api/editProfile/:username", {nameForm, userId: userId});
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || "Error al cambiar");
        }
    }

    const handleEmailSumbit = async() =>{
        try {
            const res = await axios.post("http://localhost:3000/api/editProfile/:email", {emailForm, userId: userId});
            setMessage(res.data.message);
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


    const handlePasswordSumbit = async() =>{
        try {
            if(passwordForm.password === passwordForm.password){const res = await axios.post("http://localhost:3000/api/editProfile/:email", {passwordForm, userId: userId});
                setMessage(res.data.message);
            }
            else{
                setMessage("Las constrseñas no coinciden");
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Error al modificar");
        }
    }


    return (
        <div>
            <div className={styles.container}>
                <img
                    className={styles.backButton}
                    alt="Volver"
                    src="arrow-left-solid.svg"
                    onClick={() => navigate('/home')}
                />

                <div className={styles.card}>
                    <img
                        className={styles.profileImage}
                        alt="Foto de perfil"
                        src={`defaultProfileImage.png`}
                    />
                    <div>
                        <h1 className={styles.profileName}>{username}</h1>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter new name..."
                            value={nameForm.username}
                            onChange={handleNameChange}
                        />
                        <button onClick={handleUsernameSumbit}>Modificar</button>
                    </div>

                    <h2 className={styles.profileEmail}>{mail}</h2>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter new email..."
                        value={emailForm.email}
                        onChange={handleEmailChange}
                    />
                    <button onClick={handleEmailSumbit}>Modificar</button>

                    <h1 className={styles.profileEmail}>Change password</h1>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter new password..."
                        value={passwordForm.password}
                        onChange={handlePasswordChange}
                    />
                    <input
                        type="password"
                        name="repeatPassword"
                        placeholder="Repeat password..."
                        value={passwordForm.repeatPassword}
                        onChange={handlePasswordChange}
                    />
                    <button onClick={handlePasswordSumbit}>Modificar</button>
                </div>
            </div>
        </div>
    );

}

export default Profile;