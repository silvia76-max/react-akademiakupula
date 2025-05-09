import { useEffect, useRef, useState } from 'react';
import '../styles/ParticlesBackground.css';

const ParticlesBackground = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  
  // Configuración de partículas
  const particleCount = 50;
  const particleProps = {
    color: '#ffd700',
    minSize: 1,
    maxSize: 3,
    minSpeed: 0.1,
    maxSpeed: 0.5,
    minOpacity: 0.1,
    maxOpacity: 0.7
  };
  
  // Inicializar dimensiones
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const { clientWidth, clientHeight } = document.documentElement;
        setDimensions({
          width: clientWidth,
          height: clientHeight
        });
        canvasRef.current.width = clientWidth;
        canvasRef.current.height = clientHeight;
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Inicializar partículas
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    // Crear partículas
    particlesRef.current = Array(particleCount).fill().map(() => createParticle());
    
    // Mostrar el canvas con una animación
    setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    // Iniciar animación
    startAnimation();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);
  
  // Verificar si las animaciones están desactivadas
  useEffect(() => {
    const checkAnimations = () => {
      const animationsDisabled = document.documentElement.classList.contains('reduce-animations');
      if (animationsDisabled && animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        clearCanvas();
      } else if (!animationsDisabled && !animationRef.current) {
        startAnimation();
      }
    };
    
    checkAnimations();
    
    // Observar cambios en la clase reduce-animations
    const observer = new MutationObserver(checkAnimations);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Crear una partícula
  const createParticle = () => {
    return {
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: Math.random() * (particleProps.maxSize - particleProps.minSize) + particleProps.minSize,
      speedX: (Math.random() - 0.5) * (particleProps.maxSpeed - particleProps.minSpeed) + particleProps.minSpeed,
      speedY: (Math.random() - 0.5) * (particleProps.maxSpeed - particleProps.minSpeed) + particleProps.minSpeed,
      opacity: Math.random() * (particleProps.maxOpacity - particleProps.minOpacity) + particleProps.minOpacity
    };
  };
  
  // Limpiar el canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  
  // Iniciar la animación
  const startAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar y actualizar partículas
      particlesRef.current.forEach(particle => {
        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${particle.opacity})`;
        ctx.fill();
        
        // Actualizar posición
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Rebote en los bordes
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`particles-canvas ${isVisible ? 'visible' : ''}`}
      aria-hidden="true"
    />
  );
};

export default ParticlesBackground;
