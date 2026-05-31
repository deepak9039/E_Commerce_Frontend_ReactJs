import { common } from '@mui/material/colors';
import axios from 'axios';
import { useEffect } from 'react';

// Read base URL from Vite env variable. Set VITE_API_BASE_URL in .env, .env.development, .env.production
const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : '';
if (BASE_URL) {
  axios.defaults.baseURL = BASE_URL;
}
// Ensure cookies are sent for cross-site requests (session-based auth)
axios.defaults.withCredentials = true;

// Attach Authorization header from localStorage token when present
axios.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        // Preserve any existing Authorization header
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      // ignore localStorage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
    const res = await axios.post('/admin/createCategory', data);
    return res.data;
  } catch (err) {
    console.error('API call error createCategory:', err);
    throw err;
  }
}

export const getCategoryById = async (payload) => {
  try {
    const res = await axios.post(`/getCategoryById`, payload);
    return res.data;
  } catch (err) {
    console.error('API call error getCategoryById:', err);
    throw err;
  }
}

export const updateCategory = async (payload) => {
  try {
    const res = await axios.post(`/admin/updateCategory`, payload);
    return res.data;
  } catch (err) {
    console.error('API call error updateCategory:', err);
    throw err;
  }
}

export const findAllCategory = async () => {
  try {
    const res = await axios.get('/getAllCategory')
    return res.data
  } catch (err) {
    console.error('API call error getAllCategories:', err)
    throw err
  }
}

//Cart endpoints

export const addToCart = async (payload) => {
  try {
    const res = await axios.post('/addToCart', payload)
    return res.data
  } catch (err) {
    console.error('API call error addToCart:', err)
    throw err
  }
}

export const getCartByUserId = async (userId) => {
  try {
    const res = await axios.post('/cart', { userId : userId });
    return res.data
  } catch (err) {
    console.error('API call error getCartByUserId:', err)
    throw err
  }
}

export const cartCountByUserId = async (userId) => {
  try {
    const res = await axios.post('/cartCount', { userId : userId });
    return res.data
  } catch (err) {
    console.error('API call error cartCountByUserId:', err)
    throw err
  }
}

export const quntityUpdatePlus = async (id, userId, productId) => {
  try {
    const res = await axios.post('/updateCartQuantityPlus', { id : id, userId : userId, productId: productId });
    return res.data
  } catch (err) {
    console.error('API call error quntityUpdatePlus:', err)
    throw err
  }
}

export const quntityUpdateMinus = async (id, userId, productId) => {
  try {
    const res = await axios.post('/updateCartQuantityMinus', { id : id, userId : userId, productId: productId });
    return res.data
  } catch (err) {
    console.error('API call error quntityUpdateMinus:', err)
    throw err
  }
}

export const removeCartItem = async (id, userId, productId) => {
  try {
    const res = await axios.post('/removeFromCart', { id : id, userId : userId, productId: productId });
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
    const res = await axios.post('/admin/createProduct', payload)
    return res.data
  } catch (err) {
    console.error('API call error createProduct:', err)
    throw err
  }
}

export const getProduct = async (productId) => {
  try {
    const res = await axios.get(`/product/${productId}`)    
    return res.data;
  } catch (err) {
    console.error('API call error getProduct:', err);
    throw err;
  }
}

 export const updateProduct = async (payload) => {
  try {
    const res = await axios.post(`/admin/updateProduct`, payload)
    return res.data
  } catch (err) {
    console.error('API call error updateProduct:', err);
    throw err
  }
}

//Get all products
export const findAllProduct = async (payload) => {
  try {
    const res = await axios.post('/findAllProducts', payload)
    console.log("findAllProduct response:", res.data);
    return res.data
  } catch (err) {
    console.error('API call error getAllProducts:', err)
    throw err
  }
}

//Get all products
export const findAllProductAdmin = async (payload) => {
  try {
    const res = await axios.post('/admin/findAllProducts', payload)
    console.log("findAllProduct response:", res.data);
    return res.data
  } catch (err) {
    console.error('API call error getAllProducts:', err)
    throw err
  }
}

// Get products with out pagination
export const findAllSponsoredProducts = async () => {
  try {
    const res = await axios.post('/findAllSponsoredProducts');
    return res.data;
  } catch (err) {
    console.error('API call error findAllSponsoredProducts:', err);
    throw err;
  }
}

