import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Badge, 
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import AdminProductsPage from './pages/AdminProductsPage';
import './App.css';

// Create a custom theme with a more attractive color scheme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5D4A66', // Rich purple
      light: '#7E6B88',
      dark: '#3F3244',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F2B880', // Warm peach
      light: '#FFD9A8',
      dark: '#D19860',
      contrastText: '#000000',
    },
    background: {
      default: '#F9F7FA', // Light lavender background
      paper: '#FFFFFF',
    },
    error: {
      main: '#E57373',
    },
    warning: {
      main: '#FFB74D',
    },
    info: {
      main: '#64B5F6',
    },
    success: {
      main: '#81C784',
    },
    text: {
      primary: '#2A2438', // Dark purple for text
      secondary: '#5D4A66', // Medium purple for secondary text
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      letterSpacing: '0.0075em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(135deg, #5D4A66 0%, #7E6B88 100%)',
          },
          '&.MuiButton-containedSecondary': {
            background: 'linear-gradient(135deg, #F2B880 0%, #FFD9A8 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          background: 'linear-gradient(135deg, #5D4A66 0%, #7E6B88 100%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
        elevation3: {
          boxShadow: '0 6px 16px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a8a8a8',
          },
        },
      },
    },
  },
});

// Wrapper component to access location
const AppContent = () => {
  const location = useLocation();
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    // Update cart item count whenever localStorage changes
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartItemCount(count);
    };

    // Initial count
    updateCartCount();

    // Listen for storage events (when localStorage changes)
    window.addEventListener('storage', updateCartCount);

    // Custom event for cart updates within the same window
    const handleCartUpdate = () => {
      updateCartCount();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Check for cart updates every second (as a fallback)
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  // Only show navigation on non-landing pages
  const NavigationBar = () => {
    if (location.pathname === '/') return null;

    return (
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              letterSpacing: '0.5px',
            }}
          >
            Elegant Shop
          </Typography>
          <Button 
            color="inherit" 
            component={Link} 
            to="/home"
            sx={{ 
              mx: 1,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.1),
              }
            }}
          >
            Home
          </Button>
          <IconButton 
            color="inherit" 
            component={Link} 
            to="/cart"
            sx={{
              ml: 1,
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.1),
              }
            }}
          >
            <Badge 
              badgeContent={cartItemCount} 
              color="secondary"
              sx={{
                '& .MuiBadge-badge': {
                  fontWeight: 'bold',
                }
              }}
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  };

  const SideDrawer = () => (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => toggleDrawer(false)}
    >
      <Box
        sx={{ 
          width: 280,
          background: 'linear-gradient(180deg, #F9F7FA 0%, #FFFFFF 100%)',
          height: '100%',
        }}
        role="presentation"
        onClick={() => toggleDrawer(false)}
      >
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          mb: 2,
        }}>
          <Typography 
            variant="h5" 
            component="div" 
            color="primary"
            sx={{ 
              fontWeight: 700,
              letterSpacing: '0.5px',
              mb: 1,
            }}
          >
            Elegant Shop
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Premium Shopping Experience
          </Typography>
        </Box>
        <List sx={{ px: 2 }}>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              component={Link} 
              to="/home"
              sx={{ 
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                }
              }}
            >
              <ListItemIcon>
                <HomeIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Home" 
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              component={Link} 
              to="/cart"
              sx={{ 
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                }
              }}
            >
              <ListItemIcon>
                <ShoppingCartIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Shopping Cart" 
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider sx={{ my: 2, mx: 2 }} />
        <Typography 
          variant="subtitle2" 
          color="text.secondary" 
          sx={{ px: 4, mb: 1, fontWeight: 600 }}
        >
          Admin Area
        </Typography>
        <List sx={{ px: 2 }}>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              component={Link} 
              to="/admin/products"
              sx={{ 
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                }
              }}
            >
              <ListItemIcon>
                <DashboardIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Admin Dashboard" 
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              component={Link} 
              to="/admin/products"
              sx={{ 
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                }
              }}
            >
              <ListItemIcon>
                <CategoryIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Manage Products" 
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <NavigationBar />
      <SideDrawer />
      <Box sx={{ 
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #F9F7FA 0%, #F5F3F7 100%)',
      }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
        </Routes>
      </Box>
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
