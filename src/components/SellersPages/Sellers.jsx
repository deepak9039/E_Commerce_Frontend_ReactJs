import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Container,
  Avatar,
  Box,
  Button,
  Typography,
  Stack
} from "@mui/material";
import { Person } from "@mui/icons-material";

import { featchAllSellers } from "../../services/apiService";

const Sellers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      // const response = await getAllUsers();
      const response = await featchAllSellers();
      // DataGrid requires id field
      console.log("Fetched sellers:", response);
      const formatted = response?.sellers?.map((u, index) => ({ ...u, id: u.id || index }));
      setUsers(formatted);
    } catch (error) {
      console.log("Error fetching sellers:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = () => {
    console.log("Delete user coming soon");
  };

  // Table Columns
  const columns = [
    {
      field: "profilePicture",
      headerName: "Profile",
      width: 100,
      renderCell: () => (
        <Avatar sx={{ bgcolor: "#e0e0e0", color: "#616161" }}>
          <Person />
        </Avatar>
      )
    },
    {
      field: "userName",
      headerName: "Username",
      width: 150
    },
    {
      field: "email",
      headerName: "Seller Email",
      width: 200
    },
    {
      field: "firstName",
      headerName: "Seller First Name",
      width: 150
    },
    {
      field: "lastName",
      headerName: "Seller Last Name",
      width: 150
    },
    {
      field: "addresses",
      headerName: "Addresses",
      width: 200,
      renderCell: (params) => (
        <Box>
          {params.value?.map((a, i) => (
            <Typography variant="body2" key={i}>
              📍 {a.city}, {a.state}, {a.country} — 📞 {a.phoneNumber}
            </Typography>
          ))}
        </Box>
      )
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => alert("Edit user coming soon")}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Stack>
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Admin — Users Table
      </Typography>

      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
        />
      </Box>
    </Container>
  );
};

export default Sellers
