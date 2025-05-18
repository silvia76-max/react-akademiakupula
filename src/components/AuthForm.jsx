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

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (currentUser) {
      if (onClose) onClose();

      // Redirigir según el tipo de usuario
      if (currentUser.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    }
  }, [currentUser, navigate, onClose]);

  // Efecto para animar la entrada del formulario
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector('.auth-container').classList.add('active');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Validación de campos
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'full_name':
        if (value.trim().length < 3) {
          error = 'El nombre debe tener al menos 3 caracteres';
        }
        break;
      case 'postal_code':
        if (!/^\d{5}$/.test(value)) {
          error = 'El código postal debe tener 5 dígitos';
        }
        break;
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Introduce un email válido';
        }
        break;
      case 'password':
        if (value.length < 6) {
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

    if (formSubmitted) {
      const error = validateField(name, value);
      setErrors({
        ...errors,
        [name]: error
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Solo validamos los campos que son relevantes para el modo actual
    if (!isLogin && !isForgotPassword) {
      newErrors.full_name = validateField('full_name', formData.full_name);
      newErrors.postal_code = validateField('postal_code', formData.postal_code);

      if (newErrors.full_name || newErrors.postal_code) {
        isValid = false;
      }
    }

    newErrors.email = validateField('email', formData.email);

    if (!isForgotPassword) {
      newErrors.password = validateField('password', formData.password);
    }

    if (newErrors.email || (!isForgotPassword && newErrors.password)) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setNotification({ show: false, type: '', message: '' });

    try {
      if (isForgotPassword) {
        // Implementar recuperación de contraseña
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
          console.log('Intentando iniciar sesión con:', formData.email);

          // Verificar explícitamente si es el usuario administrador
          const isAdminUser = formData.email === 'admin@gmail.com' && formData.password === 'AkademiaKupula';

          if (isAdminUser) {
            console.log('Detectadas credenciales de administrador');
          }

          // Usar el contexto de autenticación para iniciar sesión con la opción de recordar sesión
          const user = await login({
            email: formData.email,
            password: formData.password
          }, formData.rememberMe);

          console.log('Usuario autenticado:', user);

          // Mostrar notificación de éxito
          setNotification({
            show: true,
            type: 'success',
            message: isAdminUser ? '¡Bienvenido Administrador!' : '¡Inicio de sesión exitoso!'
          });

          // Cerrar el modal después de un breve retraso
          setTimeout(() => {
            if (onClose) onClose();

            // Redirigir según el tipo de usuario
            if (isAdminUser) {
              console.log('Redirigiendo a panel de administración...');
              navigate('/admin');
            } else {
              console.log('Redirigiendo a perfil de usuario...');
              navigate('/profile');
            }
          }, 1000);
        } catch (error) {
          console.error('Error al iniciar sesión:', error);

          // Mostrar mensaje de error específico si está disponible
          let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';

          if (error.message) {
            if (error.message.includes('token')) {
              errorMessage = 'Error en la autenticación. Por favor, inténtalo de nuevo.';
            } else if (error.message.includes('404')) {
              errorMessage = 'Servicio no disponible. Por favor, inténtalo más tarde.';
            } else if (error.message.includes('500')) {
              errorMessage = 'Error en el servidor. Por favor, inténtalo más tarde.';
            }
          }

          setNotification({
            show: true,
            type: 'error',
            message: errorMessage
          });
        }
      } else {
        try {
          // Usar el contexto de autenticación para registrar
          const user = await register(formData);

          // Verificar explícitamente si es el usuario administrador
          const isAdminUser = formData.email === 'admin@gmail.com';

          console.log('Usuario registrado:', user);
          console.log('¿Es administrador?', isAdminUser);

          setNotification({
            show: true,
            type: 'success',
            message: isAdminUser ? '¡Administrador registrado!' : 'Registro exitoso. ¡Bienvenido/a!'
          });

          // Redirigir según el tipo de usuario
          setTimeout(() => {
            if (onClose) onClose();

            if (isAdminUser) {
              console.log('Redirigiendo a panel de administración...');
              navigate('/admin');
            } else {
              console.log('Redirigiendo a perfil de usuario...');
              navigate('/profile');
            }
          }, 1000);
        } catch (error) {
          console.error('Error al registrar:', error);
          setNotification({
            show: true,
            type: 'error',
            message: 'Error al registrar. Inténtalo de nuevo.'
          });
        }
      }
    } catch (error) {
      console.error('Error general:', error);
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

        {/* Opción de recordar sesión (solo para login) */}
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
