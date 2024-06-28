import axios from 'axios';

// Replace 'your-heroku-app-url' with the actual URL of your Heroku app
const BASE_URL = 'https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com';

export const fetchMenuItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/items`);
    console.log('API response:', response.data);
    return response.data.items;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

// services/api.js

export const submitOrder = async (order) => {
  try {
    const response = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const submitOrderItem = async (orderItem) => {
  try {
    const response = await fetch(`${BASE_URL}/api/order_items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderItem)
    });
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/orders`);
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};
