import { useEffect, useRef } from 'react';
import '../styles/AboutSection.css';
import Tania12img from '../assets/images/tania12.jpg'
import SalonKupulaimg from '../assets/images/salonkupula.jpg';
import Unaskupula15img from '../assets/images/unas-kupula15.jpg';
import UnasKupula29img from '../assets/images/unas-kupula29.jpg';
import UnasKupula26img from '../assets/images/unas-kupula26.jpg';
import flayerTania from '../assets/images/flayertania.png';

const AboutSection = () => {
  const sectionRefs = useRef([]);

  // Efecto para la animación de fade-in
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      sectionRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Efecto para cargar el script de Instagram
  useEffect(() => {
    // Función para cargar el script de Instagram
    const loadInstagramEmbed = () => {
      // Eliminar cualquier script existente para evitar duplicados
      const existingScript = document.getElementById('instagram-embed-script');
      if (existingScript) {
        existingScript.remove();
      }

      // Crear y añadir el nuevo script
      const script = document.createElement('script');
      script.id = 'instagram-embed-script';
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);

      // Intentar inicializar el widget si ya existe la función
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    // Cargar el script
    loadInstagramEmbed();

    // Volver a cargar el script cuando el componente se desmonte y se vuelva a montar
    return () => {
      const script = document.getElementById('instagram-embed-script');
      if (script) {
        script.remove();
      }
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

      {/* Reproductor de Instagram */}
      <div className="about-subsection fade-in-section" ref={addToRefs}>
        <div className="section-header">
          <h3 className="about-subtitle">Conoce Nuestra Academia</h3>
          <div className="subtitle-underline"></div>
        </div>
        <div className="instagram-container">
          <div className="instagram-video-container">
            {/* Reproductor de video de Instagram con iframe oculto */}
            <div className="instagram-video-wrapper">
              <iframe
                className="instagram-video-iframe"
                src="https://www.instagram.com/reel/DGjn9YcNr2B/embed/captioned/?hidecaption=true&amp;autoplay=true"
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                title="Video de Instagram de la Academia"
              ></iframe>
            </div>
          </div>
          <p className="instagram-description">
            Descubre nuestras instalaciones y conoce más sobre nuestra metodología de enseñanza.
          </p>
        </div>
      </div>

      {/* Sección de Flyer */}
      <div className="about-subsection fade-in-section" ref={addToRefs}>
        <div className="section-header">
          <h3 className="about-subtitle">Información Destacada</h3>
          <div className="subtitle-underline"></div>
        </div>
        <div className="flyer-container">
          <div className="flyer-content">
            <img
              src={flayerTania}
              alt="Flyer informativo de Akademia Kupula"
              className="flyer-image"
            />
            <div className="flyer-info">
              <h4 className="flyer-title">Próximos Cursos y Eventos</h4>
              <p className="flyer-text">
                Mantente al día con nuestras últimas novedades, promociones especiales y eventos exclusivos.
              </p>
            </div>
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
