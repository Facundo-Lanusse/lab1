import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./css/NavigationBar.module.css";

const NavigationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const listRefs = useRef([]);
    const [indicatorPosition, setIndicatorPosition] = useState(null);
    const [indicatorIsReady, setIndicatorIsReady] = useState(false);

    const items = [
        { icon: "glass.svg", text: "Search", path: "/search" },
        { icon: "house.svg", text: "Home", path: "/home" },
        { icon: "play.svg", text: "Play", path: "/play" },
    ];

    // Detectar cuál es el índice activo según la URL
    const activeIndex = items.findIndex(item => item.path === location.pathname);

    const handleLink = (index) => {
        navigate(items[index].path);
    };

    useEffect(() => {
        if (listRefs.current[activeIndex]) {
            const liElement = listRefs.current[activeIndex];
            const rect = liElement.getBoundingClientRect();
            const ulRect = liElement.parentElement.getBoundingClientRect();

            const liCenter = rect.left + rect.width / 2;
            const ulLeft = ulRect.left;
            const relativeCenter = liCenter - ulLeft;

            setIndicatorPosition(relativeCenter);
            setIndicatorIsReady(true); //abilitamos al trancicion recien cuando sabemos su posicion
        }
    }, [activeIndex]);

    return (
        <div className={styles.navigation}>
            <ul>
                {items.map((item, index) => (
                    <li
                        key={index}
                        ref={el => listRefs.current[index] = el}
                        className={`${styles.list} ${index === activeIndex ? styles.active : ""}`}
                        onClick={() => handleLink(index)}
                    >
                        <img className={styles.icon} alt={item.text} src={item.icon} />
                        <span className={styles.text}>{item.text}</span>
                    </li>
                ))}
                <div
                    className={styles.indicator}
                    style={{
                        transform: `translateX(${indicatorPosition}px) translateX(-50%)`,
                        transition: indicatorIsReady ? "transform 0.4s ease" : "none",
                    }}
                />
            </ul>
        </div>
    );
};

export default NavigationBar;
