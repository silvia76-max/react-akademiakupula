import { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';
import '../styles/ChatBot.css';

// Respuestas predefinidas para el chatbot
const botResponses = {
  greeting: [
    "¡Hola! Soy el asistente virtual de Akademia La Kúpula. ¿En qué puedo ayudarte?",
    "¡Bienvenido/a! Estoy aquí para resolver tus dudas sobre nuestros cursos. ¿Qué te gustaría saber?"
  ],
  farewell: [
    "¡Gracias por contactar con Akademia La Kúpula! Si tienes más preguntas, no dudes en escribirnos.",
    "Ha sido un placer ayudarte. ¡Esperamos verte pronto en nuestros cursos!"
  ],
  default: [
    "Lo siento, no he entendido tu pregunta. ¿Podrías reformularla?",
    "Disculpa, no tengo información sobre eso. ¿Puedo ayudarte con algo más?"
  ],
  courses: [
    "Ofrecemos cursos de Maquillaje Profesional, Uñas Esculpidas, Estética Integral, Manicura y Pedicura, Maquillaje Social y Extensión de Pestañas. ¿Te interesa alguno en particular?",
    "Tenemos una amplia variedad de cursos en el ámbito de la estética. Desde maquillaje hasta tratamientos de uñas y pestañas. ¿Sobre cuál te gustaría más información?"
  ],
  prices: [
    "Los precios varían según el curso y la modalidad (presencial u online). Te recomiendo contactar directamente con nosotros para obtener información actualizada sobre precios y promociones.",
    "Cada curso tiene un precio diferente dependiendo de su duración y contenido. Para información detallada sobre precios, por favor, contacta con nosotros a través del formulario o por teléfono."
  ],
  location: [
    "Estamos ubicados en calle Iturriaga, nº 58, 48004 Bilbo, Bizkaia, a menos de 100 metros del metro de Santutxu.",
    "Nuestra academia se encuentra en el corazón de Santutxu, en Bilbao. La dirección exacta es calle Iturriaga, nº 58, 48004 Bilbo, Bizkaia."
  ],
  contact: [
    "Puedes contactarnos por teléfono al +34 620 57 66 46, por email a institutodebellezataniacalvo@gmail.com o a través del formulario de contacto en nuestra web.",
    "Estamos disponibles por teléfono, email o a través del formulario de contacto. También puedes seguirnos en nuestras redes sociales para estar al día de nuestras novedades."
  ],
  schedule: [
    "Nuestro horario de atención es de lunes a viernes de 9:00 a 20:00 y sábados de 9:00 a 14:00. Los cursos tienen horarios flexibles, consúltanos para más información.",
    "Atendemos de lunes a viernes en horario completo y los sábados por la mañana. Los horarios de los cursos son flexibles para adaptarse a tus necesidades."
  ]
};

// Función para encontrar la mejor respuesta basada en palabras clave
const findBestResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Palabras clave para cada tipo de respuesta
  const keywords = {
    greeting: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos'],
    farewell: ['adiós', 'hasta luego', 'gracias', 'chao', 'bye'],
    courses: ['curso', 'cursos', 'formación', 'aprender', 'estudiar', 'clases'],
    prices: ['precio', 'precios', 'costo', 'coste', 'cuánto cuesta', 'cuánto vale', 'tarifa'],
    location: ['dónde', 'ubicación', 'dirección', 'llegar', 'sitio', 'lugar'],
    contact: ['contacto', 'teléfono', 'email', 'correo', 'llamar', 'escribir'],
    schedule: ['horario', 'hora', 'cuando', 'abierto', 'disponible', 'calendario']
  };
  
  // Buscar coincidencias
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => lowerMessage.includes(word))) {
      const responses = botResponses[category];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // Si no hay coincidencias, devolver respuesta por defecto
  const defaultResponses = botResponses.default;
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Efecto para saludar al abrir el chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
      setMessages([{ text: greeting, sender: 'bot' }]);
    }
  }, [isOpen, messages.length]);
  
  // Efecto para hacer scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Añadir mensaje del usuario
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simular que el bot está escribiendo
    setIsTyping(true);
    
    // Respuesta del bot con un pequeño retraso para simular procesamiento
    setTimeout(() => {
      const botResponse = { text: findBestResponse(userMessage.text), sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Entre 1 y 2 segundos
  };
  
  return (
    <div className="chatbot-container">
      {/* Botón para abrir/cerrar el chat */}
      <button 
        className="chat-toggle-btn"
        onClick={toggleChat}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
        title={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? <FaTimes /> : <FaComments />}
      </button>
      
      {/* Ventana de chat */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Asistente Virtual</h3>
            <button 
              className="close-chat-btn"
              onClick={toggleChat}
              aria-label="Cerrar chat"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot typing">
                <span className="typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chat-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Escribe tu pregunta..."
              aria-label="Mensaje"
            />
            <button 
              type="submit"
              aria-label="Enviar mensaje"
              disabled={!inputValue.trim()}
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
