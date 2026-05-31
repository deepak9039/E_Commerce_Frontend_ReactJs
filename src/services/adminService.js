import axios from 'axios';

//API for admin Products
export const fetchAdminProducts = async (payload) => {
  try {
    console.log("API call fetchAdminProducts with payload:", payload);
    const res = await axios.post('/admin/myProducts', payload);
    return res.data;
  } catch (err) {
    console.error('API call error fetchAdminProducts:', err)
    throw err
  }
}

// API for admin Orders
export const fetchAdminOrders = async (payload) => {
  try {
    console.log("API call fetchAdminOrders with payload:", payload);
    const res = await axios.post('/admin/getOrdersForAdmin', payload);
    return res.data;
  } catch (err) {
    console.error('API call error fetchAdminOrders:', err)
    throw err
  }
}

//API admin for product count, order count, revenue 
export const fetchAdminProductsCount = async () => {
  try {
    const res = await axios.post('/admin/metrics/owner/productCount');
    return res.data;
  } catch (err) {
    console.error('API call error adminProductsCount:', err)
    throw err
  }
}
export const fetchAdminOrdersCount = async () => {
  try {
    const res = await axios.post('/admin/metrics/owner/ordersCount');
    return res.data;
  } catch (err) {
    console.error('API call error fetchAdminOrdersCount:', err)
    throw err
  }
}
export const fetchAdminRevenue = async () => {
  try {
    const res = await axios.post('/admin/metrics/owner/revenue');
    return res.data;
  } catch (err) {
    console.error('API call error fetchAdminRevenue:', err)
    throw err
  }
}

//Create Seller API
export const createSeller = async (sellerData) => {
  try {
    console.log("API call createSeller with data:", sellerData);
    const res = await axios.post('/registerSeller', sellerData);
    return res.data;
  } catch (err) {
    console.error('API call error createSeller:', err)
    throw err
  }
}

// Admin Recent Orders
export const fetchAdminRecentOrders = async () => {
  try {
    const res = await axios.post('/admin/metrics/owner/recentOrders');
    return res.data;
  } catch (err) {
    console.error('API call error fetchAdminRecentOrders:', err)
    throw err
  }
}

// Admin Top Products
export const fetchAdminTopProducts = async () => {
  try {
    const res = await axios.post('/admin/metrics/owner/topProducts');
    return res.data;
  }catch (err) {
    console.error('API call error fetchAdminTopProducts:', err)
    throw err
  }
}