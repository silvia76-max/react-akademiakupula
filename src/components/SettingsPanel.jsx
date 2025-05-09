import { useState, useEffect } from 'react';
import { 
  FaCog, 
  FaTimes, 
  FaFont, 
  FaAdjust, 
  FaPalette, 
  FaMoon, 
  FaSun,
  FaUniversalAccess,
  FaKeyboard
} from 'react-icons/fa';
import '../styles/SettingsPanel.css';

const SettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('personalization');
  const [settings, setSettings] = useState({
    fontSize: localStorage.getItem('fontSize') || 'medium',
    contrast: localStorage.getItem('contrast') || 'normal',
    colorAccent: localStorage.getItem('colorAccent') || 'gold',
    animations: localStorage.getItem('animations') !== 'disabled',
    theme: localStorage.getItem('theme') || 'dark',
    shortcuts: localStorage.getItem('accessibilityShortcuts') === 'enabled'
  });
  
  // Aplicar configuraciones al cargar
  useEffect(() => {
    applySettings();
  }, []);
  
  // Aplicar configuraciones cuando cambian
  useEffect(() => {
    applySettings();
    saveSettings();
  }, [settings]);
  
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const applySettings = () => {
    // Aplicar tamaño de fuente
    document.documentElement.setAttribute('data-font-size', settings.fontSize);
    
    // Aplicar contraste
    document.documentElement.setAttribute('data-contrast', settings.contrast);
    
    // Aplicar color de acento
    document.documentElement.setAttribute('data-color-accent', settings.colorAccent);
    
    // Aplicar animaciones
    if (settings.animations) {
      document.documentElement.classList.remove('reduce-animations');
    } else {
      document.documentElement.classList.add('reduce-animations');
    }
    
    // Aplicar tema
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Aplicar atajos de teclado
    if (settings.shortcuts) {
      setupKeyboardShortcuts();
    } else {
      removeKeyboardShortcuts();
    }
  };
  
  const saveSettings = () => {
    localStorage.setItem('fontSize', settings.fontSize);
    localStorage.setItem('contrast', settings.contrast);
    localStorage.setItem('colorAccent', settings.colorAccent);
    localStorage.setItem('animations', settings.animations ? 'enabled' : 'disabled');
    localStorage.setItem('theme', settings.theme);
    localStorage.setItem('accessibilityShortcuts', settings.shortcuts ? 'enabled' : 'disabled');
  };
  
  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 'medium',
      contrast: 'normal',
      colorAccent: 'gold',
      animations: true,
      theme: 'dark',
      shortcuts: false
    };
    
    setSettings(defaultSettings);
  };
  
  // Funciones de accesibilidad
  const increaseTextSize = () => {
    const currentSize = settings.fontSize;
    
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
    
    handleSettingChange('fontSize', newSize);
  };
  
  const decreaseTextSize = () => {
    const currentSize = settings.fontSize;
    
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
    
    handleSettingChange('fontSize', newSize);
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
        handleSettingChange('theme', settings.theme === 'dark' ? 'light' : 'dark');
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="settings-container">
      <button 
        className={`settings-toggle ${isOpen ? 'active' : ''}`}
        onClick={togglePanel}
        aria-label="Configuración y accesibilidad"
        title="Configuración y accesibilidad"
      >
        {isOpen ? <FaTimes /> : <FaCog />}
      </button>
      
      {isOpen && (
        <div className="settings-panel">
          <div className="panel-header">
            <h3>Configuración</h3>
            <button 
              className="close-panel"
              onClick={togglePanel}
              aria-label="Cerrar panel"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="panel-tabs">
            <button 
              className={`tab-button ${activeTab === 'personalization' ? 'active' : ''}`}
              onClick={() => setActiveTab('personalization')}
              aria-label="Personalización"
            >
              <FaPalette />
              <span>Personalización</span>
            </button>
            <button 
              className={`tab-button ${activeTab === 'accessibility' ? 'active' : ''}`}
              onClick={() => setActiveTab('accessibility')}
              aria-label="Accesibilidad"
            >
              <FaUniversalAccess />
              <span>Accesibilidad</span>
            </button>
          </div>
          
          <div className="panel-content">
            {activeTab === 'personalization' && (
              <div className="tab-content">
                {/* Color de acento */}
                <div className="setting-group">
                  <div className="setting-header">
                    <FaPalette className="setting-icon" />
                    <h4>Color de acento</h4>
                  </div>
                  <div className="setting-options color-options">
                    <button 
                      className={`color-option gold ${settings.colorAccent === 'gold' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('colorAccent', 'gold')}
                      aria-label="Color dorado"
                    ></button>
                    <button 
                      className={`color-option purple ${settings.colorAccent === 'purple' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('colorAccent', 'purple')}
                      aria-label="Color púrpura"
                    ></button>
                    <button 
                      className={`color-option teal ${settings.colorAccent === 'teal' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('colorAccent', 'teal')}
                      aria-label="Color turquesa"
                    ></button>
                    <button 
                      className={`color-option rose ${settings.colorAccent === 'rose' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('colorAccent', 'rose')}
                      aria-label="Color rosa"
                    ></button>
                  </div>
                </div>
                
                {/* Tema */}
                <div className="setting-group">
                  <div className="setting-header">
                    {settings.theme === 'dark' ? (
                      <FaMoon className="setting-icon" />
                    ) : (
                      <FaSun className="setting-icon" />
                    )}
                    <h4>Tema</h4>
                  </div>
                  <div className="setting-options">
                    <button 
                      className={`option-btn ${settings.theme === 'dark' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('theme', 'dark')}
                    >
                      Oscuro
                    </button>
                    <button 
                      className={`option-btn ${settings.theme === 'light' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('theme', 'light')}
                    >
                      Claro
                    </button>
                  </div>
                </div>
                
                {/* Animaciones */}
                <div className="setting-group">
                  <div className="setting-header">
                    <span className="setting-icon">✨</span>
                    <h4>Animaciones</h4>
                  </div>
                  <div className="setting-toggle">
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={settings.animations}
                        onChange={() => handleSettingChange('animations', !settings.animations)}
                      />
                      <span className="slider round"></span>
                    </label>
                    <span>{settings.animations ? 'Activadas' : 'Desactivadas'}</span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'accessibility' && (
              <div className="tab-content">
                {/* Tamaño de texto */}
                <div className="setting-group">
                  <div className="setting-header">
                    <FaFont className="setting-icon" />
                    <h4>Tamaño de texto</h4>
                  </div>
                  <div className="setting-options">
                    <button 
                      className={`option-btn ${settings.fontSize === 'small' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('fontSize', 'small')}
                    >
                      A<span className="visually-hidden"> (Pequeño)</span>
                    </button>
                    <button 
                      className={`option-btn ${settings.fontSize === 'medium' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('fontSize', 'medium')}
                    >
                      A<span className="visually-hidden"> (Mediano)</span>
                    </button>
                    <button 
                      className={`option-btn ${settings.fontSize === 'large' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('fontSize', 'large')}
                    >
                      A<span className="visually-hidden"> (Grande)</span>
                    </button>
                  </div>
                </div>
                
                {/* Contraste */}
                <div className="setting-group">
                  <div className="setting-header">
                    <FaAdjust className="setting-icon" />
                    <h4>Contraste</h4>
                  </div>
                  <div className="setting-options">
                    <button 
                      className={`option-btn ${settings.contrast === 'normal' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('contrast', 'normal')}
                    >
                      Normal
                    </button>
                    <button 
                      className={`option-btn ${settings.contrast === 'high' ? 'active' : ''}`}
                      onClick={() => handleSettingChange('contrast', 'high')}
                    >
                      Alto
                    </button>
                  </div>
                </div>
                
                {/* Atajos de teclado */}
                <div className="setting-group keyboard-shortcuts">
                  <div className="setting-header">
                    <FaKeyboard className="setting-icon" />
                    <h4>Atajos de teclado</h4>
                  </div>
                  
                  <div className="setting-toggle">
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={settings.shortcuts}
                        onChange={() => handleSettingChange('shortcuts', !settings.shortcuts)}
                        aria-label="Activar atajos de teclado"
                      />
                      <span className="slider round"></span>
                    </label>
                    <span>{settings.shortcuts ? 'Activados' : 'Desactivados'}</span>
                  </div>
                  
                  {settings.shortcuts && (
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
            )}
            
            {/* Botón de reinicio */}
            <button 
              className="reset-btn"
              onClick={resetSettings}
              aria-label="Restablecer configuración predeterminada"
            >
              Restablecer valores predeterminados
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
