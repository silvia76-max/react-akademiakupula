import { useState } from 'react';
import "../styles/ContactSection.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/contacto', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la respuesta');
      }
      

      const data = await response.json();
      alert(data.message || 'Mensaje enviado con éxito!');
      setFormData({ nombre: '', email: '', mensaje: '' });

    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar el mensaje');
    }
  };

  return (
    <div className="form-card1">
      <div className="form-card2">
        <form className="formu" onSubmit={handleSubmit}>
          <div className="form-field">
            <input
              className="input-field"
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <input
              className="input-field"
              type="email"
              name="email"
              placeholder="Tu email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <textarea
              className="input-field"
              name="mensaje"
              placeholder="Tu mensaje"
              rows="5"
              value={formData.mensaje}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="sendMessage-btn">Enviar mensaje</button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;