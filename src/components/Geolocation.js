// eslint-disable-next-line
import React, { useState, useEffect } from 'react';

const Geolocation = ({ setLocation, setLocationError }) => {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError(error.message);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, [setLocation, setLocationError]);

  return null; // This component doesn't need to render anything
};

export default Geolocation;
