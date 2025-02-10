import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Navbar';
import SearchBar from '../../Components/SearchBar';
import RestaurantCard from './RestaurantCard';
import './Restaurants.css';
import Banner from './Banner';
import yummy from '../../Images/yummy.jpg';
import dominos from '../../Images/dominos.png';
import dosa from '../../Images/dosa.jpg';
import annapurna from '../../Images/annapurna.jpg';

function Restaurants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState([]);
 

  const restaurants = [
    { image: yummy, name: 'Yummy', cuisine: 'Your Everytime Snack' },
    { image: dominos, name: 'Dominos', cuisine: 'Hot, Fresh, Fast' },
    { image: annapurna, name: 'Annapurna', cuisine: 'Best Foods' },
    { image: dosa, name: 'DosaCorner', cuisine: 'Any Dosa' },
  ];

  const fetchFeedback = useCallback(async () => {
    
    try {
      const response = await axios.get('http://localhost/MiniProject/fetch_feedback.php');
      if (Array.isArray(response.data)) {
        setFeedback(response.data);
      } else {
        console.error('Unexpected response data format:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    }
  }, []);

  useEffect(() => {
    
    fetchFeedback();
  }, [fetchFeedback]);

  const calculateAverageRating = (stallName) => {
    const stallFeedback = feedback.filter(f => f.stall_name === stallName);
    if (stallFeedback.length === 0) return null;

    const totalRating = stallFeedback.reduce((acc, cur) => acc + parseFloat(cur.rating), 0);
    return (totalRating / stallFeedback.length).toFixed(1);
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="Home">
      <Navbar />
      <main>
        <Banner/>
        <SearchBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
        {/* <h2>Featured Stalls</h2> */}
        <div className="container">
          <RestaurantCard 
            restaurants={filteredRestaurants.map(restaurant => ({
              ...restaurant,
              averageRating: calculateAverageRating(restaurant.name),
            }))}
          />
        </div>
      </main>
    </div>
  );
}

export default Restaurants;

