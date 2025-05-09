import { useEffect, useRef } from 'react';
import '../styles/AboutSection.css';
import Tania12img from '../assets/images/tania12.jpg'
import SalonKupulaimg from '../assets/images/salonkupula.jpg';
import Unaskupula15img from '../assets/images/unas-kupula15.jpg';
import UnasKupula29img from '../assets/images/unas-kupula29.jpg';
import UnasKupula26img from '../assets/images/unas-kupula26.jpg';

const AboutSection = () => {
  const sectionRefs = useRef([]);

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

    sectionRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <section className="about-section" id="sobre">
      <div className="about-content fade-in-section" ref={addToRefs}>
        <div className="section-header">
          <h2 className="about-title">Sobre Akademia La Kúpula</h2>
          <div className="title-underline"></div>
        </div>
        <p className="about-text">
          En <span className="about-highlight">La Kúpula</span> formamos a futuras profesionales del sector
          estético con una visión moderna, creativa y enfocada en la excelencia.
          Contamos con años de experiencia impartiendo formación presencial
          y ahora también online, para que puedas formarte desde cualquier lugar.
        </p>
        <p className="about-text">
          Nuestra misión es empoderar a mujeres emprendedoras a través de la belleza, el arte y la técnica.
          Cada curso está diseñado con cariño, profesionalidad y atención al detalle.
        </p>
      </div>

      <div className="about-subsection fade-in-section" ref={addToRefs}>
        <div className="section-header">
          <h3 className="about-subtitle">Nuestra Filosofía</h3>
          <div className="subtitle-underline"></div>
        </div>
        <div className="philosophy-container">
          <div className="philosophy-card">
            <div className="philosophy-icon">✨</div>
            <h4>Excelencia</h4>
            <p>Compromiso con la calidad y la mejora continua en cada formación</p>
          </div>
          <div className="philosophy-card">
            <div className="philosophy-icon">💪</div>
            <h4>Empoderamiento</h4>
            <p>Herramientas para que desarrolles tu potencial profesional</p>
          </div>
          <div className="philosophy-card">
            <div className="philosophy-icon">🌱</div>
            <h4>Crecimiento</h4>
            <p>Aprendizaje continuo y desarrollo personal y profesional</p>
          </div>
        </div>
      </div>

      {/* Directora */}
      <div className="about-subsection fade-in-section" ref={addToRefs}>
        <div className="section-header">
          <h3 className="about-subtitle">Nuestra Directora</h3>
          <div className="subtitle-underline"></div>
        </div>
        <div className="about-block">
          <div className="about-image-block">
            <div className="image-frame">
              <img src={Tania12img} alt="Tania Calvo" className="about-img" />
            </div>
            <h3 className="nametitle">Tania Calvo</h3>
          </div>
          <div className="about-text-block">
            <p className="about-text">
              Fundadora y alma de la Akademia, Tania cuenta con más de 15 años de experiencia en el sector de la imagen personal.
              Su vocación por la enseñanza y su visión innovadora han creado un espacio de formación único, donde el desarrollo profesional
              y personal van de la mano.
            </p>
            <div className="director-quote">
              <blockquote>
                "Mi objetivo es formar profesionales que no solo dominen técnicas, sino que entiendan la belleza como una forma de arte y bienestar."
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      {/* La Akademia */}
      <div className="about-subsection fade-in-section" ref={addToRefs}>
        <div className="section-header">
          <h3 className="about-subtitle">Nuestra Akademia</h3>
          <div className="subtitle-underline"></div>
        </div>
        <div className="about-block reverse">
          <div className="about-image-block">
            <div className="image-frame">
              <img src={SalonKupulaimg} alt="Interior de la Akademia" className="about-img" />
            </div>
          </div>
          <div className="about-text-block">
            <p className="about-text">
              Ubicada en Santutxu, a menos de 100 metros del metro, La Kúpula es un espacio acogedor y moderno.
              Nuestras aulas están equipadas con todo lo necesario para una formación práctica, cómoda y profesional.
            </p>
            <ul className="facility-features">
              <li>✓ Equipamiento profesional de última generación</li>
              <li>✓ Grupos reducidos para atención personalizada</li>
              <li>✓ Ambiente acogedor y creativo</li>
              <li>✓ Ubicación céntrica y accesible</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cursos */}
      <div className="about-subsection fade-in-section" ref={addToRefs}>
        <div className="section-header">
          <h3 className="about-subtitle">Itinerarios Formativos</h3>
          <div className="subtitle-underline"></div>
        </div>
        <div className="about-courses">
          <div className="about-gallery">
            <div className="gallery-item">
              <img src={Unaskupula15img} alt="Curso 1" />
              <div className="gallery-overlay">
                <span>Presencial</span>
              </div>
            </div>
            <div className="gallery-item">
              <img src={UnasKupula29img} alt="Curso 2" />
              <div className="gallery-overlay">
                <span>Online</span>
              </div>
            </div>
            <div className="gallery-item">
              <img src={UnasKupula26img} alt="Curso 3" />
              <div className="gallery-overlay">
                <span>Intensivo</span>
              </div>
            </div>
          </div>
          <p className="about-text">
            Ofrecemos cursos tanto presenciales como online. Puedes adquirirlos individualmente con todos los materiales descargables,
            o registrarte en nuestra academia online con acceso a un campus virtual interactivo. Nos adaptamos a tu ritmo, tu tiempo y tus metas.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
