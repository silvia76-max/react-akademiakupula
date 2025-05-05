import React from 'react';
import GoldenButton from './GoldenButton'; 
import "../styles/CourseCard.css";

const CourseCard = ({ title, description, image }) => {
  return (
    <div className="course-card">
    <div className="card-header">
      <img src={image} alt={title} className="course-image" />
    </div>
    <div className="card-body">
      <h3 className="course-title">{title}</h3>
      <p className="course-description">{description}</p>
    </div>
    <div className="card-footer">
      <GoldenButton text="Ver más" link={`/${title.toLowerCase().replace(/\s+/g, '-')}`} />
    </div>
  </div>
  );
};

export default CourseCard;
