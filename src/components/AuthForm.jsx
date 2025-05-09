import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/AuthForm.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    postal_code: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate(); 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Respuesta del servidor:', data);

        if (isLogin) {
          navigate('/profile'); // al perfil después de login
        } else if (!isLogin) {
          alert('Registro exitoso. ¡Ahora inicia sesión!');
          setIsLogin(true); // cambia automáticamente al login después de registrarse
          setFormData({ full_name: '', postal_code: '', email: '', password: '' });
        } else if (isForgotPassword) {
          alert('Correo de recuperación enviado.');
          setIsForgotPassword(false); // vuelve al login
        }
      } else {
        alert(data.message || 'Ocurrió un error.');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al conectar con el servidor.');
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
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setFormData({
      full_name: '',
      postal_code: '',
      email: '',
      password: ''
    });
  };

  return (
    <div className="auth-container">
      <h2>
        {isForgotPassword
          ? 'Recuperar Contraseña'
          : isLogin
          ? 'Iniciar Sesión'
          : 'Registrarse'}
      </h2>

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && !isForgotPassword && (
          <>
            <input
              type="text"
              name="full_name"
              placeholder="Nombre completo"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="auth-input"
            />
            <input
              type="text"
              name="postal_code"
              placeholder="Código postal"
              value={formData.postal_code}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="auth-input"
        />

        {!isForgotPassword && (
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            className="auth-input"
          />
        )}

        <button type="submit" className="auth-button">
          {isForgotPassword
            ? 'Enviar Recuperación'
            : isLogin
            ? 'Iniciar Sesión'
            : 'Registrarse'}
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
          {isForgotPassword ? 'Volver al Inicio' : '¿Olvidaste tu contraseña?'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
