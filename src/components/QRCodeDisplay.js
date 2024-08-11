import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const QRCodeDisplay = () => {
  const [qrCodeData, setQrCodeData] = useState(null);
  const [userProfile, setUserProfile] = useState({ displayName: 'User' });
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('user_id');
    const displayName = queryParams.get('display_name');

    if (displayName) {
      setUserProfile({ displayName });
    }

    if (userId) {
      axios.get(`https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/api/get_qr_code/${userId}`, { responseType: 'blob' })
        .then(response => {
          const qrCodeUrl = URL.createObjectURL(response.data);
          setQrCodeData(qrCodeUrl);
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
        color: '#D5AA55',
      }}>
        My Qulture Rewards
      </h1>
      {qrCodeData ? (
        <>
          <img src={qrCodeData} alt="QR Code" style={{
            width: '200px',
            height: '200px',
            marginBottom: '1rem',
          }} />
          <p style={{
            fontSize: '1.2rem',
            margin: '0.5rem 0',
          }}>
            Account Name: {userProfile.displayName}
          </p>
        </>
      ) : (
        <p style={{
          fontSize: '1.5rem',
          color: '#D5AA55',
        }}>
          Loading QR code...
        </p>
      )}
    </div>
  );
};

export default QRCodeDisplay;
