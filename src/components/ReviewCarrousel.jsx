import React from "react";
import Slider from "react-slick";
import ReviewCard from "./ReviewCard";
import "../styles/ReviewCard.css";
import "../styles/ReviewCarrousel.css"; 

const reviews = [
  {
    name: "Laura Gómez",
    avatar: "/avatars/laura.jpg",
    rating: 5,
    comment: "Un lugar increíble para formarse. Tania es una gran profesional.",
    date: "2024-11-10",
  },
  {
    name: "Carlos Martín",
    avatar: "/avatars/carlos.jpg",
    rating: 4,
    comment: "Muy buenos cursos, dinámicos y actualizados. ¡Repetiré!",
    date: "2024-12-05",
  },
  {
    name: "Sandra Ruiz",
    avatar: "/avatars/sandra.jpg",
    rating: 5,
    comment: "Aprendí muchísimo y me sentí muy apoyada. Gracias por todo.",
    date: "2025-01-08",
  },
  // ...más reseñas si quieres
];

const ReviewCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <div className="review-carousel">
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div key={index}>
            <ReviewCard {...review} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ReviewCarousel;
