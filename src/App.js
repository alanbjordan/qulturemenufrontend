import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Navbar, Container, Button, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import Badge from '@mui/material/Badge';
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
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [view, setView] = useState('home');
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const clearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const [showButton, setShowButton] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [setShowCartModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

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

  const renderContent = () => {
    switch (view) {
      case 'coffee':
        return <CoffeeItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={setCartItems} />;
      case 'tea':
        return <TeaItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={setCartItems} />;
      case 'smoothie':
        return <SmoothieItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={setCartItems} />;
      case 'coldPress':
        return <ColdPressItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={setCartItems} />;
      case 'breakfast':
        return <BreakfastItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={setCartItems} />;
      case 'brunch':
        return <BrunchItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={setCartItems} />;
      case 'italiansoda':
        return <ItalianSodaSoftDrinkItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={setCartItems} />;
      case 'bakery':
        return <BakeryItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={setCartItems} />;
      case 'saturdaySpecial':
        return <SaturdaySpecialItems goToMainMenu={() => setView('home')} cartItems={cartItems} setCartItems={setCartItems} />;
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
    <Router>
      <div className="App bg-black">
        <Navbar bg="black" variant="dark" expand="lg" className="d-flex navbar-fixed-top justify-content-between align-items-center" style={{ backgroundColor: '#000000' }}>
          <Container className="d-flex justify-content-between align-items-center">
            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleShow} style={{ display: 'block' }} />
            <a href="/" onClick={() => window.location.reload()}>
              <FontAwesomeIcon icon={faHome} style={{ color: '#D5AA55', fontSize: '24px', marginLeft: '15px' }} />
            </a>
            <div className="ms-auto d-flex align-items-center">
              <Button as={Link} to="/create-pass" variant="light" style={{ backgroundColor: '#D5AA55', color: '#000000', fontWeight: 'bold', marginRight: '15px' }}>Qulture Rewards</Button>
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
            <Button as={Link} to="/" variant="dark" className="mb-2 w-100 text-start" onClick={() => window.location.reload()} style={{ backgroundColor: '#D5AA55', color: '#FFFFFF', fontWeight: 'bold' }}>Menu</Button>
            <Button as={Link} to="/login" variant="dark" className="mb-2 w-100 text-start" onClick={handleClose} style={{ backgroundColor: '#D5AA55', color: '#FFFFFF', fontWeight: 'bold' }}>Staff Login</Button>
            <Button variant="dark" className="mb-2 w-100 text-start" onClick={handleClose} style={{ backgroundColor: '#D5AA55', color: '#FFFFFF', fontWeight: 'bold' }}>Add Our Line Official</Button>
          </Offcanvas.Body>
        </Offcanvas>

        <Routes>
          <Route path="/" element={renderContent()} />
          <Route path="/login" element={<Login />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/staff-orders" element={<StaffOrders />} />
          <Route path="/create-pass" element={<CreatePass />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <BackToTopButton show={showButton} />
        <Cart cartItems={cartItems} setCartItems={setCartItems} clearCart={clearCart} open={showCart} onClose={() => setShowCart(false)} />

        {/* Add FAB with text */}
        <div 
          style={{ 
            position: 'fixed', 
            bottom: '20px', 
            right: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            cursor: 'pointer' // Make the whole container clickable
          }} 
          onClick={() => setShowCartModal(true)}
        >
        </div>
      </div>
    </Router>
  );
}

export default App;
