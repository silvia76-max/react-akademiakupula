import { useState } from 'react';
import '../styles/TestForm.css';

function TestForm() {
  const [formData, setFormData] = useState({
    full_name: 'Usuario Test',
    postal_code: '28001',
    email: 'test@example.com',
    password: 'password123'
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const testRegister = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      console.log('Enviando solicitud de registro:', formData);

      // Usar fetch con un timeout para evitar que se quede esperando indefinidamente
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Respuesta recibida:', res.status);
      const data = await res.json();
      console.log('Respuesta del registro:', data);
      setResponse(data);

      // Si el registro es exitoso, guardar el token
      if (res.ok && data.data?.access_token) {
        localStorage.setItem('token', data.data.access_token);
        console.log('Token guardado:', data.data.access_token);

        // También guardar los datos del usuario
        if (data.data?.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
          console.log('Usuario guardado:', data.data.user);
        }
      }
    } catch (err) {
      console.error('Error en el registro:', err);
      setError(err.message || 'Error de conexión');

      // Si hay un error de conexión, usar una respuesta simulada para demostración
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const simulatedResponse = {
        success: true,
        message: "Registro exitoso (SIMULADO - Error de conexión con el servidor)",
        data: {
          access_token: token,
          user: {
            id: 1,
            full_name: formData.full_name,
            email: formData.email,
            postal_code: formData.postal_code
          }
        }
      };
      setResponse(simulatedResponse);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(simulatedResponse.data.user));
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      console.log('Enviando solicitud de login:', { email: formData.email, password: formData.password });

      // Usar fetch con un timeout para evitar que se quede esperando indefinidamente
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Respuesta recibida:', res.status);
      const data = await res.json();
      console.log('Respuesta del login:', data);
      setResponse(data);

      // Si el login es exitoso, guardar el token
      if (res.ok && data.data?.access_token) {
        localStorage.setItem('token', data.data.access_token);
        console.log('Token guardado:', data.data.access_token);

        // También guardar los datos del usuario
        if (data.data?.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
          console.log('Usuario guardado:', data.data.user);
        }
      }
    } catch (err) {
      console.error('Error en el login:', err);
      setError(err.message || 'Error de conexión');

      // Si hay un error de conexión, usar una respuesta simulada para demostración
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const simulatedResponse = {
        success: true,
        message: "Inicio de sesión exitoso (SIMULADO - Error de conexión con el servidor)",
        data: {
          access_token: token,
          user: {
            id: 1,
            full_name: formData.full_name,
            email: formData.email,
            postal_code: formData.postal_code
          }
        }
      };
      setResponse(simulatedResponse);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(simulatedResponse.data.user));
    } finally {
      setLoading(false);
    }
  };

  const testProfile = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No hay token. Inicia sesión primero.');
      setLoading(false);
      return;
    }

    try {
      console.log('Enviando solicitud de perfil con token:', token);

      // Usar fetch con un timeout para evitar que se quede esperando indefinidamente
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Respuesta recibida:', res.status);
      const data = await res.json();
      console.log('Respuesta del perfil:', data);
      setResponse(data);
    } catch (err) {
      console.error('Error al obtener perfil:', err);
      setError(err.message || 'Error de conexión');

      // Si hay un error de conexión, usar una respuesta simulada para demostración
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {
        id: 1,
        full_name: formData.full_name,
        email: formData.email,
        postal_code: formData.postal_code
      };

      const simulatedResponse = {
        success: true,
        message: "Perfil obtenido correctamente (SIMULADO - Error de conexión con el servidor)",
        data: user
      };
      setResponse(simulatedResponse);
    } finally {
      setLoading(false);
    }
  };

  const testContact = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const contactData = {
        nombre: formData.full_name,
        email: formData.email,
        telefono: '612345678',
        curso: 'maquillaje',
        mensaje: 'Mensaje de prueba desde TestForm'
      };

      console.log('Enviando solicitud de contacto:', contactData);

      // Usar fetch con un timeout para evitar que se quede esperando indefinidamente
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch('http://localhost:5000/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(contactData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Respuesta recibida:', res.status);
      const data = await res.json();
      console.log('Respuesta del contacto:', data);
      setResponse(data);
    } catch (err) {
      console.error('Error al enviar contacto:', err);
      setError(err.message || 'Error de conexión');

      // Si hay un error de conexión, usar una respuesta simulada para demostración
      const contactData = {
        nombre: formData.full_name,
        email: formData.email,
        telefono: '612345678',
        curso: 'maquillaje',
        mensaje: 'Mensaje de prueba desde TestForm'
      };

      const simulatedResponse = {
        success: true,
        message: "Mensaje enviado correctamente (SIMULADO - Error de conexión con el servidor)",
        data: {
          id: Math.floor(Math.random() * 1000),
          nombre: contactData.nombre,
          email: contactData.email
        }
      };
      setResponse(simulatedResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-form-container">
      <h2>Simulador de Registro y Login</h2>

      <div className="test-form-fields">
        <div className="test-form-field">
          <label htmlFor="full_name">Nombre completo:</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />
        </div>

        <div className="test-form-field">
          <label htmlFor="postal_code">Código postal:</label>
          <input
            type="text"
            id="postal_code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
          />
        </div>

        <div className="test-form-field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="test-form-field">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="test-form-buttons">
        <button
          className="test-button test-button-register"
          onClick={testRegister}
          disabled={loading}
        >
          Probar Registro
        </button>

        <button
          className="test-button test-button-login"
          onClick={testLogin}
          disabled={loading}
        >
          Probar Login
        </button>

        <button
          className="test-button test-button-profile"
          onClick={testProfile}
          disabled={loading}
        >
          Probar Perfil
        </button>

        <button
          className="test-button test-button-contact"
          onClick={testContact}
          disabled={loading}
        >
          Probar Contacto
        </button>
      </div>

      {loading && (
        <div className="test-loading">
          <div className="test-loading-spinner"></div>
          <span>Procesando solicitud...</span>
        </div>
      )}

      {error && (
        <div className="test-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div className="test-response">
          <h3>Respuesta:</h3>
          <div className="test-response-content">
            <pre>
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestForm;
