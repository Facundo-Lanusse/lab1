import React from 'react';
import { Navigate } from 'react-router-dom';
import { BurgerMenu } from "./BurgerMenu";
import styles from "./css/Home.module.css";
import NavigationBar from "./NavigationBar";

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className={styles.homeContainer}>
            <BurgerMenu />

            <div className={styles.homeContent}>
                <h1 className={styles.welcomeTitle}>Bienvenido, <span>{user.username}</span></h1>

                <div className={styles.featuresContainer}>
                </div>
            </div>

            <NavigationBar />
        </div>
    );
};

export default Home;