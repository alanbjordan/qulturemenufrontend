import React, { useState, useEffect } from 'react';
import { fetchMenuItems } from '../services/api';
import bakeryHeader from '../images/bakeryHeader.png'; // Update with the correct image for bakery
import placeholderImage from '../images/placeholder.gif'; // A low-resolution placeholder image
import 'bootstrap/dist/css/bootstrap.min.css';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader'; // Import ClipLoader
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import DOMPurify from 'dompurify';
import { Modal, Button } from 'react-bootstrap';

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

const BakeryItems = ({ goToMainMenu, cartItems, setCartItems }) => {
  const [bakeryItems, setBakeryItems] = useState([]);
  const [quantities, setQuantities] = useState({}); // Track quantities for each item
  const [loading, setLoading] = useState(true); // State to manage loading
  const [imagesLoaded, setImagesLoaded] = useState(0); // Track the number of images loaded
  const [totalImages, setTotalImages] = useState(0); // Track the total number of images
  const [modalShow, setModalShow] = useState(false);
  const [modalContent, setModalContent] = useState({});

  useEffect(() => {
    const getMenuItems = async () => {
      const items = await fetchMenuItems();
      const bakeryItems = items.filter(item => item.category_id === '4fd81f0d-d796-4538-b04d-6fdcd85758ee'); // Bakery category ID
      setBakeryItems(bakeryItems);
      setTotalImages(bakeryItems.length);
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
    const quantity = quantities[item.id] || 1;
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity }]);
    }
    // Reset quantity to 1 after adding to cart
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [item.id]: 1
    }));

    // Add shake animation to button
    const button = document.querySelector(`.add-to-cart-button-${item.id}`);
    if (button) {
      button.classList.add('shake');
      setTimeout(() => {
        button.classList.remove('shake');
      }, 500);
    }
  };

  const increaseQuantity = (itemId) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemId]: (prevQuantities[itemId] || 1) + 1
    }));
  };

  const decreaseQuantity = (itemId) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemId]: Math.max((prevQuantities[itemId] || 1) - 1, 1)
    }));
  };

  const handleModalShow = (item) => {
    setModalContent(item);
    setModalShow(true);
  };

  if (loading) {
    return (
      <div style={spinnerContainerStyle}>
        <ClipLoader color={"#D5AA55"} loading={loading} css={override} size={150} />
      </div>
    );
  }

  return (
    <div className='main'>
      <header className='Logo-header text-center p-3'>
        <img src={bakeryHeader} alt='Qulture' className='img-fluid mb-3'/>
      </header>
      <button className='custom-button' onClick={goToMainMenu}>Back</button>
      <div className="container">
        <div className="row">
          {bakeryItems.map(item => (
            <div key={item.id} className="col-md-3 mb-4">
              <div className="card h-100">
                {item.image_url && (
                  <img
                    src={placeholderImage}
                    data-src={item.image_url}
                    alt={item.item_name}
                    className="card-img-top lazyload"
                    style={{ height: '400px', objectFit: 'cover' }}
                    onLoad={handleImageLoad}
                    onError={handleImageLoad} // Call handleImageLoad even if the image fails to load
                  />
                )}
                <div className="card-body">
                  <h3 className="card-title">{item.item_name}</h3>
                  {item.description && (
                    <Button variant="link" onClick={() => handleModalShow(item)}>
                      View Description
                    </Button>
                  )}
                  <h4 className="card-text">{item.variants[0].default_price}</h4>
                  <div className="input-group mb-3 quantity-selector">
                    <button className="btn btn-outline-secondary" type="button" onClick={() => decreaseQuantity(item.id)}>-</button>
                    <input type="text" className="form-control text-center" value={quantities[item.id] || 1} readOnly />
                    <button className="btn btn-outline-secondary" type="button" onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>
                  <button className={`custom-button add-to-cart-button add-to-cart-button-${item.id}`} onClick={() => addToCart(item)}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.item_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: 'black' }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(modalContent.description) }}></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BakeryItems;
