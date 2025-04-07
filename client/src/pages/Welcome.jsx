import {useCallback, useEffect} from 'react';
import styles from './css/Welcome.module.css';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    useEffect(() => { //Igual a las líneas de home
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            navigate('/home');
        }
    }, [navigate]);

    const onLoginClick = useCallback(() => {
        navigate('/login'); // Redirige al formulario de login
    }, [navigate]);



    return (
        <div className={styles.welcome}>
            <div className={styles.logoParent}>
                <img className={styles.logoIcon} alt="Logo" src="logo.png" />
                <b className={styles.brainBattle}>BRAIN BATTLE</b>
            </div>

            <div className={styles.logInWrapper} onClick={onLoginClick}>
                <b className={styles.logIn}>Log in</b>
            </div>

            <div className={styles.authLinks}>
                <span className={styles.dontHaveAn}>Don’t have an account?</span>
                <span className={styles.signUp} onClick={() => navigate('/signup')}>Sign up</span>
            </div>
        </div>
    );
};

export default Welcome;
