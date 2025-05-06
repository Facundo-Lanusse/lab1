import {useState} from "react";
import Hamburger from 'hamburger-react'
import { useNavigate } from 'react-router-dom';
import styles from './css/BurgerMenu.module.css';


export const BurgerMenu = () => {


    const navigate = useNavigate();
    const [isOpen, setOpen] = useState(false);

    const handleLogOut = () => { //Botón de logOut
        localStorage.removeItem('user')
        navigate('/login')
    }
    const handleClickOnEditProfile = () => {
        navigate('/profile')
    }
    const user = JSON.parse(localStorage.getItem('user'))

    const userIsAdmin = user.is_admin;

    function handleClickOnAdminButton(){//solo si es admin aparece el boton
        navigate('/uploadQuestion')
    }

    function handleClickOnAdminUsersButton(){//solo si es admin aparece el boton
        navigate('/admin')
    }

    return (
        <div className={styles.burgerMenu}>
            <Hamburger
                size={24}
                toggled={isOpen}
                toggle={setOpen}
            />
            {isOpen && <div>
                <div><button className={styles.buttonForDesplegableMenu} onClick={handleClickOnEditProfile}>Profile</button></div>
                <div><button onClick={handleLogOut} className={styles.buttonForDesplegableMenu}>Log out</button></div>
                <div>{userIsAdmin && <button onClick={handleClickOnAdminButton} className={styles.buttonForDesplegableMenu}>Upload Question</button>}</div>
                <div>{userIsAdmin && <button onClick={handleClickOnAdminUsersButton} className={styles.buttonForDesplegableMenu}>User manager</button>}</div>
                <div>{<button onClick={() => navigate('/ranking')} className={styles.buttonForDesplegableMenu}>Users ranking</button>}</div>
                <div>{<button onClick={() => navigate('/soloHistory')} className={styles.buttonForDesplegableMenu}>Solo History</button>}</div>
            </div>}
        </div>

    )
}