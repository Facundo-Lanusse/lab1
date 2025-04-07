import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => { //cuando entre a esta pagina pregunte lo siguiente
        const user = JSON.parse(localStorage.getItem('user')); //Si está logueado el user todo bien
        if (!user) {//Si no lo está lo mando a su casa
            navigate('/login');
        }
    }, [navigate]);

    const handleLogOut = () => { //Botón de logOut
        localStorage.removeItem('user')
        navigate('/login')
    }

    return(
        <div>
            <h1>
                hola entraste a la pagina home
            </h1>
            <button onClick={handleLogOut}>LogOut</button>
        </div>
    )

};


export default Home;