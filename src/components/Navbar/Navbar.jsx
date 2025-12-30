import { Link as RouterLink, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";

import { logoutUser } from "../../services/apiService";
import { useCart } from "../Context/CartContext";

const CartBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.error.main,
    color: "#fff",
    fontSize: "0.7rem",
    top: -18,
    right: 0,
  },
}));

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { cartCount, refreshCartCount } = useCart();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (user?.userId) {
      refreshCartCount(user.userId);
    }
  }, [user]);

  const signOut = async () => {
    localStorage.removeItem("user");
    setUser(null);
    await logoutUser();
    navigate("/signin");
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" sx={{ mr: 3 }}>
          E-Commerce
        </Typography>

        <Button component={RouterLink} to="/" color="inherit">
          Home
        </Button>
        <Box sx={{ flexGrow: 1 }} />

        {!user ? (
          <>
            <Button component={RouterLink} to="/register" color="inherit">
              Register
            </Button>
            <Button component={RouterLink} to="/signin" color="inherit">
              Login
            </Button>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>

            {user?.role === "ROLE_ADMIN" && (
              <Button component={RouterLink} to="/admin" color="inherit">
                Dashboard
              </Button>
            )}
            
            {/* Cart Icon with Badge */}
            <Button component={RouterLink} to="/cart" color="inherit">
              <IconButton>
                <ShoppingCartIcon sx={{ color: "white" }} />
                {user?.role === "ROLE_USER" && <CartBadge badgeContent={cartCount || 0} />}
              </IconButton>
            </Button>

            {/* User Orders */}
            <Button component={RouterLink} to="/user-orders" color="inherit">
              Orders
            </Button>

            {/* Username + Avatar (Profile menu only) */} 
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', color: 'white' }} > 
              <Typography sx={{ fontWeight: 'bold' }}> {user.email || "User"} </Typography> 
              <Avatar sx={{ bgcolor: 'white', color: '#1976d2' }}> 
                {user?.userName?.charAt(0)?.toUpperCase()} 
                </Avatar> 
            </Box>

            <Button color="inherit" onClick={signOut}>
              Logout
            </Button>

            <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
