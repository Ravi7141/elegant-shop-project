import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  Chip,
  CardActions,
  Skeleton,
  Rating,
  alpha
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Product } from '../types/Product';
import { api } from '../services/api';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // First check if the product already has imageData
        if (product.imageData) {
          console.log(`Using embedded image data for product ID: ${product.id}`);
          setImageUrl(`data:${product.imageType || 'image/jpeg'};base64,${product.imageData}`);
          setIsLoading(false);
          return;
        }
        
        // If no embedded image data, fetch it from the API
        if (product.id) {
          setIsLoading(true);
          console.log(`Fetching image for product ID: ${product.id}`);
          const imageData = await api.getProductImage(product.id);
          console.log(`Image data received for product ID: ${product.id}`, imageData ? 'Image data received' : 'No image data');
          setImageUrl(imageData);
        }
      } catch (error) {
        console.error(`Error fetching product image for ID: ${product.id}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [product.id, product.imageData, product.imageType]);

  // Format price to display with 2 decimal places
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to product details when clicking the button
    
    // Get current cart from localStorage or initialize empty array
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product is already in cart
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      currentCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: imageUrl
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show success message
    alert('Product added to cart!');
  };

  // Generate a random rating between 3.5 and 5
  const rating = Math.floor(Math.random() * 15 + 35) / 10;
  
  // Generate a random number of reviews between 5 and 120
  const reviewCount = Math.floor(Math.random() * 115 + 5);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 6px 16px rgba(0,0,0,0.05)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
          '& .MuiCardMedia-root': {
            transform: 'scale(1.05)',
          },
        }
      }}
      elevation={0}
      onClick={handleViewDetails}
    >
      {/* Favorite button */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          size="small"
          sx={{
            minWidth: 'auto',
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#5D4A66',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              color: '#F2B880',
            },
          }}
        >
          <FavoriteBorderIcon fontSize="small" />
        </Button>
      </Box>

      {/* Product availability badge */}
      {product.productAvailable ? (
        product.stockQuantity <= 5 && (
          <Chip
            label="Low Stock"
            size="small"
            color="warning"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 1,
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        )
      ) : (
        <Chip
          label="Out of Stock"
          size="small"
          color="error"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 1,
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        />
      )}

      {/* Product image */}
      {isLoading ? (
        <Skeleton 
          variant="rectangular" 
          height={220} 
          animation="wave"
          sx={{ backgroundColor: alpha('#5D4A66', 0.05) }}
        />
      ) : (
        <CardMedia
          component="img"
          height={220}
          image={imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.name}
          sx={{ 
            objectFit: 'contain', 
            padding: 2, 
            backgroundColor: alpha('#F9F7FA', 0.8),
            transition: 'transform 0.5s ease',
          }}
          onError={(e) => {
            console.error(`Error loading image for product: ${product.name}`);
            // @ts-ignore
            e.target.src = 'https://via.placeholder.com/300x200?text=Error+Loading+Image';
          }}
        />
      )}

      {/* Product content */}
      <CardContent sx={{ flexGrow: 1, p: 2.5, pt: 2 }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 0.5, 
            textTransform: 'uppercase', 
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          {product.brand}
        </Typography>
        
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            fontWeight: 600, 
            fontSize: '1rem',
            mb: 0.5,
            height: '2.5rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={rating} 
            precision={0.5} 
            size="small" 
            readOnly 
            sx={{ color: '#F2B880' }}
          />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ ml: 0.5, fontSize: '0.75rem' }}
          >
            ({reviewCount})
          </Typography>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 1.5, 
            height: '2.5rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.description}
        </Typography>
        
        <Typography 
          variant="h6" 
          color="primary" 
          sx={{ 
            fontWeight: 700,
            fontSize: '1.25rem',
          }}
        >
          {formattedPrice}
        </Typography>
      </CardContent>

      {/* Add to cart button */}
      <CardActions sx={{ p: 2.5, pt: 0 }}>
        <Button 
          variant="contained" 
          fullWidth
          startIcon={<ShoppingCartIcon />}
          disabled={!product.productAvailable}
          onClick={handleAddToCart}
          sx={{
            py: 1,
            background: product.productAvailable 
              ? 'linear-gradient(45deg, #5D4A66 30%, #7E6B88 90%)' 
              : undefined,
            color: 'white',
            boxShadow: product.productAvailable 
              ? '0 4px 12px rgba(93, 74, 102, 0.3)' 
              : 'none',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(93, 74, 102, 0.4)',
            }
          }}
        >
          {product.productAvailable ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard; 