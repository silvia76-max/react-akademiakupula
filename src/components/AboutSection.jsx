import '../styles/AboutSection.css';
import Tania12img from '../assets/images/tania12.jpg'
import SalonKupulaimg from '../assets/images/salonkupula.jpg';
import Unaskupula15img from '../assets/images/unas-kupula15.jpg';
import UnasKupula29img from '../assets/images/unas-kupula29.jpg';
import UnasKupula26img from '../assets/images/unas-kupula26.jpg';

const AboutSection = () => {
  return (
    <section className="about-section" id="sobre">
      <div className="about-content">
        <h2 className="about-title">Sobre Akademia La Kúpula</h2>
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
       <div className="about-subsection">
        <h3 className="about-subtitle">Nuestra Filosofía</h3>
        <p className="about-text">
          La Kúpula es un espacio para aprender, crecer y transformar. Apostamos por el empoderamiento femenino,
          la sostenibilidad, el aprendizaje continuo y el respeto. Aquí no solo adquieres conocimientos, también herramientas para liderar tu futuro.
        </p>
      </div>

      {/* Directora */}
      <div className="about-subsection">
      <h3 className="about-subtitle">Nuestra Directora</h3>
      <div className="about-block">
        <div className="about-image-block">
          <img src={Tania12img} alt="Tania Calvo" className="about-img" />
          <h3 className="nametitle">Tania Calvo</h3>
        </div>
        <div className="about-text-block">
          <p className="about-text">
            Fundadora y alma de la Akademia, Tania cuenta con más de 15 años de experiencia en el sector de la imagen personal.
            Su vocación por la enseñanza y su visión innovadora han creado un espacio de formación único, donde el desarrollo profesional
            y personal van de la mano.
          </p>
        </div>
      </div>
    </div>
      {/* La Akademia */}
      <div className="about-subsection">
        <h3 className="about-subtitle">Nuestra Akademia</h3>
        <div className="about-block reverse">
        <img src={SalonKupulaimg} alt="Interior de la Akademia" className="about-img" />
        <p className="about-text">
            Ubicada en Santutxu, a menos de 100 metros del metro, La Kúpula es un espacio acogedor y moderno.
            Nuestras aulas están equipadas con todo lo necesario para una formación práctica, cómoda y profesional.
          </p>
        </div>
      </div>

      {/* Cursos */}
      <div className="about-subsection">
        <h3 className="about-subtitle">Itinerarios Formativos</h3>
        <div className="about-courses">
          <div className="about-gallery">
          <img src={Unaskupula15img} alt="Curso 1" />
            <img src={UnasKupula29img} alt="Curso 2" />
            <img src={UnasKupula26img} alt="Curso 3" />
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
