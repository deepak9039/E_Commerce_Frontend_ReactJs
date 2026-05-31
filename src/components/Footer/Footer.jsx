import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";

import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import XIcon from "@mui/icons-material/X";

import logo from "../../../public/logoNew1.png";

const footerLinkStyle = {
  color: "#94a3b8",
  textDecoration: "none",
  transition: "all 0.3s ease",
  fontSize: "14px",
  width: "fit-content",

  "&:hover": {
    color: "#ff008c",
    transform: "translateX(5px)",
  },
};

const socialIconStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
  borderRadius: "4px",
  transition: "0.3s ease",

  "&:hover": {
    background: "#ff008c",
    borderColor: "#ff008c",
    transform: "translateY(-4px)",
    boxShadow: "0 0 20px rgba(255,0,140,0.5)",
  },
};

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        background: "#050505",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* TOP PINK LINE */}
      <Box
        sx={{
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, #ff008c, transparent)",
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          pt: 8,
          pb: 4,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Grid container spacing={6}>
          {/* ===== LOGO ===== */}
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 3 }}>
              <img
                src={logo}
                alt="logo"
                style={{
                  height: "60px",
                  objectFit: "contain",
                }}
              />
            </Box>

            <Typography
              sx={{
                color: "#94a3b8",
                lineHeight: 1.9,
                fontSize: "14px",
              }}
            >
              Premium shopping experience with fast delivery, secure payments,
              and quality products for modern customers.
            </Typography>
          </Grid>

          {/* ===== SHOP ===== */}
          <Grid item xs={6} md={2}>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                mb: 3,
                letterSpacing: "3px",
                fontSize: "13px",
              }}
            >
              • SHOP
            </Typography>

            <Stack spacing={2}>
              <Link href="/" sx={footerLinkStyle}>
                Home
              </Link>

              <Link href="/products" sx={footerLinkStyle}>
                Products
              </Link>

              <Link href="/wishlist" sx={footerLinkStyle}>
                Wishlist
              </Link>

              <Link href="/cart" sx={footerLinkStyle}>
                Cart
              </Link>

              <Link href="/orders" sx={footerLinkStyle}>
                My Orders
              </Link>
            </Stack>
          </Grid>

          {/* ===== ACCOUNT ===== */}
          <Grid item xs={6} md={2}>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                mb: 3,
                letterSpacing: "3px",
                fontSize: "13px",
              }}
            >
              • ACCOUNT
            </Typography>

            <Stack spacing={2}>
              <Link href="/login" sx={footerLinkStyle}>
                Login
              </Link>

              <Link href="/register" sx={footerLinkStyle}>
                Register
              </Link>

              <Link href="/profile" sx={footerLinkStyle}>
                Profile
              </Link>

              <Link href="/settings" sx={footerLinkStyle}>
                Settings
              </Link>
            </Stack>
          </Grid>

          {/* ===== CONTACT ===== */}
          <Grid item xs={12} md={3}>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                mb: 3,
                letterSpacing: "3px",
                fontSize: "13px",
              }}
            >
              • HEADQUARTERS
            </Typography>

            <Stack spacing={2}>
              <Typography sx={{ color: "#cbd5e1", fontSize: "14px" }}>
                📍 Kerala, India
              </Typography>

              <Typography sx={{ color: "#94a3b8", fontSize: "14px" }}>
                support@yourstore.com
              </Typography>

              <Typography sx={{ color: "#94a3b8", fontSize: "14px" }}>
                Partnerships
              </Typography>

              <Typography sx={{ color: "#94a3b8", fontSize: "14px" }}>
                Press & Media
              </Typography>
            </Stack>
          </Grid>

          {/* ===== SOCIAL ===== */}
          <Grid item xs={12} md={2}>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                mb: 3,
                letterSpacing: "3px",
                fontSize: "13px",
              }}
            >
              • NETWORK
            </Typography>

            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: "14px",
                lineHeight: 1.8,
                mb: 3,
              }}
            >
              Follow the brand across drops, offers and latest updates.
            </Typography>

            <Stack direction="row" spacing={2}>
              <IconButton sx={socialIconStyle}>
                <InstagramIcon />
              </IconButton>

              <IconButton sx={socialIconStyle}>
                <YouTubeIcon />
              </IconButton>

              <IconButton sx={socialIconStyle}>
                <XIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>

        {/* HUGE BACKGROUND TEXT */}
        <Box
          sx={{
            position: "relative",
            mt: 10,
            mb: 3,
            textAlign: "center",
          }}
        >
<Typography
  sx={{
    fontSize: { xs: "70px", sm: "90px", md: "100px" },
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: "-8px",
    cursor: "pointer",
    userSelect: "none",
    display: "inline-block",
    position: "relative",

    /* DEFAULT OUTLINE */
    color: "transparent",
    WebkitTextStroke: "1px rgba(255,255,255,0.18)",

    transition: "all 0.6s ease",

    /* HOVER EFFECT */
    "&:hover": {
      background:
        "linear-gradient(90deg, #ffffff 0%, #ffffff 45%, #ff008c 75%, #ff008c 100%)",

      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",

      WebkitTextStroke: "0px transparent",

      filter: "drop-shadow(0 0 20px rgba(255,0,140,0.45))",

      transform: "scale(1.02)",
    },
  }}
>
  Infinity Your Store
</Typography>
        </Box>

        <Divider
          sx={{
            my: 4,
            borderColor: "rgba(255,255,255,0.08)",
          }}
        />

        {/* ===== BOTTOM ===== */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            sx={{
              color: "#64748b",
              fontSize: "13px",
              letterSpacing: "2px",
            }}
          >
            © {new Date().getFullYear()} INFINITY STORE. ALL RIGHTS RESERVED.
          </Typography>

          <Stack direction="row" spacing={3}>
            <Link href="#" sx={footerLinkStyle}>
              Privacy
            </Link>

            <Link href="#" sx={footerLinkStyle}>
              Terms
            </Link>

            <Link href="#" sx={footerLinkStyle}>
              Shipping Policy
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;