import React, { useState, useEffect } from "react";
import Hamburger from 'hamburger-react'
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../pages/css/BurgerMenu.module.css';
import fetchProfileImage from "./FetchProfileImage";

export const BurgerMenu = () => {
    const navigate = useNavigate();
    const [isOpen, setOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const userIsAdmin = user.is_admin;
    const [profileImage, setProfileImage] = useState(null);

    // Cerrar menú al hacer clic fuera del mismo
    useEffect(() => {
        if (isOpen) {
            const handleClickOutside = (event) => {
                if (!event.target.closest(`.${styles.menuContainer}`) &&
                    !event.target.closest(`.${styles.burgerMenu}`)) {
                    setOpen(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);



    useEffect(() => {
        const loadProfileImage = async () => {
            if (user?.user_id) {
                try {
                    const path = await fetchProfileImage(user.user_id);
                    setProfileImage(path);
                } catch (error) {
                    console.error("Error loading profile image:", error);
                    setProfileImage('/defaultProfileImage.png');
                }
            }
        };

        loadProfileImage().then();


    }, [user?.user_id]);



    const handleLogOut = () => {

        navigate('/login');
        setTimeout(() => {
            localStorage.removeItem('user');
        }, 0);
    }


    // Iconos planos en formato SVG inline
    const menuItems = [
        {
            label: 'Profile',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21v-2a7 7 0 0 0-14 0v2"/></svg>,
            action: () => navigate('/profile')
        },
        {
            label: 'Users Ranking',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>,
            action: () => navigate('/ranking')
        },
        {
            label: 'Solo History',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
            action: () => navigate('/soloHistory')
        },
        {
            label: 'Friends',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
            action: () => navigate('/Friends')
        },
        {
            label: 'Log Out',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
            action: handleLogOut,
            className: styles.logoutButton
        }
    ];

    // Insertar items de administrador si el usuario es admin
    if (userIsAdmin) {
        menuItems.splice(3, 0,
            {
                label: 'Upload Question',
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
                action: () => navigate('/uploadQuestion')
            },
            {
                label: 'User Manager',
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
                action: () => navigate('/admin')
            },
            {
                label: 'Manage Community Categories',
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <path d="M7 7l-1.5-1.5" />
                    <path d="M18 7l-1.5-1.5" />
                    <path d="M7 18l-1.5-1.5" />
                    <circle cx="17.5" cy="17.5" r="2.5" />
                    <path d="M19.5 19.5l1 1" />
                </svg>,
                action: () => navigate ("/Categories-Judgement")
            }
        );
    }

    const menuVariants = {
        hidden: { x: '-100%', opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
        exit: { x: '-100%', opacity: 0, transition: { duration: 0.2 } }
    };

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: (i) => ({
            x: 0,
            opacity: 1,
            transition: { delay: i * 0.1, duration: 0.3 }
        })
    };

    return (
        <>
            <div className={styles.burgerMenu}>
                <Hamburger
                    size={24}
                    toggled={isOpen}
                    toggle={setOpen}
                    color="#000000"
                    rounded
                    label="Show menu"
                />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.menuContainer}
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className={styles.menuHeader}>
                            {profileImage ? (
                                <img
                                    src={`${profileImage}`}
                                    alt="Foto de perfil"
                                    className={styles.userAvatar}
                                />
                            ) : (
                                <div className={styles.userAvatar}>
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className={styles.userInfo}>
                                <h3>{user.username}</h3>
                                <p>{userIsAdmin ? 'Administrator' : 'Player'}</p>
                            </div>

                        </div>

                        <div className={styles.menuDivider}></div>

                        <div className={styles.menuItems}>
                            {menuItems.map((item, index) => (
                                <motion.button
                                    key={index}
                                    className={`${styles.buttonForDesplegableMenu} ${item.className || ''}`}
                                    onClick={() => {
                                        item.action();
                                        setOpen(false);
                                    }}
                                    variants={itemVariants}
                                    custom={index}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <span className={styles.menuItemIcon}>{item.icon}</span>
                                    <span className={styles.menuItemLabel}>{item.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay de fondo oscuro cuando el menú está abierto */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    )
}
