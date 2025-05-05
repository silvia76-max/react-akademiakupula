import "../styles/ContactSection.css";
import tiendaImg from "../assets/images/entrada-kupula.jpg";
import ContactForm from "./ContactForm.jsx";
import { SiTiktok } from "react-icons/si"
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope} from "react-icons/fa";


const ContactSection = () => {
  return (
    <section id="contacto" className="contact-section">
      <h2>Contacto</h2>
      <p>
        ¿Tienes dudas o quieres apuntarte a uno de nuestros cursos?
        ¡Escríbenos sin compromiso!
      </p>
      <div className="contact-wrapper">
      <div className="contact-container">
        {/* Izquierda: Formulario con tus clases actuales */}
        <ContactForm />

        {/* Derecha: Imagen, comentario y mapa */}
        <div className="info-extra">
          <div className="store-image">
          <img src={tiendaImg} alt="Nuestra tienda" />
          <p>Nos encontrarás en el corazón de Santutxu, en calle Iturriaga,  nº 58, 48004 Bilbo, Bizkaia, ¡a menos de 100m del metro!</p>
          </div>
          <div className="map-container">
            <iframe
              title="Ubicación"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5811.948268604861!2d-2.9105716000000283!3d43.251963900000014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4e4e4c0c4decc1%3A0x32a07f372db1faa6!2sLa%20Kupula!5e0!3m2!1ses!2ses!4v1744870036913!5m2!1ses!2ses" 
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>

      {/* Redes sociales */}
      <nav className="social-icons" aria-label="Redes sociales">
        <a 
          href="https://www.tiktok.com/@taniadelacupula" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="TikTok"
          className="social-icon"
        >
          <SiTiktok aria-hidden="true" />
        </a>
        <a 
          href="https://www.facebook.com/tania.laCupula" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Facebook"
          className="social-icon"
        >
          <FaFacebook aria-hidden="true" />
        </a>
        <a 
          href="https://www.instagram.com/taniadelacupula" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Instagram"
          className="social-icon"
        >
          <FaInstagram aria-hidden="true" />
        </a>
        <a 
          href="https://wa.me/+34620576646" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="WhatsApp"
          className="social-icon"
        >
          <FaWhatsapp aria-hidden="true" />
        </a>
        <a 
          href="mailto:institutodebellezataniacalvo@gmail.com" 
          aria-label="Email"
          className="social-icon"
        >
          <FaEnvelope aria-hidden="true" />
        </a>
      </nav>
      </div>
    </section>
  );
};

export default ContactSection;