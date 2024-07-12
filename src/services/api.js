import axios from 'axios';

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

export const fetchModifierData = async (modifierId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/modifiers`, {
      params: { modifier_id: modifierId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching modifier data:', error);
    return null; // Returning null to indicate no data could be fetched
  }
};

export const submitOrder = async (order) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/orders`, order);
    return response.data;
  } catch (error) {
    console.error('Error submitting order:', error);
    return { error: error.message };
  }
};

export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { error: error.message };
  }
};
