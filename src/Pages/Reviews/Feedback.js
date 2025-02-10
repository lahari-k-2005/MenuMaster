import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Feedback.css';
import StarRating from './StarRating'; // Import the StarRating component

const FeedbackPage = (props) => {
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState([]);

  const fetchFeedback = useCallback(async () => {
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
  }, [props.stallName]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost/MiniProject/submit_feedback.php', {
      method: 'POST',
      body: new URLSearchParams({
        reg_no: props.reg_no,
        comments: comments,
        rating: rating,
        stall_name: props.stallName
      })
    });
    if (response.ok) {
      alert('Feedback submitted successfully!');
      setComments('');
      setRating(0);
      fetchFeedback();
    } else {
      alert('Failed to submit feedback');
    }
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(totalStars - rating);
    return filledStars + emptyStars;
  };

  return (
    <div className="container">
      <h1>Feedback for {props.stallName} Stall</h1>
      <form onSubmit={handleSubmit}>
        <textarea 
          value={comments} 
          onChange={(e) => setComments(e.target.value)} 
          placeholder="Comments" 
          required 
        />
        <StarRating rating={rating} setRating={setRating} /> {/* Use the StarRating component */}
        <button type="submit">Submit</button>
      </form>
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
    </div>
  );
};

export default FeedbackPage;
