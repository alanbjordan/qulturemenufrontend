import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchCountries } from './fetchCountries';

const QRCodeDisplay = () => {
  const [qrCodeData, setQrCodeData] = useState(null);
  const [userProfile, setUserProfile] = useState({ displayName: 'User', rewards_points: 0 });
  const [isUserFound, setIsUserFound] = useState(false);
  const [email, setEmail] = useState('');
  const [homeCountry, setHomeCountry] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCountries = async () => {
      const countryList = await fetchCountries();
      setCountries(countryList);
    };

    loadCountries();

    const queryParams = new URLSearchParams(location.search);
    const lineId = queryParams.get('line_id');
    const displayName = queryParams.get('display_name');
    const userStatus = queryParams.get('status');

    console.log("Query params:", { lineId, displayName, userStatus });

    if (lineId) {
      if (userStatus === 'new') {
        setIsUserFound(false);
        setLoading(false);
      } else {
        fetchUserProfile(lineId);  // Fetch the user profile including rewards points
        fetchQRCode(lineId);
      }
    } else {
      setError('User ID not found in the URL.');
      setLoading(false);
    }
  }, [location.search]);

  const fetchUserProfile = (lineId) => {
    axios.get(`https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/api/get_user_profile/${lineId}`)
      .then(response => {
        if (response.status === 200) {
          console.log("User profile fetched successfully:", response.data);
          setUserProfile(response.data);
          console.log("User Profile set:", response.data);
        } else {
          console.error("Failed to fetch user profile. Status code:", response.status);
        }
      })
      .catch(error => {
        setError('Error fetching user profile.');
        console.error('Error fetching user profile:', error);
      });
  };

  const fetchQRCode = (lineId) => {
    console.log("Fetching QR code for user ID:", lineId);
    axios.get(`https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/api/get_qr_code/${lineId}`, { responseType: 'blob' })
      .then(response => {
        if (response.status === 200) {
          const qrCodeUrl = URL.createObjectURL(response.data);
          setQrCodeData(qrCodeUrl);
          setIsUserFound(true);
          setLoading(false);
          console.log("QR code fetched successfully.");
        }
      })
      .catch(error => {
        setError('Error fetching QR code.');
        console.error('Error fetching QR code:', error);
        setLoading(false);
      });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");

    if (!email || !homeCountry || !birthdate || !gender) {
      setFormError('Please fill in all fields.');
      console.log("Form validation failed. Missing fields.");
      return;
    }

    const lineId = new URLSearchParams(location.search).get('line_id');
    const account = new URLSearchParams(location.search).get('account');
    console.log("Submitting form with data:", { lineId, displayName: userProfile.displayName, email, homeCountry, birthdate, gender, account });

    try {
      const response = await axios.post(`https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/api/update_customer`, {
        user_id: lineId,
        display_name: userProfile.displayName,
        email,
        home_country: homeCountry,
        birthdate,
        gender,
        account,
      });

      console.log('User data updated successfully:', response.data);
      setFormError(null);
      setIsUserFound(true);
      fetchQRCode(lineId);

    } catch (error) {
      setFormError('Error updating user data.');
      console.error('Error updating user data:', error);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  if (loading) {
    return <p style={{ textAlign: 'center', color: '#fff' }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#111',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'left',
        position: 'relative',
      }}>
        <button onClick={handleClose} style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#D5AA55',
          fontSize: '1.5rem',
          cursor: 'pointer',
        }}>
          &times;
        </button>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '2rem',
          color: '#D5AA55',
          textAlign: 'center',
        }}>
          My Qulture Rewards
        </h1>
        {qrCodeData && isUserFound ? (
          <>
            <img src={qrCodeData} alt="QR Code" style={{
              width: '200px',
              height: '200px',
              marginBottom: '1rem',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }} />
            <p style={{
              fontSize: '1.2rem',
              margin: '0.5rem 0',
              textAlign: 'center',
            }}>
              Account Name: {userProfile.displayName || userProfile.display_name || 'N/A'}
            </p>
            <p style={{
              fontSize: '1.2rem',
              margin: '0.5rem 0',
              textAlign: 'center',
            }}>
              Points Balance: {userProfile.rewards_points}
            </p>
          </>
        ) : (
          !isUserFound && (
            <form onSubmit={handleFormSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              color: '#fff',
              width: '100%',
            }}>
              {formError && <p style={{ color: 'red', marginBottom: '1rem' }}>{formError}</p>}
              <label style={{ marginBottom: '1rem', fontSize: '1rem', color: '#D5AA55' }}>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.8rem',
                    borderRadius: '5px',
                    border: '1px solid #D5AA55',
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: '#222',
                    color: '#fff',
                  }}
                />
              </label>
              <label style={{ marginBottom: '1rem', fontSize: '1rem', color: '#D5AA55' }}>
                Home Country:
                <select
                  value={homeCountry}
                  onChange={(e) => setHomeCountry(e.target.value)}
                  required
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.8rem',
                    borderRadius: '5px',
                    border: '1px solid #D5AA55',
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: '#222',
                    color: '#fff',
                  }}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ marginBottom: '1rem', fontSize: '1rem', color: '#D5AA55' }}>
                Birthdate:
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  required
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.8rem',
                    borderRadius: '5px',
                    border: '1px solid #D5AA55',
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: '#222',
                    color: '#fff',
                  }}
                />
              </label>
              <label style={{ marginBottom: '1rem', fontSize: '1rem', color: '#D5AA55' }}>
                Gender:
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.8rem',
                    borderRadius: '5px',
                    border: '1px solid #D5AA55',
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: '#222',
                    color: '#fff',
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <button type="submit" style={{
                marginTop: '1rem',
                padding: '0.7rem',
                borderRadius: '5px',
                backgroundColor: '#D5AA55',
                color: '#000',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                boxSizing: 'border-box',
                border: 'none',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              }}>
                Submit
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
};

export default QRCodeDisplay;
