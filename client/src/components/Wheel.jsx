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

  // Función para obtener iconos SVG basados en la categoría
  const getCategoryIcon = (categoryName) => {
    const category = categoryName.toLowerCase().trim();

    // SVG paths para diferentes categorías (más simples y reconocibles)
    const icons = {
      deportes:
        "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M7,9V11H17V9H7M7,13V15H17V13H7Z",
      historia:
        "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z",
      ciencia:
        "M7,2V4H8V18A4,4 0 0,0 12,22A4,4 0 0,0 16,18V4H17V2H7M11,16C10.4,16 10,15.6 10,15C10,14.4 10.4,14 11,14C11.6,14 12,14.4 12,15C12,15.6 11.6,16 11,16M13,12C12.4,12 12,11.6 12,11C12,10.4 12.4,10 13,10C13.6,10 14,10.4 14,11C14,11.6 13.6,12 13,12M14,7H10V4H14V7Z",
      arte: "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z",
      geografía:
        "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22S19,14.25 19,9A7,7 0 0,0 12,2Z",
      geografia:
        "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22S19,14.25 19,9A7,7 0 0,0 12,2Z",
      entretenimiento: "M8,5.14V19.14L19,12.14L8,5.14Z",
      default:
        "M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2Z",
    };

    return icons[category] || icons["default"];
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

      // Calcular posición para el icono
      const iconAngle = startAngleRad + anglePerSegment / 2;
      const iconDistance = radius * 0.75;
      const iconX = centerX + iconDistance * Math.cos(iconAngle);
      const iconY = centerY + iconDistance * Math.sin(iconAngle);

      // Dibujar el icono con sombra
      const iconPath = getCategoryIcon(segment);

      // Sombra del icono
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      drawIcon(ctx, iconPath, iconX, iconY, 32, contrastColor);
      ctx.restore();
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
