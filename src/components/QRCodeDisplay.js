import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { fetchCountries } from './fetchCountries';

const QRCodeDisplay = () => {
  const [qrCodeData, setQrCodeData] = useState(null);
  const [userProfile, setUserProfile] = useState({ displayName: 'User' });
  const [userRewards, setUserRewards] = useState(0); // Store only rewards points here
  const [isUserFound, setIsUserFound] = useState(false);
  const [email, setEmail] = useState('');
  const [homeCountry, setHomeCountry] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countryList = await fetchCountries();
        setCountries(countryList);
      } catch (err) {
        setError('Error loading countries.');
        setLoading(false);
      }
    };

    loadCountries();

    const queryParams = new URLSearchParams(location.search);
    const lineId = queryParams.get('line_id'); // Use 'line_id' instead of 'user_id'
    const displayName = queryParams.get('display_name');
    const userStatus = queryParams.get('status');

    console.log("Query params:", { lineId, displayName, userStatus }); // Logging the extracted query parameters

    if (displayName) {
      setUserProfile({ displayName });
    }

    if (lineId) {  // Check for lineId instead of userId
      if (userStatus === 'new') {
        // If the user is new, show the form to collect additional details
        setIsUserFound(false);
        setLoading(false);
      } else {
        // If the user is existing, fetch the QR code and rewards points
        fetchQRCode(lineId);
        fetchRewards(lineId);
      }
    } else {
      setError('User ID not found in the URL.');
      setLoading(false);
    }
  }, [location.search]);

  const fetchQRCode = (lineId) => {
    console.log("Fetching QR code for user ID:", lineId); // Logging before making the API call
    axios.get(`https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/api/get_qr_code/${lineId}`, { responseType: 'blob' })
      .then(response => {
        if (response.status === 200) {
          const qrCodeUrl = URL.createObjectURL(response.data);
          setQrCodeData(qrCodeUrl);
          setIsUserFound(true);
          setLoading(false); // Ensure loading is set to false after successful fetch
          console.log("QR code fetched successfully."); // Logging success
        } else {
          setError('Failed to fetch QR code.');
          setLoading(false);
        }
      })
      .catch(error => {
        setError('Error fetching QR code.');
        console.error('Error fetching QR code:', error);
        setLoading(false);
      });
  };

  const fetchRewards = (lineId) => {
    console.log("Fetching rewards points for user ID:", lineId);
    axios.get(`https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/api/get_user_profile/${lineId}`)
      .then(response => {
        if (response.status === 200) {
          const rewardsPoints = response.data.rewards_points;
          setUserRewards(rewardsPoints); // Set only rewards points
          setLoading(false); // Ensure loading is set to false after successful fetch
          console.log("Rewards points fetched successfully.");
        } else {
          setError('Failed to fetch rewards points.');
          setLoading(false);
        }
      })
      .catch(error => {
        setError('Error fetching rewards points.');
        console.error('Error fetching rewards points:', error);
        setLoading(false);
      });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);  // Set submitting state to true
    setFeedbackMessage('');  // Clear previous feedback messages
    console.log("Form submitted!");  // Logging form submission

    if (!email || !homeCountry || !birthdate || !gender) {
      setFormError('Please fill in all fields.');
      console.log("Form validation failed. Missing fields.");
      setIsSubmitting(false);  // Reset submitting state
      return;
    }

    const lineId = new URLSearchParams(location.search).get('line_id');
    const account = new URLSearchParams(location.search).get('account');

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
      setFeedbackMessage('Form submitted successfully!');
      setIsUserFound(true);
      fetchQRCode(lineId);

    } catch (error) {
      setFormError('Error updating user data.');
      console.error('Error updating user data:', error);
      setFeedbackMessage('Failed to submit the form.');
    } finally {
      setIsSubmitting(false);  // Reset submitting state
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
        position: 'relative',
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
            <p style={{
              fontSize: '1.2rem',
              margin: '0.5rem 0',
              textAlign: 'center',
            }}>
              Rewards Points: {userRewards.toLocaleString()}
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
              
              {/* Feedback Message */}
              {feedbackMessage && (
                <p style={{ color: feedbackMessage.includes('success') ? 'green' : 'red', textAlign: 'center' }}>
                  {feedbackMessage}
                </p>
              )}

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
                backgroundColor: isSubmitting ? '#999' : '#D5AA55',
                color: isSubmitting ? '#666' : '#000',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                width: '100%',
                boxSizing: 'border-box',
                border: 'none',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                opacity: isSubmitting ? 0.7 : 1,
              }} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
};

export default QRCodeDisplay;
