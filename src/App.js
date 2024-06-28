import React, { useState, useEffect } from 'react';
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
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SmoothieItems from './components/SmoothieItems';
import ColdPressItems from './components/ColdPressItems';
import BreakfastItems from './components/BreakfastItems';
import BrunchItems from './components/BrunchItems';
import ItalianSodaSoftDrinkItems from './components/ItalianSodaSoftDrinkItems';
import BakeryItems from './components/BakeryItems';
import SaturdaySpecialItems from './components/SaturdaySpecialItems';
import BackToTopButton from './components/BackToTopButton'; // Import the component
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import StaffOrders from './components/StaffOrders';

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
              <img src={menuHeader} alt='Qulture Image' className='img-fluid mb-3'/>
            </header>
            <div className="row justify-content-center">
              <div className="col-10">
                <div className="section mb-4" onClick={() => setView('breakfast')}>
                  <img src={breakfast} className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('brunch')}>
                  <img src={brunchPhoto} className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('coffee')}>
                  <img src={coffeePhoto} className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('tea')}>
                  <img src={teaPhoto} className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('smoothie')}>
                  <img src={smoothiePhoto} className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('coldPress')}>
                  <img src={coldPressPhoto} className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('italiansoda')}>
                  <img src={italianSodaPhoto} className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('bakery')}>
                  <img src={bakery} className='img-fluid rounded border img-hover-effect'/>
                </div>
                <div className="section mb-4" onClick={() => setView('saturdaySpecial')}>
                  <img src={saturdaySpecial} className='img-fluid rounded border img-hover-effect'/>
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
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Staff Login</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={renderContent()} />
          <Route path="/login" element={<Login />} />
          <Route path="/staff-orders" element={<StaffOrders />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Cart cartItems={cartItems} setCartItems={setCartItems} clearCart={clearCart} />
        <BackToTopButton show={showButton} />
      </div>
    </Router>
  );
}

export default App;
