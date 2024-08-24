import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

const StaffDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex flex-column align-items-center mt-5">
      <h2>Welcome, Staff Member</h2>
      <Button className="mt-3" onClick={() => navigate('/staff-orders')}>
        View Orders
      </Button>
    </Container>
  );
};

export default StaffDashboard;
