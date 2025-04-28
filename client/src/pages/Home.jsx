import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {BurgerMenu} from "./BurgerMenu";
import styles from "./css/GamePlay.module.css";
import NavigationBar from "./NavigationBar";


//Faltaria hacerle un style a este view
const Home = () => {
    const navigate = useNavigate();


    useEffect(() => { //cuando entre a esta pagina pregunte lo siguiente
        const user = JSON.parse(localStorage.getItem('user')); //Si está logueado el user todo bien
        if (!user) { //Si no lo está lo mando a su casa
            navigate('/login');
        }
    }, [navigate]);

    const userName = JSON.parse(localStorage.getItem('user')).username


    return(
        <div>
            <BurgerMenu/>
            <h1  className={styles.titleDePrueba} >Welcome {userName}</h1>
            <NavigationBar/>
        </div>

    )

};


export default Home;