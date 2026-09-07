import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Chip,
  Pagination,
  Button,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DownloadIcon from "@mui/icons-material/Download";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import InventoryIcon from "@mui/icons-material/Inventory";
import { findOrdersByUserId, downloadInvoice } from "../../services/apiService";

// Purely presentational helper — maps an order status to a status color/icon.
// Does not change any data or logic, only how the status is displayed.
const getStatusMeta = (status) => {
  if (status === "DELIVERED") {
    return { color: "#1b8e5a", bg: "#e6f7ef", icon: CheckCircleIcon, label: "Delivered" };
  }
  if (status === "CANCELLED") {
    return { color: "#d32f2f", bg: "#fdecea", icon: CancelIcon, label: "Cancelled" };
  }
  return { color: "#e57c00", bg: "#fff3e0", icon: AutorenewIcon, label: "In Progress" };
};

const UserOrders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  console.log("UserOrders Component - User:", user);

  /* ================= FETCH USER ORDERS ================= */
  useEffect(() => {
    if (!user?.userId) return;

    const fetchOrders = async () => {
      try {
        const res = await findOrdersByUserId(user?.userId, currentPage, 10);
        setOrders(res?.orders || []);
        setTotalPages(res?.totalPages || 0);
        setTotalElements(res?.totalElements || 0);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user?.userId, currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleDownloadInvoice = async (userId, orderId) => {
    try {
      await downloadInvoice(userId, orderId);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  return (
    <Box sx={{ minHeight: "calc(100vh - 72px)", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        {/* ===== HEADER ===== */}
        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                display: "grid",
                placeItems: "center",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #ff8a00 0%, #ff5722 100%)",
                color: "#fff",
                boxShadow: "0 8px 18px rgba(255, 87, 34, 0.28)",
              }}
            >
              <ShoppingBagIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{ color: "#0f172a", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.5px" }}
              >
                My Orders
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 14.5 }}>
                Track, manage and review everything you've bought
              </Typography>
            </Box>
          </Box>

          {totalElements > 0 && (
            <Chip
              label={`${totalElements} total ${totalElements === 1 ? "order" : "orders"}`}
              sx={{
                bgcolor: "#fff",
                border: "1px solid #e2e8f0",
                fontWeight: 700,
                color: "#334155",
                px: 1,
              }}
            />
          )}
        </Box>

        {/* ===== EMPTY STATE ===== */}
        {orders.length === 0 && (
          <Card
            sx={{
              borderRadius: 4,
              border: "2px dashed #cbd5e1",
              bgcolor: "#fbfcfe",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ py: 8, textAlign: "center" }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  bgcolor: "#fff3e0",
                  display: "grid",
                  placeItems: "center",
                  mx: "auto",
                  mb: 2.5,
                }}
              >
                <InventoryIcon sx={{ fontSize: 34, color: "#ff5722" }} />
              </Box>
              <Typography variant="h6" fontWeight="800" color="#1e293b">
                No orders yet
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 340, mx: "auto" }}>
                You haven't placed any orders yet. Once you do, they'll show up here.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* ===== ORDERS LIST ===== */}
        {orders.map((order) => {
          const statusMeta = getStatusMeta(order.status);
          const StatusIcon = statusMeta.icon;

          return (
            <Card
              key={order.id}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid #e6e9ef",
                boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)",
                mb: 3,
                transition: "box-shadow 0.25s ease",
                "&:hover": {
                  boxShadow: "0 10px 26px rgba(15, 23, 42, 0.09)",
                },
              }}
            >
              {/* ================= TOP HEADER ================= */}
              <Box
                sx={{
                  bgcolor: "#f8fafc",
                  px: { xs: 2.5, md: 3.5 },
                  py: 2,
                  borderBottom: "1px solid #e6e9ef",
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 6, md: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 13, color: "#94a3b8" }} />
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 800, color: "#94a3b8", letterSpacing: "0.5px", fontSize: 10.5 }}
                      >
                        ORDER PLACED
                      </Typography>
                    </Box>
                    <Typography fontWeight={700} sx={{ fontSize: 14, color: "#0f172a" }}>
                      {new Date(order.orderDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6, md: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 800, color: "#94a3b8", letterSpacing: "0.5px", fontSize: 10.5, display: "block", mb: 0.5 }}
                    >
                      TOTAL
                    </Typography>
                    <Typography fontWeight={800} sx={{ fontSize: 14.5, color: "#0f172a" }}>
                      ₹{order.price}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 800, color: "#94a3b8", letterSpacing: "0.5px", fontSize: 10.5, display: "block", mb: 0.5 }}
                    >
                      SHIP TO
                    </Typography>
                    <Typography sx={{ color: "#ff5722", fontWeight: 700, fontSize: 14 }}>
                      {user?.firstName || user?.email}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6, md: 5 }} sx={{ textAlign: { xs: "left", md: "right" } }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: "#94a3b8",
                        display: "block",
                        fontSize: 10.5,
                        fontFamily: "monospace",
                        mb: 0.5,
                      }}
                    >
                      ORDER ID: {order.orderId}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                      onClick={() => handleDownloadInvoice(user?.userId, order.orderId)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        color: "#ff5722",
                        "&:hover": { bgcolor: "#fff3e0" },
                      }}
                    >
                      Download Invoice
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* ================= BODY ================= */}
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Grid container spacing={3}>
                  {/* Product Image */}
                  <Grid size={{ xs: 12, sm: 3, md: 2 }}>
                    <Box
                      sx={{
                        border: "1px solid #eef1f6",
                        borderRadius: 3,
                        p: 1.5,
                        bgcolor: "#fafbfc",
                        display: "grid",
                        placeItems: "center",
                        height: "100%",
                      }}
                    >
                      <Box
                        component="img"
                        src={`http://localhost:1234/image/product/${order.product.productImageUrl}`}
                        alt={order.product.productName}
                        sx={{
                          width: "100%",
                          maxHeight: 130,
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  </Grid>

                  {/* Product Details */}
                  <Grid size={{ xs: 12, sm: 9, md: 6 }}>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.75,
                        bgcolor: statusMeta.bg,
                        color: statusMeta.color,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        mb: 1.5,
                      }}
                    >
                      <StatusIcon sx={{ fontSize: 17 }} />
                      <Typography sx={{ fontWeight: 800, fontSize: 13.5 }}>
                        {statusMeta.label}
                      </Typography>
                    </Box>

                    <Typography
                      component={Link}
                      to="#"
                      sx={{
                        fontWeight: 700,
                        color: "#0f172a",
                        fontSize: 16,
                        display: "block",
                        mb: 0.75,
                        textDecoration: "none",
                        "&:hover": { color: "#ff5722" },
                      }}
                    >
                      {order.product.productName}
                    </Typography>

                    <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: 16, mb: 1.5 }}>
                      ₹{order.price}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.75,
                        bgcolor: "#f8fafc",
                        borderRadius: 1.5,
                        px: 1.25,
                        py: 0.5,
                      }}
                    >
                      <LocalShippingIcon sx={{ fontSize: 15, color: "#94a3b8" }} />
                      Payment Method: <strong>{order.paymentMethod}</strong>
                    </Typography>

                    {order.status === "DELIVERED" && (
                      <Box mt={2}>
                        <Typography
                          component={Link}
                          to="/productReview"
                          state={{
                            user,
                            product: order.product,
                            orderId: order.id,
                          }}
                          sx={{
                            textDecoration: "none",
                            color: "#ff5722",
                            fontWeight: 700,
                            fontSize: 13.5,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          <StarRateRoundedIcon sx={{ fontSize: 18 }} />
                          Rate & Review Product
                        </Typography>
                      </Box>
                    )}
                  </Grid>

                  {/* Right Side Actions */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box display="flex" flexDirection="column" gap={1.5} sx={{ height: "100%", justifyContent: "center" }}>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          borderRadius: "30px",
                          py: 1.2,
                          textTransform: "none",
                          fontWeight: 700,
                          background: "linear-gradient(135deg, #ff8a00 0%, #ff5722 100%)",
                          boxShadow: "0 6px 14px rgba(255, 87, 34, 0.28)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #f57c00 0%, #e64a19 100%)",
                            boxShadow: "0 8px 18px rgba(255, 87, 34, 0.38)",
                          },
                        }}
                      >
                        View Product
                      </Button>

                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<ReceiptLongIcon sx={{ fontSize: 18 }} />}
                        sx={{
                          borderRadius: "30px",
                          py: 1.2,
                          textTransform: "none",
                          fontWeight: 700,
                          borderColor: "#e2e8f0",
                          color: "#475569",
                          "&:hover": {
                            borderColor: "#cbd5e1",
                            bgcolor: "#f8fafc",
                          },
                        }}
                      >
                        Contact Seller
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          );
        })}

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                "& .Mui-selected": {
                  background: "linear-gradient(135deg, #ff8a00 0%, #ff5722 100%) !important",
                  color: "#fff",
                },
              }}
            />
          </Box>
        )}

        {/* ================= PAGINATION INFO ================= */}
        {totalElements > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing page {currentPage} of {totalPages} • Total Orders: {totalElements}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default UserOrders;
