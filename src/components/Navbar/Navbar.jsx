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
  Container,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import logo from "../../../public/logoNew1.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { logoutUser } from "../../services/apiService";
import { useCart } from "../Context/CartContext";
import SearchBar from "../Search/SearchBar";

/* ================= STYLED CART BADGE ================= */
const CartBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.error.main,
    color: "#fff",
    fontSize: "0.7rem",
    top: -3,
    right: -2,
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
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#0f172a",
        color: "#e5e7eb",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ minHeight: 72 }}>

        <Box
          component={RouterLink}
          to="/"
          sx={{
            ml: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
          }}
        >
          <img src={logo} alt="logo" style={{ height: "50px" }} />
        </Box>


          {/* HOME */}
          {/* <Button
            component={RouterLink}
            to="/"
            sx={{
              ml: 2,
              color: "#e5e7eb",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            Home
          </Button> */}

          <Box sx={{ flexGrow: 1 }} />

          {/* SEARCH */}
          <Box sx={{ flex: 1, maxWidth: 420 }}>
            <SearchBar />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* ================= AUTH ================= */}
          {!user ? (
            <>
              <Button
                component={RouterLink}
                to="/signin"
                sx={{
                  color: "#e5e7eb",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Login
              </Button>

              {/* CART */}
              <IconButton component={RouterLink} to="/cart" sx={{ ml: 1 }}>
                <CartBadge badgeContent={cartCount || 0}>
                  <ShoppingCartIcon sx={{ color: "white" }} />
                </CartBadge>
              </IconButton>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

              {/* ADMIN */}
              {user.role === "ROLE_ADMIN" && (
                <Button
                  component={RouterLink}
                  to="/admin"
                  sx={{ color: "#e5e7eb", textTransform: "none" }}
                >
                  Dashboard
                </Button>
              )}

              {/* USER CART */}
              {user.role === "ROLE_USER" && (
                <IconButton component={RouterLink} to="/cart">
                  <CartBadge badgeContent={cartCount || 0}>
                    <ShoppingCartIcon sx={{ color: "white" }} />
                  </CartBadge>
                </IconButton>
              )}

              {/* USER INFO */}
              <Box
                onMouseEnter={handleMenuOpen}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  px: 1,
                  py: 0.5,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                <Typography sx={{ fontWeight: 500 }}>
                  {user.email || "User"}
                </Typography>
                {/* <Avatar
                  sx={{
                    bgcolor: "#e5e7eb",
                    color: "#1976d2",
                    width: 34,
                    height: 34,
                    fontWeight: "bold",
                  }}
                > */}
                  {/* {user?.userName?.charAt(0)?.toUpperCase()} */}
                {/* </Avatar> */}
                  {/* {user?.userName?.charAt(0)?.toUpperCase()} */}
                <KeyboardArrowDownIcon sx={{ color: '#e5e7eb', ml: 0.5 }} />
              </Box>

              {/* DROPDOWN */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{ onMouseLeave: handleMenuClose }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem onClick={() => navigate("/profile")}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>

                <MenuItem onClick={() => navigate("/user/address")}>
                  <ListItemIcon>
                    <LocationOnIcon fontSize="small" />
                  </ListItemIcon>
                  Address
                </MenuItem>

                <MenuItem onClick={() => navigate("/user-orders")}>
                  <ListItemIcon>
                    <ReceiptLongIcon fontSize="small" />
                  </ListItemIcon>
                  Orders
                </MenuItem>

                <Divider />

                <MenuItem onClick={signOut}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
