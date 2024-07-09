import React, { useState } from 'react';
import {
  IconButton, Modal, Backdrop, Fade, Paper, Typography, Button, List, ListItem,
  ListItemText, TextField, Grid, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Divider
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const CartPaper = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  width: '90%',
  maxWidth: 400,
  maxHeight: '80vh',
  backgroundColor: theme.palette.background.paper,
  border: '2px solid #D5AA55',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}));

const ModalContent = styled('div')(({ theme }) => ({
  overflowY: 'auto',
  padding: theme.spacing(2, 4, 3),
  flex: '1 1 auto',
}));

const ButtonContainer = styled('div')({
  padding: '10px 20px',
  background: '#fff',
  borderTop: '1px solid #ddd',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

const CloseButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
});

const Cart = ({ cartItems, setCartItems, clearCart, open, onClose }) => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRemoveItem = (itemId, variantId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== itemId || (item.selectedChoice && item.selectedChoice.choice_id !== variantId));
    setCartItems(updatedCartItems);
  };

  const handleCommentChange = (itemId, variantId, comment) => {
    const updatedCartItems = cartItems.map(item =>
      item.id === itemId && item.selectedChoice && item.selectedChoice.choice_id === variantId ? { ...item, comment } : item
    );
    setCartItems(updatedCartItems);
  };

  const increaseQuantity = (itemId, variantId) => {
    setCartItems(cartItems.map(item =>
      item.id === itemId && item.selectedChoice && item.selectedChoice.choice_id === variantId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (itemId, variantId) => {
    setCartItems(cartItems.map(item =>
      item.id === itemId && item.selectedChoice && item.selectedChoice.choice_id === variantId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
  
    const order = {
      table_name: 'Table 2',
      line_items: cartItems.map(item => ({
        item_name: item.item_name,
        quantity: item.quantity,
        comment: item.comment || ''
      }))
    };
  
    try {
      const response = await fetch('https://qulturemenuflaskbackend-5969f5ac152a.herokuapp.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setOrderStatus('Order submitted successfully');
        clearCart();
        onClose();
      } else {
        setOrderStatus(`Failed to submit order: ${result.error}`);
      }
    } catch (error) {
      setOrderStatus(`Failed to submit order: ${error.message}`);
    } finally {
      setLoading(false);
      setDialogOpen(true);
    }
  };
  
  

  const getTotalPrice = () => {
    const total = cartItems.reduce((total, item) => {
      const itemPrice = item.price;
      const modifiersPrice = item.selectedModifiers.reduce((modTotal, mod) => {
        return modTotal + (mod.selectedOption ? mod.selectedOption.price : 0);
      }, 0);
      console.log(`Item: ${item.item_name}, Item Price: ${itemPrice}, Modifiers Price: ${modifiersPrice}, Quantity: ${item.quantity}`);
      return total + (itemPrice + modifiersPrice) * item.quantity;
    }, 0).toFixed(2);
    console.log(`Total Price: ${total}`);
    return total;
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <CartPaper>
            <CloseButtonContainer>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </CloseButtonContainer>
            <ModalContent>
              {cartItems.length > 0 ? (
                <>
                  <List>
                    {cartItems.map(item => (
                      <React.Fragment key={`${item.id}-${item.selectedChoice ? item.selectedChoice.choice_id : 'no-choice'}`}>
                        <ListItem>
                          <Grid container spacing={1} alignItems="center">
                            <Grid item xs={12}>
                              <ListItemText
                                primary={`${item.item_name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())} - $${item.price}`}
                                secondary={item.selectedChoice ? `Choice: ${item.selectedChoice.option1_value}` : ''}
                                primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
                              />
                            </Grid>
                            {item.selectedModifiers && item.selectedModifiers.filter(mod => mod.selectedOption).length > 0 && (
                              <Grid item xs={12}>
                                <Typography variant="body2">
                                  Addons: {item.selectedModifiers.filter(mod => mod.selectedOption).map(modifier =>
                                    `${modifier.selectedOption.name} ${modifier.selectedOption.price ? `- $${modifier.selectedOption.price}` : ''}`
                                  ).join(', ')}
                                </Typography>
                              </Grid>
                            )}
                            <Grid item xs={12}>
                              <TextField
                                label="Comment"
                                variant="outlined"
                                size="small"
                                fullWidth
                                margin="dense"
                                value={item.comment || ''}
                                onChange={(e) => handleCommentChange(item.id, item.selectedChoice ? item.selectedChoice.choice_id : null, e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" style={{ marginRight: '10px' }}>Quantity: {item.quantity}</Typography>
                              <IconButton edge="end" aria-label="decrease" onClick={() => decreaseQuantity(item.id, item.selectedChoice ? item.selectedChoice.choice_id : null)}>
                                <RemoveIcon />
                              </IconButton>
                              <IconButton edge="end" aria-label="increase" onClick={() => increaseQuantity(item.id, item.selectedChoice ? item.selectedChoice.choice_id : null)}>
                                <AddIcon />
                              </IconButton>
                              <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item.id, item.selectedChoice ? item.selectedChoice.choice_id : null)}>
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                  <Typography variant="h6" style={{ textAlign: 'center', padding: '20px' }}>Total Price: ${getTotalPrice()}</Typography>
                </>
              ) : (
                <Typography variant="h6" style={{ textAlign: 'center', padding: '20px' }}>Add items to cart</Typography>
              )}
              {orderStatus && <Typography variant="body2" style={{ marginTop: '12px' }}>{orderStatus}</Typography>}
            </ModalContent>

            {cartItems.length > 0 && (
              <ButtonContainer>
                                <Button
                  variant="contained"
                  color="primary"
                  onClick={clearCart}
                  style={{ width: '100%', backgroundColor: '#000000', color: '#FFFFFF' }}
                >
                  Clear Cart
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmitOrder}
                  disabled={loading}
                  style={{ width: '100%', backgroundColor: '#D5AA55', color: '#FFFFFF' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Submit Order'}
                </Button>

              </ButtonContainer>
            )}
          </CartPaper>
        </Fade>
      </Modal>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="order-status-dialog-title"
        aria-describedby="order-status-dialog-description"
      >
        <DialogTitle id="order-status-dialog-title">Order Status</DialogTitle>
        <DialogContent>
          <DialogContentText id="order-status-dialog-description">
            {orderStatus}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Cart;
