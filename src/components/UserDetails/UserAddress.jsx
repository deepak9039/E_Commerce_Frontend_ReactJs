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
} from "@mui/material";
import { userAddress } from "../../services/apiService";

/*
EXPECTED API RESPONSE:
{
  status: "Success",
  addresses: [ {...} ]
}
*/

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
    setSelectedAddress({ ...address }); // clone object
  };

  const handleChange = (e) => {
    setSelectedAddress({
      ...selectedAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateAddress = async () => {
    try {
      await updateUserAddress(selectedAddress.addressId, selectedAddress);
      alert("Address updated successfully!");

      // Update local list
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.addressId === selectedAddress.addressId
            ? selectedAddress
            : addr
        )
      );

      setSelectedAddress(null);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update address");
    }
  };

  /* ================= UI ================= */
  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        My Addresses
      </Typography>

      {/* ================= ADDRESS LIST ================= */}
      <Grid container spacing={2}>
        {addresses.map((addr) => (
          <Grid item xs={12} key={addr.addressId}>
            <Card
              sx={{
                cursor: "pointer",
                border:
                  selectedAddress?.addressId === addr.addressId
                    ? "2px solid #1976d2"
                    : "1px solid #ddd",
              }}
              onClick={() => handleSelectAddress(addr)}
            >
              <CardContent>
                <Typography fontWeight="bold">
                  {addr.addressLine || "Address"}
                </Typography>
                <Typography variant="body2">
                  {addr.address || "-"}, {addr.city}, {addr.state}
                </Typography>
                <Typography variant="body2">
                  {addr.country} - {addr.pinCode || "-"}
                </Typography>
                <Typography variant="body2">
                  📞 {addr.phoneNumber}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= EDIT FORM ================= */}
      {selectedAddress && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Update Address
          </Typography>

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

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateAddress}
            >
              Update Address
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setSelectedAddress(null)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default UserAddress;
