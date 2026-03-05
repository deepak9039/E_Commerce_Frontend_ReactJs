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
} from "@mui/material";
import { findOrdersByUserId } from "../../services/apiService";

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        My Orders
      </Typography>

      {orders.length === 0 && (
        <Typography color="text.secondary">
          You have not placed any orders yet.
        </Typography>
      )}

      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid size={12} key={order.id}>
            <Card>
              <CardContent>
                {/* ================= HEADER ================= */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    {/* <Typography variant="subtitle2" color="text.secondary">
                      Order ID: {order.orderId}
                    </Typography> */}
                    <Typography variant="subtitle2" color="text.secondary">
                      Order Date:{" "}
                      {new Date(order.orderDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                      
                  <Grid
                    item
                    xs={12}
                    md={4}
                    textAlign={{ xs: "left", md: "right" }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      
                        Payment Method:{" "}
                        {order.paymentMethod}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* ================= PRODUCT DETAILS ================= */}
                <Grid container spacing={2}>
                  <Grid size={3}>
                    <Box
                      component="img"
                      src={`http://localhost:1234/image/product/${order.product.productImageUrl}`}
                      alt={order.product.productName}
                      sx={{
                        width: "100%",
                        height: 100,
                        objectFit: "contain",
                        borderRadius: 1,
                      }}
                    />
                  </Grid>

                  <Grid size={4}>
                    <Typography fontSize={14}>
                      {order.product.productName}
                    </Typography>

                    {/* <Typography variant="body2" color="text.secondary">
                      Category: {order.product.categoryName}
                    </Typography> */}

                    {/* <Typography variant="body2" sx={{ mt: 1 }}>
                      {order.product.productDescription}
                    </Typography> */}

                    {/* <Typography sx={{ mt: 1 }}>
                      Quantity: <b>{order.quantity}</b>
                    </Typography> */}

                    <Typography sx={{py:1}}>
                      Price: ₹{order.price}
                    </Typography>
                      <Chip
                      label={order.status}
                      color={
                        order.status === "DELIVERED"
                          ? "success"
                          : order.status === "CANCELLED"
                          ? "error"
                          : "warning"
                      }
                    />
                    {/* <Typography fontWeight="bold">
                      Total: ₹{order.price * order.quantity}
                    </Typography> */}
                  </Grid>
                  {order.status === "DELIVERED" && (
                  <Grid size={4}>
                    <Typography
                      component={Link}
                      to="/productReview"
                      variant="body2"
                      sx={{
                        textDecoration: "none",
                        color: "primary.main",
                        fontWeight: 500,
                        "&:hover": {
                          textDecoration: "underline",
                        },
                        cursor: "pointer",
                      }}
                    >
                      Rate & Review Product
                    </Typography>
                  </Grid>
                  )
                  }
                  {/* ================= ADDRESS ================= */}
                  {/* <Grid size={4}>
                    <Typography fontWeight="bold">
                      Delivery Address
                    </Typography>
                    <Typography variant="body2">
                      {order.orderAddress.firstName}{" "}
                      {order.orderAddress.lastName}
                    </Typography>
                    <Typography variant="body2">
                      {order.orderAddress.address}
                    </Typography>
                    <Typography variant="body2">
                      {order.orderAddress.city},{" "}
                      {order.orderAddress.state}
                    </Typography>
                    <Typography variant="body2">
                      PIN: {order.orderAddress.pinCode}
                    </Typography>
                    <Typography variant="body2">
                      📞 {order.orderAddress.phoneNumber}
                    </Typography>
                  </Grid> */}
                </Grid>

                {/* <Divider sx={{ my: 2 }} /> */}

                {/* ================= FOOTER ================= */}
                {/* <Grid container>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      Payment Method:{" "}
                      <b>{order.paymentMethod}</b>
                    </Typography>
                  </Grid>
                </Grid> */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* ================= PAGINATION INFO ================= */}
      {totalElements > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing page {currentPage} of {totalPages} | Total Orders: {totalElements}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default UserOrders;
