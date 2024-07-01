import React, { useState, useEffect } from 'react';
import { fetchCountries } from './fetchCountries';

const BASE_URL = 'https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com';

const CreatePass = () => {
    const [formData, setFormData] = useState({
        name: '',
        birthdate: '',
        homeCountry: '',
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
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Birthdate:</label>
                <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Home Country:</label>
                <select
                    name="homeCountry"
                    value={formData.homeCountry}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                            {country.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Gender:</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Creating Pass...' : 'Create Pass'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default CreatePass;
