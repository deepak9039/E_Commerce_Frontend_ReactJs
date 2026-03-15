import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  Stack,
} from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        backgroundColor: "#0f172a",
        color: "#e2e8f0",
        pt: 5,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* ===== BRAND ===== */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="#e2e8f0">
              YourStore
            </Typography>

            <Typography variant="body2" color="#e2e8f0">
              Your one-stop destination for quality products, fast delivery,
              and a seamless shopping experience.
            </Typography>

            <Typography variant="body2" sx={{ mt: 2 }} color="#e2e8f0">
              Trusted by thousands of customers across India.
            </Typography>
          </Grid>

          {/* ===== QUICK LINKS ===== */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#e2e8f0">
              Quick Links
            </Typography>

            <Stack spacing={1}>
              <Link href="/" color="#e2e8f0" underline="hover">
                Home
              </Link>
              <Link href="/products" color="#e2e8f0" underline="hover">
                Products
              </Link>
              <Link href="/orders" color="#e2e8f0" underline="hover">
                My Orders
              </Link>
              <Link href="/cart" color="#e2e8f0" underline="hover">
                Cart
              </Link>
            </Stack>
          </Grid>

          {/* ===== ACCOUNT ===== */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#e2e8f0">
              Account
            </Typography>

            <Stack spacing={1}>
              <Link href="/login" color="#e2e8f0" underline="hover">
                Login
              </Link>
              <Link href="/register" color="#e2e8f0" underline="hover">
                Register
              </Link>
              <Link href="/profile" color="#e2e8f0" underline="hover">
                Profile
              </Link>
              <Link href="/settings" color="#e2e8f0" underline="hover">
                Settings
              </Link>
            </Stack>
          </Grid>

          {/* ===== SUPPORT ===== */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#e2e8f0">
              Support
            </Typography>

            <Typography variant="body2" color="#e2e8f0">
              Need help? Our support team is available 24/7.
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }} color="#e2e8f0">
              📧 support@yourstore.com
            </Typography>

            <Typography variant="body2" color="#e2e8f0">
              📞 +91 90000 00000
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }} color="#e2e8f0">
              Secure payments • Easy returns • Fast delivery
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "#1e293b" }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          pb={3}
        >
          <Typography variant="body2" color="#e2e8f0">
            © {new Date().getFullYear()} YourStore. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={3}>
            <Link href="#" color="#e2e8f0" underline="hover">
              Privacy Policy
            </Link>
            <Link href="#" color="#e2e8f0" underline="hover">
              Terms & Conditions
            </Link>
            <Link href="#" color="#e2e8f0" underline="hover">
              Refund Policy
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;