//User Endpoints
export const registerUser = async (payload) => {
  try {
    const res = await axios.post('/createUser', payload)
    return res.data
  } catch (err) {
    console.error('API call error registerUser:', err)
    throw err
  }
}

//User Signin
export const loginUser = async (payload) => {
  try {
    const res = await axios.post('/signin', payload,{ withCredentials: true })
    return res.data
  } catch (err) {
    console.error('API call error loginUser:', err)
    throw err
  }
}

//User Logout
export const logoutUser = async () => {
  try {
    const res = await axios.post('/signout',{},{ withCredentials: true })
    return res.data
  } catch (err) {
    console.error('API call error logoutUser:', err)
    throw err
  }
}

// Get User by ID
export const getUserById = async (userId) => {
  try {
    const res = await axios.post('/getUser', { userId : userId });
    return res.data;
  } catch (err) {
    console.error('API call error getUserById:', err)
    throw err
  }
}

// Update User Profile
export const updateUserProfile = async (payload) => {
  try {
    const res = await axios.post('/updateUser', payload);
    return res.data;
  } catch (err) {
    console.error('API call error updateUserProfile:', err)
    throw err
  }
}

// Update User Address
export const updateUserAddress = async (payload) => {
  try {
    const res = await axios.post('/updateUserAddress', payload);
    return res.data;
  } catch (err) {
    console.error('API call error updateUserAddress:', err)
    throw err
  } 
}

//Get User Addresses
export const userAddress = async (userId) => {
  try {
    const res = await axios.post('/userAddress', { userId : userId });
    return res.data;
  } catch (err) {
    console.error('API call error userAddress:', err)
    throw err
  }
}

//Get all users
export const getAllUsers = async () => {
  try {
    const res = await axios.get('/findAllUsers')
    return res.data
  } catch (err) {
    console.error('API call error findAllUsers:', err)
    throw err
  }
}

// Get User Addresses
export const getUserAddresses = async (userId) => {
  try {
    const res = await axios.post('/userAddress', { userId : userId });
    return res.data;
  } catch (err) {
    console.error('API call error getUserAddresses:', err)
    throw err
  }
}

export const addUserAddress = async (payload) => {
  try {
    const res = await axios.post('/createUserAddress', payload);
    return res.data;
  } catch (err) {
    console.error('API call error addUserAddress:', err)
    throw err
  }
}

//Get product by ID
export const getProductById = async (productId) => {
  try {
    const res = await axios.get(`/product/${productId}`);
    return res.data;
  } catch (err) {
    console.error('API call error getProductById:', err);
    throw err;
  }
}

export const getProductsByCategory = async (categoryName, page, pageSize) => {
  console.log("API call getProductsByCategory with categoryName:", categoryName, page, pageSize);
  try {
    const res = await axios.post('/findProductsByCategoryName', { categoryName : categoryName, page: page, pageSize: pageSize });
    return res.data;
  } catch (err) {
    console.error('API call error getProductsByCategory:', err);
    throw err;
  }
}

// Order Endpoints
export const saveOrder = async (payload) => {
  try {
    const res = await axios.post('/saveOrder', payload);
    return res.data;
  } catch (err) {
    console.error('API call error saveOrder:', err);
    throw err;
  }
}

export const findOrdersByUserId = async (userId, page = 0, pageSize = 10) => {
  try {
    const res = await axios.post('/getOrdersByUserId', { userId : userId, page: page, pageSize: pageSize });
    return res.data;
  } catch (err) {
    console.error('API call error findOrdersByUserId:', err)
    throw err
  }
}

// Admin Order Endpoints
export const getAllOrders = async (payload) => {
  try {
    const res = await axios.post('/admin/getAllOrders', payload);
    return res.data;
  } catch (err) {
    console.error('API call error getAllOrders:', err)
    throw err
  }
}


export const updateOrderStatus = async (payload) => {
  try {
    const res = await axios.post('/admin/updateOrderStatus', payload);
    return res.data;
  } catch (err) {
    console.error('API call error updateOrderStatus:', err)
    throw err
  }
}

export const ordersCount = async () => {
  try {
    const res = await axios.post('/ordersCount');
    return res.data;
  } catch (err) {
    console.error('API call error ordersCount:', err)
    throw err
  }
}

