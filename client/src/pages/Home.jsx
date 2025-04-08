import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {BurgerMenu} from "./BurgerMenu";

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => { //cuando entre a esta pagina pregunte lo siguiente
        const user = JSON.parse(localStorage.getItem('user')); //Si está logueado el user todo bien
        if (!user) { //Si no lo está lo mando a su casa
            navigate('/login');
        }
    }, [navigate]);

    return(
        <div>
            <BurgerMenu/>
            <h1>
                Brain Battle
            </h1>
        </div>
    )

};


export default Home;