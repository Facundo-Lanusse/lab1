import {Navigate} from 'react-router-dom';
import {BurgerMenu} from "./BurgerMenu";
import styles from "./css/Home.module.css";
import NavigationBar from "./NavigationBar";

const Home = () => {

    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        return <Navigate to="/login" />;
    }

    return(
        <div>
            <BurgerMenu/>
            <div>
                <h1  className={styles.titleDePrueba} >Welcome {user.username}</h1>

            </div>
            <br></br>
            <br></br>
            <NavigationBar/>
        </div>

    )

};


export default Home;