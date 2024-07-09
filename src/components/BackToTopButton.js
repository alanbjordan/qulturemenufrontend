import React from 'react';
import { Fab } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const BackToTopButton = ({ show }) => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    show && (
      <Fab 
        color="primary" 
        aria-label="back to top" 
        onClick={handleScrollToTop} 
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '370px', // Adjust position if needed
          backgroundColor: '#D5AA55', 
          color: '#000'
        }}
      >
        <ArrowUpwardIcon />
      </Fab>
    )
  );
};

export default BackToTopButton;
