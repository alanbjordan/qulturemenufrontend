import axios from 'axios';

export const fetchCountries = async () => {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data.map(country => ({
            code: country.cca2,
            name: country.name.common
        }));
        return countries.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
};
