import { useCallback } from 'react';
import styles from './css/LogIn.module.css';


const LogIn = () => {

    const onRectangleClick = useCallback(() => {
        // Add your code here
    }, []);

    return (
        <div className={styles.logIn}>
            <img className={styles.loginImageIcon} alt="" src="login_image.svg" />
            <b className={styles.loginPage}>Login Page</b>
            <div className={styles.rectangleParent}>
                <div className={styles.frameChild} />
                <div className={styles.enterEmail}>Enter email...</div>
            </div>
            <div className={styles.rectangleGroup}>
                <div className={styles.frameItem} />
                <div className={styles.enterPassword}>Enter password...</div>
            </div>
            <div className={styles.forgotPassword}>Forgot password ?</div>
            <div className={styles.logInChild} onClick={onRectangleClick} />
            <b className={styles.logIn1}>{`Log in `}</b>
            <img className={styles.arrowLeftSolid1Icon} alt="" src="arrow-left-solid.svg" onClick={onRectangleClick} />
        </div>);
};

export default LogIn;
