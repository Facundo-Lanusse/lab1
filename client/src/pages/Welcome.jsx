import {useCallback, useEffect} from 'react';
import styles from './css/Welcome.module.css';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Welcome = () => {
    const navigate = useNavigate();

    useEffect(() => { //Igual a las líneas de home
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            navigate('/Home');
        }
    }, [navigate]);

    const onLoginClick = useCallback(() => {
        navigate('/login'); // Redirige al formulario de login
    }, [navigate]);

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post('http://localhost:3000/api/google-auth', {
                token: credentialResponse.credential
            });
            // Guarda solo los datos del usuario y el token en localStorage
            const data = {
                user_id: res.data.user.user_id,
                email: res.data.user.email,
                username: res.data.user.username,
                is_admin: res.data.user.is_admin
            };
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', res.data.token);
            navigate('/Home');
        } catch (error) {
            alert(error.response?.data?.error || 'Error en el login con Google');
        }
    };

    return (
        <GoogleOAuthProvider clientId="361371830838-gdsj434u5sidc88m6aetl5q3icorj8p8.apps.googleusercontent.com">
            <div className={styles.welcome}>
                <div className={styles.logoParent}>
                    <img className={styles.logoIcon} alt="Logo" src="logo.png" />
                    <b className={styles.brainBattle}>BRAIN BATTLE</b>
                </div>
                <div className={styles.logInWrapper} onClick={onLoginClick}>
                    <b className={styles.logIn}>Log in</b>
                </div>
                <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => alert('Error al iniciar sesión con Google')}
                    />
                </div>
                <div className={styles.authLinks}>
                    <span className={styles.dontHaveAn}>Don’t have an account?</span>
                    <span className={styles.signUp} onClick={() => navigate('/signup')}>Sign up</span>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Welcome;
