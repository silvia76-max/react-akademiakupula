import { useRef, useEffect } from "react";
import "../styles/ContactSection.css";
import tiendaImg from "../assets/images/entrada-kupula.jpg";
import ContactForm from "./ContactForm.jsx";
import { SiTiktok } from "react-icons/si";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone
} from "react-icons/fa";

const ContactSection = () => {
  const sectionRef = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    elementsRef.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      elementsRef.current.forEach(el => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  return (
    <section id="contacto" className="contact-section fade-in-section" ref={sectionRef}>
      <div className="contact-wrapper">
        <header className="section-header fade-in-section" ref={addToRefs}>
          <h2>Contacto</h2>
          <p className="section-description">
            ¿Tienes dudas o quieres apuntarte a uno de nuestros cursos?
            ¡Escríbenos sin compromiso!
          </p>
        </header>

        <div className="contact-container">
          {/* Izquierda: Formulario mejorado */}
          <div className="fade-in-section" ref={addToRefs}>
            <ContactForm />
          </div>

          {/* Derecha: Información de contacto */}
          <div className="info-extra fade-in-section" ref={addToRefs}>
            <div className="contact-info-card">
              <h3 className="info-title">Información de contacto</h3>

              <ul className="contact-info-list">
                <li className="contact-info-item">
                  <FaMapMarkerAlt className="contact-info-icon" aria-hidden="true" />
                  <div>
                    <strong>Dirección:</strong>
                    <address>Calle Iturriaga, nº 58, 48004 Bilbo, Bizkaia</address>
                  </div>
                </li>
                <li className="contact-info-item">
                  <FaPhone className="contact-info-icon" aria-hidden="true" />
                  <div>
                    <strong>Teléfono:</strong>
                    <a href="tel:+34620576646" className="contact-link">+34 620 57 66 46</a>
                  </div>
                </li>
                <li className="contact-info-item">
                  <FaEnvelope className="contact-info-icon" aria-hidden="true" />
                  <div>
                    <strong>Email:</strong>
                    <a href="mailto:institutodebellezataniacalvo@gmail.com" className="contact-link">
                      institutodebellezataniacalvo@gmail.com
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="store-image">
              <img src={tiendaImg} alt="Fachada de Akademia La Kúpula" />
              <p>Nos encontrarás en el corazón de Santutxu, ¡a menos de 100m del metro!</p>
            </div>

            <div className="map-container" aria-label="Mapa de ubicación">
              <iframe
                title="Ubicación de Akademia La Kúpula"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5811.948268604861!2d-2.9105716000000283!3d43.251963900000014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4e4e4c0c4decc1%3A0x32a07f372db1faa6!2sLa%20Kupula!5e0!3m2!1ses!2ses!4v1744870036913!5m2!1ses!2ses"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                aria-label="Google Maps mostrando la ubicación de Akademia La Kúpula">
              </iframe>
            </div>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="social-section fade-in-section" ref={addToRefs}>
          <h3 className="social-title">Síguenos en redes sociales</h3>

          <div className="social-icons" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
            <a
              href="https://www.tiktok.com/@taniadelacupula"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en TikTok"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#1a1a1a',
                color: '#ffd700',
                fontSize: '24px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 215, 0, 0.2)'
              }}
              title="TikTok"
            >
              <SiTiktok size={24} />
            </a>
            <a
              href="https://www.facebook.com/tania.laCupula"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en Facebook"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#1a1a1a',
                color: '#ffd700',
                fontSize: '24px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 215, 0, 0.2)'
              }}
              title="Facebook"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://www.instagram.com/taniadelacupula"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en Instagram"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#1a1a1a',
                color: '#ffd700',
                fontSize: '24px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 215, 0, 0.2)'
              }}
              title="Instagram"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://wa.me/+34620576646"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contáctanos por WhatsApp"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#1a1a1a',
                color: '#ffd700',
                fontSize: '24px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 215, 0, 0.2)'
              }}
              title="WhatsApp"
            >
              <FaWhatsapp size={24} />
            </a>
            <a
              href="mailto:institutodebellezataniacalvo@gmail.com"
              aria-label="Envíanos un email"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#1a1a1a',
                color: '#ffd700',
                fontSize: '24px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 215, 0, 0.2)'
              }}
              title="Email"
            >
              <FaEnvelope size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;