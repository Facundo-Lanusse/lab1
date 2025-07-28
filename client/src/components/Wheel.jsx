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
  const [currentSegment, setCurrentSegment] = useState(null);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const timerDelay = 33; // ~30fps
  const spinTime = 4000; // 3 segundos de giro
  const spinTimeTotal = 4000;
  const radius = size / 2 - 10;

  // Función para obtener las rutas de los archivos SVG reales
  const getCategoryIcon = (categoryName) => {
    const category = categoryName.toLowerCase().trim();

    const icons = {
      deportes: "/Play.svg", // Usamos el icono existente como placeholder
      historia: "/chess-rook-solid-full.svg",
      ciencia: "/flask-solid-full.svg",
      arte: "/Vector.svg", // Usamos Vector como placeholder para arte
      geografía: "/earth-americas-solid-full.svg",
      geografia: "/earth-americas-solid-full.svg",
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

    segments.forEach((segment, i) => {
      const iconAngle = angleOffset + i * anglePerSegment + anglePerSegment / 2;
      const iconDistance = radius * 0.75;
      const iconX = centerX + iconDistance * Math.cos(iconAngle);
      const iconY = centerY + iconDistance * Math.sin(iconAngle);

      positions.push({
        segment,
        x: iconX,
        y: iconY,
        angle: iconAngle,
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

  // Variables para la animación
  const spinData = useRef({
    startTime: 0,
    angleDelta: 0,
    spinTime: 0,
    spinTimeTotal: 0,
  });

  // Controla cuando se termina el giro
  const finishSpinning = (segment) => {
    setIsSpinning(false);
    setCurrentSegment(segment);
    if (onFinished) {
      onFinished(segment);
    }
  };

  // Animación del giro
  const rotateWheel = () => {
    const now = new Date().getTime();
    const elapsedTime = now - spinData.current.startTime;
    spinData.current.spinTime = elapsedTime;

    if (elapsedTime >= spinData.current.spinTimeTotal) {
      stopRotation();
      finishSpinning(winningSegment);
      return;
    }

    // Función de desaceleración
    const easeOut = (t, b, c, d) => {
      const ts = (t /= d) * t;
      const tc = ts * t;
      return b + c * (tc + -3 * ts + 3 * t);
    };

    // Calcular el ángulo actual
    const timeRemaining = spinData.current.spinTimeTotal - elapsedTime;
    const angle = easeOut(
      timeRemaining,
      0,
      spinData.current.angleDelta,
      spinData.current.spinTimeTotal
    );

    const angleToStop = calculateSegmentAngle(
      segments.indexOf(winningSegment),
      segments.length
    );
    const newAngle = 360 * 10 + angleToStop + angle;

    setStartAngle(newAngle);

    timerRef.current = setTimeout(rotateWheel, timerDelay);
  };

  // Detener la rotación
  const stopRotation = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Calcular el ángulo para un segmento específico
  const calculateSegmentAngle = (index, total) => {
    return (360 / total) * index;
  };

  // Iniciar el giro de la ruleta
  const spin = () => {
    if (isSpinning || segments.length === 0) return;

    // Reiniciar estados
    stopRotation();
    setIsSpinning(true);
    setCurrentSegment(null);

    // Generar un ángulo aleatorio entre 10 y 20 vueltas completas (3600-7200 grados)
    // Esto hace que la ruleta gire un número aleatorio de veces antes de detenerse
    const randomAngleDelta = Math.floor(Math.random() * 3600) + 3600;

    // Configurar la animación
    spinData.current = {
      startTime: new Date().getTime(),
      angleDelta: randomAngleDelta, // Ángulo aleatorio que se moverá
      spinTime: 0,
      spinTimeTotal: spinTimeTotal,
    };

    // Iniciar la animación
    rotateWheel();
  };

  // Dibujar la ruleta
  useEffect(() => {
    drawWheel();
  }, [startAngle, segments, segColors, size]);

  // Dibujar la ruleta en el canvas
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el borde exterior de la ruleta con gradiente
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, primaryColor);
    gradient.addColorStop(1, "#0d8a91");
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();

    // Dibujar sombra interna
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fill();
    ctx.closePath();

    // Dibujar los segmentos
    const anglePerSegment = (2 * Math.PI) / segments.length;
    const angleOffset = (startAngle * Math.PI) / 180;

    segments.forEach((segment, i) => {
      const startAngleRad = angleOffset + i * anglePerSegment;
      const endAngleRad = startAngleRad + anglePerSegment;

      // Dibujar segmento con gradiente
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngleRad, endAngleRad);
      ctx.closePath();

      // Crear gradiente radial para cada segmento
      const segGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      );
      const baseColor = segColors[i % segColors.length];
      segGradient.addColorStop(0, baseColor);
      segGradient.addColorStop(1, baseColor + "CC"); // Añadir transparencia

      ctx.fillStyle = segGradient;
      ctx.fill();

      // Borde más elegante
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Dibujar círculo central con gradiente
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.22, 0, Math.PI * 2);
    const centerGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius * 0.22
    );
    centerGradient.addColorStop(0, primaryColor);
    centerGradient.addColorStop(1, "#0d8a91");
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Agregar brillo al círculo central
    ctx.beginPath();
    ctx.arc(centerX - 5, centerY - 5, radius * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fill();
  };

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        margin: "0 auto",
        filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))",
      }}
    >
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

      {/* Iconos SVG posicionados sobre la ruleta */}
      {getIconPositions().map((iconData, index) => (
        <img
          key={`${iconData.segment}-${index}`}
          src={iconData.src}
          alt={iconData.segment}
          style={{
            position: "absolute",
            left: iconData.x - 16, // Centrar el icono (32px / 2)
            top: iconData.y - 16,
            width: "32px",
            height: "32px",
            filter:
              "drop-shadow(2px 2px 3px rgba(0,0,0,0.4)) brightness(0) invert(1)", // Hacer el SVG blanco con sombra
            pointerEvents: "none",
            transition: isSpinning ? "none" : "all 0.3s ease",
            zIndex: 1,
          }}
        />
      ))}

      {/* Flecha simple de un solo color - posicionada en el borde superior */}
      <div
        style={{
          position: "absolute",
          top: "5px", // En el borde superior de la ruleta
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 4,
        }}
      >
        {/* Flecha simple apuntando hacia abajo */}
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "16px solid transparent",
            borderRight: "16px solid transparent",
            borderTop: "45px solid #ffffff", // Flecha blanca para contrastar con la ruleta
            zIndex: 2,
          }}
        />
      </div>

      {/* Botón para girar con diseño mejorado */}
      <button
        onClick={spin}
        disabled={isSpinning}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: isSpinning
            ? "linear-gradient(135deg, #b0b0b0, #888888)"
            : `linear-gradient(135deg, ${primaryColor}, #0d8a91)`,
          color: contrastColor,
          border: "none",
          borderRadius: "50%",
          width: radius * 0.38,
          height: radius * 0.38,
          cursor: isSpinning ? "default" : "pointer",
          fontWeight: "bold",
          fontSize: "12px",
          fontFamily,
          boxShadow: isSpinning
            ? "inset 0 2px 4px rgba(0,0,0,0.3)"
            : `0 4px 12px rgba(22,179,185,0.4), inset 0 1px 0 rgba(255,255,255,0.2)`,
          zIndex: 2,
          transition: "all 0.3s ease",
          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
        }}
      >
        {isSpinning ? "Girando..." : buttonText}
      </button>
    </div>
  );
};

export default Wheel;
