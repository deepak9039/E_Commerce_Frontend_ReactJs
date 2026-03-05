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
import { useLocation, useNavigate } from "react-router-dom";
import { getUserAddresses, saveOrder, addUserAddress } from "../../services/apiService";

const Order = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalAmount, cartItems , totalOrderDiscount} = location.state || { totalAmount: 0, cartItems: [], totalOrderDiscount: 0 };

  console.log("Order Page - Received from Cart:", { totalAmount, cartItems, totalOrderDiscount });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentError, setPaymentError] = useState(false);
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

  const subtotal = totalAmount;
  const discount = totalOrderDiscount;
  const tax = subtotal * 0.05;
  const delivery = subtotal < 1000 ? 50 : 0;
  const total = subtotal + tax + delivery;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const fetchAddresses = async () => {
    const res = await getUserAddresses(user.userId);
    const list = res?.addresses || [];
    setAddresses(list);
    if (list.length > 0) setSelectedAddressId(String(list[0].addressId));
  };

  useEffect(() => {
    if (user?.userId) fetchAddresses();
  }, [user?.userId]);

  const handleChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async () => {
    try {
      const payload = {
        addressLine: newAddress.address,
        city: newAddress.city,
        state: newAddress.state,
        address: newAddress.address,
        pinCode: newAddress.pinCode,
        country: "India",
        phoneNumber: newAddress.phoneNumber,
        userId: user?.userId,
      };
      await addUserAddress(payload);
      fetchAddresses();
      setOpenAddressForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveorder = async () => {

    if (!paymentMethod) {
    setPaymentError(true);
    return;
  }
    const selectedAddress = addresses.find(
      (addr) => String(addr.addressId) === String(selectedAddressId)
    );
    if (!selectedAddress) return alert("Please select address");

    const orderPayload = {
      userId: user?.userId,
      paymentMethod,
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
    // alert(res?.message || "Order placed!");

    console.log("ssss",res)
    if(res.status === "Success") {
      navigate("/order-success", { state: res });
      console.log("i amsuccess")
   }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Grid container spacing={3}>

        {/* LEFT – ADDRESS */}
        <Grid size={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">
                  Delivery Address
                </Typography>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setOpenAddressForm(true)}
                  sx={{ 
                        borderRadius: 2, 
                        backgroundColor: "#0f172a",
                        "&:hover": { backgroundColor: "#1e293b" },
                  }}
                  
                >
                  + Add
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <RadioGroup
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
              >
                {addresses.map((addr) => (
                  <Box
                    key={addr.addressId}
                    sx={{
                      border: selectedAddressId === String(addr.addressId)
                        ? "2px solid #1976d2"
                        : "1px solid #ddd",
                      borderRadius: 2,
                      p: 2,
                      mb: 2,
                      transition: "0.3s",
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
                          <Typography variant="body2">📞 {addr.phoneNumber}</Typography>
                        </Box>
                      }
                    />
                  </Box>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </Grid>

        {/* CENTER – PAYMENT */}
        <Grid size={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Payment Method
              </Typography>

              <Divider sx={{ my: 3 }} />

              <FormControl fullWidth error={paymentError}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  label="Payment Method"
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setPaymentError(false); // remove error once selected
                  }}
                  size="small"
                >
                  <MenuItem value="CASH_ON_DELIVERY">Cash on Delivery</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="CREDIT_CARD">Card</MenuItem>
                </Select>

                {paymentError && (
                  <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                    Please select a payment method
                  </Typography>
                )}
              </FormControl>

              {/* 🔽 CARD / UPI DETAILS */}
              {paymentMethod && paymentMethod !== "CASH_ON_DELIVERY" && (
                <Box mt={3} display="grid" gap={2}>
                  <Typography fontWeight="bold">Payment Details</Typography>

                  {paymentMethod === "CREDIT_CARD" && (
                    <>
                      <TextField size="small" label="Card Number" fullWidth />
                      <Box display="flex" gap={2}>
                        <TextField size="small" label="Expiry" fullWidth />
                        <TextField size="small" label="CVV" fullWidth />
                      </Box>
                      <TextField size="small" label="Card Holder Name" fullWidth />
                    </>
                  )}

                  {paymentMethod === "UPI" && (
                    <TextField label="UPI ID" fullWidth />
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT – SUMMARY */}
        {/* RIGHT – SUMMARY */}
<Grid size={4}>
  <Box
    sx={{
      p: 3,
      border: "1px solid #e5e7eb",
      borderRadius: 3,
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      position: "sticky",
      top: 20
    }}
  >
    {/* HEADER */}
    <Typography
      variant="subtitle1"
      sx={{
        fontWeight: 700,
        letterSpacing: 0.5,
        color: "#64748b",
        mb: 2
      }}
    >
      PRICE DETAILS
    </Typography>

    <Divider sx={{ mb: 2 }} />

    {/* ITEMS */}
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
      <Typography sx={{ color: "#475569" }}>
        Price ({totalItems} items)
      </Typography>

      <Typography fontWeight={500}>
        ₹ {subtotal}
      </Typography>
    </Box>

    {/* DISCOUNT */}
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
      <Typography sx={{ color: "#475569" }}>
        Discount
      </Typography>

      <Typography sx={{ color: "#16a34a", fontWeight: 600 }}>
        − ₹ {discount}
      </Typography>
    </Box>

    {/* TAX */}
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
      <Typography sx={{ color: "#475569" }}>
        Tax (5%)
      </Typography>

      <Typography>
        ₹ {tax.toFixed(2)}
      </Typography>
    </Box>

    {/* DELIVERY */}
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Typography sx={{ color: "#475569" }}>
        Delivery Charges
      </Typography>

      {delivery === 0 ? (
        <Typography sx={{ color: "#16a34a", fontWeight: 600 }}>
          FREE
        </Typography>
      ) : (
        <Typography>
          ₹ {delivery}
        </Typography>
      )}
    </Box>

    <Divider sx={{ mb: 2 }} />

    {/* TOTAL */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 2
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
        Total Amount
      </Typography>

      <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
        ₹ {total.toFixed(2)}
      </Typography>
    </Box>

    <Divider sx={{ mb: 2 }} />

    {/* SAVINGS */}
    <Box
      sx={{
        backgroundColor: "#ecfdf5",
        color: "#15803d",
        px: 2,
        py: 1.5,
        borderRadius: 2,
        fontWeight: 600,
        mb: 3,
        fontSize: 14
      }}
    >
      🎉 You saved ₹ {discount} on this order
    </Box>

    {/* PLACE ORDER */}
    <Button
      fullWidth
      sx={{
        backgroundColor: "#facc15",
        color: "#000",
        fontWeight: 700,
        py: 1.5,
        fontSize: 16,
        borderRadius: 2,
        "&:hover": {
          backgroundColor: "#eab308"
        }
      }}
      disabled={!selectedAddressId}
      onClick={handleSaveorder}
    >
      PLACE ORDER
    </Button>
  </Box>
</Grid>
      </Grid>

      {/* ADD ADDRESS DIALOG */}
      <Dialog open={openAddressForm} onClose={() => setOpenAddressForm(false)} fullWidth>
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2 }}>
          <TextField size="small" label="First Name" name="firstName" onChange={handleChange} />
          <TextField size="small" label="Last Name" name="lastName" onChange={handleChange} />
          <TextField size="small" label="Email" name="email" onChange={handleChange} />
          <TextField size="small" label="Phone Number" name="phoneNumber" onChange={handleChange} />
          <TextField size="small" label="Address" name="address" onChange={handleChange} />
          <TextField size="small" label="City" name="city" onChange={handleChange} />
          <TextField size="small" label="State" name="state" onChange={handleChange} />
          <TextField size="small" label="Pin Code" name="pinCode" onChange={handleChange} />
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
