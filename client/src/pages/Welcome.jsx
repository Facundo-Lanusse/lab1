import { useCallback } from 'react';
import styles from './css/Welcome.module.css';


const Welcome = () => {

    const onFrameContainerClick = useCallback(() => {
        // Add your code here
    }, []);

    return (
        <div className={styles.welcome}>
            <div className={styles.welcomeChild} />
            <div className={styles.logInWrapper} onClick={onFrameContainerClick}>
                <b className={styles.logIn}>Log in</b>
            </div>
            <div className={styles.dontHaveAn}>Don’t have an account?</div>
            <b className={styles.signUp} onClick={onFrameContainerClick}>Sign up</b>
            <div className={styles.logoParent}>
                <img className={styles.logoIcon} alt="" src="logo.png" />
                <b className={styles.brainBattle}>BRAIN BATTLE</b>
            </div>
        </div>);
};

export default Welcome;
