import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
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
                        <h1 className={styles.profileName}>{user.username}</h1>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter new name..."
                            value={nameForm.username}
                            onChange={handleNameChange}
                        />
                        <button onClick={handleUsernameSubmit}>Modificar</button>
                    </div>

                    <h2 className={styles.profileEmail}>{user.email}</h2>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter new email..."
                        value={emailForm.email}
                        onChange={handleEmailChange}
                    />
                    <button onClick={handleEmailSubmit}>Modificar mail</button>

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
                    <button onClick={handlePasswordSubmit}>Modificar</button>
                    <h3>{message}</h3>
                </div>
            </div>
        </div>
    );

}

export default Profile;