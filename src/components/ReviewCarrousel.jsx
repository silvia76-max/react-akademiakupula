import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/ReviewCard.css";
import "../styles/ReviewCarrousel.css";
import ReviewCard from "./ReviewCard.jsx";

// Placeholder images for avatars
import defaultAvatar1 from "../assets/images/unas-kupula3.jpg";
import defaultAvatar2 from "../assets/images/unas-kupula5.jpg";
import defaultAvatar3 from "../assets/images/unas-kupula2.jpg";

// Review data
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
    name: "Carla Martín",
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
  }
];

// Slider settings
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  responsive: [
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 1
      }
    }
  ]
};

// Review carousel component
const ReviewCarrousel = () => (
  <div className="review-section">
    <div className="review-carousel-container">
      <div className="review-carousel-header">
        <div className="section-header">
          <h2 className="section-title">Lo que dicen nuestros alumnos</h2>
          <div className="title-underline"></div>
        </div>
      </div>
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div key={index} className="review-item">
            <ReviewCard {...review} />
          </div>
        ))}
      </Slider>
      <div className="review-carousel-footer">
        <p>Más de 500 alumnos satisfechos nos avalan</p>
      </div>
    </div>
  </div>
);

export default ReviewCarrousel;
