import {useState} from "react";
import Hamburger from 'hamburger-react'
import { useNavigate } from 'react-router-dom';

export const BurgerMenu = () => {

    const navigate = useNavigate();
    const [isOpen, setOpen] = useState(false);

    const handleLogOut = () => { //Botón de logOut
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <div>
            <Hamburger
                size={24}
                toggled={isOpen}
                toggle={setOpen}
            />
            {isOpen && <div>
                <div>Edit profile</div>
                <div onClick={handleLogOut}>Log out</div>
            </div>}
        </div>
    )
}