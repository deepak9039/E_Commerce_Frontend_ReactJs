import { common } from '@mui/material/colors';
import axios from 'axios';
import { useEffect } from 'react';

// Category endpoints
export const createCategory = async (payload) => {
  try {
    let data = payload;
    let config = {};
    if (payload instanceof FormData) {
      data = payload;
      // DO NOT set Content-Type header here; let the browser/axios set the correct
      // multipart/form-data boundary automatically. Setting it manually causes 415.
    }
    const res = await axios.post('/api/admin/createCategory', data);
    return res.data;
  } catch (err) {
    console.error('API call error createCategory:', err);
    throw err;
  }
}

export const getCategoryById = async (payload) => {
  try {
    const res = await axios.post(`/api/getCategoryById`, payload);
    return res.data;
  } catch (err) {
    console.error('API call error getCategoryById:', err);
    throw err;
  }
}

export const updateCategory = async (payload) => {
  try {
    const res = await axios.post(`/api/admin/updateCategory`, payload);
    return res.data;
  } catch (err) {
    console.error('API call error updateCategory:', err);
    throw err;
  }
}

export const findAllCategory = async () => {
  try {
    const res = await axios.get('/api/getAllCategory')
    return res.data
  } catch (err) {
    console.error('API call error getAllCategories:', err)
    throw err
  }
}

//Cart endpoints

export const addToCart = async (payload) => {
  try {
    const res = await axios.post('/api/addToCart', payload)
    return res.data
  } catch (err) {
    console.error('API call error addToCart:', err)
    throw err
  }
}

export const getCartByUserId = async (userId) => {
  try {
    const res = await axios.post('/api/cart', { userId : userId });
    return res.data
  } catch (err) {
    console.error('API call error getCartByUserId:', err)
    throw err
  }
}

export const cartCountByUserId = async (userId) => {
  try {
    const res = await axios.post('/api/cartCount', { userId : userId });
    return res.data
  } catch (err) {
    console.error('API call error cartCountByUserId:', err)
    throw err
  }
}

export const quntityUpdatePlus = async (id, userId, productId) => {
  try {
    const res = await axios.post('/api/updateCartQuantityPlus', { id : id, userId : userId, productId: productId });
    return res.data
  } catch (err) {
    console.error('API call error quntityUpdatePlus:', err)
    throw err
  }
}

export const quntityUpdateMinus = async (id, userId, productId) => {
  try {
    const res = await axios.post('/api/updateCartQuantityMinus', { id : id, userId : userId, productId: productId });
    return res.data
  } catch (err) {
    console.error('API call error quntityUpdateMinus:', err)
    throw err
  }
}

export const removeCartItem = async (id, userId, productId) => {
  try {
    const res = await axios.post('/api/removeFromCart', { id : id, userId : userId, productId: productId });
    return res.data
  } catch (err) {
    console.error('API call error removeCartItem:', err)
    throw err
  }
}

// Product endpoints
export const createProduct = async (payload) => {
  try {
    // Accept either snake_case keys or camelCase
    const res = await axios.post('/api/admin/createProduct', payload)
    return res.data
  } catch (err) {
    console.error('API call error createProduct:', err)
    throw err
  }
}

export const getProduct = async (productId) => {
  try {
    const res = await axios.get(`/api/product/${productId}`)    
    return res.data;
  } catch (err) {
    console.error('API call error getProduct:', err);
    throw err;
  }
}

 export const updateProduct = async (payload) => {
  try {
    const res = await axios.post(`/api/admin/updateProduct`, payload)
    return res.data
  } catch (err) {
    console.error('API call error updateProduct:', err);
    throw err
  }
}

//Get all products
export const findAllProduct = async () => {
  try {
    const res = await axios.get('/api/findAllProducts')
    return res.data
  } catch (err) {
    console.error('API call error getAllProducts:', err)
    throw err
  }
}

//User Endpoints
export const registerUser = async (payload) => {
  try {
    const res = await axios.post('/api/createUser', payload)
    return res.data
  } catch (err) {
    console.error('API call error registerUser:', err)
    throw err
  }
}

//User Signin
export const loginUser = async (payload) => {
  try {
    const res = await axios.post('/api/signin', payload,{ withCredentials: true })
    return res.data
  } catch (err) {
    console.error('API call error loginUser:', err)
    throw err
  }
}

//User Logout
export const logoutUser = async () => {
  try {
    const res = await axios.post('/api/signout',{},{ withCredentials: true })
    return res.data
  } catch (err) {
    console.error('API call error logoutUser:', err)
    throw err
  }
}

// Get User by ID
export const getUserById = async (userId) => {
  try {
    const res = await axios.post('/api/getUser', { userId : userId });
    return res.data;
  } catch (err) {
    console.error('API call error getUserById:', err)
    throw err
  }
}

//Get User Addresses
export const userAddress = async (userId) => {
  try {
    const res = await axios.post('/api/userAddress', { userId : userId });
    return res.data;
  } catch (err) {
    console.error('API call error userAddress:', err)
    throw err
  }
}

//Get all users
export const getAllUsers = async () => {
  try {
    const res = await axios.get('/api/findAllUsers')
    return res.data
  } catch (err) {
    console.error('API call error findAllUsers:', err)
    throw err
  }
}

// Get User Addresses
export const getUserAddresses = async (userId) => {
  try {
    const res = await axios.post('/api/userAddress', { userId : userId });
    return res.data;
  } catch (err) {
    console.error('API call error getUserAddresses:', err)
    throw err
  }
}

export const addUserAddress = async (payload) => {
  try {
    const res = await axios.post('/api/createUserAddress', payload);
    return res.data;
  } catch (err) {
    console.error('API call error addUserAddress:', err)
    throw err
  }
}

//Get product by ID
export const getProductById = async (productId) => {
  try {
    const res = await axios.get(`/api/product/${productId}`);
    return res.data;
  } catch (err) {
    console.error('API call error getProductById:', err);
    throw err;
  }
}

export const getProductsByCategory = async (categoryName) => {
  try {
    const res = await axios.post('/api/findProductsByCategoryName', { categoryName : categoryName });
    return res.data;
  } catch (err) {
    console.error('API call error getProductsByCategory:', err);
    throw err;
  }
}

// Order Endpoints
export const saveOrder = async (payload) => {
  try {
    const res = await axios.post('/api/saveOrder', payload);
    return res.data;
  } catch (err) {
    console.error('API call error saveOrder:', err);
    throw err;
  }
}

export const findOrdersByUserId = async (userId) => {
  try {
    const res = await axios.post('/api/getOrdersByUserId', { userId : userId });
    return res.data;
  } catch (err) {
    console.error('API call error findOrdersByUserId:', err)
    throw err
  }
}

// Admin Order Endpoints
export const getAllOrders = async () => {
  try {
    const res = await axios.post('/api/admin/getAllOrders');
    return res.data;
  } catch (err) {
    console.error('API call error getAllOrders:', err)
    throw err
  }
}


export const updateOrderStatus = async (payload) => {
  try {
    const res = await axios.post('/api/admin/updateOrderStatus', payload);
    return res.data;
  } catch (err) {
    console.error('API call error updateOrderStatus:', err)
    throw err
  }
}

const apiService = () => {
    useEffect(() => {
    findAllCategory();
    findAllProduct();
    }, []);
}

export default apiService;
