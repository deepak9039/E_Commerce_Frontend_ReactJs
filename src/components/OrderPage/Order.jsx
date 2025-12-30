import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { getUserAddresses, saveOrder, addUserAddress } from "../../services/apiService";

const Order = ({ user }) => {
  const location = useLocation();
  const { totalAmount, cartItems } = location.state || { totalAmount: 0, cartItems: [] };

  console.log("User in Order Page:", user);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });

  // Calculate order summary
  const subtotal = totalAmount;
  const tax = subtotal * 0.05; // 5% tax
  const delivery = 50; // Fixed delivery charge
  const total = subtotal + tax + delivery;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  /* ================= FETCH ADDRESSES ================= */
  const fetchAddresses = async () => {
      try {
        const res = await getUserAddresses(user.userId);
        const list = res?.addresses || [];

        setAddresses(list);

        // ✅ Select ONLY the first address by default
        if (list.length > 0) {
          setSelectedAddressId(String(list[0].addressId));
        } else {
          setSelectedAddressId("");
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setAddresses([]);
        setSelectedAddressId("");
      }
    };
  useEffect(() => {
    if (!user?.userId) return;
    fetchAddresses();
  }, [user?.userId]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async () => {
    const id = Date.now().toString(); // 🔑 keep ID as STRING

    const updatedAddresses = [...addresses, { ...newAddress, id }];
    setAddresses(updatedAddresses);
    setSelectedAddressId(id);

    setNewAddress({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
    });

    setOpenAddressForm(false);
    try {
      const payload = {
        addressLine: newAddress.address,
        city: newAddress.city,
        state: newAddress.state,
        address: newAddress.address,
        pinCode: newAddress.pinCode,
        country: "India",
        phoneNumber: newAddress.phoneNumber,
        userId: user?.userId
      };
      const res = await addUserAddress(payload);
      console.log("Address added successfully:", res);
      // Refresh address list
      fetchAddresses();
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleSaveorder = async () => {
    try {
      // 🔑 Find selected address object
      const selectedAddress = addresses.find(
        (addr) => String(addr.addressId) === String(selectedAddressId)
      );

      console.log("Selected Address ID:", selectedAddressId);
      console.log("Selected Address Object:", selectedAddress);

      if (!selectedAddress) {
        alert("Please select an address");
        return;
      }
      const orderPayload = {
        userId: user?.userId,
        paymentMethod: paymentMethod,
        firstName: selectedAddress.firstName || user?.userName,
        lastName: selectedAddress.lastName,
        email: selectedAddress.email || user?.email,
        phoneNumber: selectedAddress.phoneNumber,
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pinCode: selectedAddress.pinCode,
      };

      const res = await saveOrder(orderPayload);
      alert(res?.message || "Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  }

  /* ================= UI ================= */
  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Grid container spacing={2}>

        {/* 🔵 LEFT (9) */}
        <Grid size={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Select Delivery Address</Typography>
              <Divider sx={{ my: 1 }} />

              {addresses.length === 0 && (
                <Typography color="text.secondary">
                  No address found. Please add a new address.
                </Typography>
              )}

              {/* ✅ RADIO GROUP */}
              <RadioGroup
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
              >
                {addresses.map((addr) => (
                  <Box
                    key={addr.addressId}
                    sx={{
                      border: "1px solid #ddd",
                      borderRadius: 1,
                      p: 2,
                      mb: 2,
                    }}
                  >
                    <FormControlLabel
                      value={String(addr.addressId)}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography fontWeight="bold">
                            {addr.firstName} {addr.lastName}
                          </Typography>
                          <Typography variant="body2">
                            {addr.address}, {addr.city}, {addr.state} - {addr.pinCode}
                          </Typography>
                          <Typography variant="body2">
                            📞 {addr.phoneNumber}
                          </Typography>
                          <Typography variant="body2">
                            ✉ {addr.email}
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                ))}
              </RadioGroup>

              <Button
                variant="outlined"
                onClick={() => setOpenAddressForm(true)}
              >
                + Add New Address
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={5}>
          <Card>
            <CardContent>
              <Typography variant="h6">Select Payment Method</Typography>
              <Divider sx={{ my: 1 }} />

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="payment-method-label">
                  Payment Method
                </InputLabel>

                <Select
                  labelId="payment-method-label"
                  value={paymentMethod}
                  label="Payment Method"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <MenuItem value="CASH_ON_DELIVERY">
                    Cash on Delivery
                  </MenuItem>
                  <MenuItem value="UPI">
                    UPI
                  </MenuItem>
                  <MenuItem value="CREDIT_CARD">
                    Credit / Debit / ATM Card
                  </MenuItem>
                  <MenuItem value="EMI">
                    EMI
                  </MenuItem>
                </Select>
              </FormControl>

            </CardContent>
          </Card>
        </Grid>

        {/* 🟢 RIGHT (3) */}
        <Grid size={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Order Summary</Typography>
              <Divider sx={{ my: 1 }} />

              <Typography>Items: {totalItems}</Typography>
              <Typography>Subtotal: ₹{subtotal.toFixed(2)}</Typography>
              <Typography>Tax Charges: ₹{tax.toFixed(2)}</Typography>
              <Typography>Delivery Charges: ₹{delivery.toFixed(2)}</Typography>

              <Divider sx={{ my: 1 }} />

              <Typography fontWeight="bold">Total: ₹{total.toFixed(2)}</Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                disabled={!selectedAddressId}
                onClick={handleSaveorder}
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 🔴 ADD ADDRESS MODAL */}
      <Dialog
        open={openAddressForm}
        onClose={() => setOpenAddressForm(false)}
        fullWidth
      >
        <DialogTitle>Add New Address</DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField label="First Name" name="firstName" onChange={handleChange} />
          <TextField label="Last Name" name="lastName" onChange={handleChange} />
          <TextField label="Email" name="email" onChange={handleChange} />
          <TextField label="Phone Number" name="phoneNumber" onChange={handleChange} />
          <TextField label="Address" name="address" onChange={handleChange} />
          <TextField label="City" name="city" onChange={handleChange} />
          <TextField label="State" name="state" onChange={handleChange} />
          <TextField label="Pin Code" name="pinCode" onChange={handleChange} />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenAddressForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveAddress}>
            Save Address
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Order;
