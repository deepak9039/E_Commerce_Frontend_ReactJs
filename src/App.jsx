import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toolbar } from "@mui/material";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/HomePage/HomePage";
import AddCategory from "./components/Category/AddCategory";
import AddProduct from "./components/Product/AddProduct";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ViewProduct from "./components/Product/ViewProduct";
import UserPage from "./components/UserDetails/UserPage";
import LoginPage from "./components/Login/LoginPage";
import UsersTable from "./components/UserDetails/UsersTable";
import ProductDetails from "./components/Product/ProductDetails";
import AdminRoute from "./components/Admin/AdminRoute";
import CartPage from "./components/Cart/CartPage";
import Order from "./components/OrderPage/Order";
import UserOrders from "./components/OrderPage/UserOrders";
import AdminOrders from "./components/Admin/AdminOrders";
import SearchResults from "./components/Search/SearchResults";
import ProductReviewPage from "./components/Review/ProductReviewPage";

import { loginUser } from "./services/apiService";
import { CartProvider } from "./components/Context/CartContext";
import UserProfile from "./components/UserDetails/UserProfile";
import UserAddress from "./components/UserDetails/UserAddress";
import AdminLayout from "./components/Admin/AdminLayout";
import { logoutUser } from "./services/apiService";
import OrderSuccess from "./components/OrderPage/OrderSuccess";
import SellerPage from "./components/UserDetails/SellerPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

function App() {
  const [user, setUser] = useState(null);

  console.log("Current User in App.jsx:", user); 

  const handleLogin = async (email, password) => {
  try {
    const response = await loginUser({ email, password });
    console.log("====", response);

    if (response.status === "FAILED") return response;

    // Persist user and token (if present) so axios interceptor can attach it
    try {
      if (response) {
        localStorage.setItem('user', JSON.stringify(response));
        if (response.token) localStorage.setItem('token', response.token);
        else if (response.accessToken) localStorage.setItem('token', response.accessToken);
      }
    } catch (e) {
      console.warn('Could not persist login data to localStorage', e);
    }

    setUser(response);
    return response;

  } catch (err) {
    console.log("Login Error:", err);

    return err?.response?.data || {
      status: "FAILED",
      message: "Login failed. Please try again.",
    };
  }
};

  const signOut = async () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      await logoutUser();
    } catch (e) {
      console.warn('Error during sign out', e);
    }
  };
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Router>
          <Navbar user={user} setUser={setUser} />
          {/* {!user || user.role !== "ROLE_ADMIN" && (
            <Navbar user={user} setUser={setUser} />
          )} */}
          <Toolbar />

          <Routes>
            <Route path="/" element={<HomePage user={user} />} />

            <Route
              path="/admin"
              element={
                <AdminRoute user={user}>
                  {/* <AdminDashboard /> */}
                  <AdminLayout user={user} signOut={signOut} />
                </AdminRoute>
              }
            />

            <Route path="/cart" element={<CartPage user={user} />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/view-products" element={<ViewProduct />} />
            <Route path="/product/:id" element={<ProductDetails user={user} />} />
            <Route path="/edit-product/:id" element={<AddProduct />} />
            <Route path="/register" element={<UserPage />} />
            <Route path="/become-seller" element={<SellerPage />} />
            <Route path="/profile" element={<UserProfile user={user} setUser={setUser} />} />
            <Route path="/user/address" element={<UserAddress user={user} />} />
            <Route path="/users" element={<UsersTable />} />
            <Route path="/signin" element={<LoginPage handleLogin={handleLogin} />} />
            <Route path="/order" element={<Order user={user} />} />
            <Route path="/user-orders" element={<UserOrders user={user} />} />
            <Route path="/admin-orders" element={<AdminOrders user={user} />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/productReview" element={<ProductReviewPage />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
