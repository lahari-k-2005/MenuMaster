import React from 'react';

function SearchBar({ searchValue, onSearchChange }) {
  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleSearchClick = () => {
    onSearchChange(searchValue);
  };

  return (
    <section className="search-bar">
      <input 
        type="text" 
        placeholder="Search for restaurants" 
        value={searchValue} 
        onChange={handleInputChange}
      />
      <button onClick={handleSearchClick}>Search</button>
    </section>
  );
}

export default SearchBar;