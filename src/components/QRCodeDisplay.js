import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { fetchCountries } from './fetchCountries'; // Import the fetchCountries function

const QRCodeDisplay = () => {
  const [qrCodeData, setQrCodeData] = useState(null);
  const [userProfile, setUserProfile] = useState({ displayName: 'User' });
  const [isUserFound, setIsUserFound] = useState(false);
  const [email, setEmail] = useState('');
  const [homeCountry, setHomeCountry] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [countries, setCountries] = useState([]); // State for storing fetched countries
  const [loading, setLoading] = useState(true); // Loading state for QR code
  const [error, setError] = useState(null); // Error state
  const [formError, setFormError] = useState(null); // Form submission error state
  const location = useLocation();

  useEffect(() => {
    const loadCountries = async () => {
      const countryList = await fetchCountries();
      setCountries(countryList);
    };

    loadCountries();

    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('user_id');
    const displayName = queryParams.get('display_name');

    console.log("Query params:", { userId, displayName }); // Logging the extracted query parameters

    if (displayName) {
      setUserProfile({ displayName });
    }

    if (userId) {
      fetchQRCode(userId);
    } else {
      setError('User ID not found in the URL.');
      setLoading(false);
    }
  }, [location.search]);

  const fetchQRCode = (userId) => {
    console.log("Fetching QR code for user ID:", userId); // Logging before making the API call
    axios.get(`https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/api/get_qr_code/${userId}`, { responseType: 'blob' })
      .then(response => {
        if (response.status === 200) {
          const qrCodeUrl = URL.createObjectURL(response.data);
          setQrCodeData(qrCodeUrl);
          setIsUserFound(true);  // User is found
          console.log("QR code fetched successfully."); // Logging success
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          setIsUserFound(false);  // User is not found, show the form
          console.log("User not found, showing the form."); // Logging user not found
        } else {
          setError('Error fetching QR code.');
          console.error('Error fetching QR code:', error);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");  // Logging form submission

    // Basic form validation
    if (!email || !homeCountry || !birthdate || !gender) {
      setFormError('Please fill in all fields.');
      console.log("Form validation failed. Missing fields."); // Logging validation failure
      return;
    }

    const userId = new URLSearchParams(location.search).get('user_id');
    console.log("Submitting form with data:", { userId, displayName: userProfile.displayName, email, homeCountry, birthdate, gender }); // Logging form data

    try {
      const response = await axios.post(`https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/api/update_customer`, {
        user_id: userId,
        display_name: userProfile.displayName,
        email,
        home_country: homeCountry,
        birthdate,
        gender,
      });

      console.log('User data updated successfully:', response.data); // Logging success
      setFormError(null); // Clear any previous errors

      // Fetch and display the QR code again after successful form submission
      fetchQRCode(userId);

    } catch (error) {
      setFormError('Error updating user data.');
      console.error('Error updating user data:', error); // Logging error
    }
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
      }}>
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
              Account Name: {userProfile.displayName}
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
