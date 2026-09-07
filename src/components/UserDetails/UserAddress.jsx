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
  Chip,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import PlaceIcon from "@mui/icons-material/Place";
import PhoneIcon from "@mui/icons-material/Phone";
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

// Purely presentational helper — picks an icon based on the label text.
// Does not affect data/logic, only which icon is rendered on a card.
const getAddressIcon = (label) => {
  const normalized = (label || "").toLowerCase();
  if (normalized.includes("home")) return HomeIcon;
  if (normalized.includes("work") || normalized.includes("office")) return WorkIcon;
  return PlaceIcon;
};

// Presentational only — builds the "City, State" / "Country - PIN" lines
// and falls back to a muted placeholder instead of a bare "-" when a
// field is empty. Does not touch any address data.
const formatLine = (parts) => parts.filter(Boolean).join(", ");

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
    <Box sx={{ minHeight: "calc(100vh - 72px)", bgcolor: "#F7F6F3", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        {/* ===== HEADER ===== */}
        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ color: "#1C1B19", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.4px" }}
            >
              Your addresses
            </Typography>
            <Typography sx={{ mt: 0.75, fontSize: 15, color: "#6B6862" }}>
              Manage where your orders get delivered
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{
              bgcolor: "#1C1B19",
              color: "#fff",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              py: 1,
              boxShadow: "none",
              "&:hover": { bgcolor: "#33312D", boxShadow: "none" },
            }}
          >
            Add address
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* ===== LEFT SIDE - ADDRESS LIST ===== */}
          <Grid size={{ xs: 12, md: 6.5 }}>
            {addresses.length > 0 && (
              <Typography sx={{ mb: 1.5, fontSize: 13, fontWeight: 600, color: "#9A968D" }}>
                {addresses.length} saved {addresses.length === 1 ? "address" : "addresses"}
              </Typography>
            )}

            {addresses.length === 0 ? (
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px dashed #D8D4CA",
                  bgcolor: "transparent",
                  boxShadow: "none",
                }}
              >
                <CardContent sx={{ py: 7, textAlign: "center" }}>
                  <LocationOnIcon sx={{ fontSize: 30, color: "#B5B0A3", mb: 1.5 }} />
                  <Typography sx={{ fontWeight: 700, color: "#1C1B19", fontSize: 17 }}>
                    No addresses yet
                  </Typography>
                  <Typography sx={{ mt: 0.75, mb: 3, color: "#8A8578", maxWidth: 300, mx: "auto", fontSize: 14 }}>
                    Add your first delivery address to speed through checkout next time
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddNew}
                    sx={{
                      bgcolor: "#1C1B19",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      px: 3,
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#33312D" },
                    }}
                  >
                    Add address
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                {addresses.map((addr, index) => {
                  const isSelected = selectedAddress?.addressId === addr.addressId;
                  const AddressIcon = getAddressIcon(addr.addressLine);
                  const isDefault = index === 0;

                  return (
                    <Card
                      key={addr.addressId}
                      onClick={() => handleSelectAddress(addr)}
                      sx={{
                        cursor: "pointer",
                        borderRadius: 3,
                        border: isSelected ? "1.5px solid #1C1B19" : "1px solid #EAE7DF",
                        bgcolor: "#fff",
                        boxShadow: "none",
                        transition: "border-color 0.15s ease, background-color 0.15s ease",
                        "&:hover": {
                          borderColor: "#1C1B19",
                          bgcolor: "#FAF9F6",
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          py: 2,
                          px: 2.25,
                          "&:last-child": { pb: 2 },
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.75,
                        }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            bgcolor: isSelected ? "#1C1B19" : "#F1EFE9",
                            color: isSelected ? "#fff" : "#6B6862",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                          }}
                        >
                          <AddressIcon sx={{ fontSize: 18 }} />
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: "#1C1B19",
                                fontSize: 15,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: 220,
                              }}
                            >
                              {addr.addressLine || "Untitled address"}
                            </Typography>
                            {isDefault && (
                              <Chip
                                label="Default"
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: 11,
                                  fontWeight: 600,
                                  bgcolor: "#EFEAE0",
                                  color: "#6B6350",
                                }}
                              />
                            )}
                          </Box>

                          <Typography sx={{ fontSize: 13.5, color: "#5B584F", lineHeight: 1.55 }}>
                            {addr.address || "No street address added"}
                          </Typography>
                          <Typography sx={{ fontSize: 13.5, color: "#5B584F", lineHeight: 1.55 }}>
                            {formatLine([addr.city, addr.state, addr.pinCode]) || "No location details"}
                          </Typography>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 1 }}>
                            <PhoneIcon sx={{ fontSize: 13, color: "#9A968D" }} />
                            <Typography sx={{ fontSize: 12.5, color: "#8A8578", fontWeight: 500 }}>
                              {addr.phoneNumber || "No phone number added"}
                            </Typography>
                          </Box>
                        </Box>

                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectAddress(addr);
                          }}
                          sx={{ color: "#9A968D", mt: 0.25 }}
                        >
                          {isSelected ? <EditIcon sx={{ fontSize: 18 }} /> : <ChevronRightIcon sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Grid>

          {/* ===== RIGHT SIDE - EDIT FORM ===== */}
          <Grid size={{ xs: 12, md: 5.5 }}>
            {selectedAddress ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3.5 },
                  borderRadius: 3,
                  border: "1px solid #EAE7DF",
                  bgcolor: "#ffffff",
                  position: "sticky",
                  top: 92,
                }}
              >
                <Box sx={{ mb: 2.5 }}>
                  <Typography sx={{ fontWeight: 700, color: "#1C1B19", fontSize: 17 }}>
                    {selectedAddress.addressId ? "Edit address" : "New address"}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#8A8578", mt: 0.25 }}>
                    {selectedAddress.addressId
                      ? "Update the details below"
                      : "Fill in the details to save a new address"}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2.75, borderColor: "#EAE7DF" }} />

                <Box sx={{ display: "grid", gap: 2 }}>
                  <TextField
                    label="Address label"
                    placeholder="e.g., Home, Work"
                    name="addressLine"
                    value={selectedAddress.addressLine || ""}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PlaceIcon sx={{ fontSize: 18, color: "#B5B0A3" }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Street address"
                    placeholder="House no., building, street, area"
                    name="address"
                    value={selectedAddress.address || ""}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                  />

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                      label="City"
                      placeholder="City"
                      name="city"
                      value={selectedAddress.city || ""}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="State"
                      placeholder="State"
                      name="state"
                      value={selectedAddress.state || ""}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                      label="Country"
                      placeholder="Country"
                      name="country"
                      value={selectedAddress.country || ""}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Postal code"
                      placeholder="Postal code"
                      name="pinCode"
                      value={selectedAddress.pinCode || ""}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                    />
                  </Box>

                  <TextField
                    label="Phone number"
                    placeholder="10-digit mobile number"
                    name="phoneNumber"
                    value={selectedAddress.phoneNumber || ""}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ fontSize: 18, color: "#B5B0A3" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box mt={3.5} display="flex" gap={1.5} flexDirection="column">
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleUpdateAddress}
                    sx={{
                      bgcolor: "#1C1B19",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      py: 1.2,
                      fontSize: 15,
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#33312D", boxShadow: "none" },
                    }}
                  >
                    {selectedAddress.addressId ? "Save changes" : "Save address"}
                  </Button>

                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => setSelectedAddress(null)}
                    sx={{
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      py: 1.2,
                      color: "#6B6862",
                      "&:hover": { bgcolor: "#F1EFE9" },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Paper>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: "1px dashed #D8D4CA",
                  textAlign: "center",
                  position: "sticky",
                  top: 92,
                }}
              >
                <EditIcon sx={{ fontSize: 26, color: "#B5B0A3", mb: 1.5 }} />
                <Typography sx={{ fontWeight: 700, color: "#1C1B19", fontSize: 15 }}>
                  Select an address
                </Typography>
                <Typography sx={{ mt: 1, color: "#8A8578", fontSize: 13, maxWidth: 260, mx: "auto" }}>
                  Choose any address on the left to edit it, or add a new one
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserAddress;
