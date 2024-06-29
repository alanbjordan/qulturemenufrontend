import React, { useState, useEffect } from 'react';
import { fetchCountries } from './fetchCountries';

const CreatePass = () => {
    const [formData, setFormData] = useState({
        name: '',
        birthdate: '',
        homeCountry: '',
        email: '',
        gender: ''
    });
    const [countries, setCountries] = useState([]);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/create-pass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Pass created successfully!');
                } else {
                    alert('Error creating pass: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
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
                />
            </div>
            <div>
                <label>Birthdate:</label>
                <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Home Country:</label>
                <select
                    name="homeCountry"
                    value={formData.homeCountry}
                    onChange={handleChange}
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
                />
            </div>
            <div>
                <label>Gender:</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <button type="submit">Create Pass</button>
        </form>
    );
};

export default CreatePass;
