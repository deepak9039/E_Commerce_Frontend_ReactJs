import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { getAllOrders, updateOrderStatus } from "../../services/apiService";
import { fetchAdminOrders } from "../../services/adminService";

const AdminOrders = ( { user }) => {
  const [orders, setOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 50;

  console.log("AdminOrders component - Current User:", user);

  const handlePageChange = (event, value) => {
    const newPage = value - 1;
    fetchOrders(newPage);
  };

  const fetchOrders = async (pageNo = 0) => {
    try {
      const payload = {
        page: pageNo,
        pageSize: PAGE_SIZE,
      };

      if (user && user.role === "ROLE_SUPER_ADMIN") {

      const res = await getAllOrders(payload);
      console.log("All Orders Response:", res);
      setOrders(res.orders || []);
      setPage(res.currentPage || 0);
      setTotalPages(res.totalPages || 0);

      }
      else{
      const res = await fetchAdminOrders(payload);
      console.log("Admin Orders Response:", res);
      setOrders(res.orders || []);
      setPage(res.currentPage || 0);
      setTotalPages(res.totalPages || 0);
      }

      // const res = await getAllOrders(payload);
      // const adminOrdersRes = await fetchAdminOrders(payload);
      // console.log("Admin Orders Response:", adminOrdersRes);

      // setOrders(res.orders || []);
      // setPage(res.currentPage || 0);
      // setTotalPages(res.totalPages || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setOrderStatuses(prev => ({
      ...prev,
      [orderId]: newStatus
    }));
  };

  const handleUpdateClick = async (orderId) => {
    const status = orderStatuses[orderId];
    if (!status) {
      alert("Please select a status first");
      return;
    }

    try {
      const payload = {
        orderId: orderId,
        status: status
      };
      const res = await updateOrderStatus(payload);
      console.log("Order status updated:", res);
      alert("Order status updated successfully!");
      
      // Refresh orders to get updated data
      const fetchOrders = async () => {
        try {
          const res = await getAllOrders();
          setOrders(res.orders || []);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 5}}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Admin – All Orders
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          {/* ================= TABLE HEADER ================= */}
          <TableHead>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>User</b></TableCell>
              <TableCell><b>Address</b></TableCell>
              <TableCell><b>Order Date</b></TableCell>
              <TableCell><b>Price Details</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>

          {/* ================= TABLE BODY ================= */}
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                {/* ID */}
                <TableCell>{order.id}</TableCell>

                {/* USER + ADDRESS */}
                <TableCell>
                  <Typography fontWeight="bold">
                    {order.orderAddress.firstName}{" "}
                    {order.orderAddress.lastName}
                  </Typography>

                </TableCell>
                <TableCell>
                  

                  <Typography variant="body2">
                    {order.orderAddress.address},{" "}
                    {order.orderAddress.city},{" "}
                  </Typography>
                  <Typography>

                    {order.orderAddress.state} -{" "}
                    {order.orderAddress.pinCode}
                  </Typography>

                  <Typography variant="body2">
                    📞 {order.orderAddress.phoneNumber}
                  </Typography>

                  <Typography variant="body2">
                    ✉ {order.orderAddress.email}
                  </Typography>
                </TableCell>

                {/* DATE */}
                <TableCell>
                  {new Date(order.orderDate).toLocaleDateString()}
                </TableCell>

                {/* PRICE */}

                <TableCell>
                  <Typography>{order.product.productName}</Typography>
                  <Typography>Qty: {order.quantity}</Typography>
                  <Typography>Price: ₹{order.price}</Typography>
                  <Typography fontWeight="bold">
                    Total: ₹{order.price * order.quantity}
                  </Typography>
                </TableCell>

                {/* STATUS DROPDOWN */}
                <TableCell>
                  {/* Only SUPER_ADMIN can change status; ROLE_ADMIN sees disabled control */}
                  <Select
                    size="small"
                    fullWidth
                    value={orderStatuses[order.orderId] || order.status}
                    onChange={(e) =>
                      handleStatusChange(order.orderId, e.target.value)
                    }
                    disabled={!(user && user.role === "ROLE_SUPER_ADMIN")}
                  >
                    <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                    <MenuItem value="ORDER_RECE">ORDER_RECEIVED</MenuItem>
                    <MenuItem value="PRODUCT_PACK">PRODUCT_PACKED</MenuItem>
                    <MenuItem value="OUT_FOR_DEL">OUT_FOR_DEL</MenuItem>
                    <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                    <MenuItem value="CANCEL">CANCELLED</MenuItem>
                  </Select>
                </TableCell>

                {/* ACTION */}
                <TableCell>
                  {user && user.role === "ROLE_SUPER_ADMIN" && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleUpdateClick(order.orderId)}
                    >
                      Update
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default AdminOrders;
