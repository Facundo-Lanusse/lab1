import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../pages/css/NavigationBar.module.css";

const NavigationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const listRefs = useRef([]);
    const indicatorRef = useRef(null);
    const [indicatorPosition, setIndicatorPosition] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const items = [
        { icon: "glass.svg", text: "Search", path: "/communities" },
        { icon: "house.svg", text: "Home", path: "/home" },
        { icon: "play.svg", text: "Play", path: "/play" },
    ];

    const activeIndex = items.findIndex(item => item.path === location.pathname);

    const calculatePosition = (index) => {
        if (listRefs.current[index]) {
            const liElement = listRefs.current[index];
            const rect = liElement.getBoundingClientRect();
            const ulRect = liElement.parentElement.getBoundingClientRect();
            const liCenter = rect.left + rect.width / 2;
            const ulLeft = ulRect.left;
            return liCenter - ulLeft;
        }
        return null;
    };

    const handleLink = (index) => {
        const newPosition = calculatePosition(index);
        if (newPosition !== null) {
            setIsTransitioning(true);
            setIndicatorPosition(newPosition);
        }
        navigate(items[index].path);
    };

    useEffect(() => {
        const position = calculatePosition(activeIndex);
        if (position !== null) {
            setIndicatorPosition(position);
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
                    ref={indicatorRef}
                    className={styles.indicator}
                    style={{
                        transform: `translateX(${indicatorPosition}px) translateX(-50%)`,
                        transition: isTransitioning ? "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none"
                    }}
                />
            </ul>
        </div>
    );
};

export default NavigationBar;
