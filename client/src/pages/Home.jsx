import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { BurgerMenu } from "../components/BurgerMenu";
import styles from "./css/Home.module.css";
import { motion } from 'framer-motion';

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        // Efecto de entrada animada
        setTimeout(() => {
            setShowWelcome(true);
        }, 300);
    }, []);

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className={styles.homeContainer}>
            {/* Video de fondo */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className={styles.backgroundVideo}
            >
                <source src="/videos/9867271-uhd_3840_2160_24fps.mp4" type="video/mp4" />
                Tu navegador no soporta videos HTML5.
            </video>

            {/* Capa de superposición para mejorar la legibilidad */}
            <div className={styles.overlay}></div>

            <BurgerMenu />

            <div className={styles.homeContent}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: showWelcome ? 1 : 0, y: showWelcome ? 0 : -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className={styles.welcomeTitle}>
                        Bienvenido, <span>{user.username}</span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className={styles.logoContainer}
                >
                    <img src={"logo.png"} alt="Logo" className={styles.logo} />
                </motion.div>
            </div>
        </div>
    );
};

export default Home;