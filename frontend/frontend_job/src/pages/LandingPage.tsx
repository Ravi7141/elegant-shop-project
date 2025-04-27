import React from 'react';
import { Box, Button, Container, Typography, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/home');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F9F7FA 0%, #E8E4ED 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(93, 74, 102, 0.1) 0%, rgba(93, 74, 102, 0.05) 100%)',
          top: '-50px',
          right: '-50px',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(242, 184, 128, 0.1) 0%, rgba(242, 184, 128, 0.05) 100%)',
          bottom: '50px',
          left: '100px',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(93, 74, 102, 0.08) 0%, rgba(93, 74, 102, 0.04) 100%)',
          top: '100px',
          left: '50px',
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4 }}>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  color: '#2A2438',
                  marginBottom: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: '0',
                    width: '80px',
                    height: '4px',
                    background: 'linear-gradient(90deg, #5D4A66 0%, #7E6B88 100%)',
                    borderRadius: '2px',
                  }
                }}
              >
                Welcome to Elegant Shop
              </Typography>
              
              <Typography
                variant="h5"
                color="textSecondary"
                paragraph
                sx={{ 
                  marginBottom: 4, 
                  maxWidth: '600px',
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Discover a curated collection of premium products at great prices. 
                Start your shopping journey with us today and experience excellence.
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleStart}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  padding: '12px 32px',
                  fontSize: '1.1rem',
                  borderRadius: 8,
                  boxShadow: '0 8px 20px rgba(93, 74, 102, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 25px rgba(93, 74, 102, 0.4)',
                  }
                }}
              >
                Start Shopping
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                padding: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '5px',
                  background: 'linear-gradient(90deg, #5D4A66 0%, #F2B880 100%)',
                }
              }}
            >
              <Box
                sx={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #5D4A66 0%, #7E6B88 100%)',
                  marginBottom: 4,
                  boxShadow: '0 10px 20px rgba(93, 74, 102, 0.2)',
                }}
              >
                <ShoppingBagIcon sx={{ fontSize: 60, color: 'white' }} />
              </Box>
              
              <Typography
                variant="h4"
                component="h2"
                align="center"
                gutterBottom
                sx={{ fontWeight: 700, color: '#2A2438', mb: 2 }}
              >
                Premium Shopping Experience
              </Typography>
              
              <Typography
                variant="body1"
                align="center"
                color="textSecondary"
                paragraph
                sx={{ mb: 3, maxWidth: '400px' }}
              >
                • Curated selection of quality products<br />
                • Fast and secure checkout<br />
                • Excellent customer service<br />
                • Easy returns and exchanges
              </Typography>
              
              <Button
                variant="outlined"
                color="primary"
                onClick={handleStart}
                sx={{
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px',
                  }
                }}
              >
                Learn More
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage; 