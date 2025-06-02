import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import '../styles/ThemeToggle.css';

const ThemeToggle = () => {
  // Verificar si hay una preferencia guardada en localStorage
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Estado inicial basado en preferencia guardada o preferencia del sistema
  const [isDark, setIsDark] = useState(
    savedTheme ? savedTheme === 'dark' : prefersDark
  );

  // Efecto para aplicar el tema cuando cambia
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Manejar cambio de tema
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? (
        <FaSun className="theme-icon sun" aria-hidden="true" />
      ) : (
        <FaMoon className="theme-icon moon" aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;
