import { useState, useRef, useEffect } from 'react';

const GlareHover = ({
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.3,
  glareAngle = -30,
  glareSize = 300,
  transitionDuration = 800,
  playOnce = false,
}) => {
  const [glarePosition, setGlarePosition] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handleMouseMove = (e) => {
    if (playOnce && hasPlayed) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setGlarePosition({ x, y });
    if (playOnce) setHasPlayed(true);
  };

  const handleMouseLeave = () => {
    if (!playOnce) {
      setGlarePosition({ x: -1000, y: -1000 });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden"
      style={{ position: 'relative' }}
    >
      {children}
      <div
        className="pointer-events-none absolute rounded-full opacity-0 transition-opacity"
        style={{
          left: `${glarePosition.x}px`,
          top: `${glarePosition.y}px`,
          width: `${glareSize}px`,
          height: `${glareSize}px`,
          background: `radial-gradient(circle, ${glareColor} 0%, transparent 70%)`,
          opacity: glarePosition.x > -500 ? glareOpacity : 0,
          transform: `translate(-50%, -50%) rotate(${glareAngle}deg)`,
          transition: `opacity ${transitionDuration}ms ease-out`,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
};

export default GlareHover;

