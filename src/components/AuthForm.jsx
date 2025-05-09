import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import '../styles/AuthForm.css';

const AuthForm = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    postal_code: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const navigate = useNavigate();

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

    try {
      let endpoint = '';
      let method = '';
      let bodyData = {};

      if (isForgotPassword) {
        endpoint = '/api/auth/recover-password';
        method = 'POST';
        bodyData = { email: formData.email };
      } else if (isLogin) {
        endpoint = '/api/auth/login';
        method = 'POST';
        bodyData = {
          email: formData.email,
          password: formData.password
        };
      } else {
        endpoint = '/api/auth/register';
        method = 'POST';
        bodyData = formData;
      }

      try {
        // Realizar la petición real al backend
        const response = await fetch(`http://localhost:5000${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyData)
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (response.ok) {
          if (isLogin) {
            try {
              // Verificar si los datos vienen en el formato esperado
              const token = data.data?.access_token || data.access_token;
              const userData = data.data?.user || data.user;

              if (token) {
                // Guardar token en localStorage
                localStorage.setItem('token', token);
                console.log('Token guardado:', token);
              } else {
                console.error('No se encontró token en la respuesta');
              }

              if (userData) {
                localStorage.setItem('user', JSON.stringify(userData));
                console.log('Usuario guardado:', userData);
              } else {
                console.error('No se encontraron datos de usuario en la respuesta');
              }

              setNotification({
                show: true,
                type: 'success',
                message: '¡Inicio de sesión exitoso!'
              });

              // Usar un pequeño retraso para evitar problemas de React
              setTimeout(() => {
                if (onClose) onClose();
                navigate('/profile');
              }, 100);
            } catch (err) {
              console.error('Error procesando respuesta de login:', err);
              setNotification({
                show: true,
                type: 'error',
                message: 'Error procesando la respuesta del servidor'
              });
            }
          } else if (!isLogin) {
            setNotification({
              show: true,
              type: 'success',
              message: 'Registro exitoso. ¡Ahora puedes iniciar sesión!'
            });

            // Usar un pequeño retraso para evitar problemas de React
            setTimeout(() => {
              setIsLogin(true);
              setFormData({ full_name: '', postal_code: '', email: '', password: '' });
              setFormSubmitted(false);
            }, 100);
          } else if (isForgotPassword) {
            setNotification({
              show: true,
              type: 'success',
              message: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.'
            });

            // Usar un pequeño retraso para evitar problemas de React
            setTimeout(() => {
              setIsForgotPassword(false);
              setFormData({ ...formData, email: '' });
              setFormSubmitted(false);
            }, 100);
          }
        } else {
          setNotification({
            show: true,
            type: 'error',
            message: data.message || 'Ocurrió un error. Inténtalo de nuevo.'
          });
        }
      } catch (fetchError) {
        console.error('Error en fetch:', fetchError);
        setNotification({
          show: true,
          type: 'error',
          message: 'Error de conexión con el servidor'
        });
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
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
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
