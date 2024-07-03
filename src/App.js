import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
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
import Cart from './components/Cart';
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
    switch(view) {
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
          <div className="container">
            <header className='Logo-header text-center p-3'>
              <img src={menuHeader} alt='Qulture' className='img-fluid mb-3'/>
            </header>
            <div className="row justify-content-center">
              <div className="col-10">
                <div className="section mb-4" onClick={() => setView('breakfast')}>
                  <img src={breakfast} alt='Qulture'  className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('brunch')}>
                  <img src={brunchPhoto} alt='Qulture'  className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('coffee')}>
                  <img src={coffeePhoto} alt='Qulture'  className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('tea')}>
                  <img src={teaPhoto} alt='Qulture'  className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('smoothie')}>
                  <img src={smoothiePhoto} alt='Qulture'  className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('coldPress')}>
                  <img src={coldPressPhoto} alt='Qulture'  className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('italiansoda')}>
                  <img src={italianSodaPhoto} alt='Qulture'  className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('bakery')}>
                  <img src={bakery} alt='Qulture'  className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('saturdaySpecial')}>
                  <img src={saturdaySpecial} alt='Qulture'  className='img-fluid rounded border img-hover-effect'/>
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
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">Qulture</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/login">Staff Login</Nav.Link>
                <Nav.Link as={Link} to="/create-pass">Create Pass</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Routes>
          <Route path="/" element={renderContent()} />
          <Route path="/login" element={<Login />} />
          <Route path="/staff-orders" element={<StaffOrders />} />
          <Route path="/create-pass" element={<CreatePass />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Cart cartItems={cartItems} setCartItems={setCartItems} clearCart={clearCart} />
        <BackToTopButton show={showButton} />
      </div>
    </Router>
  );
}

export default App;
