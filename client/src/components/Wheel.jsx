import { WillChangeMotionValue } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

const Wheel = ({
  segments,
  segColors,
  winningSegment,
  onFinished,
  primaryColor = "#16b3b9",
  contrastColor = "#ffffff",
  buttonText = "Girar",
  size = 290,
  fontFamily = "proxima-nova",
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [finalSpinAngle, setFinalSpinAngle] = useState(0); // Nuevo estado para el ángulo final
  const [currentSegment, setCurrentSegment] = useState(null);
  const [showSparkles, setShowSparkles] = useState(false);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const timerDelay = 16; // 60fps para animación más suave
  const spinTime = 4000;
  const spinTimeTotal = 4000;
  const radius = size / 2 - 12; // Más espacio para efectos

  // Función para normalizar nombres (quitar acentos y convertir a minúsculas)
  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remover acentos
  };

  // Función para obtener las rutas de los archivos SVG reales
  const getCategoryIcon = (categoryName) => {
    const category = normalizeString(categoryName);

    const icons = {
      deportes: "/Play.svg", // Usamos el icono existente como placeholder
      historia: "/chess-rook-solid-full.svg",
      ciencia: "/flask-solid-full.svg",
      arte: "/Vector.svg", // Usamos Vector como placeholder para arte
      geografia: "/earth-americas-solid-full.svg", // Normalizado sin acento
      entretenimiento: "/ticket-solid-full.svg",
      default: "/Play.svg",
    };

    return icons[category] || icons["default"];
  };

  // Función para calcular las posiciones de los iconos
  const getIconPositions = () => {
    const positions = [];
    const anglePerSegment = (2 * Math.PI) / segments.length;
    const angleOffset = (startAngle * Math.PI) / 180;
    const centerX = size / 2;
    const centerY = size / 2;

    // VOLVER AL ORDEN NORMAL
    segments.forEach((segment, i) => {
      const iconAngle = angleOffset + i * anglePerSegment + anglePerSegment / 2;
      const iconDistance = radius * 0.75;
      const iconX = centerX + iconDistance * Math.cos(iconAngle);
      const iconY = centerY + iconDistance * Math.sin(iconAngle);

      // Calcular el ángulo de rotación para que el icono mire hacia el centro
      // Agregamos 90 grados porque los iconos por defecto "miran" hacia arriba
      const iconRotation = (iconAngle * 180) / Math.PI + 90;

      positions.push({
        segment,
        x: iconX,
        y: iconY,
        angle: iconAngle,
        rotation: iconRotation,
        src: getCategoryIcon(segment),
      });
    });

    return positions;
  };

  // Función para dibujar un icono SVG en el canvas
  const drawIcon = (ctx, iconPath, x, y, size, color) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 24, size / 24); // Escalar desde 24x24 (tamaño estándar SVG)
    ctx.translate(-12, -12); // Centrar el icono

    // Crear un path2D desde el string SVG
    const path = new Path2D(iconPath);
    ctx.fillStyle = color;
    ctx.fill(path);
    ctx.restore();
  };

  // Variables para la animación ORIGINALES
  const spinData = useRef({
    startTime: 0,
    angleDelta: 0,
    spinTime: 0,
    spinTimeTotal: 0,
    randomOffset: 0, // Calcular una sola vez al inicio
  });

  // Controla cuando se termina el giro
  const finishSpinning = (finalAngle = null) => {
    setIsSpinning(false);

    if (segments.length === 0) {
      console.log("No hay segmentos disponibles");
      return;
    }

    // Usar el ángulo final pasado como parámetro o el estado guardado
    const angleToUse = finalAngle !== null ? finalAngle : finalSpinAngle;
    const currentAngle = angleToUse % 360;
    // Normalizar el ángulo para que esté entre 0 y 360
    const normalizedAngle =
      currentAngle < 0 ? currentAngle + 360 : currentAngle;

    // Calcular el ángulo por segmento
    const anglePerSegment = 360 / segments.length;

    // CORRECCIÓN: La flecha está visualmente arriba (270° en Canvas), no en 0°
    // Lógica de detección: encontrar qué segmento está bajo la flecha (270°)
    const arrowAngle = 270; // La flecha está arriba
    const originalPosition = (360 - normalizedAngle + arrowAngle) % 360;
    const selectedIndex = Math.floor(originalPosition / anglePerSegment);
    const selectedSegment = segments[selectedIndex];

    setCurrentSegment(selectedSegment);
    setShowSparkles(true);

    // Ocultar sparkles después de 2 segundos
    setTimeout(() => setShowSparkles(false), 2000);

    if (onFinished) {
      onFinished(selectedSegment);
    }
  };

  // Animación del giro SIMPLE ALEATORIO
  const rotateWheel = () => {
    const now = new Date().getTime();
    const elapsedTime = now - spinData.current.startTime;
    spinData.current.spinTime = elapsedTime;

    // Cuando se termina el tiempo de giro
    if (elapsedTime >= spinData.current.spinTimeTotal) {
      stopRotation();

      // Calcular y guardar el ángulo final real
      const finalAngle = spinData.current.angleDelta % 360;
      setFinalSpinAngle(finalAngle);
      setStartAngle(finalAngle);

      // Terminar el giro y detectar el segmento automáticamente, pasando el ángulo calculado
      setTimeout(() => finishSpinning(finalAngle), 100); // Pasar el ángulo como parámetro
      return;
    }

    // Función de desaceleración
    const easeOutCubic = (t) => {
      return 1 - Math.pow(1 - t, 3);
    };

    // Calcular progreso
    const progress = elapsedTime / spinData.current.spinTimeTotal;
    const easedProgress = easeOutCubic(progress);

    // Calcular el ángulo actual basado en la animación
    // Invertir la lógica: al principio easedProgress=0, al final easedProgress=1
    const currentAngle = spinData.current.angleDelta * easedProgress;

    // Actualizar el ángulo de inicio para el dibujo
    setStartAngle(currentAngle);

    // Continuar la animación
    timerRef.current = setTimeout(rotateWheel, timerDelay);
  };

  // Detener la rotación
  const stopRotation = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Calcular el ángulo para un segmento específico (corregido para precisión)
  const calculateSegmentAngle = (index, total) => {
    // La flecha apunta hacia arriba (0 grados), calculamos desde ahí
    const anglePerSegment = 360 / total;
    // Queremos que el centro del segmento esté bajo la flecha
    return anglePerSegment * index;
  };

  // Iniciar el giro de la ruleta con efectos mejorados
  const spin = () => {
    if (isSpinning || segments.length === 0) return;

    // Reiniciar estados
    stopRotation();
    setIsSpinning(true);
    setCurrentSegment(null);
    setShowSparkles(false);

    // Generar un ángulo aleatorio con más variación
    const randomAngleDelta = Math.floor(Math.random() * 2160) + 1800; // Entre 5-11 vueltas

    // Calcular offset aleatorio UNA SOLA VEZ para evitar movimiento errático
    let randomOffset = 0;
    if (segments.length === 2) {
      const anglePerSegment = 360 / segments.length;
      randomOffset = (Math.random() - 0.5) * anglePerSegment * 0.15; // Reducido a ±7.5% del segmento para más fluidez
    }

    // Configurar la animación ORIGINAL
    spinData.current = {
      startTime: new Date().getTime(),
      angleDelta: randomAngleDelta,
      spinTime: 0,
      spinTimeTotal: spinTimeTotal,
      randomOffset: randomOffset,
    };

    // Iniciar la animación
    rotateWheel();
  };

  // Función ORIGINAL para parar - por ahora deshabilitada para simplicidad
  const stopSpin = () => {
    // Por simplicidad, no hacer nada por ahora
    console.log("Función de parar deshabilitada temporalmente");
  };

  // Dibujar la ruleta
  useEffect(() => {
    drawWheel();
  }, [startAngle, segments, segColors, size]);

  // Dibujar la ruleta en el canvas con efectos mejorados
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Borde exterior dorado estilo Preguntados (menos brillante)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 6, 0, Math.PI * 2);
    ctx.fillStyle = "#D4AF37";
    ctx.fill();
    ctx.closePath();

    // Borde interno blanco
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();

    // Dibujar los segmentos con mejores efectos
    const anglePerSegment = (2 * Math.PI) / segments.length;
    const angleOffset = (startAngle * Math.PI) / 180;

    // VOLVER AL ORDEN NORMAL - sin complicaciones
    segments.forEach((segment, i) => {
      const startAngleRad = angleOffset + i * anglePerSegment;
      const endAngleRad = startAngleRad + anglePerSegment;

      // Segmento con color sólido estilo Preguntados
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngleRad, endAngleRad);
      ctx.closePath();

      // Color sólido vibrante
      const baseColor = segColors[i % segColors.length];
      ctx.fillStyle = baseColor;
      ctx.fill();

      // Borde blanco delgado entre segmentos
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Círculo central blanco estilo Preguntados
    const centerRadius = radius * 0.25;

    // Círculo central principal
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    // Borde dorado del círculo central (menos brillante)
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Remover los iconos dibujados en el canvas - usaremos los SVG existentes
  };

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        margin: "0 auto",
        filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.2))",
        animation: isSpinning
          ? "wheelPulse 0.5s ease-in-out infinite alternate"
          : "none",
      }}
    >
      {/* Definir animaciones CSS */}
      <style>
        {`
          @keyframes wheelPulse {
            from { filter: drop-shadow(0 12px 24px rgba(0,0,0,0.2)); }
            to { filter: drop-shadow(0 16px 32px rgba(22,179,185,0.3)); }
          }
          
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
            50% { opacity: 1; transform: scale(1) rotate(180deg); }
          }
        `}
      </style>

      {/* Canvas para dibujar la ruleta */}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          borderRadius: "50%",
        }}
      />

      {/* Efectos de partículas/sparkles cuando termina */}
      {showSparkles && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "8px",
                height: "8px",
                backgroundColor: "#FFD700",
                borderRadius: "50%",
                transform: `translate(-50%, -50%) rotate(${
                  i * 45
                }deg) translateY(-${radius + 20}px)`,
                animation: "sparkle 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
                zIndex: 5,
              }}
            />
          ))}
        </>
      )}

      {/* Iconos SVG posicionados sobre la ruleta */}
      {getIconPositions().map((iconData, index) => (
        <img
          key={`${iconData.segment}-${index}`}
          src={iconData.src}
          alt={iconData.segment}
          style={{
            position: "absolute",
            left: iconData.x - 18, // Centrar el icono (36px / 2)
            top: iconData.y - 18,
            width: "36px", // Iconos un poco más grandes
            height: "36px",
            filter: isSpinning
              ? "drop-shadow(2px 2px 4px rgba(0,0,0,0.3)) brightness(0) invert(1) blur(0.5px)"
              : "drop-shadow(3px 3px 6px rgba(0,0,0,0.4)) brightness(0) invert(1)",
            pointerEvents: "none",
            transition: isSpinning ? "none" : "all 0.3s ease",
            transform: `rotate(${iconData.rotation}deg)`,
            transformOrigin: "center center",
            zIndex: 1,
            // Removida la animación flotante - los iconos se mantienen fijos
          }}
        />
      ))}

      {/* Flecha blanca estilo Preguntados */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 4,
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "15px solid transparent",
            borderRight: "15px solid transparent",
            borderTop: "40px solid #FFFFFF",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
          }}
        />
      </div>

      {/* Botón central estilo Preguntados */}
      <button
        onClick={isSpinning ? stopSpin : spin}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#FFFFFF",
          color: "#333333",
          border: "3px solid #D4AF37",
          borderRadius: "50%",
          width: radius * 0.5, // Botón más grande para que quepa el texto
          height: radius * 0.5,
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "13px", // Tamaño más pequeño para que quepa
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          zIndex: 3,
          transition: "all 0.2s ease",
          textShadow: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0",
          lineHeight: "1",
          textAlign: "center",
          transform: isSpinning
            ? "translate(-50%, -50%) scale(0.95)"
            : "translate(-50%, -50%) scale(1)",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = isSpinning
            ? "translate(-50%, -50%) scale(0.95)"
            : "translate(-50%, -50%) scale(1.05)";
          e.target.style.background = "#FFF9E6";
          e.target.style.borderColor = "#E6C347";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = isSpinning
            ? "translate(-50%, -50%) scale(0.95)"
            : "translate(-50%, -50%) scale(1)";
          e.target.style.background = "#FFFFFF";
          e.target.style.borderColor = "#D4AF37";
        }}
      >
        {isSpinning ? "PARAR" : "GIRAR"}
      </button>
    </div>
  );
};

export default Wheel;
