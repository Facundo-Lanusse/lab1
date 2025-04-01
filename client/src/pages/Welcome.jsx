import { useCallback } from 'react';
import styles from './css/Welcome.module.css';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    const onLoginClick = useCallback(() => {
        navigate('/login'); // Redirige al formulario de login
    }, [navigate]);



    return (
        <div className={styles.welcome}>
            <div className={styles.welcomeChild} />
            <div className={styles.logInWrapper} onClick={onLoginClick}>
                <b className={styles.logIn}>Log in</b>
            </div>
            <div className={styles.dontHaveAn}>Don’t have an account?</div>
            <b className={styles.signUp} onClick={() => navigate('/signup')}>Sign up</b>
            <div className={styles.logoParent}>
                <img className={styles.logoIcon} alt="" src="logo.png" />
                <b className={styles.brainBattle}>BRAIN BATTLE</b>
            </div>
        </div>
    );
};

export default Welcome;
