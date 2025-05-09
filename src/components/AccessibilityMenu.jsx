import { useState } from 'react';
import { FaUniversalAccess, FaTimes, FaKeyboard } from 'react-icons/fa';
import '../styles/AccessibilityMenu.css';

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeShortcuts, setActiveShortcuts] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleShortcuts = () => {
    setActiveShortcuts(!activeShortcuts);
    
    // Guardar preferencia
    localStorage.setItem('accessibilityShortcuts', !activeShortcuts ? 'enabled' : 'disabled');
    
    // Aplicar o quitar los atajos de teclado
    if (!activeShortcuts) {
      setupKeyboardShortcuts();
    } else {
      removeKeyboardShortcuts();
    }
  };
  
  // Configurar atajos de teclado
  const setupKeyboardShortcuts = () => {
    document.addEventListener('keydown', handleKeyboardShortcuts);
  };
  
  // Eliminar atajos de teclado
  const removeKeyboardShortcuts = () => {
    document.removeEventListener('keydown', handleKeyboardShortcuts);
  };
  
  // Manejar atajos de teclado
  const handleKeyboardShortcuts = (e) => {
    // Solo procesar si Alt está presionada
    if (!e.altKey) return;
    
    switch (e.key) {
      case 'h': // Inicio
        e.preventDefault();
        window.location.href = '#inicio';
        break;
      case 'c': // Cursos
        e.preventDefault();
        window.location.href = '#cursos';
        break;
      case 'a': // Sobre nosotros
        e.preventDefault();
        window.location.href = '#sobre';
        break;
      case 'o': // Contacto
        e.preventDefault();
        window.location.href = '#contacto';
        break;
      case 't': // Cambiar tema
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
        localStorage.setItem('theme', currentTheme === 'dark' ? 'light' : 'dark');
        break;
      default:
        break;
    }
  };
  
  // Funciones de accesibilidad
  const increaseTextSize = () => {
    const html = document.documentElement;
    const currentSize = html.getAttribute('data-font-size') || 'medium';
    
    let newSize;
    switch (currentSize) {
      case 'small':
        newSize = 'medium';
        break;
      case 'medium':
        newSize = 'large';
        break;
      default:
        newSize = 'large';
    }
    
    html.setAttribute('data-font-size', newSize);
    localStorage.setItem('fontSize', newSize);
  };
  
  const decreaseTextSize = () => {
    const html = document.documentElement;
    const currentSize = html.getAttribute('data-font-size') || 'medium';
    
    let newSize;
    switch (currentSize) {
      case 'large':
        newSize = 'medium';
        break;
      case 'medium':
        newSize = 'small';
        break;
      default:
        newSize = 'small';
    }
    
    html.setAttribute('data-font-size', newSize);
    localStorage.setItem('fontSize', newSize);
  };
  
  const toggleHighContrast = () => {
    const html = document.documentElement;
    const currentContrast = html.getAttribute('data-contrast') || 'normal';
    const newContrast = currentContrast === 'normal' ? 'high' : 'normal';
    
    html.setAttribute('data-contrast', newContrast);
    localStorage.setItem('contrast', newContrast);
  };
  
  const toggleAnimations = () => {
    const html = document.documentElement;
    const hasReducedAnimations = html.classList.contains('reduce-animations');
    
    if (hasReducedAnimations) {
      html.classList.remove('reduce-animations');
      localStorage.setItem('animations', 'enabled');
    } else {
      html.classList.add('reduce-animations');
      localStorage.setItem('animations', 'disabled');
    }
  };
  
  return (
    <div className="accessibility-container">
      <button 
        className={`accessibility-toggle ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Menú de accesibilidad"
        title="Menú de accesibilidad"
      >
        {isOpen ? <FaTimes /> : <FaUniversalAccess />}
      </button>
      
      {isOpen && (
        <div className="accessibility-menu">
          <div className="menu-header">
            <h3>Accesibilidad</h3>
            <button 
              className="close-menu"
              onClick={toggleMenu}
              aria-label="Cerrar menú"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="menu-content">
            <div className="accessibility-option">
              <button 
                onClick={increaseTextSize}
                aria-label="Aumentar tamaño de texto"
              >
                Aumentar texto (A+)
              </button>
            </div>
            
            <div className="accessibility-option">
              <button 
                onClick={decreaseTextSize}
                aria-label="Disminuir tamaño de texto"
              >
                Disminuir texto (A-)
              </button>
            </div>
            
            <div className="accessibility-option">
              <button 
                onClick={toggleHighContrast}
                aria-label="Alternar alto contraste"
              >
                Alto contraste
              </button>
            </div>
            
            <div className="accessibility-option">
              <button 
                onClick={toggleAnimations}
                aria-label="Reducir animaciones"
              >
                Reducir animaciones
              </button>
            </div>
            
            <div className="accessibility-option keyboard-shortcuts">
              <div className="option-header">
                <FaKeyboard className="option-icon" />
                <h4>Atajos de teclado</h4>
              </div>
              
              <div className="option-toggle">
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={activeShortcuts}
                    onChange={toggleShortcuts}
                    aria-label="Activar atajos de teclado"
                  />
                  <span className="slider round"></span>
                </label>
                <span>{activeShortcuts ? 'Activados' : 'Desactivados'}</span>
              </div>
              
              {activeShortcuts && (
                <div className="shortcuts-list">
                  <p>Usa Alt + la tecla indicada:</p>
                  <ul>
                    <li><strong>Alt + H</strong>: Inicio</li>
                    <li><strong>Alt + C</strong>: Cursos</li>
                    <li><strong>Alt + A</strong>: Sobre nosotros</li>
                    <li><strong>Alt + O</strong>: Contacto</li>
                    <li><strong>Alt + T</strong>: Cambiar tema</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityMenu;
