import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import StarRating from '../Reviews/StarRating';

export default function FeedbackList(props) {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get('http://localhost/MiniProject/fetch_feedback.php');
        console.log(response.data); // Inspect the data
        if (Array.isArray(response.data)) {
          const filteredFeedback = response.data.filter(f => f.stall_name === props.stallName);
          setFeedback(filteredFeedback);
        } else {
          console.error('Unexpected response data format:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch feedback:', error);
      }
    };

    fetchFeedback(); // Invoke the fetch function
  }, [props.stallName]);

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(totalStars - rating);
    return filledStars + emptyStars;
  };


  return (
    <div className="feedback-list">
      {feedback.map(f => (
        <div className="feedback-item" key={f.reg_no}>
          <p>Reg no: {f.reg_no}</p>
          <p>Rating: {renderStars(f.rating)}</p>
          <p>Comments: {f.comments}</p>
          <p>Date: {new Date(f.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
