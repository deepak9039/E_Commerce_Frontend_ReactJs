import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
import SearchBar from "../Search/SearchBar";

/* ================= STYLED CART BADGE ================= */
const CartBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.error.main,
    color: "#fff",
    fontSize: "0.7rem",
    top: -18,
    right: 0,
  },
}));

/* ================= COMPONENT ================= */
const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { cartCount, refreshCartCount } = useCart();

  const [anchorEl, setAnchorEl] = useState(null);

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (user?.userId) {
      refreshCartCount(user.userId);
    }
  }, [user]);

  /* ================= HANDLERS ================= */
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const signOut = async () => {
    localStorage.removeItem("user");
    setUser(null);
    await logoutUser();
    navigate("/signin");
  };

  /* ================= UI ================= */
  return (
    <AppBar position="fixed"
    sx={{
      backgroundColor: "#0f172a",
      color: "#e5e7eb",
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    }}
    >
      <Toolbar>
        {/* LOGO */}
        <Typography variant="h6" sx={{ mr: 3 }} fontWeight="bold" gutterBottom>
          YourStore
        </Typography>

        {/* HOME */}
        <Button component={RouterLink} to="/" color="inherit">
          Home
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {/* SEARCH BAR - CENTERED */}
        <Box sx={{ display: "flex", justifyContent: "center", flex: 1 }}>
          <SearchBar />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* ================= AUTH ================= */}
        {!user ? (
          <>
            {/* <Button component={RouterLink} to="/register" color="inherit">
              Register
            </Button> */}
            <Button component={RouterLink} to="/signin" color="inherit">
              Login
            </Button>
            {/* CART */}
            <Button component={RouterLink} to="/cart">
              <IconButton>
                <Button sx={{color: "white"}}>
                  Cart
                </Button>
                <ShoppingCartIcon sx={{ color: "white" }} />
                <CartBadge badgeContent={cartCount || 0} />
              </IconButton>
            </Button>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            
            {/* ADMIN */}
            {user.role === "ROLE_ADMIN" && (
              <Button component={RouterLink} to="/admin" color="inherit">
                Dashboard
              </Button>
            )}

            {/* USER */}
            {user.role === "ROLE_USER" && (
              <>
                {/* ORDERS */}
                {/* <Button component={RouterLink} to="/user-orders" color="inherit">
                  Orders
                </Button> */}
                <Button component={RouterLink} to="/cart" color="inherit">
                  <IconButton>
                    <Button sx={{color: "white"}}>
                      Cart
                    </Button>
                    <ShoppingCartIcon sx={{ color: "white" }} />
                    <CartBadge badgeContent={cartCount || 0} />
                  </IconButton>
                </Button>
              </>
            )}

            {/* USER AVATAR + NAME (HOVER MENU) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                color: "white",
              }}
              onMouseEnter={handleMenuOpen}
            >
              <Typography sx={{ fontWeight: "bold" }}>
                {user.email || "User"}
              </Typography>

              <Avatar sx={{ bgcolor: "white", color: "#1976d2" }}>
                {user?.userName?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Box>

            {/* LOGOUT BUTTON (OUTSIDE MENU) */}
            <Button color="inherit" onClick={signOut}>
              Logout
            </Button>

            {/* DROPDOWN MENU */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{
                onMouseLeave: handleMenuClose,
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/profile");
                }}
              >
                Profile
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/user/address");
                }}
              >
                Address
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/user-orders");
                }}
              >
                Orders
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
