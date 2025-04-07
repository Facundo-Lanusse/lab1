
import { useEffect } from 'react';
import styles from './css/Welcome.module.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {

        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null; //chequeo si el usuario se logueo bien y sino lo mando al Login

        if (!user) {
            navigate('/login');
        }
    }, [navigate]);


    const handleLogOut = () => {
        localStorage.removeItem('user')
        navigate('/login')
    }

    return(<div className={styles.welcome}>
            <h1>Home</h1>
            <div className={styles.brainBattle}>
                <h2>Bienvenido a preguntados</h2>
            </div>
            <div>
                <img className={styles.preguntados} alt="" src="preguntados.png" width={768} height={432} />
            </div>
            <button>Home</button>
            <button>AdminPage</button>
            <button>Search</button>
            <div>
                <button onClick={handleLogOut}>LogOut</button>
            </div>
        </div>

    );


}
export default Home;