import React from 'react';
import './StarRating.css';

const StarRating = ({ rating = 0, setRating }) => {
  const handleStarClick = (index) => {
    if (setRating) {
      setRating(index + 1);
    }
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        return (
          <span 
            key={index} 
            className={`star ${index < rating ? 'filled' : ''}`} 
            onClick={() => handleStarClick(index)}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
