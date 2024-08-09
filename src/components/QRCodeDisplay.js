import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const QRCodeDisplay = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [userProfile, setUserProfile] = useState({ userId: '', displayName: '' });
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('user_id'); // Retrieve userId from the query parameter

    if (userId) {
      axios.get(`https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/api/get_qr_code/${userId}`, {
        responseType: 'blob' // Ensure the response type is set to 'blob'
      })
      .then(response => {
        const url = URL.createObjectURL(response.data);
        setQrCodeUrl(url); // Set the URL for rendering the image
        setUserProfile({ userId }); // Mock display name, replace with actual logic if needed
      })
      .catch(error => {
        console.error('Error fetching QR code:', error);
      });
    } else {
      console.error('User ID not found in the URL');
    }
  }, [location.search]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      backgroundColor: '#000',
      color: '#fff',
    }}>
      <h1 style={{
        fontSize: '2rem',
        marginBottom: '2rem',
        color: '#D5AA55', // Gold color for the title2
      }}>
        My Qulture Rewards
      </h1>
      {qrCodeUrl ? (
        <>
          <img src={qrCodeUrl} alt="QR Code" style={{
            width: '200px',
            height: '200px',
            marginBottom: '1rem',
          }} />
          <p style={{
            fontSize: '1.2rem',
            margin: '0.5rem 0',
          }}>
            User ID: {userProfile.userId}
          </p>
        </>
      ) : (
        <p style={{
          fontSize: '1.5rem',
          color: '#D5AA55', // Gold color for loading text
        }}>
          Loading QR code...
        </p>
      )}
    </div>
  );
};

export default QRCodeDisplay;
