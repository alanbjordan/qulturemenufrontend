import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/react';
import '../Login.css'; // Create and import a separate CSS file for custom styles

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

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    setTimeout(() => {
      if (username === 'admin' && password === 'admin1234') {
        navigate('/staff-dashboard'); // Navigate to StaffDashboard
      } else {
        setError('Invalid credentials');
      }
      setLoading(false); // Set loading to false after login process
    }, 2000); // Simulate a delay for the login process
  };
  

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="login-title">Staff Login</h2>
        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <div style={spinnerContainerStyle}>
            <ClipLoader color={"#D5AA55"} loading={loading} css={override} size={150} />
          </div>
        ) : (
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
