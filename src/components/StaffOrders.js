import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';

// Replace 'your-heroku-app-url' with the actual URL of your Heroku app
const BASE_URL = process.env.REACT_APP_API_URL || 'https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com';
const socket = io(process.env.REACT_APP_API_URL || 'https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com'); // Fallback for local development

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loadingButton, setLoadingButton] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/orders`);
        const data = response.data;

        // Group orders by order_id
        const groupedOrders = data.reduce((acc, order) => {
          const { order_id, table_name, item_name, quantity, comment } = order;
          if (!acc[order_id]) {
            acc[order_id] = {
              order_id,
              table_name,
              items: []
            };
          }
          acc[order_id].items.push({ item_name, quantity, comment });
          return acc;
        }, {});

        setOrders(Object.values(groupedOrders));
        setLoading(false);
      } catch (err) {
        setError('Error fetching orders');
        setLoading(false);
      }
    };

    fetchOrders();

    // Set up Socket.IO listener for new orders
    socket.on('new_order', (newOrder) => {
      setOrders((prevOrders) => {
        const orderExists = prevOrders.find(order => order.order_id === newOrder.order_id);
        if (orderExists) {
          return prevOrders;
        } else {
          return [...prevOrders, newOrder];
        }
      });
    });

    // Set up Socket.IO listener for order status updates
    socket.on('order_status_update', (updatedOrder) => {
      setOrders((prevOrders) => prevOrders.filter(order => order.order_id !== updatedOrder.order_id));
    });

    return () => {
      socket.off('new_order');
      socket.off('order_status_update');
    };
  }, []);

  const handleTicketOpened = async (orderId) => {
    setLoadingButton(orderId);
    try {
      await axios.put(`${BASE_URL}/api/orders/${orderId}/status`, {
        status: 'assigned_to_ticket'
      });
      setOrders(orders.filter(order => order.order_id !== orderId));
      setSuccess('Order status updated successfully');
      setLoadingButton(null);
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating order status:', err);
      setLoadingButton(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Orders</h2>
      {success && <Alert variant="success">{success}</Alert>}
      {orders.map(order => (
        <Card key={order.order_id} className="mb-3">
          <Card.Header>Table: {order.table_name}</Card.Header>
          <Card.Body>
            <Card.Title>Order ID: {order.order_id}</Card.Title>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.quantity} x {item.item_name} {item.comment && `- ${item.comment}`}
                </li>
              ))}
            </ul>
            <Button 
              variant="primary" 
              onClick={() => handleTicketOpened(order.order_id)} 
              disabled={loadingButton === order.order_id}
            >
              {loadingButton === order.order_id ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  /> Loading...
                </>
              ) : (
                'Assigned to Ticket'
              )}
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default StaffOrders;
