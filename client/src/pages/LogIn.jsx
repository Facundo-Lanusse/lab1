import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import styles from './css/LogIn.module.css';

const LogIn = () => {
    const [email, setEmail] = useState(''); //useState se usa para guardar estados de las variables
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();//para navegar entre links


    useEffect(() => { //Igual a las líneas de home
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            navigate('/Home');
        }
    }, [navigate]);


    function randomString(length = 5) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result + '@example.com';
    }

    function randomNumberString(length = 4) {
        const digits = '0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += digits.charAt(Math.floor(Math.random() * digits.length));
        }
        return result;
    }

    const handleLogin = async (isGuest) => {
        setError('');
        try {
            if(isGuest){
                const guestEmail = randomString();
                const user = {
                    email: guestEmail,
                    password: 'guest123',
                    username: 'Guest'+ randomNumberString(),
                    user_id: Math.floor(Math.random() * 61) + 100000 //Genera un ID de usuario aleatorio entre 100000 y 100030
                }
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/Home')
            }


            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {//Si no explotó response que haga lo siguiente, sino que tire error
                localStorage.setItem('user', JSON.stringify(data.user));//Guardo en el storage la session del usuario, es nativo de node
                localStorage.setItem('token', data.token);
                navigate('/Home')
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
                onClick={() => navigate('/')}
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

            <button className={styles.logInButton} onClick={() => handleLogin(false)}>Log in</button>

            <div>
                <button className={styles.logInButton} onClick={() => handleLogin(true)}>
                    Log in as Guest
                </button>
            </div>
        </div>
    );
};

export default LogIn;