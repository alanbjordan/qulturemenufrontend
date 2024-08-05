import React, { useState, useEffect } from 'react';
import { fetchMenuItems } from '../services/api';
import teaHeader from '../images/teaHeader.png'; // Update with the correct image for tea
import placeholderImage from '../images/placeholder.gif'; // A low-resolution placeholder image
import 'bootstrap/dist/css/bootstrap.min.css';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader'; // Import ClipLoader
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import DOMPurify from 'dompurify';
import { Modal, Button, Form } from 'react-bootstrap';

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

const TeaItems = ({ goToMainMenu, cartItems, setCartItems }) => {
  const [teaItems, setTeaItems] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [imagesLoaded, setImagesLoaded] = useState(0); // Track the number of images loaded
  const [totalImages, setTotalImages] = useState(0); // Track the total number of images
  const [shakingButtonId, setShakingButtonId] = useState(null); // Track the button to shake
  const [modalShow, setModalShow] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null); // State to manage selected variant
  const [modifiers, setModifiers] = useState([]); // State to manage modifiers
  const [selectedModifiers, setSelectedModifiers] = useState([]); // State to manage selected modifiers
  const [loadingButtonId, setLoadingButtonId] = useState(null); // Track the button being loaded

  useEffect(() => {
    const getMenuItems = async () => {
      const items = await fetchMenuItems();
      console.log("Fetched items:", items); // Log fetched items to the console
      const teaItems = items.filter(item => item.category_id === 'af2cef22-376f-4f51-bc21-15081445cf5e'); // Tea category ID
      
      // Sort items from most expensive to least expensive
      const sortedItems = teaItems.sort((a, b) => {
        const priceA = a.variants && a.variants.length > 0 ? a.variants[0].default_price : a.default_price;
        const priceB = b.variants && b.variants.length > 0 ? b.variants[0].default_price : b.default_price;
        return priceB - priceA;
      });

      setTeaItems(sortedItems);
      setTotalImages(sortedItems.length);
    };

    const loadData = async () => {
      await getMenuItems(); // Fetch data in the background
      setTimeout(() => {
        setLoading(false); // Spinner will spin for at least 3 seconds
      }, 10); // Wait for 3 seconds
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
    const existingItem = cartItems.find(cartItem =>
      cartItem.id === item.id &&
      (!cartItem.selectedVariant || cartItem.selectedVariant.variant_id === (selectedVariant ? selectedVariant.variant_id : null)) &&
      JSON.stringify(cartItem.selectedModifiers) === JSON.stringify(selectedModifiers)
    );
    const itemPrice = selectedVariant ? selectedVariant.default_price : item.default_price;
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id &&
        (!cartItem.selectedVariant || cartItem.selectedVariant.variant_id === (selectedVariant ? selectedVariant.variant_id : null)) &&
        JSON.stringify(cartItem.selectedModifiers) === JSON.stringify(selectedModifiers)
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1, selectedVariant, selectedModifiers, price: itemPrice }]);
    }
    setModalShow(false);
    setLoadingButtonId(item.id); // Start spinner
    setTimeout(() => {
      setLoadingButtonId(null); // Stop spinner
      setShakingButtonId(item.id); // Start shaking
      setTimeout(() => {
        setShakingButtonId(null); // Stop shaking
        setTimeout(() => {
          setShakingButtonId(null); // Ensure the button resets to "Add to Cart"
        }, 500); // Delay before reverting to "Add to Cart"
      }, 500); // Duration of shake animation
    }, 500); // Duration of spinner before modal opens
  };

  const handleAddToCartClick = async (item) => {
    setLoadingButtonId(item.id); // Start spinner
    if (item.modifier_ids && item.modifier_ids.length > 0) {
      try {
        const fetchedModifier = await fetchModifierData(item.modifier_ids[0]); // Fetch the first modifier ID only
        console.log('Fetched modifier:', fetchedModifier);
        setModifiers([fetchedModifier]);
      } catch (error) {
        console.error('Error fetching modifier:', error);
      }
    } else {
      setModifiers([]);
    }
    setModalContent(item);
    setSelectedVariant(item.variants && item.variants.length > 0 ? item.variants[0] : null); // Set default variant selection if it exists
    setSelectedModifiers([]); // Reset selected modifiers
    setTimeout(() => {
      setModalShow(true);
      setLoadingButtonId(null); // Stop spinner once modal opens
    }, 500); // Adjust duration as needed
  };

  const fetchModifierData = async (modifierId) => {
    const response = await fetch(`https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/api/modifiers?modifier_id=${modifierId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  };

  const handleModalClose = () => {
    setModalShow(false);
    setLoadingButtonId(null); // Reset loading state if modal is closed without adding
  };

  const handleVariantChange = (event) => {
    const variantId = event.target.value;
    const variant = modalContent.variants.find(v => v.variant_id === variantId);
    setSelectedVariant(variant);
  };

  const handleModifierChange = (event, modifierIndex) => {
    const selectedOptionId = event.target.value;
    const selectedOption = selectedOptionId ? modifiers[modifierIndex].modifier_options.find(option => option.id === selectedOptionId) : null;

    // Update selected option for the given modifier
    setModifiers(modifiers => {
      const newModifiers = [...modifiers];
      newModifiers[modifierIndex].selectedOption = selectedOption;
      return newModifiers;
    });
  };

  const handleAddModifier = (modifierIndex) => {
    const modifier = modifiers[modifierIndex];
    const selectedOption = modifier.selectedOption;

    if (selectedOption) {
      setSelectedModifiers(prevSelectedModifiers => [
        ...prevSelectedModifiers,
        {
          ...modifier,
          selectedOption,
        },
      ]);
    }
  };

  const handleAddVariantToCart = () => {
    const itemWithVariant = { ...modalContent, selectedVariant, selectedModifiers };
    addToCart(itemWithVariant);
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
        <img src={teaHeader} alt='Qulture' className='img-fluid mb-3'/>
      </header>
      <button className='custom-button' onClick={goToMainMenu}>Back</button>
      <div className="container">
        <div className="row">
          {teaItems.map(item => (
            <div key={item.id} className="col-md-12 mb-4">
              <div className="card h-100 d-flex flex-row align-items-center">
                <div className="card-body flex-grow-1 d-flex flex-column justify-content-between" style={{ textAlign: 'left' }}>
                  <div>
                    <h5 className="card-title">{toTitleCase(item.item_name)}</h5>
                    {item.variants && item.variants.length > 0 ? (
                      <h6 className="card-text">฿{item.variants[0].default_price}</h6>
                    ) : (
                      <h6 className="card-text">฿{item.default_price}</h6>
                    )}
                    {item.description && (
                      <Button variant="link" onClick={() => handleAddToCartClick(item)}>
                        View Description
                      </Button>
                    )}
                  </div>
                  <button
                    className={`custom-button mt-3 ${shakingButtonId === item.id ? 'shake' : ''}`}
                    onClick={() => handleAddToCartClick(item)}
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

      <Modal show={modalShow} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.item_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: 'black' }}>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(modalContent.description) }}></div>
          {modalContent.variants && modalContent.variants.length > 1 && (
            <Form.Group controlId="variantSelect">
              <Form.Label>Select Option</Form.Label>
              <Form.Control as="select" value={selectedVariant ? selectedVariant.variant_id : ''} onChange={handleVariantChange}>
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
              <Form.Label>Select Add-ons</Form.Label>
              <div className="d-flex">
                <Form.Control as="select" onChange={(e) => handleModifierChange(e, index)}>
                  <option value="">None</option> {/* Add default None option */}
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleModalClose} >
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

export default TeaItems;
