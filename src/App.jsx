import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toolbar } from "@mui/material";

import Navbar from "./components/Navbar/Navbar";
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

import { loginUser } from "./services/apiService";
import { CartProvider } from "./components/Context/CartContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

function App() {
  const [user, setUser] = useState(null);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Router>
          <Navbar user={user} setUser={setUser} />
          <Toolbar />

          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route
              path="/admin"
              element={
                <AdminRoute user={user}>
                  <AdminDashboard />
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
            <Route path="/users" element={<UsersTable />} />
            <Route path="/signin" element={<LoginPage handleLogin={handleLogin} />} />
            <Route path="/order" element={<Order user={user} />} />
            <Route path="/user-orders" element={<UserOrders user={user} />} />

          </Routes>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
