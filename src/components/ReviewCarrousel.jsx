import { useRef, useEffect } from "react";
import Slider from "react-slick";
import ReviewCard from "./ReviewCard";
import "../styles/ReviewCard.css";
import "../styles/ReviewCarrousel.css";

// Placeholder images for avatars (replace with actual images when available)
import defaultAvatar1 from "../assets/images/unas-kupula3.jpg";
import defaultAvatar2 from "../assets/images/unas-kupula5.jpg";
import defaultAvatar3 from "../assets/images/unas-kupula2.jpg";

const reviews = [
  {
    name: "Laura Gómez",
    avatar: defaultAvatar1,
    rating: 5,
    comment: "Un lugar increíble para formarse. Tania es una gran profesional y sus cursos son muy completos. Recomiendo 100% la academia.",
    date: "2024-11-10",
    course: "Curso de Maquillaje Profesional"
  },
  {
    name: "Carlos Martín",
    avatar: defaultAvatar2,
    rating: 4,
    comment: "Muy buenos cursos, dinámicos y actualizados. El ambiente es muy agradable y el material de primera calidad. ¡Repetiré sin duda!",
    date: "2024-12-05",
    course: "Curso de Uñas Esculpidas"
  },
  {
    name: "Sandra Ruiz",
    avatar: defaultAvatar3,
    rating: 5,
    comment: "Aprendí muchísimo y me sentí muy apoyada. Gracias por todo el conocimiento compartido y la paciencia. Ahora tengo mi propio negocio.",
    date: "2025-01-08",
    course: "Estética Integral"
  },
  {
    name: "María Fernández",
    avatar: defaultAvatar1,
    rating: 5,
    comment: "La mejor inversión que he hecho en mi formación. El curso online está muy bien estructurado y el soporte es excelente.",
    date: "2025-02-15",
    course: "Curso de Manicura y Pedicura"
  }
];

const ReviewCarousel = () => {
  const sliderRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current.classList.add('visible');
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    adaptiveHeight: true,
    fade: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    customPaging: (i) => (
      <div className="custom-dot"></div>
    ),
    beforeChange: (current, next) => {
      // Add animation classes to the next slide
      const nextSlide = document.querySelector(`.slick-slide[data-index="${next}"]`);
      if (nextSlide) {
        nextSlide.classList.add('animating');
      }
    },
    afterChange: (current) => {
      // Remove animation classes after transition
      document.querySelectorAll('.slick-slide').forEach(slide => {
        if (slide.getAttribute('data-index') != current) {
          slide.classList.remove('animating');
        }
      });
    }
  };

  const nextSlide = () => {
    sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <div className="review-section fade-in-section" ref={sectionRef}>
      <div className="review-carousel-container">
        <div className="review-carousel-header">
          <div className="section-header">
            <h2 className="section-title">Lo que dicen nuestros alumnos</h2>
            <div className="title-underline"></div>
          </div>
        </div>

        <div className="review-carousel">
          <button className="carousel-arrow prev-arrow" onClick={prevSlide} aria-label="Anterior reseña">
            &#10094;
          </button>

          <Slider ref={sliderRef} {...settings}>
            {reviews.map((review, index) => (
              <div key={index} className="review-slide">
                <ReviewCard {...review} />
              </div>
            ))}
          </Slider>

          <button className="carousel-arrow next-arrow" onClick={nextSlide} aria-label="Siguiente reseña">
            &#10095;
          </button>
        </div>

        <div className="review-carousel-footer">
          <p>Más de 500 alumnos satisfechos nos avalan</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCarousel;
