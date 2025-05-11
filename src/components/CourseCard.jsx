import React from 'react';
import GoldenButton from './GoldenButton';
import "../styles/CourseCard.css";

const CourseCard = ({ title, description, image, duration, level }) => {
  return (
    <div className="course-card">
      <div className="card-header">
        <img src={image} alt={title} className="course-image" />
        <div className="card-overlay">
          <div className="card-badges">
            {duration && <span className="badge duration-badge">{duration}</span>}
            {level && <span className="badge level-badge">{level}</span>}
          </div>
        </div>
      </div>
      <div className="card-body">
        <h3 className="course-title">{title}</h3>
        <p className="course-description">{description}</p>
      </div>
      <div className="card-footer">
        <GoldenButton
          text="Ver detalles"
          link={`/curso/${title.toLowerCase().replace(/\s+/g, '-')}`}
          requiresAuth={true}
          courseId={title.toLowerCase().replace(/\s+/g, '-')}
        />
      </div>
    </div>
  );
};

export default CourseCard;
