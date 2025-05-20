import React, { useState, useRef, useEffect } from 'react';

const Wheel = ({ segments, segColors, winningSegment, onFinished, primaryColor = '#30609b', contrastColor = '#ffffff', buttonText = 'Girar', size = 290, fontFamily = 'proxima-nova' }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [currentSegment, setCurrentSegment] = useState(null);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const timerDelay = 33; // ~30fps
  const spinTime = 8000; // 8 segundos de giro
  const spinTimeTotal = 8000;
  // Definir radius aquí para que esté disponible en todo el componente
  const radius = size / 2 - 10;

  // Variables para la animación
  const spinData = useRef({
    startTime: 0,
    angleDelta: 0,
    spinTime: 0,
    spinTimeTotal: 0
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
    const angle = easeOut(timeRemaining, 0, spinData.current.angleDelta, spinData.current.spinTimeTotal);

    const angleToStop = calculateSegmentAngle(segments.indexOf(winningSegment), segments.length);
    const newAngle = (360 * 10) + angleToStop + angle;

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

    // Configurar la animación
    spinData.current = {
      startTime: new Date().getTime(),
      angleDelta: 360,  // Angulo total que se moverá
      spinTime: 0,
      spinTimeTotal: spinTimeTotal
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

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    // Ya no necesitamos definir radius aquí, porque ya lo tenemos definido arriba

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el borde de la ruleta
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
    ctx.fillStyle = primaryColor;
    ctx.fill();
    ctx.closePath();

    // Dibujar los segmentos
    const anglePerSegment = 2 * Math.PI / segments.length;
    const angleOffset = (startAngle * Math.PI) / 180;

    segments.forEach((segment, i) => {
      const startAngleRad = angleOffset + i * anglePerSegment;
      const endAngleRad = startAngleRad + anglePerSegment;

      // Dibujar segmento
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngleRad, endAngleRad);
      ctx.closePath();
      ctx.fillStyle = segColors[i % segColors.length];
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Dibujar texto
      ctx.save();
      ctx.translate(
        centerX + 0.8 * radius * Math.cos(startAngleRad + anglePerSegment / 2),
        centerY + 0.8 * radius * Math.sin(startAngleRad + anglePerSegment / 2)
      );
      ctx.rotate(startAngleRad + anglePerSegment / 2 + Math.PI / 2);
      ctx.textAlign = "center";
      ctx.fillStyle = contrastColor;
      ctx.font = `bold 12px ${fontFamily}`;

      // Limitar el texto si es muy largo
      const text = segment.length > 10 ? segment.substring(0, 10) + '...' : segment;
      ctx.fillText(text, 0, 0);
      ctx.restore();
    });

    // Dibujar círculo central
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = primaryColor;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      {/* Canvas para dibujar la ruleta */}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />

      {/* Indicador de la ruleta (flecha) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderBottom: '30px solid #333',
          zIndex: 2
        }}
      />

      {/* Botón para girar */}
      <button
        onClick={spin}
        disabled={isSpinning}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: isSpinning ? '#cccccc' : primaryColor,
          color: contrastColor,
          border: 'none',
          borderRadius: '50%',
          width: radius * 0.38,
          height: radius * 0.38,
          cursor: isSpinning ? 'default' : 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
          fontFamily,
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          zIndex: 1
        }}
      >
        {isSpinning ? 'Girando...' : buttonText}
      </button>
    </div>
  );
};

export default Wheel;
