import React, { useState, useEffect } from 'react';
import { fetchCountries } from './fetchCountries';

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
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#000'
        }}>
            <form onSubmit={handleSubmit} style={{
                maxWidth: '400px',
                width: '100%',
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
                color: '#000'
            }}>
                <h2 style={{ marginBottom: '20px' }}>Join My Qulture Rewards</h2>
                <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '16px',
                            marginTop: '5px'
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                    <label>Birthdate:</label>
                    <input
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '16px',
                            marginTop: '5px'
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                    <label>Home Country:</label>
                    <select
                        name="home_country"
                        value={formData.home_country}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '16px',
                            marginTop: '5px'
                        }}
                    >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '16px',
                            marginTop: '5px'
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                    <label>Gender:</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '16px',
                            marginTop: '5px'
                        }}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <button type="submit" disabled={loading} style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                }}>
                    {loading ? 'Adding you to the family!...' : 'Submit Membership'}
                </button>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>
        </div>
    );
};

export default CreatePass;
