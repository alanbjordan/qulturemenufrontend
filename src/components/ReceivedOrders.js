import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../services/api';
import { Typography, Paper, List, ListItem, ListItemText, Container } from '@mui/material';

const ReceivedOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      const result = await fetchOrders();
      if (!result.error) {
        setOrders(result.filter(order => order.order_status === 'received'));
      }
    };
    getOrders();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Received Orders
      </Typography>
      <Paper>
        <List>
          {orders.map(order => (
            <ListItem key={order.id}>
              <ListItemText
                primary={`Table: ${order.table_name}`}
                secondary={`Items: ${order.items.map(item => item.item_name).join(', ')}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ReceivedOrders;
