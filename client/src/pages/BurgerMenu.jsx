import {useState} from "react";
import Hamburger from 'hamburger-react'
import { useNavigate } from 'react-router-dom';
import styles from './css/BurgerMenu.module.css';

export const BurgerMenu = () => {
    const navigate = useNavigate();
    const [isOpen, setOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const userIsAdmin = user.is_admin;

    const handleLogOut = () => {
        localStorage.removeItem('user')
        navigate('/login')
    }

    const handleClickOnEditProfile = () => {
        navigate('/profile')
    }

    function handleClickOnAdminButton() {
        navigate('/uploadQuestion')
    }

    function handleClickOnAdminUsersButton() {
        navigate('/admin')
    }

    return (
        <div className={styles.burgerMenu}>
            <Hamburger
                size={24}
                toggled={isOpen}
                toggle={setOpen}
                color="black"
            />
            {isOpen && (
                <div className={styles.menuContainer} style={{ display: 'flex' }}>
                    <button className={styles.buttonForDesplegableMenu} onClick={handleClickOnEditProfile}>
                        Profile
                    </button>
                    <button className={styles.buttonForDesplegableMenu} onClick={() => navigate('/ranking')}>
                        Users ranking
                    </button>
                    <button className={styles.buttonForDesplegableMenu} onClick={() => navigate('/soloHistory')}>
                        Solo History
                    </button>
                    {userIsAdmin && (
                        <>
                            <button className={styles.buttonForDesplegableMenu} onClick={handleClickOnAdminButton}>
                                Upload Question
                            </button>
                            <button className={styles.buttonForDesplegableMenu} onClick={handleClickOnAdminUsersButton}>
                                User manager
                            </button>
                        </>
                    )}
                    <button className={styles.buttonForDesplegableMenu} onClick={handleLogOut}>
                        Log out
                    </button>
                    <button className={styles.buttonForDesplegableMenu} onClick={() => navigate('/Friends')}>
                        Friends
                    </button>
                </div>
            )}
        </div>
    )
}