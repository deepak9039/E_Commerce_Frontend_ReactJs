import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const orderData = location.state;

  // If page refreshed and state lost
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

  // Calculate total amount
  const totalAmount = orderData.orders.reduce(
    (sum, order) => sum + order.price * order.quantity,
    0
  );

  // Take first order to show common details
  const firstOrder = orderData.orders[0];

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        p: 3,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 700,
          width: "100%",
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box textAlign="center">
          <CheckCircleOutlineIcon
            sx={{ fontSize: 80, color: "green", mb: 2 }}
          />

          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Order Placed Successfully!
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Thank you for your purchase. Your order has been confirmed.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Order ID */}
        <Typography>
          <b>Order ID:</b> {firstOrder.orderId}
        </Typography>

        <Typography>
          <b>Order Date:</b>{" "}
          {new Date(firstOrder.orderDate).toLocaleString()}
        </Typography>

        <Typography>
          <b>Status:</b> {firstOrder.status}
        </Typography>

        <Typography>
          <b>Payment Method:</b>{" "}
          {firstOrder.paymentMethod || "Cash on Delivery"}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Products List */}
        <Typography variant="h6" gutterBottom>
          Ordered Products:
        </Typography>

        {orderData.orders.map((order, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography>
              <b>Product:</b> {order.product.productName}
            </Typography>

            <Typography>
              <b>Quantity:</b> {order.quantity}
            </Typography>

            <Typography>
              <b>Price:</b> ₹{order.price}
            </Typography>

            <Typography>
              <b>Total:</b> ₹{order.price * order.quantity}
            </Typography>

            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}

        {/* Grand Total */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Grand Total: ₹{totalAmount}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Delivery Address */}
        <Typography variant="h6" gutterBottom>
          Delivery Address:
        </Typography>

        <Typography>
          {firstOrder.orderAddress.address},{" "}
          {firstOrder.orderAddress.city},{" "}
          {firstOrder.orderAddress.state} -{" "}
          {firstOrder.orderAddress.pinCode}
        </Typography>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/orders")}
          >
            View Orders
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default OrderSuccess;