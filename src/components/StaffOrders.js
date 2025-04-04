import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/react';

const BASE_URL = 'https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/';
const socket = io(BASE_URL, {
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('Connected to the backend');
});

socket.on('disconnect', () => {
  console.log('Disconnected from the backend');
});

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

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);
  const [callWaiterRequests, setCallWaiterRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loadingButton, setLoadingButton] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/orders`);
      const data = response.data;

      const groupedOrders = data.reduce((acc, order) => {
        const { order_id, table_name, comment, item_name, quantity, selected_variant, selected_modifiers } = order;
        if (!acc[order_id]) {
          acc[order_id] = {
            order_id,
            table_name,
            comment: comment || 'No comment',
            items: []
          };
        }
        acc[order_id].items.push({ item_name, quantity, selected_variant, selected_modifiers });
        return acc;
      }, {});

      setOrders(Object.values(groupedOrders));
      setLoading(false);
    } catch (err) {
      setError('Error fetching orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    socket.on('new_order', () => {
      fetchOrders(); // Refetch the orders when a new order is received
    });

    socket.on('order_status_update', (updatedOrder) => {
      setOrders((prevOrders) => prevOrders.filter(order => order.order_id !== updatedOrder.order_id));
    });

    socket.on('call_waiter', ({ message, table_name }) => {
      setCallWaiterRequests((prevRequests) => [...prevRequests, { table_name, message }]);
    });

    return () => {
      socket.off('new_order');
      socket.off('order_status_update');
      socket.off('call_waiter');
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

  const handleCallWaiterAttended = (index) => {
    setCallWaiterRequests((prevRequests) => prevRequests.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div style={spinnerContainerStyle}>
        <ClipLoader color={"#D5AA55"} loading={loading} css={override} size={150} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <h2 className="mb-4" style={{ fontWeight: 700 }}>Orders</h2>
      {success && <Alert variant="success">{success}</Alert>}
      
      {callWaiterRequests.map((request, index) => (
        <Card key={index} className="mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <Card.Header style={{ fontWeight: 500 }}>Call Waiter Request</Card.Header>
          <Card.Body>
            <Card.Title style={{ fontWeight: 700 }}>{request.message}</Card.Title>
            <Card.Text><strong>Table:</strong> {request.table_name}</Card.Text>
            <Button 
              variant="dark" 
              onClick={() => handleCallWaiterAttended(index)} 
              style={{ marginTop: '15px', fontFamily: 'Roboto, sans-serif' }}
            >
              Attended
            </Button>
          </Card.Body>
        </Card>
      ))}

      {orders.map(order => (
        <Card key={order.order_id} className="mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <Card.Header style={{ fontWeight: 500 }}>Table: {order.table_name}</Card.Header>
          <Card.Body>
            <Card.Title style={{ fontWeight: 700 }}>Order ID: {order.order_id}</Card.Title>
            <div><strong>Comment:</strong> {order.comment || 'No comment'}</div>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px', textAlign: 'left', width: '75%' }}>
                {order.items.map((item, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      padding: '10px 0', 
                      borderBottom: index < order.items.length - 1 ? '1px solid #ddd' : 'none', 
                      textAlign: 'left'
                    }}
                  >
                    <div><strong>Quantity:</strong> {item.quantity}</div>
                    <div><strong>Item:</strong> {item.item_name}</div>
                    {item.selected_variant && (
                      <div>
                        <strong>Selected Option:</strong> {item.selected_variant.option1_value || 'N/A'}
                      </div>
                    )}
                    {item.selected_modifiers && item.selected_modifiers.length > 0 && (
                      <div>
                        <strong>Addons:</strong> 
                        <ul>
                          {item.selected_modifiers.map((mod, modIndex) => (
                            <li key={modIndex}>
                              {mod.selectedOption.name} - ฿{mod.selectedOption.price}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Button 
              variant="dark" 
              onClick={() => handleTicketOpened(order.order_id)} 
              disabled={loadingButton === order.order_id}
              style={{ marginTop: '15px', fontFamily: 'Roboto, sans-serif' }}
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
