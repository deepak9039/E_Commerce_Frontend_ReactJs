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
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserAddresses, saveOrder, addUserAddress } from "../../services/apiService";
import { processPayment } from "../../services/paymentService";

const Order = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalAmount, cartItems, totalOrderDiscount } = location.state || { totalAmount: 0, cartItems: [], totalOrderDiscount: 0 };

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
  // const total = subtotal + tax + delivery;
  const total = subtotal + delivery;
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

    // if (!paymentMethod) {
    //   setPaymentError(true);
    //   return;
    // }
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

    console.log("ssss", res)
    if (res.status === "Success") {
      // Pass order response along with all order details to Payment page
      navigate("/process-payment", { 
        state: {
          res,
          totalAmount,
          cartItems,
          totalOrderDiscount,
          selectedAddress,
          paymentMethod
        }
      });
      console.log("i amsuccess")
    }
  };

  return (
    <Box sx={{ minHeight: "calc(100vh - 72px)", bgcolor: "#f6f8fb", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            display: "flex",
            alignItems: { xs: "flex-start", md: "flex-end" },
            justifyContent: "space-between",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: "#0f172a",
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "2.6rem" },
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
              }}
            >
              Complete your order
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, fontSize: { xs: 15, md: 16 } }}>
              You are one step away. Choose a delivery address to continue.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.5,
              py: 0.8,
              borderRadius: 10,
              bgcolor: "#e0f2fe",
              color: "#0369a1",
              whiteSpace: "nowrap",
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 17 }} />
            <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1.1, textTransform: "uppercase" }}>
              Secure checkout
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3, color: "#64748b" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "#1976d2", fontWeight: 700 }}>
            <CheckCircleIcon fontSize="small" />
            Cart
          </Box>
          <Divider sx={{ width: 42 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "#0f172a", fontWeight: 700 }}>
            <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: "#0f172a", color: "white", display: "grid", placeItems: "center", fontSize: 12 }}>2</Box>
            Address
          </Box>
          <Divider sx={{ width: 42 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 14 }}>
            <Box sx={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid #cbd5e1", display: "grid", placeItems: "center", fontSize: 12 }}>3</Box>
            Payment
          </Box>
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* LEFT – ADDRESS */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)" }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <Box sx={{ width: 42, height: 42, display: "grid", placeItems: "center", borderRadius: 2, bgcolor: "#e0f2fe", color: "#0369a1" }}>
                      <LocalShippingOutlinedIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="800" color="#0f172a">
                        Delivery address
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Select an address for this order
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddressForm(true)}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, whiteSpace: "nowrap" }}
                  >
                    Add new
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <RadioGroup
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                >
                  {addresses.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 5, px: 2, border: "1px dashed #cbd5e1", borderRadius: 2.5, bgcolor: "#f8fafc" }}>
                      <LocalShippingOutlinedIcon sx={{ fontSize: 38, color: "#94a3b8", mb: 1 }} />
                      <Typography fontWeight={700} color="#334155">No saved addresses yet</Typography>
                      <Typography variant="body2" color="text.secondary">Add an address to continue with checkout.</Typography>
                    </Box>
                  )}
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === String(addr.addressId);
                    return (
                      <Box
                        key={addr.addressId}
                        sx={{
                          position: "relative",
                          border: isSelected ? "2px solid #1976d2" : "1px solid #e2e8f0",
                          borderRadius: 2.5,
                          p: { xs: 1.5, md: 2 },
                          mb: 2,
                          bgcolor: isSelected ? "#f0f9ff" : "#fff",
                          transition: "border-color 0.2s, background-color 0.2s, box-shadow 0.2s",
                          "&:hover": { borderColor: "#90caf9", boxShadow: "0 5px 16px rgba(15, 23, 42, 0.06)" },
                        }}
                      >
                        {isSelected && <CheckCircleIcon sx={{ position: "absolute", top: 14, right: 14, color: "#1976d2", fontSize: 20 }} />}
                        <FormControlLabel
                          value={String(addr.addressId)}
                          control={<Radio sx={{ alignSelf: "flex-start", mt: 0.25 }} />}
                          sx={{ alignItems: "flex-start", m: 0, width: "100%" }}
                          label={
                            <Box sx={{ pr: 3 }}>
                              <Typography fontWeight="800" color="#1e293b">
                                {addr.firstName} {addr.lastName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.65 }}>
                                {addr.address}, {addr.city}, {addr.state} - {addr.pinCode}
                              </Typography>
                              <Typography variant="body2" color="#475569" sx={{ mt: 0.75, fontWeight: 600 }}>
                                {addr.phoneNumber}
                              </Typography>
                            </Box>
                          }
                        />
                      </Box>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>
          </Grid>

        {/* CENTER – PAYMENT */}
        {/* <Grid size={4}>
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
                    setPaymentError(false);
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

              {paymentMethod && paymentMethod !== "CASH_ON_DELIVERY" && (
                <Box mt={3} display="grid" gap={2}>
                  <Typography fontWeight="bold">Payment Details</Typography>

                  {paymentMethod === "CREDIT_CARD" && (
                    <>
                      <TextField size="small" label="Card Number" fullWidth required/>
                      <Box display="flex" gap={2}>
                        <TextField size="small" label="Expiry" fullWidth required/>
                        <TextField size="small" label="CVV" fullWidth required />
                      </Box>
                      <TextField size="small" label="Card Holder Name" fullWidth required />
                    </>
                  )}

                  {paymentMethod === "UPI" && (
                    <TextField label="UPI ID" fullWidth required />
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid> */}

        {/* RIGHT – SUMMARY */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              p: { xs: 2.5, md: 3 },
              border: "1px solid #dbeafe",
              borderRadius: 3,
              background: "linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)",
              boxShadow: "0 10px 30px rgba(15,0,42,0.07)",
              position: "sticky",
              top: 92
            }}
          >
            {/* HEADER */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}>
              <ShoppingBagOutlinedIcon sx={{ color: "#1976d2" }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
                  Order summary
                </Typography>
                <Typography variant="caption" color="text.secondary">{totalItems} items in your bag</Typography>
              </Box>
            </Box>

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
            {/* <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
              <Typography sx={{ color: "#475569" }}>
                Tax (5%)
              </Typography>

              <Typography>
                ₹ {tax.toFixed(2)}
              </Typography>
            </Box> */}

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
                <Typography sx={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>
                Total Amount
              </Typography>

              <Typography sx={{ fontWeight: 800, fontSize: 20, color: "#0f172a" }}>
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
                fontSize: 14,
                border: "1px solid #bbf7d0"
              }}
            >
                You saved ₹ {discount} on this order
            </Box>

            {/* PLACE ORDER */}
            <Button
              fullWidth
              sx={{
                backgroundColor: "#f59e0b",
                color: "#fff",
                fontWeight: 700,
                py: 1.5,
                fontSize: 16,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "#d97706"
                }
              }}
              disabled={!selectedAddressId}
              onClick={handleSaveorder}
            >
              PLACE ORDER
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75, mt: 2, color: "#64748b" }}>
              <LockOutlinedIcon sx={{ fontSize: 15 }} />
              <Typography variant="caption">Safe and secure checkout</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* ADD ADDRESS DIALOG */}
      <Dialog open={openAddressForm} onClose={() => setOpenAddressForm(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800, color: "#0f172a", pb: 1 }}>Add new address</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: "8px !important" }}>
          <TextField size="small" label="First Name" name="firstName" onChange={handleChange} />
          <TextField size="small" label="Last Name" name="lastName" onChange={handleChange} />
          <TextField size="small" label="Email" name="email" onChange={handleChange} />
          <TextField size="small" label="Phone Number" name="phoneNumber" onChange={handleChange} />
          <TextField size="small" label="Address" name="address" onChange={handleChange} />
          <TextField size="small" label="City" name="city" onChange={handleChange} />
          <TextField size="small" label="State" name="state" onChange={handleChange} />
          <TextField size="small" label="Pin Code" name="pinCode" onChange={handleChange} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setOpenAddressForm(false)} sx={{ textTransform: "none", fontWeight: 700 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveAddress} sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
            Save Address
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </Box>
  );
};

export default Order;

