import { useState } from 'react';
import {useNavigate} from "react-router-dom";
import styles from './css/LogIn.module.css';

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Login successful!');
                // Redirección o manejo de sesión
                navigate('/home')
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (error) {
            setError('Error connecting to the server');
            console.error('Fetch error:', error);
        }
    };

    return (
        <div className={styles.logIn}>
            <img
                className={styles.arrowLeftSolid1Icon}
                alt="Go back"
                src="arrow-left-solid.svg"
                onClick={() => window.history.back()}
            />
            <img className={styles.loginImageIcon} alt="Login visual" src="login_image.svg" />
            <b className={styles.loginPage}>Login Page</b>

            <div className={styles.rectangleGroup}>
                <input
                    type="email"
                    className={styles.inputField}
                    placeholder="Enter email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className={styles.rectangleGroup}>
                <input
                    type="password"
                    className={styles.inputField}
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.forgotPassword}>Forgot password?</div>

            <button className={styles.logInButton} onClick={handleLogin}>Log in</button>

        </div>
    );
};

export default LogIn;
