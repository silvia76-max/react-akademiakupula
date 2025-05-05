import React from "react";
import "../styles/ReviewCard.css";

const ReviewCard = ({ name, avatar, rating, comment, date }) => {
  return (
    <div className="review-card">
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

      <div className="review-stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="star">
            {i < rating ? "⭐" : "☆"}
          </span>
        ))}
      </div>

      <p className="review-comment">“{comment}”</p>
    </div>
  );
};

export default ReviewCard;
