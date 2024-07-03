import React, { useState, useEffect } from 'react';
import { fetchMenuItems } from '../services/api';
import italianSodaHeader from '../images/italianSodaHeader.png'; // Update with the correct image for Italian soda
import placeholderImage from '../images/placeholder.gif'; // A low-resolution placeholder image
import 'bootstrap/dist/css/bootstrap.min.css';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader'; // Import ClipLoader
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';

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

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const ItalianSodaSoftDrinkItems = ({ goToMainMenu, cartItems, setCartItems }) => {
  const [italianSodaItems, setItalianSodaItems] = useState([]);
  const [softDrinkItems, setSoftDrinkItems] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [imagesLoaded, setImagesLoaded] = useState(0); // Track the number of images loaded
  const [totalImages, setTotalImages] = useState(0); // Track the total number of images
  const [shakingButtonId, setShakingButtonId] = useState(null); // Track the button to shake

  useEffect(() => {
    const getMenuItems = async () => {
      const items = await fetchMenuItems();
      const italianSodaItems = items.filter(item => item.category_id === 'd8a0cf2b-2bab-456c-8a14-6c9d834dbe10');
      const softDrinkItems = items.filter(item => item.category_id === 'ed9a5724-b2fe-43cf-a7e8-2897c6badbad'); // Italian soda category ID
      setItalianSodaItems(italianSodaItems);
      setSoftDrinkItems(softDrinkItems);
      setTotalImages(italianSodaItems.length + softDrinkItems.length);
    };

    const loadData = async () => {
      await getMenuItems(); // Fetch data in the background
      setTimeout(() => {
        setLoading(false); // Spinner will spin for at least 3 seconds
      }, 500); // Wait for 3 seconds
    };

    loadData();
  }, []);

  useEffect(() => {
    if (totalImages > 0 && imagesLoaded === totalImages) {
      setLoading(false);
    }
  }, [imagesLoaded, totalImages]);

  const handleImageLoad = () => {
    setImagesLoaded(prevCount => prevCount + 1);
  };

  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    // Trigger shake animation
    setShakingButtonId(item.id);
    setTimeout(() => setShakingButtonId(null), 500); // Adjust duration as needed
  };

  if (loading) {
    return (
      <div style={spinnerContainerStyle}>
        <ClipLoader color={"#D5AA55"} loading={loading} css={override} size={150} />
      </div>
    );
  }

  // Combine items and sort to prioritize soft drinks
  const combinedItems = [...softDrinkItems, ...italianSodaItems];

  return (
    <div className='main'>
      <header className='Logo-header text-center p-3'>
        <img src={italianSodaHeader} alt='Qulture' className='img-fluid mb-3'/>
      </header>
      <button className='custom-button' onClick={goToMainMenu}>Back</button>
      <div className="container">
        <div className="row">
          {combinedItems.map(item => (
            <div key={item.id} className="col-md-12 mb-4">
              <div className="card h-100 d-flex flex-row align-items-center">
                <div className="card-body flex-grow-1 d-flex flex-column justify-content-between" style={{ textAlign: 'left' }}>
                  <div>
                    <h5 className="card-title">{toTitleCase(item.item_name)}</h5>
                    <h6 className="card-text">${item.variants[0].default_price}</h6>
                    {item.description && (
                      <p className="card-text">{item.description}</p>
                    )}
                  </div>
                  <button
                    className={`custom-button mt-3 ${shakingButtonId === item.id ? 'shake' : ''}`}
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
                <img
                  src={placeholderImage}
                  data-src={item.image_url}
                  alt={item.item_name}
                  className="card-img-right lazyload"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', marginLeft: '10px', marginRight: '10px', borderRadius: '10px' }}
                  onLoad={handleImageLoad}
                  onError={handleImageLoad} // Call handleImageLoad even if the image fails to load
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItalianSodaSoftDrinkItems;
