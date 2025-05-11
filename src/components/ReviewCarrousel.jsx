import React from "react";
import "../styles/ReviewCard.css";
import "../styles/ReviewCarrousel.css";

// Placeholder images for avatars
import defaultAvatar1 from "../assets/images/unas-kupula3.jpg";
import defaultAvatar2 from "../assets/images/unas-kupula5.jpg";
import defaultAvatar3 from "../assets/images/unas-kupula2.jpg";

// Componente simplificado de ReviewCard
const SimpleReviewCard = ({ name, avatar, rating, comment, date, course }) => {
  return (
    <div className="review-card">
      <div className="review-content">
        <p className="review-comment">"{comment}"</p>
        <div className="review-stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="star">
              {i < rating ? "★" : "☆"}
            </span>
          ))}
        </div>
        {course && <p className="review-course">{course}</p>}
      </div>

      <div className="review-footer">
        <div className="review-header">
          <img
            src={avatar}
            alt={`${name} avatar`}
            className="review-avatar"
          />
          <div className="review-info">
            <h4>{name}</h4>
            <p className="review-date">{new Date(date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Datos de reseñas
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
  }
];

// Componente simplificado de ReviewCarousel
const ReviewCarousel = () => {
  return (
    <div className="review-section">
      <div className="review-carousel-container">
        <div className="review-carousel-header">
          <div className="section-header">
            <h2 className="section-title">Lo que dicen nuestros alumnos</h2>
            <div className="title-underline"></div>
          </div>
        </div>

        <div className="simple-review-grid">
          {reviews.map((review, index) => (
            <div key={index} className="review-item">
              <SimpleReviewCard {...review} />
            </div>
          ))}
        </div>

        <div className="review-carousel-footer">
          <p>Más de 500 alumnos satisfechos nos avalan</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCarousel;
