import axios from 'axios';
import { Product } from '../types/Product';

// Adjust this URL to match your backend URL
// If your backend is running on a different port or host, update this value
const API_BASE_URL = 'http://localhost:8080/api';

// Configure axios defaults
axios.defaults.withCredentials = false; // Set to true if your API requires cookies/session
axios.defaults.headers.common['Accept'] = 'application/json';

// Add a request interceptor to handle CORS and other common issues
axios.interceptors.request.use(
  config => {
    // Don't set Content-Type for FormData requests (multipart/form-data)
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Log detailed error information for debugging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error Message:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export const api = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      console.log('Products fetched successfully:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
  },

  // Get product by ID
  getProductById: async (id: number): Promise<Product | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/product/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      return null;
    }
  },

  // Get product image by product ID
  getProductImage: async (productId: number): Promise<string> => {
    try {
      console.log(`Fetching image from API for product ID: ${productId}`);
      const response = await axios.get(`${API_BASE_URL}/product/${productId}/image`, {
        responseType: 'arraybuffer'
      });
      
      // Get the content type from the response headers or use a default
      const contentType = response.headers['content-type'] || 'image/jpeg';
      console.log(`Image content type for product ID ${productId}:`, contentType);
      
      // Convert the binary data to base64 using browser APIs
      const arrayBuffer = response.data;
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = window.btoa(binary);
      
      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      console.error(`Error fetching image for product ID ${productId}:`, error);
      return '';
    }
  },

  // Search products
  searchProducts: async (keyword: string): Promise<Product[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/search?keyword=${keyword}`);
      console.log(`Search results for "${keyword}":`, response.data.length);
      return response.data;
    } catch (error) {
      console.error(`Error searching products with keyword "${keyword}":`, error);
      return [];
    }
  },

  // Add a new product
  addProduct: async (formData: FormData): Promise<Product> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Product added successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update an existing product
  updateProduct: async (id: number, formData: FormData): Promise<Product> => {
    try {
      // Log the request for debugging
      console.log(`Sending update request for product ID ${id}`);
      
      const response = await axios.put(`${API_BASE_URL}/product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log(`Product with ID ${id} updated successfully:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating product with ID ${id}:`, error);
      
      // Log more detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      
      throw error;
    }
  },

  // Delete a product
  deleteProduct: async (id: number): Promise<void> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/product/${id}`);
      console.log(`Product with ID ${id} deleted successfully:`, response.data);
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  }
}; 