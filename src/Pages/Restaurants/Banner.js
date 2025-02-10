import React from 'react';
import './Banner.css';
import bannerImage from '../../Images/Banner.jpg'; 

function Banner() {
  return (
    <div className="banner-container">
      <img src={bannerImage} alt="Banner" className="header-image" />
      <div className="overlay-text">Menu Master</div>
      <div className="underline"></div>
      <p className="description">
        Menu Master is designed for college students to easily place food orders from various stalls within the campus. Whether you're craving a quick snack between classes or a hearty meal, Menu Master connects you with on-campus food vendors for a seamless ordering experience. Browse menus, place orders, and enjoy a variety of campus dining options—all in one convenient platform.
      </p>
    </div>
  );
}

export default Banner;
