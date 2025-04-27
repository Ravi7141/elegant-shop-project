import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Chip,
  Divider,
  TextField,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { api } from '../services/api';
import { Product } from '../types/Product';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await api.getProductById(parseInt(id));
        
        if (!productData) {
          setError('Product not found');
          return;
        }
        
        setProduct(productData);
        
        // If the product has imageData, use it directly
        if (productData.imageData && typeof productData.imageData === 'string') {
          setImageUrl(`data:${productData.imageType || 'image/jpeg'};base64,${productData.imageData}`);
        } else {
          // Otherwise fetch the image
          try {
            const imageData = await api.getProductImage(productData.id);
            setImageUrl(imageData);
          } catch (imageError) {
            console.error('Error fetching product image:', imageError);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (product && value > product.stockQuantity) {
      setQuantity(product.stockQuantity);
    } else {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Get current cart from localStorage or initialize empty array
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product is already in cart
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: imageUrl
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    // Show success message or redirect to cart
    alert('Product added to cart!');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Format price to display with 2 decimal places
  const formattedPrice = product ? new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price) : '';

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleGoBack}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
          Home
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>
      
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleGoBack}
        sx={{ mb: 4 }}
      >
        Back to Products
      </Button>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 400,
                objectFit: 'contain',
                borderRadius: 2,
                backgroundColor: '#f5f5f5',
                p: 2
              }}
              src={imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'}
              alt={product.name}
            />
          </Grid>
          
          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Typography variant="h5" color="primary" gutterBottom>
              {formattedPrice}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip 
                label={product.productAvailable ? 'In Stock' : 'Out of Stock'} 
                color={product.productAvailable ? 'success' : 'error'} 
              />
              <Chip label={`Brand: ${product.brand}`} variant="outlined" />
              <Chip label={`Category: ${product.category}`} variant="outlined" />
            </Box>
            
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Stock: {product.stockQuantity} units
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Release Date: {new Date(product.releaseDate).toLocaleDateString()}
              </Typography>
            </Box>
            
            {product.productAvailable ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4 }}>
                <TextField
                  label="Quantity"
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: product.stockQuantity } }}
                  value={quantity}
                  onChange={handleQuantityChange}
                  sx={{ width: 100 }}
                />
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleAddToCart}
                  disabled={!product.productAvailable || product.stockQuantity < 1}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  }}
                >
                  Add to Cart
                </Button>
              </Box>
            ) : (
              <Alert severity="warning" sx={{ mt: 2 }}>
                This product is currently out of stock.
              </Alert>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetailsPage; 