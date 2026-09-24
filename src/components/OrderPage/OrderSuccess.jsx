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
        <Box
          sx={{
            maxWidth: 420,
            mx: "auto",
            py: 6,
            px: 4,
            borderRadius: "16px",
            border: "1px dashed #cbd5e1",
            backgroundColor: "#f8fafc",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#334155" }}>
            No order details found.
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 2.5,
              px: 4,
              py: 1.1,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "none",
              backgroundColor: "#2563eb",
              "&:hover": {
                backgroundColor: "#1d4ed8",
                boxShadow: "0 8px 20px rgba(37,99,235,0.3)",
              },
            }}
            onClick={() => navigate("/")}
          >
            Go Home
          </Button>
        </Box>
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
        background: "#f5f7fa",
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1180, mx: "auto" }}>

        {/* SUCCESS HEADER */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "18px",
            border: "1px solid #dcfce7",
            overflow: "hidden",
            mb: 3,
            background: "linear-gradient(120deg, #ecfdf5 0%, #f7fefb 60%, #f0f7ff 100%)",
          }}
        >
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexDirection: { xs: "column", sm: "row" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Box
              sx={{
                width: 74,
                height: 74,
                flexShrink: 0,
                borderRadius: "50%",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 24px rgba(22,163,74,0.18)",
              }}
            >
              <CheckCircleOutlineIcon
                sx={{ fontSize: 44, color: "#16a34a" }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: { xs: 22, md: 27 }, fontWeight: 700, color: "#0f172a" }}>
                Order Placed Successfully
              </Typography>

              <Typography sx={{ color: "#64748b", mt: 0.5, fontSize: 14 }}>
                Thank you for shopping with us
              </Typography>
            </Box>

            <Chip
              label={firstOrder.status}
              color="success"
              size="small"
              sx={{ fontWeight: 700, borderRadius: "6px", px: 0.5 }}
            />
          </Box>
        </Paper>

        {/* TWO COLUMN BODY */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
            flexDirection: { xs: "column", md: "row" },
          }}
        >

          {/* ================= LEFT COLUMN ================= */}
          <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>

            <Paper
              elevation={0}
              sx={{
                borderRadius: "18px",
                border: "1px solid #e2e8f0",
                p: { xs: 2.5, md: 3 },
                mb: 3,
              }}
            >
              {/* ORDER INFO */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  backgroundColor: "#f8fafc",
                  border: "1px solid #eef1f6",
                  borderRadius: "14px",
                  p: 2.5,
                  mb: 3,
                }}
              >
                <Box sx={{ minWidth: 220, flex: 1 }}>
                  <Typography sx={{ fontSize: 12, color: "#64748b", letterSpacing: "0.3px" }}>
                    Order ID
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: 14, wordBreak: "break-all" }}>
                    {firstOrder.orderId}
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 150 }}>
                  <Typography sx={{ fontSize: 12, color: "#64748b", letterSpacing: "0.3px" }}>
                    Order Date
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>
                    {new Date(firstOrder.orderDate).toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 140 }}>
                  <Typography sx={{ fontSize: 12, color: "#64748b", letterSpacing: "0.3px" }}>
                    Payment Method
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>
                    {firstOrder.paymentMethod || "Cash on Delivery"}
                  </Typography>
                </Box>
              </Box>

              {/* PRODUCTS */}
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#0f172a",
                }}
              >
                <ReceiptLongOutlinedIcon sx={{ color: "#2563eb", fontSize: 21 }} />
                Ordered Products
                <Box
                  component="span"
                  sx={{
                    ml: 0.5,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#2563eb",
                    backgroundColor: "#eaf1ff",
                    px: 1,
                    py: 0.25,
                    borderRadius: "999px",
                  }}
                >
                  {orderData.orders.length}
                </Box>
              </Typography>

              <Box mt={2}>
                {orderData.orders.map((order, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: "1px solid #eef1f6",
                      borderRadius: "14px",
                      mb: 1.5,
                      background: "#ffffff",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        borderColor: "#cbd5e1",
                        boxShadow: "0 8px 18px rgba(15,23,42,0.07)",
                      },
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={600} sx={{ color: "#0f172a", mb: 0.5, fontSize: 15 }}>
                        {order.product.productName}
                      </Typography>

                      <Typography variant="body2" sx={{ color: "#64748b", fontSize: 13 }}>
                        ₹{order.price} &nbsp;×&nbsp; {order.quantity}
                      </Typography>
                    </Box>

                    <Typography fontWeight={700} sx={{ color: "#0f172a", whiteSpace: "nowrap", fontSize: 16 }}>
                      ₹{order.price * order.quantity}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* ADDRESS */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "18px",
                border: "1px solid #e2e8f0",
                p: { xs: 2.5, md: 3 },
              }}
            >
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#0f172a",
                }}
              >
                <LocalShippingOutlinedIcon sx={{ color: "#2563eb", fontSize: 21 }} />
                Delivery Address
              </Typography>

              <Typography
                mt={1.5}
                sx={{
                  color: "#475569",
                  fontSize: 14,
                  lineHeight: 1.7,
                  backgroundColor: "#f8fafc",
                  border: "1px solid #eef1f6",
                  borderRadius: "12px",
                  p: 2,
                }}
              >
                {firstOrder.orderAddress.address},{" "}
                {firstOrder.orderAddress.city},{" "}
                {firstOrder.orderAddress.state} -{" "}
                {firstOrder.orderAddress.pinCode}
              </Typography>
            </Paper>
          </Box>

          {/* ================= RIGHT COLUMN (SUMMARY) ================= */}
          <Box
            sx={{
              width: { xs: "100%", md: 340 },
              flexShrink: 0,
              position: { md: "sticky" },
              top: 90,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: "18px",
                border: "1px solid #e2e8f0",
                p: { xs: 2.5, md: 3 },
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a", mb: 2 }}>
                Payment Summary
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.25 }}>
                <Typography sx={{ color: "#64748b", fontSize: 14 }}>
                  Items ({orderData.orders.length})
                </Typography>
                <Typography sx={{ color: "#1e293b", fontSize: 14, fontWeight: 600 }}>
                  ₹{totalAmount}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.25 }}>
                <Typography sx={{ color: "#64748b", fontSize: 14 }}>Delivery</Typography>
                <Typography sx={{ color: "#15803d", fontSize: 14, fontWeight: 700 }}>
                  FREE
                </Typography>
              </Box>

              <Divider sx={{ my: 2, borderColor: "#eef1f6" }} />

              {/* TOTAL */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f0f7ff",
                  border: "1px solid #dbe7fe",
                  borderRadius: "12px",
                  px: 2,
                  py: 1.75,
                }}
              >
                <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: 15 }}>
                  Grand Total
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 22, color: "#0f172a" }}>
                  ₹{totalAmount}
                </Typography>
              </Box>

              {/* ACTION BUTTONS */}
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: "#2563eb",
                    "&:hover": {
                      backgroundColor: "#1d4ed8",
                      boxShadow: "0 8px 20px rgba(37,99,235,0.3)",
                    },
                    py: 1.2,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                  }}
                  onClick={() => navigate("/user-orders")}
                >
                  View Orders
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    py: 1.2,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 700,
                    borderColor: "#cbd5e1",
                    color: "#334155",
                    "&:hover": {
                      borderColor: "#2563eb",
                      color: "#2563eb",
                      backgroundColor: "rgba(37,99,235,0.04)",
                    },
                  }}
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </Button>
              </Box>
            </Paper>

            {/* REASSURANCE STRIP */}
            <Box
              sx={{
                mt: 2,
                borderRadius: "14px",
                border: "1px solid #eef1f6",
                backgroundColor: "#fff",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
              }}
            >
              {[
                "🚚  Free delivery on this order",
                "🔄  7-day easy return",
                "🔒  Safe & secure payment",
              ].map((line) => (
                <Typography key={line} sx={{ fontSize: 13, color: "#475569" }}>
                  {line}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderSuccess;
