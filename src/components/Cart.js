import React, { useState } from 'react';
import { submitOrder } from '../services/api';
import {
  IconButton, Badge, Modal, Backdrop, Fade, Paper, Typography, Button, List, ListItem,
  ListItemText, TextField, Grid, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Divider
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const CartButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
  backgroundColor: '#D5AA55',
  color: 'black',
  width: theme.spacing(8),
  height: theme.spacing(8),
  fontSize: '24px',
}));

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

const Cart = ({ cartItems, setCartItems, clearCart }) => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpen = () => {
    setOrderStatus(null);  // Reset order status when opening the cart
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleRemoveItem = (itemId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCartItems);
  };

  const handleCommentChange = (itemId, comment) => {
    const updatedCartItems = cartItems.map(item => 
      item.id === itemId ? { ...item, comment } : item
    );
    setCartItems(updatedCartItems);
  };

  const increaseQuantity = (itemId) => {
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (itemId) => {
    setCartItems(cartItems.map(item =>
      item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    const order = {
      table_name: 'Table 2',  // Replace this with the actual table name, or get it from user input
      line_items: cartItems.map(item => ({
        item_name: item.item_name,
        quantity: item.quantity,
        comment: item.comment || ''
      })),
    };
  
    const result = await submitOrder(order);
    setLoading(false);
    if (result.error) {
      setOrderStatus('Failed to submit order');
    } else {
      setOrderStatus('Order submitted successfully');
      clearCart();
      handleClose();
    }
    setDialogOpen(true);
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <>
      <CartButton color="primary" onClick={handleOpen}>
        <Badge badgeContent={getTotalQuantity()} color="secondary">
          <ShoppingCartIcon style={{ fontSize: '40px' }} />
        </Badge>
      </CartButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <CartPaper>
            <CloseButtonContainer>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </CloseButtonContainer>
            <ModalContent>
              {cartItems.length > 0 ? (
                <List>
                  {cartItems.map(item => (
                    <React.Fragment key={item.id}>
                      <ListItem>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item xs={12}>
                            <ListItemText
                              primary={item.item_name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}
                              primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              label="Comment"
                              variant="outlined"
                              size="small"
                              fullWidth
                              margin="dense"
                              value={item.comment || ''}
                              onChange={(e) => handleCommentChange(item.id, e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" style={{ marginRight: '10px' }}>Quantity: {item.quantity}</Typography>
                            <IconButton edge="end" aria-label="decrease" onClick={() => decreaseQuantity(item.id)}>
                              <RemoveIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="increase" onClick={() => increaseQuantity(item.id)}>
                              <AddIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="h6" style={{ textAlign: 'center', padding: '20px' }}>Add items to cart</Typography>
              )}
              {orderStatus && <Typography variant="body2" style={{ marginTop: '12px' }}>{orderStatus}</Typography>}
            </ModalContent>

            {cartItems.length > 0 && (
              <ButtonContainer>
                <Button
                  variant="contained"
                  onClick={handleSubmitOrder}
                  disabled={loading}
                  style={{ width: '100%', backgroundColor: '#D5AA55', color: '#FFFFFF' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Submit Order'}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={clearCart}
                  style={{ width: '100%' }}
                >
                  Clear Cart
                </Button>
              </ButtonContainer>
            )}
          </CartPaper>
        </Fade>
      </Modal>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
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
          <Button onClick={handleDialogClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Cart;
