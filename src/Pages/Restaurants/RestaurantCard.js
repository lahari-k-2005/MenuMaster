import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../Reviews/StarRating'; // Import the StarRating component
import './RestaurantCard.css';

function RestaurantCard({ restaurants}) {
  const navigate = useNavigate();

  const handleViewMenu = (restaurant) => {
    navigate('/Menu', {
      state: {
        stallName: restaurant.name,
      },
    });
  };


  return (
    <div className="centered-container">
      <section className="featured-restaurants">
        {restaurants.map((restaurant, index) => (
          <div className="restaurant-card" key={index}>
            <img src={restaurant.image} alt={restaurant.name} />
            <h3>{restaurant.name}</h3>
            <p>{restaurant.cuisine}</p>
            <p>
              Rating: <StarRating rating={restaurant.averageRating || 0} readOnly />
            </p>
            <button onClick={() => handleViewMenu(restaurant)}>View Menu</button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default RestaurantCard;
