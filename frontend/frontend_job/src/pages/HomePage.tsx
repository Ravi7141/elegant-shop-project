import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  CircularProgress, 
  Box,
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  Paper,
  Alert,
  Snackbar,
  Chip,
  Divider,
  alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { api } from '../services/api';
import { Product } from '../types/Product';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Process products to handle image data if it's included in the response
  const processProducts = (products: Product[]): Product[] => {
    return products.map(product => {
      // If the product has imageData as a byte array, convert it to base64
      if (product.imageData && typeof product.imageData !== 'string') {
        try {
          // Handle if imageData is a byte array
          if (Array.isArray(product.imageData)) {
            const byteArray = new Uint8Array(product.imageData);
            let binary = '';
            byteArray.forEach(byte => {
              binary += String.fromCharCode(byte);
            });
            product.imageData = window.btoa(binary);
          }
        } catch (error) {
          console.error(`Error processing image data for product ${product.id}:`, error);
        }
      }
      return product;
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getAllProducts();
        console.log('Raw products data:', data);
        
        // Process the products to handle image data
        const processedProducts = processProducts(data);
        setProducts(processedProducts);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(processedProducts.map(product => product.category))
        ).filter(Boolean) as string[];
        
        setCategories(uniqueCategories);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // If search term is empty, fetch all products
      try {
        setLoading(true);
        const data = await api.getAllProducts();
        const processedProducts = processProducts(data);
        setProducts(processedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setShowError(true);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      const data = await api.searchProducts(searchTerm);
      const processedProducts = processProducts(data);
      setProducts(processedProducts);
      setError(null);
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Failed to search products. Please try again later.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <Box sx={{ flexGrow: 1, pb: 8 }}>
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #5D4A66 0%, #7E6B88 100%)',
          py: 6,
          mb: 4,
          color: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 2,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            Discover Our Products
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              fontWeight: 400,
              opacity: 0.9,
              maxWidth: 600,
            }}
          >
            Browse our collection of premium products and find exactly what you're looking for.
          </Typography>
          
          <Paper
            component="form"
            sx={{ 
              p: '2px 4px', 
              display: 'flex', 
              alignItems: 'center', 
              width: { xs: '100%', sm: 500 },
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <InputBase
              sx={{ ml: 2, flex: 1 }}
              placeholder="Search Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Container>
      </Box>

      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Container maxWidth="lg">
        {/* Categories */}
        {categories.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                Categories
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                label="All Products" 
                color={selectedCategory === null ? 'primary' : 'default'}
                onClick={() => handleCategorySelect(null)}
                sx={{ 
                  fontWeight: 500,
                  px: 1,
                  '&.MuiChip-colorPrimary': {
                    background: 'linear-gradient(135deg, #5D4A66 0%, #7E6B88 100%)',
                  }
                }}
              />
              {categories.map(category => (
                <Chip 
                  key={category} 
                  label={category} 
                  color={selectedCategory === category ? 'primary' : 'default'}
                  onClick={() => handleCategorySelect(category)}
                  sx={{ 
                    fontWeight: 500,
                    px: 1,
                    '&.MuiChip-colorPrimary': {
                      background: 'linear-gradient(135deg, #5D4A66 0%, #7E6B88 100%)',
                    }
                  }}
                />
              ))}
            </Box>
            <Divider sx={{ mt: 3, mb: 4 }} />
          </Box>
        )}

        {/* Products section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 700,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-8px',
                  left: '0',
                  width: '40px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #5D4A66 0%, #7E6B88 100%)',
                  borderRadius: '2px',
                }
              }}
            >
              {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SortIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Sort by: Newest
              </Typography>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 8 }}>
              <CircularProgress sx={{ color: 'primary.main' }} />
            </Box>
          ) : error && filteredProducts.length === 0 ? (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Typography color="error" align="center">
                {error}
              </Typography>
            </Box>
          ) : filteredProducts.length === 0 ? (
            <Paper 
              elevation={0} 
              sx={{ 
                mt: 4, 
                p: 4, 
                textAlign: 'center',
                borderRadius: 3,
                backgroundColor: alpha('#F9F7FA', 0.6),
                border: '1px dashed #5D4A66',
              }}
            >
              <Typography align="center" variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try a different search term or category
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {filteredProducts.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage; 