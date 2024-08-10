import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Navbar, Container, Button, Offcanvas, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import Badge from '@mui/material/Badge';
import axios from 'axios';
import menuHeader from './images/menuHeader.png';
import breakfast from './images/breakfastPhoto.png';
import bakery from './images/bakery.png';
import coffeePhoto from './images/coffee.png';
import brunchPhoto from './images/brunch.png';
import smoothiePhoto from './images/smoothie.png';
import teaPhoto from './images/tea.png';
import coldPressPhoto from './images/coldpress.png';
import italianSodaPhoto from './images/italianSoda.png';
import saturdaySpecial from './images/saturdaySpecial.png';
import CoffeeItems from './components/CoffeeItems';
import TeaItems from './components/TeaItems';
import SmoothieItems from './components/SmoothieItems';
import ColdPressItems from './components/ColdPressItems';
import BreakfastItems from './components/BreakfastItems';
import BrunchItems from './components/BrunchItems';
import ItalianSodaSoftDrinkItems from './components/ItalianSodaSoftDrinkItems';
import BakeryItems from './components/BakeryItems';
import SaturdaySpecialItems from './components/SaturdaySpecialItems';
import BackToTopButton from './components/BackToTopButton';
import Login from './components/Login';
import StaffOrders from './components/StaffOrders';
import CreatePass from './components/CreatePass';
import Cart from './components/Cart';
import StaffDashboard from './components/StaffDashboard';
import QRCodeDisplay from './components/QRCodeDisplay'; // Import the QRCodeDisplay component
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useSession } from './contexts/SessionContext'; // Import the useSession hook

const BASE_URL = 'https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/';

