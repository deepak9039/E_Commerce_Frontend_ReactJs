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

import { loginUser } from "./services/apiService";
import { CartProvider } from "./components/Context/CartContext";
import UserProfile from "./components/UserDetails/UserProfile";
import UserAddress from "./components/UserDetails/UserAddress";
import AdminLayout from "./components/Admin/AdminLayout";
import { logoutUser } from "./services/apiService";

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
      if (response.status === "FAILED") return response;
      setUser(response);
      return response;
    } catch (err) {
      return {
        success: false,
        message: "Login failed",
      };
    }
  };

  const signOut = async () => {
      localStorage.removeItem("user");
      setUser(null);
      await logoutUser();
      navigate("/signin");
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
            <Route path="/" element={<HomePage />} />

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
            <Route path="/profile" element={<UserProfile user={user} />} />
            <Route path="/user/address" element={<UserAddress user={user} />} />
            <Route path="/users" element={<UsersTable />} />
            <Route path="/signin" element={<LoginPage handleLogin={handleLogin} />} />
            <Route path="/order" element={<Order user={user} />} />
            <Route path="/user-orders" element={<UserOrders user={user} />} />
            <Route path="/admin-orders" element={<AdminOrders user={user} />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
