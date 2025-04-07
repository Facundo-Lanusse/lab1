import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogOut = () => {
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