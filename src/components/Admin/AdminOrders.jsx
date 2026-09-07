import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getAllOrders, updateOrderStatus } from "../../services/apiService";
import { fetchAdminOrders } from "../../services/adminService";

const AdminOrders = ( { user }) => {
  const [orders, setOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const PAGE_SIZE = 50;

  console.log("AdminOrders component - Current User:", user);

  const handlePaginationModelChange = (newModel) => {
    const newPage = newModel.page;
    if (newPage !== page) {
      setPage(newPage);
      fetchOrders(newPage);
    }
  };

  const fetchOrders = async (pageNo = 0) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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

  const rows = orders.map((order) => ({
    id: order.orderId,
    orderId: order.orderId,
    userName: `${order.orderAddress?.firstName || ""} ${order.orderAddress?.lastName || ""}`.trim(),
    address: `${order.orderAddress?.address || ""}, ${order.orderAddress?.city || ""}, ${order.orderAddress?.state || ""} - ${order.orderAddress?.pinCode || ""}`,
    phone: order.orderAddress?.phoneNumber || "",
    email: order.orderAddress?.email || "",
    orderDate: order.orderDate,
    productName: order.product?.productName || "",
    quantity: order.quantity,
    price: order.price,
    total: order.price * order.quantity,
    status: order.status,
  }));

  const columns = [
    { field: "orderId", headerName: "ID", width: 90 },
    {
      field: "userName",
      headerName: "User",
      width: 170,
      renderCell: (params) => (
        <Box sx={{ py: 1, width: '100%' }}>
          <Typography fontWeight="bold" sx={{ wordBreak: 'break-word' }}>{params.value}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
            {params.row.phone}
          </Typography>
        </Box>
      ),
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      minWidth: 230,
      maxWidth: 320,
      renderCell: (params) => (
        <Box sx={{ py: 1, width: '100%' }}>
          <Typography variant="body2" sx={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>{params.value}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
            {params.row.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: "orderDate",
      headerName: "Order Date",
      width: 140,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "productName",
      headerName: "Product",
      width: 200,
      renderCell: (params) => <Typography sx={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>{params.value}</Typography>,
    },
    {
      field: "quantity",
      headerName: "Qty",
      width: 90,
      renderCell: (params) => <Typography>{params.value}</Typography>,
    },
    {
      field: "price",
      headerName: "Price",
      width: 110,
      renderCell: (params) => <Typography>₹{params.value}</Typography>,
    },
    {
      field: "total",
      headerName: "Total",
      width: 110,
      renderCell: (params) => <Typography fontWeight="bold">₹{params.value}</Typography>,
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: (params) => (
        <Select
          size="small"
          fullWidth
          value={orderStatuses[params.row.orderId] || params.value}
          onChange={(e) => handleStatusChange(params.row.orderId, e.target.value)}
          disabled={!(user && user.role === "ROLE_SUPER_ADMIN")}
        >
          <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
          <MenuItem value="ORDER_RECE">ORDER_RECEIVED</MenuItem>
          <MenuItem value="PRODUCT_PACK">PRODUCT_PACKED</MenuItem>
          <MenuItem value="OUT_FOR_DEL">OUT_FOR_DEL</MenuItem>
          <MenuItem value="DELIVERED">DELIVERED</MenuItem>
          <MenuItem value="CANCEL">CANCELLED</MenuItem>
        </Select>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        user && user.role === "ROLE_SUPER_ADMIN" ? (
          <Button
            variant="contained"
            size="small"
            onClick={() => handleUpdateClick(params.row.orderId)}
          >
            Update
          </Button>
        ) : null
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 5 }}>
      {/* <Typography variant="h5" fontWeight="bold" gutterBottom>
        Admin – All Orders
      </Typography> */}

      <Box sx={{ height: 700, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          rowCount={totalPages > 0 ? totalPages * PAGE_SIZE : orders.length}
          paginationMode="server"
          paginationModel={{ page, pageSize: PAGE_SIZE }}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[PAGE_SIZE]}
          disableRowSelectionOnClick
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              fontWeight: 600,
            },
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              alignItems: 'flex-start',
              py: 1.2,
            },
            '& .MuiDataGrid-root': {
              overflow: 'auto',
            },
          }}
        />
      </Box>
    </Container>
  );
};

export default AdminOrders;
