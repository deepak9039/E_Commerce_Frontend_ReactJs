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
    backgroundColor: "#e11d48",
    color: "#fff",
    fontSize: "0.7rem",
    fontWeight: 700,
    top: -3,
    right: -2,
  },
}));

/* ================= COMPONENT ================= */
const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { cartCount, refreshCartCount, clearCartCount } = useCart();

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
    localStorage.removeItem("token");
    setUser(null);
    await logoutUser();
    // Force clear cart count after logout
    clearCartCount();
    navigate("/signin");
  };

  /* ================= UI ================= */
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "linear-gradient(180deg, #2d6df6 0%, #2563eb 100%)",
        color: "#fff",
        boxShadow: "0 2px 10px rgba(15,23,42,0.18)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ minHeight: 68 }}>

        <Box
          component={RouterLink}
          to="/"
          sx={{
            ml: { xs: 0, md: 1 },
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
          }}
        >
          <img src={logo} alt="logo" style={{ height: "42px" }} />
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
          <Box
            sx={{
              flex: 1,
              maxWidth: 480,
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(15,23,42,0.12)",
              overflow: "hidden",
            }}
          >
            <SearchBar />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* ================= AUTH ================= */}
          {!user ? (
            <>
              <Button
                component={RouterLink}
                to="/become-seller"
                sx={{
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.12)",
                  },
                }}
              >
                Become a Seller
              </Button>
              <Button
                component={RouterLink}
                to="/signin"
                variant="contained"
                sx={{
                  ml: 1,
                  color: "#2563eb",
                  backgroundColor: "#fff",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "8px",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                    boxShadow: "none",
                  },
                }}
              >
                Login
              </Button>

              {/* CART */}
              <IconButton component={RouterLink} to="/cart" sx={{ ml: 1.5 }}>
                <CartBadge badgeContent={cartCount || 0}>
                  <ShoppingCartIcon sx={{ color: "white" }} />
                </CartBadge>
              </IconButton>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>

              {/* ADMIN */}
              {(user.role === "ROLE_ADMIN" || user.role === "ROLE_SUPER_ADMIN") && (
                <Button
                  component={RouterLink}
                  to="/admin"
                  sx={{
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
                  }}
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
                  gap: 0.75,
                  cursor: "pointer",
                  px: 1.25,
                  py: 0.75,
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.12)",
                  },
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>
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
                <KeyboardArrowDownIcon sx={{ color: '#fff', ml: 0.5, fontSize: 20 }} />
              </Box>

              {/* DROPDOWN */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{ onMouseLeave: handleMenuClose, sx: { py: 0.75 } }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 210,
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 16px 36px rgba(15,23,42,0.16)",
                  },
                }}
              >
                <MenuItem
                  onClick={() => navigate("/profile")}
                  sx={{ fontSize: 14, fontWeight: 500, py: 1.1, "&:hover": { backgroundColor: "#eaf1ff" } }}
                >
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" sx={{ color: "#2563eb" }} />
                  </ListItemIcon>
                  Profile
                </MenuItem>

                <MenuItem
                  onClick={() => navigate("/user/address")}
                  sx={{ fontSize: 14, fontWeight: 500, py: 1.1, "&:hover": { backgroundColor: "#eaf1ff" } }}
                >
                  <ListItemIcon>
                    <LocationOnIcon fontSize="small" sx={{ color: "#2563eb" }} />
                  </ListItemIcon>
                  Address
                </MenuItem>

                <MenuItem
                  onClick={() => navigate("/user-orders")}
                  sx={{ fontSize: 14, fontWeight: 500, py: 1.1, "&:hover": { backgroundColor: "#eaf1ff" } }}
                >
                  <ListItemIcon>
                    <ReceiptLongIcon fontSize="small" sx={{ color: "#2563eb" }} />
                  </ListItemIcon>
                  Orders
                </MenuItem>

                <Divider sx={{ borderColor: "#eef1f6" }} />

                <MenuItem
                  onClick={signOut}
                  sx={{ fontSize: 14, fontWeight: 500, py: 1.1, color: "#e11d48", "&:hover": { backgroundColor: "#fef2f4" } }}
                >
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
