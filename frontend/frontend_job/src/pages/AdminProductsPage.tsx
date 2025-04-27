import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../services/api';
import { Product } from '../types/Product';

const AdminProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    brand: '',
    price: 0,
    category: '',
    releaseDate: new Date().toISOString().split('T')[0],
    productAvailable: true,
    stockQuantity: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedProduct(null);
  };

  const handleOpenEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setNewProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      brand: product.brand,
      price: product.price,
      category: product.category,
      releaseDate: new Date(product.releaseDate).toISOString().split('T')[0],
      productAvailable: product.productAvailable,
      stockQuantity: product.stockQuantity
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedProduct(null);
    setImageFile(null);
  };

  const handleOpenAddDialog = () => {
    setNewProduct({
      name: '',
      description: '',
      brand: '',
      price: 0,
      category: '',
      releaseDate: new Date().toISOString().split('T')[0],
      productAvailable: true,
      stockQuantity: 0
    });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setImageFile(null);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await api.deleteProduct(selectedProduct.id);
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setSnackbar({
        open: true,
        message: `Product "${selectedProduct.name}" has been deleted.`,
        severity: 'success'
      });
    } catch (err) {
      console.error('Error deleting product:', err);
      setSnackbar({
        open: true,
        message: 'Failed to delete product. Please try again.',
        severity: 'error'
      });
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddProduct = async () => {
    try {
      if (!imageFile) {
        setSnackbar({
          open: true,
          message: 'Please select an image for the product.',
          severity: 'error'
        });
        return;
      }

      const formData = new FormData();
      formData.append('product', new Blob([JSON.stringify(newProduct)], { type: 'application/json' }));
      formData.append('imageFile', imageFile);

      const addedProduct = await api.addProduct(formData);
      setProducts([...products, addedProduct]);
      setSnackbar({
        open: true,
        message: `Product "${addedProduct.name}" has been added.`,
        severity: 'success'
      });
      handleCloseAddDialog();
    } catch (err) {
      console.error('Error adding product:', err);
      setSnackbar({
        open: true,
        message: 'Failed to add product. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct || !newProduct.id) return;

    try {
      const formData = new FormData();
      
      // Create a clean product object without undefined values
      const productToUpdate = {
        id: newProduct.id,
        name: newProduct.name || '',
        description: newProduct.description || '',
        brand: newProduct.brand || '',
        price: newProduct.price || 0,
        category: newProduct.category || '',
        releaseDate: newProduct.releaseDate || new Date().toISOString().split('T')[0],
        productAvailable: newProduct.productAvailable !== undefined ? newProduct.productAvailable : true,
        stockQuantity: newProduct.stockQuantity || 0,
        // Preserve existing image data if no new image is uploaded
        imageName: selectedProduct.imageName,
        imageType: selectedProduct.imageType
      };
      
      // Append the product data as JSON
      formData.append('product', new Blob([JSON.stringify(productToUpdate)], { type: 'application/json' }));
      
      // Only append image if a new one is selected
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      // Log the data being sent for debugging
      console.log('Updating product with data:', productToUpdate);
      
      const response = await api.updateProduct(newProduct.id, formData);
      
      // Refresh the products list
      await fetchProducts();
      
      setSnackbar({
        open: true,
        message: `Product "${newProduct.name}" has been updated.`,
        severity: 'success'
      });
      handleCloseEditDialog();
    } catch (err) {
      console.error('Error updating product:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update product. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Format price to display with 2 decimal places
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
          Home
        </Link>
        <Typography color="text.primary">Admin - Products</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Product Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
          }}
        >
          Add New Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>
                      <Box
                        component="img"
                        sx={{
                          width: 50,
                          height: 50,
                          objectFit: 'contain',
                          backgroundColor: '#f5f5f5',
                          borderRadius: 1
                        }}
                        src={`http://localhost:8080/api/product/${product.id}/image`}
                        alt={product.name}
                        onError={(e: any) => {
                          e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                        }}
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.stockQuantity}</TableCell>
                    <TableCell>
                      <Chip
                        label={product.productAvailable ? 'In Stock' : 'Out of Stock'}
                        color={product.productAvailable ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEditDialog(product)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(product)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product "{selectedProduct?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteProduct} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Product Name"
                fullWidth
                value={newProduct.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="brand"
                label="Brand"
                fullWidth
                value={newProduct.brand}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Price"
                type="number"
                fullWidth
                value={newProduct.price}
                onChange={handleInputChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="category"
                label="Category"
                fullWidth
                value={newProduct.category}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="stockQuantity"
                label="Stock Quantity"
                type="number"
                fullWidth
                value={newProduct.stockQuantity}
                onChange={handleInputChange}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="releaseDate"
                label="Release Date"
                type="date"
                fullWidth
                value={newProduct.releaseDate}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={4}
                fullWidth
                value={newProduct.description}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="productAvailable"
                    checked={newProduct.productAvailable}
                    onChange={handleInputChange}
                  />
                }
                label="Product Available"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Product Image
              </Typography>
              <input
                accept="image/*"
                type="file"
                onChange={handleImageChange}
                style={{ marginBottom: 16 }}
              />
              {selectedProduct && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current Image:
                  </Typography>
                  <Box
                    component="img"
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'contain',
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1
                    }}
                    src={`http://localhost:8080/api/product/${selectedProduct.id}/image`}
                    alt={selectedProduct.name}
                    onError={(e: any) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdateProduct} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Product Name"
                fullWidth
                value={newProduct.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="brand"
                label="Brand"
                fullWidth
                value={newProduct.brand}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Price"
                type="number"
                fullWidth
                value={newProduct.price}
                onChange={handleInputChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="category"
                label="Category"
                fullWidth
                value={newProduct.category}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="stockQuantity"
                label="Stock Quantity"
                type="number"
                fullWidth
                value={newProduct.stockQuantity}
                onChange={handleInputChange}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="releaseDate"
                label="Release Date"
                type="date"
                fullWidth
                value={newProduct.releaseDate}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={4}
                fullWidth
                value={newProduct.description}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="productAvailable"
                    checked={newProduct.productAvailable}
                    onChange={handleInputChange}
                  />
                }
                label="Product Available"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Product Image (Required)
              </Typography>
              <input
                accept="image/*"
                type="file"
                onChange={handleImageChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddProduct} color="primary">Add Product</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminProductsPage; 