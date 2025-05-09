import { useState } from 'react';
import { FaSpinner, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import "../styles/ContactSection.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    curso: '',
    mensaje: ''
  });

  const [formStatus, setFormStatus] = useState({
    status: 'idle', // idle, submitting, success, error
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validación de campos
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'nombre':
        if (!value.trim()) error = 'El nombre es obligatorio';
        else if (value.trim().length < 2) error = 'El nombre debe tener al menos 2 caracteres';
        break;
      case 'email':
        if (!value.trim()) error = 'El email es obligatorio';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Introduce un email válido';
        break;
      case 'telefono':
        if (value && !/^[0-9]{9}$/.test(value.replace(/\s/g, '')))
          error = 'Introduce un número de teléfono válido (9 dígitos)';
        break;
      case 'mensaje':
        if (!value.trim()) error = 'El mensaje es obligatorio';
        else if (value.trim().length < 10) error = 'El mensaje debe tener al menos 10 caracteres';
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar en tiempo real si el campo ya ha sido tocado
    if (touched[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Marcar el campo como tocado
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validar el campo
    setFormErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const validateForm = () => {
    const errors = {};

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    if (!validateForm()) {
      // Marcar todos los campos como tocados para mostrar errores
      const allTouched = {};
      Object.keys(formData).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      setFormStatus({
        status: 'error',
        message: 'Por favor, corrige los errores en el formulario'
      });

      return;
    }

    setFormStatus({
      status: 'submitting',
      message: 'Enviando mensaje...'
    });

    try {
      // Realizar la petición real al backend
      // Preparar los datos para enviar al backend
      // Asegurarnos de que los nombres de los campos coincidan con el backend
      const contactoData = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono || '',
        curso: formData.curso || '',
        mensaje: formData.mensaje
      };

      const response = await fetch('http://localhost:5000/api/contacto', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la respuesta');
      }

      const data = await response.json();

      setFormStatus({
        status: 'success',
        message: 'Mensaje enviado con éxito. Nos pondremos en contacto contigo pronto.'
      });

      // Resetear el formulario después de 3 segundos
      setTimeout(() => {
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          curso: '',
          mensaje: ''
        });
        setTouched({});
        setFormStatus({
          status: 'idle',
          message: ''
        });
      }, 3000);

    } catch (error) {
      console.error('Error:', error);
      setFormStatus({
        status: 'error',
        message: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.'
      });
    }
  };

  return (
    <div className="form-card1">
      <div className="form-card2">
        <h3 className="form-title">Envíanos un mensaje</h3>

        {formStatus.status === 'success' && (
          <div className="form-message success">
            <FaCheck className="message-icon" />
            <p>{formStatus.message}</p>
          </div>
        )}

        {formStatus.status === 'error' && (
          <div className="form-message error">
            <FaExclamationTriangle className="message-icon" />
            <p>{formStatus.message}</p>
          </div>
        )}

        <form
          className="contact-form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Formulario de contacto"
        >
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre <span className="required">*</span>
            </label>
            <div className={`form-field ${touched.nombre && formErrors.nombre ? 'error' : ''}`}>
              <input
                id="nombre"
                className="input-field"
                type="text"
                name="nombre"
                placeholder="Tu nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-required="true"
                aria-invalid={touched.nombre && formErrors.nombre ? 'true' : 'false'}
                aria-describedby={formErrors.nombre ? "nombre-error" : undefined}
                disabled={formStatus.status === 'submitting' || formStatus.status === 'success'}
              />
            </div>
            {touched.nombre && formErrors.nombre && (
              <div className="error-message" id="nombre-error" role="alert">
                {formErrors.nombre}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span className="required">*</span>
            </label>
            <div className={`form-field ${touched.email && formErrors.email ? 'error' : ''}`}>
              <input
                id="email"
                className="input-field"
                type="email"
                name="email"
                placeholder="tu.email@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-required="true"
                aria-invalid={touched.email && formErrors.email ? 'true' : 'false'}
                aria-describedby={formErrors.email ? "email-error" : undefined}
                disabled={formStatus.status === 'submitting' || formStatus.status === 'success'}
              />
            </div>
            {touched.email && formErrors.email && (
              <div className="error-message" id="email-error" role="alert">
                {formErrors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="telefono" className="form-label">
              Teléfono <span className="optional">(opcional)</span>
            </label>
            <div className={`form-field ${touched.telefono && formErrors.telefono ? 'error' : ''}`}>
              <input
                id="telefono"
                className="input-field"
                type="tel"
                name="telefono"
                placeholder="Tu número de teléfono"
                value={formData.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.telefono && formErrors.telefono ? 'true' : 'false'}
                aria-describedby={formErrors.telefono ? "telefono-error" : undefined}
                disabled={formStatus.status === 'submitting' || formStatus.status === 'success'}
              />
            </div>
            {touched.telefono && formErrors.telefono && (
              <div className="error-message" id="telefono-error" role="alert">
                {formErrors.telefono}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="curso" className="form-label">
              Curso de interés <span className="optional">(opcional)</span>
            </label>
            <div className="form-field">
              <select
                id="curso"
                className="input-field"
                name="curso"
                value={formData.curso}
                onChange={handleChange}
                disabled={formStatus.status === 'submitting' || formStatus.status === 'success'}
              >
                <option value="">Selecciona un curso</option>
                <option value="maquillaje">Maquillaje Profesional</option>
                <option value="unas">Uñas Esculpidas</option>
                <option value="estetica">Estética Integral</option>
                <option value="manicura">Manicura y Pedicura</option>
                <option value="social">Maquillaje Social</option>
                <option value="pestanas">Extensión de Pestañas</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mensaje" className="form-label">
              Mensaje <span className="required">*</span>
            </label>
            <div className={`form-field ${touched.mensaje && formErrors.mensaje ? 'error' : ''}`}>
              <textarea
                id="mensaje"
                className="input-field"
                name="mensaje"
                placeholder="¿En qué podemos ayudarte?"
                rows="5"
                value={formData.mensaje}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-required="true"
                aria-invalid={touched.mensaje && formErrors.mensaje ? 'true' : 'false'}
                aria-describedby={formErrors.mensaje ? "mensaje-error" : undefined}
                disabled={formStatus.status === 'submitting' || formStatus.status === 'success'}
              />
            </div>
            {touched.mensaje && formErrors.mensaje && (
              <div className="error-message" id="mensaje-error" role="alert">
                {formErrors.mensaje}
              </div>
            )}
          </div>

          <div className="form-privacy">
            <p>
              Al enviar este formulario, aceptas nuestra <a href="/politica-privacidad" target="_blank">política de privacidad</a>.
            </p>
          </div>

          <button
            type="submit"
            className={`sendMessage-btn ${formStatus.status === 'submitting' ? 'submitting' : ''}`}
            disabled={formStatus.status === 'submitting' || formStatus.status === 'success'}
          >
            {formStatus.status === 'submitting' ? (
              <>
                <FaSpinner className="spinner" aria-hidden="true" />
                <span>Enviando...</span>
              </>
            ) : 'Enviar mensaje'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;