import React, { useState, useEffect } from 'react';
import { fetchCountries } from './fetchCountries';
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/react';
import '../Login.css'; // Import the same CSS file for consistency

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const spinnerContainerStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 9999,
};

const BASE_URL = 'https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com';

const CreatePass = () => {
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    home_country: '',
    email: '',
    gender: ''
  });
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCountries = async () => {
      const countryList = await fetchCountries();
      setCountries(countryList);
    };

    getCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/create-pass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.message === 'Pass created successfully!') {
        // Redirect to the pass install URL
        window.location.href = data.pass_install_url;
      } else {
        setError('Error creating pass: ' + data.error);
      }
    } catch (error) {
      setError('Error: ' + error.toString());
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="login-title">Join My Qulture Rewards</h2>
        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <div style={spinnerContainerStyle}>
            <ClipLoader color={"#D5AA55"} loading={loading} css={override} size={150} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="login-input"
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '5px' }}>Birthdate</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                required
                className="login-input"
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '5px' }}>Home Country</label>
              <select
                name="home_country"
                value={formData.home_country}
                onChange={handleChange}
                required
                className="login-input"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="login-input"
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '5px' }}>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="login-input"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="login-button">
              {loading ? 'Adding you to the family!...' : 'Submit Membership'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreatePass;
