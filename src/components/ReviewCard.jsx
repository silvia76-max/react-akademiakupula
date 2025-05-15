import React from "react";
import "../styles/ReviewCard.css";
import { FaStar, FaRegStar, FaQuoteLeft } from "react-icons/fa";

const ReviewCard = ({ name, avatar, rating, comment, date, course }) => {
  return (
    <div className="review-card">
      <div className="review-quote-icon">
        <FaQuoteLeft />
      </div>

      <div className="review-content">
        <p className="review-comment">"{comment}"</p>

        <div className="review-stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="star">
              {i < rating ? <FaStar className="star-filled" /> : <FaRegStar className="star-empty" />}
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

export default ReviewCard;
