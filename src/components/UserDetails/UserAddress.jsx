import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Box,
  Divider,
  Paper,
} from "@mui/material";
import { userAddress, updateUserAddress } from "../../services/apiService";

const emptyAddress = {
  addressLine: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pinCode: "",
  phoneNumber: "",
};

const UserAddress = ({ user }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  /* ================= FETCH ADDRESSES ================= */
  useEffect(() => {
    if (!user?.userId) return;

    const fetchAddresses = async () => {
      try {
        const res = await userAddress(user?.userId);
        setAddresses(res?.addresses || []);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [user?.userId]);

  /* ================= HANDLERS ================= */
  const handleSelectAddress = (address) => {
    setSelectedAddress({ ...address });
  };

  const handleAddNew = () => {
    setSelectedAddress({ ...emptyAddress });
  };

  const handleChange = (e) => {
    setSelectedAddress({
      ...selectedAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateAddress = async () => {
    try {
      const payload = {
        addressId: selectedAddress.addressId,
        addressLine: selectedAddress.addressLine,
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: selectedAddress.state,
        country: selectedAddress.country,
        pinCode: selectedAddress.pinCode,
        phoneNumber: selectedAddress.phoneNumber,
        userId: user.userId,
      };

      await updateUserAddress(payload);
      alert("Address saved successfully!");

      setAddresses((prev) =>
        selectedAddress.addressId
          ? prev.map((addr) =>
              addr.addressId === selectedAddress.addressId
                ? selectedAddress
                : addr
            )
          : prev
      );

      setSelectedAddress(null);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to save address");
    }
  };

  /* ================= UI ================= */
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* ===== HEADER ===== */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h5" fontWeight="bold">
          My Addresses
        </Typography>

        <Button
          variant="contained"
          onClick={handleAddNew}
          sx={{
            backgroundColor: "#0f172a",
            "&:hover": { backgroundColor: "#1e293b" },
          }}
        >
          + Add Address
        </Button>
      </Box>

      {/* ===== ADDRESS LIST ===== */}
      <Grid container spacing={3}>
        {addresses.map((addr) => (
          <Grid size={6} key={addr.addressId}>
            <Card
              onClick={() => handleSelectAddress(addr)}
              sx={{
                cursor: "pointer",
                height: "100%",
                borderRadius: 3,
                border:
                  selectedAddress?.addressId === addr.addressId
                    ? "2px solid #1976d2"
                    : "1px solid #e5e7eb",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Typography fontWeight="bold" gutterBottom>
                  {addr.addressLine || "Saved Address"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {addr.address || "-"}, {addr.city}, {addr.state}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {addr.country} - {addr.pinCode || "-"}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  📞 {addr.phoneNumber}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ===== FORM ===== */}
      {selectedAddress && (
        <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {selectedAddress.addressId ? "Update Address" : "Add New Address"}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Address Line"
                name="addressLine"
                value={selectedAddress.addressLine || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={selectedAddress.address || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="City"
                name="city"
                value={selectedAddress.city || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="State"
                name="state"
                value={selectedAddress.state || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Country"
                name="country"
                value={selectedAddress.country || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Pin Code"
                name="pinCode"
                value={selectedAddress.pinCode || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={selectedAddress.phoneNumber || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>

          <Box mt={4} display="flex" gap={2}>
            <Button
              variant="contained"
              onClick={handleUpdateAddress}
              sx={{
                backgroundColor: "#0f172a",
                "&:hover": { backgroundColor: "#1e293b" },
              }}
            >
              Save Address
            </Button>

            <Button
              variant="outlined"
              onClick={() => setSelectedAddress(null)}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default UserAddress;
