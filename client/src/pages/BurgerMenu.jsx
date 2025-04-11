import {useState} from "react";
import Hamburger from 'hamburger-react'
import { useNavigate } from 'react-router-dom';
import styles from './css/burgerMenu.module.css';


export const BurgerMenu = () => {


    const navigate = useNavigate();
    const [isOpen, setOpen] = useState(false);

    const handleLogOut = () => { //Botón de logOut
        localStorage.removeItem('user')
        navigate('/login')
    }
    const handleClickOnEditProfile = () => {
        navigate('profile')
    }
    const user = JSON.parse(localStorage.getItem('user'))

    const userIsAdmin = user.is_admin;

    function handleClickOnAdminButton(){//solo si es admin aparece el boton
        navigate('/uploadQuestion')
    }

    return (
        <div>
            <Hamburger
                size={24}
                toggled={isOpen}
                toggle={setOpen}
            />
            {isOpen && <div>
                <div><button className={styles.buttonForDesplegableMenu} onClick={handleClickOnEditProfile}>Edit profile</button></div>
                <div><button onClick={handleLogOut} className={styles.buttonForDesplegableMenu}>Log out</button></div>
                <div>{userIsAdmin && <button onClick={handleClickOnAdminButton} className={styles.buttonForDesplegableMenu}>Upload Question</button>}</div>
            </div>}
        </div>

    )
}