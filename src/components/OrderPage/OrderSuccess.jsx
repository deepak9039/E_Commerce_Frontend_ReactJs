import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Grid,
  Chip
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { useNavigate, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const orderData = location.state;

  if (!orderData || !orderData.orders) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6">
          No order details found.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
      </Box>
    );
  }

  const totalAmount = orderData.orders.reduce(
    (sum, order) => sum + order.price * order.quantity,
    0
  );

  const firstOrder = orderData.orders[0];

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 750,
          width: "100%",
          borderRadius: 3,
          overflow: "hidden"
        }}
      >
        {/* SUCCESS HEADER */}
        <Box
          sx={{
            textAlign: "center",
            p: 4,
            background: "#ecfdf5"
          }}
        >
          <CheckCircleOutlineIcon
            sx={{ fontSize: 70, color: "#16a34a", mb: 1 }}
          />

          <Typography variant="h4" fontWeight="bold">
            Order Placed Successfully
          </Typography>

          <Typography color="text.secondary">
            Thank you for shopping with us
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>

          {/* ORDER INFO */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} md={6}>
              <Typography>
                <b>Order ID:</b> {firstOrder.orderId}
              </Typography>

              <Typography>
                <b>Order Date:</b>{" "}
                {new Date(firstOrder.orderDate).toLocaleString()}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography>
                <b>Payment Method:</b>{" "}
                {firstOrder.paymentMethod || "Cash on Delivery"}
              </Typography>

              <Box mt={1}>
                <Chip
                  label={firstOrder.status}
                  color="success"
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* PRODUCTS */}
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <ReceiptLongOutlinedIcon />
            Ordered Products
          </Typography>

          <Box mt={2}>
            {orderData.orders.map((order, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  mb: 2,
                  background: "#fafafa"
                }}
              >
                <Typography fontWeight={600}>
                  {order.product.productName}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Quantity: {order.quantity}
                </Typography>

                <Typography variant="body2">
                  Price: ₹{order.price}
                </Typography>

                <Typography fontWeight={600}>
                  Total: ₹{order.price * order.quantity}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* TOTAL */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2
            }}
          >
            <Typography variant="h6">Grand Total</Typography>
            <Typography variant="h6" fontWeight="bold">
              ₹{totalAmount}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ADDRESS */}
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <LocalShippingOutlinedIcon />
            Delivery Address
          </Typography>

          <Typography mt={1} color="text.secondary">
            {firstOrder.orderAddress.address},{" "}
            {firstOrder.orderAddress.city},{" "}
            {firstOrder.orderAddress.state} -{" "}
            {firstOrder.orderAddress.pinCode}
          </Typography>

          {/* ACTION BUTTONS */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              gap: 2,
              justifyContent: "center"
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#0f172a",
                "&:hover": { backgroundColor: "#1e293b" },
                px: 4
              }}
              onClick={() => navigate("/orders")}
            >
              View Orders
            </Button>

            <Button
              variant="outlined"
              sx={{ px: 4 }}
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default OrderSuccess;