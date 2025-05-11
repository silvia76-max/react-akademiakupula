import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [redirectMessage, setRedirectMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verificar si hay un mensaje de redirección
    if (location.state?.message) {
      setRedirectMessage(location.state.message);
    }
    
    // Verificar si el usuario ya está autenticado
    const token = localStorage.getItem('token');
    if (token) {
      // Si hay una ruta de redirección, navegar a ella
      if (location.state?.redirectTo) {
        navigate(location.state.redirectTo);
      } else {
        navigate('/profile');
      }
    }
  }, [navigate, location]);

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'email':
        if (!value) {
          error = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Introduce un email válido';
        }
        break;
      case 'password':
        if (!value) {
          error = 'La contraseña es obligatoria';
        } else if (value.length < 6) {
          error = 'La contraseña debe tener al menos 6 caracteres';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validar el campo cuando cambia
    const error = validateField(name, value);
    setFormErrors({
      ...formErrors,
      [name]: error
    });
  };

  const validateForm = () => {
    const errors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar el formulario antes de enviar
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setLoginError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Guardar el token en localStorage
        localStorage.setItem('token', data.token);
        
        // Redirigir al usuario
        if (location.state?.redirectTo) {
          navigate(location.state.redirectTo);
        } else {
          navigate('/profile');
        }
      } else {
        setLoginError(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error:', error);
      setLoginError('Error de conexión. Inténtalo de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Iniciar Sesión</h1>
          
          {redirectMessage && (
            <div className="redirect-message">
              <FaExclamationTriangle className="message-icon" />
              <p>{redirectMessage}</p>
            </div>
          )}
          
          {loginError && (
            <div className="error-message">
              <FaExclamationTriangle className="message-icon" />
              <p>{loginError}</p>
            </div>
          )}
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className={`input-container ${formErrors.email ? 'error' : ''}`}>
                <FaUser className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Tu email"
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.email && <p className="field-error">{formErrors.email}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className={`input-container ${formErrors.password ? 'error' : ''}`}>
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tu contraseña"
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.password && <p className="field-error">{formErrors.password}</p>}
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="spinner" />
                  <span>Iniciando sesión...</span>
                </>
              ) : 'Iniciar Sesión'}
            </button>
          </form>
          
          <div className="login-footer">
            <p>¿No tienes una cuenta? <a href="/register">Regístrate</a></p>
            <p><a href="/forgot-password">¿Olvidaste tu contraseña?</a></p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
