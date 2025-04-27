import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  IconButton,
  Divider,
  TextField,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartEmpty, setIsCartEmpty] = useState<boolean>(true);

  useEffect(() => {
    // Load cart items from localStorage
    const loadCartItems = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        setIsCartEmpty(parsedCart.length === 0);
      }
    };

    loadCartItems();
  }, []);

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Format price to display with 2 decimal places
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    setIsCartEmpty(updatedCart.length === 0);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setIsCartEmpty(true);
    localStorage.removeItem('cart');
  };

  const handleCheckout = () => {
    // Here you would typically redirect to a checkout page
    // For now, we'll just show an alert
    alert('Checkout functionality will be implemented in the future.');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
          Home
        </Link>
        <Typography color="text.primary">Shopping Cart</Typography>
      </Breadcrumbs>

      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/home')}
        sx={{ mb: 4 }}
      >
        Continue Shopping
      </Button>

      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <ShoppingCartIcon sx={{ mr: 1 }} /> Shopping Cart
      </Typography>

      {isCartEmpty ? (
        <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
          <Alert severity="info">
            Your cart is empty. Start shopping to add items to your cart.
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/home')}
            sx={{ mt: 2 }}
          >
            Browse Products
          </Button>
        </Paper>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
            <Grid container spacing={2} sx={{ mb: 2, fontWeight: 'bold' }}>
              <Grid item xs={6} md={6}>
                <Typography variant="subtitle1">Product</Typography>
              </Grid>
              <Grid item xs={2} md={2} sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1">Price</Typography>
              </Grid>
              <Grid item xs={2} md={2} sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1">Quantity</Typography>
              </Grid>
              <Grid item xs={2} md={2} sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle1">Subtotal</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 2 }} />

            {cartItems.map((item) => (
              <Box key={item.id} sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      component="img"
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'contain',
                        mr: 2,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1
                      }}
                      src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'}
                      alt={item.name}
                    />
                    <Typography variant="body1">{item.name}</Typography>
                  </Grid>
                  <Grid item xs={2} md={2} sx={{ textAlign: 'center' }}>
                    <Typography variant="body1">{formatPrice(item.price)}</Typography>
                  </Grid>
                  <Grid item xs={2} md={2} sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value > 0) {
                            handleQuantityChange(item.id, value);
                          }
                        }}
                        inputProps={{ 
                          min: 1, 
                          style: { textAlign: 'center' } 
                        }}
                        sx={{ width: 60, mx: 1 }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={2} md={2} sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Typography variant="body1" sx={{ mr: 1 }}>
                        {formatPrice(item.price * item.quantity)}
                      </Typography>
                      <IconButton 
                        color="error" 
                        size="small" 
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
              <Box>
                <Typography variant="h6" align="right" gutterBottom>
                  Total: {formatPrice(totalPrice)}
                </Typography>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleCheckout}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  }}
                >
                  Proceed to Checkout
                </Button>
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default CartPage; 