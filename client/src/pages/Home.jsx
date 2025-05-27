import React from 'react';
import { Navigate } from 'react-router-dom';
import { BurgerMenu } from "../components/BurgerMenu";
import styles from "./css/Home.module.css";
import NavigationBar from "../components/NavigationBar";

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

        </div>
    );
};

export default Home;
