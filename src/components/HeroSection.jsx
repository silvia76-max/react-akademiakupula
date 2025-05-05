import "../styles/HeroSection.css"; 
import salonImg from "/src/assets/images/salonkupula.jpg";
import GoldenButton from "./GoldenButton.jsx";  


const HeroSection = () => {
  return (
    <section className="hero" id="inicio">

     <img src={salonImg} alt="Akademia La Kupula" />

      <div className="content">
        <h1>Formación en Estética Profesional</h1>
        <p>
          Aprende de expertas en el sector. Cursos presenciales y online con estilo y calidad.
        </p>
        <GoldenButton href="#cursos">Ver Cursos</GoldenButton>

      </div>
    </section>
  );
};

export default HeroSection;
