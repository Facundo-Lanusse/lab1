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

  // Definimos los elementos de navegación - mantenemos solo las 3 rutas específicas
  const items = [
    { icon: "glass.svg", text: "Comunidades", path: "/Communities" },
    { icon: "house.svg", text: "Inicio", path: "/Home" },
    { icon: "play.svg", text: "Jugar", path: "/Play" },
  ];

  // Encuentra el índice activo basado en la ruta actual
  const getActiveIndex = () => {
    const exactMatchIndex = items.findIndex(
      (item) => item.path.toLowerCase() === location.pathname.toLowerCase()
    );

    if (exactMatchIndex !== -1) return exactMatchIndex;

    const pathLower = location.pathname.toLowerCase();
    for (let i = 0; i < items.length; i++) {
      if (pathLower.startsWith(items[i].path.toLowerCase() + "/")) {
        return i;
      }
    }

    // Default a Home si no hay coincidencia
    return items.findIndex((item) => item.path === "/Home");
  };

  const activeIndex = getActiveIndex();

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
    const currentIndex = getActiveIndex();
    if (items[index].path.toLowerCase() !== location.pathname.toLowerCase()) {
      // Determinamos la dirección basada en los índices de las pestañas
      const targetItem = items[index];
      const currentItem = items[currentIndex];

      // Si tenemos índices explícitos, los usamos para determinar la dirección
      const direction = targetItem.index > currentItem.index ? "right" : "left";

      // Actualizamos la posición del indicador con animación
      const newPosition = calculatePosition(index);
      if (newPosition !== null) {
        setIsTransitioning(true);
        setIndicatorPosition(newPosition);
      }

      // Navegamos con la dirección como estado
      navigate(items[index].path, {
        state: { direction },
      });
    }
  };

  // Actualiza la posición del indicador cuando cambia la ruta activa
  useEffect(() => {
    if (activeIndex !== -1) {
      const position = calculatePosition(activeIndex);
      if (position !== null) {
        setIndicatorPosition(position);
      }
    }
  }, [activeIndex, location.pathname]);

  // Inicialización
  useEffect(() => {
    if (activeIndex !== -1) {
      const position = calculatePosition(activeIndex);
      if (position !== null) {
        setIsTransitioning(false);
        setIndicatorPosition(position);
        // Habilitar la transición después de la inicialización
        setTimeout(() => {
          setIsTransitioning(true);
        }, 100);
      }
    }
  }, []);

  return (
    <div className={styles.navigation}>
      <div className={styles.navbarGlow}></div>
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            ref={(el) => (listRefs.current[index] = el)}
            className={`${styles.list} ${
              index === activeIndex ? styles.active : ""
            }`}
            onClick={() => handleLink(index)}
          >
            <div
              className={`${styles.iconWrapper} ${
                index === activeIndex ? styles.activeIcon : ""
              }`}
            >
              <img className={styles.icon} alt={item.text} src={item.icon} />
            </div>
            <span className={styles.text}>{item.text}</span>
            {index === activeIndex && (
              <span className={styles.activeIndicator}></span>
            )}
          </li>
        ))}
        <div
          ref={indicatorRef}
          className={styles.indicator}
          style={{
            transform: `translateX(${indicatorPosition}px) translateX(-50%)`,
            transition: isTransitioning
              ? "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)"
              : "none",
          }}
        />
      </ul>
    </div>
  );
};

export default NavigationBar;
