import { useState, useEffect } from 'react';
import { FaCog, FaTimes, FaFont, FaAdjust, FaPalette, FaMoon, FaSun } from 'react-icons/fa';
import '../styles/CustomizationPanel.css';

const CustomizationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: localStorage.getItem('fontSize') || 'medium',
    contrast: localStorage.getItem('contrast') || 'normal',
    colorAccent: localStorage.getItem('colorAccent') || 'gold',
    animations: localStorage.getItem('animations') !== 'disabled',
    theme: localStorage.getItem('theme') || 'dark'
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
  };
  
  const saveSettings = () => {
    localStorage.setItem('fontSize', settings.fontSize);
    localStorage.setItem('contrast', settings.contrast);
    localStorage.setItem('colorAccent', settings.colorAccent);
    localStorage.setItem('animations', settings.animations ? 'enabled' : 'disabled');
    localStorage.setItem('theme', settings.theme);
  };
  
  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 'medium',
      contrast: 'normal',
      colorAccent: 'gold',
      animations: true,
      theme: 'dark'
    };
    
    setSettings(defaultSettings);
  };
  
  return (
    <div className="customization-container">
      <button 
        className={`customization-toggle ${isOpen ? 'active' : ''}`}
        onClick={togglePanel}
        aria-label="Personalizar sitio"
        title="Personalizar sitio"
      >
        {isOpen ? <FaTimes /> : <FaCog />}
      </button>
      
      {isOpen && (
        <div className="customization-panel">
          <div className="panel-header">
            <h3>Personalización</h3>
            <button 
              className="close-panel"
              onClick={togglePanel}
              aria-label="Cerrar panel"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="panel-content">
            {/* Tamaño de fuente */}
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

export default CustomizationPanel;
