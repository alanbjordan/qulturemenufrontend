import React, { useState, useEffect } from 'react';
import { fetchMenuItems } from '../services/api';
import bakeryHeader from '../images/bakeryHeader.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';
import DOMPurify from 'dompurify';
import { Modal, Button, Form } from 'react-bootstrap';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

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

const toTitleCase = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

const generateImageUrl = (itemId) => {
  const containerName = 'qulturecontainerstorage'; // Replace with your Azure container name
  const storageAccountName = 'storagequlturelounges'; // Replace with your Azure storage account name
  return `https://${storageAccountName}.blob.core.windows.net/${containerName}/${itemId}.jpg`;
};

const BakeryItems = ({ goToMainMenu, cartItems, setCartItems }) => {
  const [bakeryItems, setBakeryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [shakingButtonId, setShakingButtonId] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [modifiers, setModifiers] = useState([]);
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [loadingButtonId, setLoadingButtonId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getMenuItems = async () => {
      const items = await fetchMenuItems();
      const bakeryItems = items.filter(item => item.category_id === '4fd81f0d-d796-4538-b04d-6fdcd85758ee');
      const sortedItems = bakeryItems.sort((a, b) => {
        const priceA = a.variants?.[0]?.default_price || a.default_price;
        const priceB = b.variants?.[0]?.default_price || b.default_price;
        return priceB - priceA;
      });

      setBakeryItems(sortedItems);
      setTotalImages(sortedItems.length);
      setLoading(false); // Directly set loading to false after data is fetched
    };

    getMenuItems();
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
    const existingItem = cartItems.find(cartItem =>
      cartItem.id === item.id &&
      (!cartItem.selectedVariant || cartItem.selectedVariant.variant_id === selectedVariant?.variant_id) &&
      JSON.stringify(cartItem.selectedModifiers) === JSON.stringify(selectedModifiers)
    );

    const itemPrice = selectedVariant ? selectedVariant.default_price : item.default_price;

    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id &&
        (!cartItem.selectedVariant || cartItem.selectedVariant.variant_id === selectedVariant?.variant_id) &&
        JSON.stringify(cartItem.selectedModifiers) === JSON.stringify(selectedModifiers)
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity, selectedVariant, selectedModifiers, price: itemPrice }]);
    }

    setModalShow(false);
    setLoadingButtonId(item.id);
    setTimeout(() => {
      setLoadingButtonId(null);
      setShakingButtonId(item.id);
      setTimeout(() => setShakingButtonId(null), 500);
    }, 500);
  };

  const handleAddToCartClick = async (item) => {
    setLoadingButtonId(item.id);
    if (item.modifier_ids?.length > 0) {
      try {
        const fetchedModifier = await fetchModifierData(item.modifier_ids[0]);
        setModifiers([fetchedModifier]);
      } catch (error) {
        console.error('Error fetching modifier:', error);
      }
    } else {
      setModifiers([]);
    }

    setModalContent(item);
    setSelectedVariant(item.variants?.[0] || null);
    setSelectedModifiers([]);
    setQuantity(1);
    setModalShow(true);
    setLoadingButtonId(null);
  };

  const fetchModifierData = async (modifierId) => {
    const response = await fetch(`https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/api/modifiers?modifier_id=${modifierId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  };

  const handleModalClose = () => setModalShow(false);

  const handleVariantChange = (event) => {
    const variantId = event.target.value;
    const variant = modalContent.variants.find(v => v.variant_id === variantId);
    setSelectedVariant(variant);
  };

  const handleModifierChange = (event, modifierIndex) => {
    const selectedOptionId = event.target.value;
    const selectedOption = modifiers[modifierIndex].modifier_options.find(option => option.id === selectedOptionId) || null;

    setModifiers(modifiers => {
      const newModifiers = [...modifiers];
      newModifiers[modifierIndex].selectedOption = selectedOption;
      return newModifiers;
    });
  };

  const handleAddModifier = (modifierIndex) => {
    const selectedOption = modifiers[modifierIndex]?.selectedOption;
    if (selectedOption) {
      setSelectedModifiers(prevSelectedModifiers => [...prevSelectedModifiers, { ...modifiers[modifierIndex], selectedOption }]);
    }
  };

  const handleAddVariantToCart = () => addToCart({ ...modalContent, selectedVariant, selectedModifiers });

  const handleIncrementQuantity = () => setQuantity(prevQuantity => prevQuantity + 1);

  const handleDecrementQuantity = () => setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));

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
        <img src={bakeryHeader} alt='Qulture' className='img-fluid mb-3' />
      </header>
      <button className='custom-button' onClick={goToMainMenu}>Back</button>
      <div className="container">
        <div className="row">
          {bakeryItems.map(item => (
            <div key={item.id} className="col-md-12 mb-4">
              <div className="card h-100 d-flex flex-row align-items-center">
                <img
                  src={generateImageUrl(item.id)}
                  alt={item.item_name}
                  className="card-img-right lazyload"
                  style={{ width: '200px', height: '200px', objectFit: 'cover', marginLeft: '10px', marginRight: '10px', borderRadius: '10px' }}
                  onLoad={handleImageLoad}
                  onError={(e) => { e.target.style.display = 'none'; handleImageLoad(); }}
                />
                <div className="card-body flex-grow-1 d-flex flex-column justify-content-between" style={{ textAlign: 'left' }}>
                  <div>
                    <h6 className="card-title" style={{ fontSize: '1rem' }}>{toTitleCase(item.item_name)}</h6>
                    <p className="card-text" style={{ fontSize: '0.9rem' }}>฿{item.variants?.[0]?.default_price || item.default_price}</p>
                    {item.description && (
                      <Button variant="link" onClick={() => handleAddToCartClick(item)} style={{ fontSize: '0.8rem' }}>
                        View Description
                      </Button>
                    )}
                  </div>
                  <button
                    className={`custom-button mt-3 ${shakingButtonId === item.id ? 'shake' : ''}`}
                    onClick={() => handleAddToCartClick(item)}
                    style={{ fontSize: '0.9rem' }}
                  >
                    {loadingButtonId === item.id ? (
                      <ClipLoader color={"#ffffff"} loading={true} size={15} />
                    ) : shakingButtonId === item.id ? (
                      "Adding"
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={modalShow} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.item_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: 'black' }}>
          <h5>{modalContent.item_name}</h5>
          {selectedVariant && (
            <h6>Price: ฿{selectedVariant.default_price}</h6>
          )}
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(modalContent.description) }}></div>
          {modalContent.variants && modalContent.variants.length > 1 && (
            <Form.Group controlId="variantSelect">
              <Form.Label>Select Option</Form.Label>
              <Form.Control as="select" value={selectedVariant?.variant_id || ''} onChange={handleVariantChange}>
                {modalContent.variants.map(variant => (
                  <option key={variant.variant_id} value={variant.variant_id}>
                    {variant.option1_value} - ฿{variant.default_price}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}
          {modifiers.map((modifier, index) => (
            <Form.Group key={modifier.id} controlId={`modifierSelect-${modifier.id}`}>
              <Form.Label>{modifier.name}</Form.Label>
              <div className="d-flex">
                <Form.Control as="select" onChange={(e) => handleModifierChange(e, index)}>
                  <option value="">None</option>
                  {modifier.modifier_options.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name} - ฿{option.price}
                    </option>
                  ))}
                </Form.Control>
                <Button variant="secondary" className="ml-2" onClick={() => handleAddModifier(index)} style={{ backgroundColor: '#D5AA55', color: '#FFFFFF' }}>
                  Add Selection
                </Button>
              </div>
            </Form.Group>
          ))}
          {selectedModifiers.length > 0 && (
            <div>
              <h6>Selected Add-ons:</h6>
              <ul>
                {selectedModifiers.map((modifier, index) => (
                  <li key={index}>{modifier.selectedOption.name} - ฿{modifier.selectedOption.price}</li>
                ))}
              </ul>
            </div>
          )}
          <Form.Group controlId="quantitySelect">
            <Form.Label>Quantity</Form.Label>
            <div className="d-flex align-items-center">
              <Button variant="secondary" onClick={handleDecrementQuantity}>
                <RemoveIcon />
              </Button>
              <Form.Control 
                type="text" 
                value={quantity} 
                readOnly
                style={{ width: '60px', textAlign: 'center', margin: '0 10px' }} 
              />
              <Button variant="secondary" onClick={handleIncrementQuantity}>
                <AddIcon />
              </Button>
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="secondary" style={{ backgroundColor: '#D5AA55', color: '#FFFFFF' }} onClick={handleAddVariantToCart}>
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BakeryItems;
