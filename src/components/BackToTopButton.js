// BackToTopButton.js
import React from 'react';
import '../App.css'; // Make sure to create this CSS file for styling

const BackToTopButton = ({ show }) => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    show && (
      <button className="back-to-top" onClick={handleClick}>
        ↑ Back to Top
      </button>
    )
  );
};

export default BackToTopButton;