const AppContent = ({ tableNumber }) => {
  const { sessionData, setSessionData } = useSession();
  const [view, setView] = useState('home');
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState('Call Waiter');
  const [showButton, setShowButton] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const cartItems = sessionData.cartItems || [];

  const clearCart = () => {
    setSessionData(prev => ({ ...prev, cartItems: [] }));
  };

  useEffect(() => {
    localStorage.setItem('sessionData', JSON.stringify(sessionData));
  }, [sessionData]);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Timeout duration (e.g., 15 minutes)
  const TIMEOUT_DURATION = 15 * 60 * 1000;
  const timeoutRef = useRef();

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setSessionData({});
      localStorage.removeItem('sessionData');
    }, TIMEOUT_DURATION);
  }, [setSessionData, TIMEOUT_DURATION]);

  useEffect(() => {
    const handleActivity = () => resetTimeout();
    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);

    resetTimeout();

    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [resetTimeout]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const callWaiter = async (tableNumber) => {
    setLoading(true);
    setButtonText('Waiter Called');
    try {
      await axios.post(`${BASE_URL}/api/call-waiter`, {
        message: 'A customer is calling a waiter!',
        table_name: tableNumber
      });
    } catch (error) {
      console.error('Error calling waiter:', error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setButtonText('Call Waiter');
      }, 5000); // Revert the button text back after 5 seconds
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'coffee':
        return <CoffeeItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={items => setSessionData(prev => ({ ...prev, cartItems: items }))} />;
      case 'tea':
        return <TeaItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={items => setSessionData(prev => ({ ...prev, cartItems: items }))} />;
      case 'smoothie':
        return <SmoothieItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={items => setSessionData(prev => ({ ...prev, cartItems: items }))} />;
      case 'coldPress':
        return <ColdPressItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={items => setSessionData(prev => ({ ...prev, cartItems: items }))} />;
      case 'breakfast':
        return <BreakfastItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={items => setSessionData(prev => ({ ...prev, cartItems: items }))} />;
      case 'brunch':
        return <BrunchItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={items => setSessionData(prev => ({ ...prev, cartItems: items }))} />;
      case 'italiansoda':
        return <ItalianSodaSoftDrinkItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={items => setSessionData(prev => ({ ...prev, cartItems: items }))} />;
      case 'bakery':
        return <BakeryItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={items => setSessionData(prev => ({ ...prev, cartItems: items }))} />;
      case 'saturdaySpecial':
        return <SaturdaySpecialItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={items => setSessionData(prev => ({ ...prev, cartItems: items }))} />;
      default:
        return (
          <div className="container content">
            <header className='Logo-header text-center p-3'>
              <img src={menuHeader} alt='Qulture' className='img-fluid mb-3' />
            </header>
            <div className="row justify-content-center">
              <div className="col-10">
                <div className="section mb-4" onClick={() => setView('breakfast')}>
                  <img src={breakfast} alt='Qulture' className='img-fluid rounded border img-hover-effect' />
                </div>
                <div className="section mb-4" onClick={() => setView('brunch')}>
                  <img src={brunchPhoto} alt='Qulture' className='img-fluid rounded border img-hover-effect' />
                </div>
                <div className="section mb-4" onClick={() => setView('coffee')}>
                  <img src={coffeePhoto} alt='Qulture' className='img-fluid rounded border img-hover-effect' />
                </div>
                <div className="section mb-4" onClick={() => setView('tea')}>
                  <img src={teaPhoto} alt='Qulture' className='img-fluid rounded border img-hover-effect' />
                </div>
                <div className="section mb-4" onClick={() => setView('smoothie')}>
                  <img src={smoothiePhoto} alt='Qulture' className='img-fluid rounded border img-hover-effect' />
                </div>
                <div className="section mb-4" onClick={() => setView('coldPress')}>
                  <img src={coldPressPhoto} alt='Qulture' className='img-fluid rounded border img-hover-effect' />
                </div>
                <div className="section mb-4" onClick={() => setView('italiansoda')}>
                  <img src={italianSodaPhoto} alt='Qulture' className='img-fluid rounded border img-hover-effect' />
                </div>
                <div className="section mb-4" onClick={() => setView('bakery')}>
                  <img src={bakery} alt='Qulture' className='img-fluid rounded border img-hover-effect' />
                </div>
                <div className="section mb-4" onClick={() => setView('saturdaySpecial')}>
                  <img src={saturdaySpecial} alt='Qulture' className='img-fluid rounded border img-hover-effect' />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App bg-black">
      <Navbar bg="black" variant="dark" expand="lg" className="d-flex navbar-fixed-top justify-content-between align-items-center" style={{ backgroundColor: '#000000' }}>
        <Container className="d-flex justify-content-between align-items-center">
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleShow} style={{ display: 'block' }} />
          <a href={`/?table=${tableNumber}`} onClick={() => window.location.reload()}>
            <FontAwesomeIcon icon={faHome} style={{ color: '#D5AA55', fontSize: '24px', marginLeft: '15px' }} />
          </a>
          <div className="ms-auto d-flex align-items-center">
            <Button variant="warning" onClick={() => callWaiter(tableNumber)} style={{ backgroundColor: '#D5AA55', color: '#000000', fontWeight: 'bold', marginRight: '15px' }}>
              {loading ? <Spinner animation="border" size="sm" /> : buttonText}
            </Button>
            <IconButton color="primary" onClick={() => setShowCart(true)} style={{ color: '#D5AA55' }}>
              <Badge badgeContent={getTotalQuantity()} color="secondary">
                <FontAwesomeIcon icon={faShoppingCart} style={{ fontSize: '24px' }} />
              </Badge>
            </IconButton>
          </div>
        </Container>
      </Navbar>

      <Offcanvas show={showOffcanvas} onHide={handleClose} placement="start" style={{ backgroundColor: '#000000' }}>
        <Offcanvas.Header>
          <Offcanvas.Title style={{ color: '#FFFFFF' }}>Qulture Lounge & Cafe</Offcanvas.Title>
          <button type="button" className="btn-close" aria-label="Close" onClick={handleClose} style={{ filter: 'invert(1)' }}></button>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column align-items-start p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <Button as={Link} to={`/?table=${tableNumber}`} variant="dark" className="mb-2 w-100 text-start" onClick={() => window.location.reload()} style={{ backgroundColor: '#D5AA55', color: '#FFFFFF', fontWeight: 'bold' }}>Menu</Button>
          {tableNumber === 'staff' && (
            <Button as={Link} to="/login" variant="dark" className="mb-2 w-100 text-start" onClick={handleClose} style={{ backgroundColor: '#D5AA55', color: '#FFFFFF', fontWeight: 'bold' }}>Staff Login</Button>
          )}
          <Button as={Link} to="https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/login" variant="dark" className="mb-2 w-100 text-start" onClick={handleClose} style={{ backgroundColor: '#D5AA55', color: '#FFFFFF', fontWeight: 'bold' }}>Login with LINE</Button>
          <Button as={Link} to={'https://lin.ee/hbKtoo0'} variant="dark" className="mb-2 w-100 text-start" onClick={handleClose} style={{ backgroundColor: '#D5AA55', color: '#FFFFFF', fontWeight: 'bold' }}>Add Our Line Official</Button>
        </Offcanvas.Body>
      </Offcanvas>

      <Routes>
        <Route path="/" element={renderContent()} />
        <Route path="/login" element={<Login />} />
        <Route path="/line-login2" element={<QRCodeDisplay />} />
        <Route path="/line-login" element={<Login />} />       
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/staff-orders" element={<StaffOrders />} />
        <Route path="/create-pass" element={<CreatePass />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <BackToTopButton show={showButton} />
      <Cart cartItems={cartItems} setCartItems={items => setSessionData(prev => ({ ...prev, cartItems: items }))} clearCart={clearCart} open={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
};

const AppWithRouter = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tableNumber = params.get('table') || 'Unknown Table';

  return (
    <AppContent tableNumber={tableNumber} />
  );
};

export default App;