export const productsCount = async () => {
  try {
    const res = await axios.post('/productsCount');
    return res.data;
  } catch (err) {
    console.error('API call error productsCount:', err)
    throw err
  }
}

export const usersCount = async () => {
  try {
    const res = await axios.post('/usersCount');
    return res.data;
  } catch (err) {
    console.error('API call error usersCount:', err)
    throw err
  }
} 

export const categorySales = async () => {
  try {
    const res = await axios.post('/categorySales');
    console.log("categorySales response:", res.data);
    return res.data;
  } catch (err) {
    console.error('API call error categorySales:', err)
    throw err
  }
}   

//product search
export const searchProducts = async (query) =>{
  try{
    const res = await axios.post("/searchProducts", query);
    return res.data;
  }catch (err){
    console.log("API call error product search", err)
  }
}

//top selling product
export const topSellingproducts = async () => {
  try{
    const res = await axios.post("/topSellingProducts");
    return res.data;
  }catch(err) {
    console.log("error while feachin top selling products", err)
  }
}

//dashboard order desceding
export const ordersDesc = async () =>{
  try{
    const res = await axios.post("/orderDesc");
    return res.data;
  }catch(err) {
    console.log("error while feachin orderDesc", err)
  }
}

// total revenue
export const totalRevenue = async () => {
  try{
    const res = await axios.post("/totalRevenue");
    return res.data;
  }catch(err) {
    console.log("error while feachin total revenue", err)
  }
}

//write review
export const writeReview = async (payload) => {
  try {
    const res = await axios.post('/reviews', payload);
    return res.data;
  } catch (err) {
    console.error('API call error writeReview:', err)
    throw err
  }
}

//get reviews by product id
export const getProductReviews = async (productId) => {
  try {
    const res = await axios.get(`/reviews/product/${productId}`);
    return res.data;
  } catch (err) {
    console.error('API call error getProductReviews:', err)
    throw err
  }
}

//sales-overview
export const salesOverview = async () => {
  try {
    const res = await axios.get('/sales-overview');
    return res.data;
  } catch (err) {
    console.error('API call error salesOverview:', err)
    throw err
  }
}

// Api service to download Product Invoice
export const downloadInvoice = async (userId, orderId) => {
  try {
    const res = await axios.post('/downloadInvoice', { userId, orderId }, { responseType: 'blob' });
    // Create a URL for the blob and trigger a download
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice_${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
  } catch (err) {
    console.error('API call error downloadInvoice:', err)
    throw err
  }
}

// API service to fetch recordRecentView
export const recentViewPost = async (userId, productId) => {
  try {
    const res = await axios.post('/api/recommendations/recent-view', null, { params: { userId, productId } });
    return res.data;
  } catch (err) {
    console.error('API call error recordRecentView:', err)
    throw err
  }
}

//API service to fetch recentViews
export const recentViewGet = async (userId, limit = 10) => {
  try {
    const res = await axios.get('/api/recommendations/recent-view', { params: { userId, limit } });
    return res.data;
  } catch (err) {
    console.error('API call error fetchRecentViews:', err)
    throw err
  }
}

// API service to fetch recommended products
export const fetchRecommendedProducts = async (userId, limit = 10) => {
  try {
    const res = await axios.get('/api/recommendations/similar', { params: { userId, limit } });
    return res.data;
  } catch (err) {
    console.error('API call error fetchRecommendedProducts:', err)
    throw err
  }
}

//API service to fetch similar products
export const fetchSimilarProducts = async (productId, limit = 10) => {
  console.log("API call fetchSimilarProducts with productId:", productId, "limit:", limit);
  try {
    const res = await axios.get('/api/recommendations/similar', { params: { productId, limit } });
    return res.data;
  } catch (err) {
    console.error('API call error fetchSimilarProducts:', err)
    throw err
  }
}

// API service to fetch discounted products for slider
export const fetchDiscountedProducts = async (minPercent = 10) => {
  try {
    const res = await axios.post('/discountsProducts', { minPercent });
    return res.data;
  } catch (err) {
    console.error('API call error fetchDiscountedProducts:', err)
    throw err
  }
}





// API service to fetch initial data on app load
const apiService = () => {
    useEffect(() => {
    findAllCategory();
    findAllProduct();
    findAllSponsoredProducts();
    }, []);
}

export default apiService;
