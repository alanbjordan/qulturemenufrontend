import React, { useState } from 'react';
import { submitOrder } from '../services/api';
import {
  IconButton, Badge, Modal, Backdrop, Fade, Paper, Typography, Button, List, ListItem,
  ListItemText, TextField, Grid, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle
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
  borderRadius: '8px',
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  overflowY: 'auto',
}));

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
          <ShoppingCartIcon style={{ fontSize: '40px'}}/>
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
            <Button style={{margin: '12px'}} variant="outlined" color="inherit" onClick={handleSubmitOrder} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Submit Order'}
            </Button>
            <Button variant="outlined" color="inherit" onClick={clearCart}>Clear Cart</Button>
            {orderStatus && <Typography variant="body2">{orderStatus}</Typography>}
            <Typography variant="h6" id="transition-modal-title">Cart Items</Typography>
            <List>
              {cartItems.map(item => (
                <ListItem key={item.id}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <ListItemText primary={`${item.item_name}`} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">Quantity: {item.quantity}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
              ))}
            </List>
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
