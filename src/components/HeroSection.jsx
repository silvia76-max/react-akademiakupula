import { useEffect, useState } from "react";
import "../styles/HeroSection.css";
import salonImg from "/src/assets/images/salonkupula.jpg";
import GoldenButton from "./GoldenButton.jsx";

const HeroSection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    // Show content with a slight delay for better entrance effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="hero" id="inicio">
      <div
        className="hero-background"
        style={{ transform: `translateY(${scrollPosition * 0.4}px)` }}
      >
        <img src={salonImg} alt="Akademia La Kupula" />
      </div>

      <div className={`content ${isVisible ? 'visible' : ''}`}>
        <div className="hero-title-container">
          <h1 className="hero-title">
            <span className="hero-title-line">Formación en</span>
            <span className="hero-title-line highlight">Estética Profesional</span>
          </h1>
        </div>
        <p className="hero-description">
          Aprende de expertas en el sector. Cursos presenciales y online con estilo y calidad.
          Descubre tu potencial en el mundo de la belleza con nosotras.
        </p>
        <div className="hero-cta">
          <GoldenButton href="#cursos">Descubrir Cursos</GoldenButton>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
