import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthForm.css';
import '../styles/RememberMe.css';

const AuthForm = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    postal_code: '',
    email: '',
    password: '',
    rememberMe: true
  });
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const navigate = useNavigate();
  const { login, register, currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        if (onClose) onClose();
        if (currentUser.is_admin) {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      }, 50);
    }
  }, [currentUser, navigate, onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const container = document.querySelector('.auth-container');
      if (container) {
        container.classList.add('active');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'full_name':
        if (value.trim().length < 3) error = 'El nombre debe tener al menos 3 caracteres';
        break;
      case 'postal_code':
        if (!/^\d{5}$/.test(value)) error = 'El código postal debe tener 5 dígitos';
        break;
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) error = 'Introduce un email válido';
        break;
      case 'password':
        if (value.length < 6) error = 'La contraseña debe tener al menos 6 caracteres';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formSubmitted) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    if (!isLogin && !isForgotPassword) {
      newErrors.full_name = validateField('full_name', formData.full_name);
      newErrors.postal_code = validateField('postal_code', formData.postal_code);
      if (newErrors.full_name || newErrors.postal_code) isValid = false;
    }
    newErrors.email = validateField('email', formData.email);
    if (!isForgotPassword) newErrors.password = validateField('password', formData.password);
    if (newErrors.email || (!isForgotPassword && newErrors.password)) isValid = false;
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!validateForm()) return;
    setIsLoading(true);
    setNotification({ show: false, type: '', message: '' });

    try {
      if (isForgotPassword) {
        setNotification({
          show: true,
          type: 'success',
          message: 'Si tu email está registrado, recibirás instrucciones para recuperar tu contraseña.'
        });
        setTimeout(() => {
          setIsForgotPassword(false);
          setFormData({ ...formData, email: '' });
        }, 2000);
      } else if (isLogin) {
        try {
          const user = await login({
            email: formData.email,
            password: formData.password
          }, formData.rememberMe);

          if (!user) throw new Error('No se recibieron datos de usuario después del login');
        } catch {
          setNotification({
            show: true,
            type: 'error',
            message: 'Error al iniciar sesión. Verifica tus credenciales.'
          });
        }
        setNotification({
          show: true,
          type: 'success',
          message: '¡Inicio de sesión exitoso!'
        });
        setTimeout(() => {
          // Recupera el usuario actualizado del storage/context
          const user = JSON.parse(localStorage.getItem('akademia_user_data')) || {};
          if (user.is_admin) {
            navigate('/admin');
          } else {
            navigate('/profile');
          }
          setTimeout(() => { if (onClose) onClose(); }, 100);
        }, 1000);
      } else {
        try {
          await register(formData);
          setNotification({
            show: true,
            type: 'success',
            message: 'Registro exitoso. ¡Bienvenido/a!'
          });
          setTimeout(() => {
            navigate('/profile');
            setTimeout(() => { if (onClose) onClose(); }, 100);
          }, 1000);
        } catch {
          setNotification({
            show: true,
            type: 'error',
            message: 'Error al registrar. Inténtalo de nuevo.'
          });
        }
      }
    } catch {
      setNotification({
        show: true,
        type: 'error',
        message: 'Hubo un problema al procesar la solicitud.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setFormData({
      full_name: '',
      postal_code: '',
      email: '',
      password: ''
    });
    setErrors({});
    setFormSubmitted(false);
    setNotification({ show: false, type: '', message: '' });
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setFormData({
      ...formData,
      email: isForgotPassword ? '' : formData.email,
      password: ''
    });
    setErrors({});
    setFormSubmitted(false);
    setNotification({ show: false, type: '', message: '' });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>
          {isForgotPassword
            ? 'Recuperar Contraseña'
            : isLogin
            ? 'Iniciar Sesión'
            : 'Crear Cuenta'}
        </h2>
        <p className="auth-subtitle">
          {isForgotPassword
            ? 'Introduce tu email para recuperar tu contraseña'
            : isLogin
            ? 'Accede a tu cuenta para disfrutar de todos los beneficios'
            : 'Únete a nuestra comunidad y descubre nuestros cursos'}
        </p>
      </div>

      {notification.show && (
        <div className={`auth-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && !isForgotPassword && (
          <>
            <div className="form-group">
              <label htmlFor="full_name" className="form-label">Nombre completo</label>
              <div className="input-group">
                <span className="input-icon"><FaUser /></span>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  placeholder="Ej. María García"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`auth-input ${errors.full_name ? 'error' : ''}`}
                />
              </div>
              {errors.full_name && <span className="error-message">{errors.full_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="postal_code" className="form-label">Código postal</label>
              <div className="input-group">
                <span className="input-icon"><FaMapMarkerAlt /></span>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  placeholder="Ej. 48004"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className={`auth-input ${errors.postal_code ? 'error' : ''}`}
                />
              </div>
              {errors.postal_code && <span className="error-message">{errors.postal_code}</span>}
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <div className="input-group">
            <span className="input-icon"><FaEnvelope /></span>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              className={`auth-input ${errors.email ? 'error' : ''}`}
            />
          </div>
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {!isForgotPassword && (
          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-icon"><FaLock /></span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className={`auth-input ${errors.password ? 'error' : ''}`}
              />
              <span
                role="button"
                tabIndex={0}
                className="password-toggle"
                onClick={togglePasswordVisibility}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    togglePasswordVisibility();
                  }
                }}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
        )}

        {isLogin && !isForgotPassword && (
          <div className="remember-me-container">
            <label className="remember-me-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({
                  ...formData,
                  rememberMe: e.target.checked
                })}
                className="remember-me-checkbox"
              />
              <span>Recordar mi sesión</span>
            </label>
          </div>
        )}

        <button
          type="submit"
          className={`auth-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <><FaSpinner className="spinner" /> Procesando...</>
          ) : (
            isForgotPassword
              ? 'Enviar Instrucciones'
              : isLogin
              ? 'Iniciar Sesión'
              : 'Crear Cuenta'
          )}
        </button>
      </form>

      <div className="auth-links">
        {!isForgotPassword && (
          <button onClick={toggleMode} className="auth-link">
            {isLogin
              ? '¿No tienes cuenta? Regístrate'
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        )}
        <button onClick={toggleForgotPassword} className="auth-link">
          {isForgotPassword ? 'Volver al inicio de sesión' : '¿Olvidaste tu contraseña?'}
        </button>
      </div>

      <div className="auth-footer">
        <p>Al continuar, aceptas nuestros <a href="/terminos" onClick={(e) => { e.preventDefault(); }}>Términos de Servicio</a> y <a href="/privacidad" onClick={(e) => { e.preventDefault(); }}>Política de Privacidad</a>.</p>
      </div>
    </div>
  );
};

export default AuthForm;
