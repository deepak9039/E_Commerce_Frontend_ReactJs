import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  Stack,
  Alert
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { registerUser } from "../../services/apiService";

const UserPage = () => {
  // ---- SIMPLE useState FOR EACH FIELD ----
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture] = useState("default.png"); // default only
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // ---- ALERT STATES ----
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  // ---- ADDRESSES ----
  const [addresses, setAddresses] = useState([
    { city: "", state: "", country: "", phoneNumber: "" },
  ]);

  const handleAddressChange = (index, field, value) => {
    const updated = [...addresses];
    updated[index][field] = value;
    setAddresses(updated);
  };

  const addAddress = () => {
    setAddresses([
      ...addresses,
      { city: "", state: "", country: "", phoneNumber: "" },
    ]);
  };

  const removeAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userJson = {
      userName,
      password,
      email,
      profilePicture,
      firstName,
      lastName,
      addresses,
    };

    console.log("Final Payload =>", userJson);

    try {

      const response = await registerUser(userJson);

      setAlertType("success");
      setAlertMessage(response);

    //   setTimeout(() => setAlertMessage(""), 3000);
    } catch (error) {
      console.log(error);

      setAlertType("error");
      setAlertMessage("Error creating user!");

    //   setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create User
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 3 }}>
        
        {/* ======= ALERT ON TOP ======= */}
        {alertMessage && (
          <Alert severity={alertType} variant="filled">
            {alertMessage}
          </Alert>
        )}

        {/* DEFAULT USER ICON — same place as before */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#e0e0e0",
              color: "#616161",
            }}
          >
            <Person sx={{ fontSize: 45 }} />
          </Avatar>
        </Stack>

        {/* USER INFORMATION */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* ADDRESS SECTION */}
        <Box>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Addresses
          </Typography>

          {addresses.map((address, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              sx={{
                mt: 2,
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
              }}
            >
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  value={address.city}
                  onChange={(e) =>
                    handleAddressChange(index, "city", e.target.value)
                  }
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="State"
                  value={address.state}
                  onChange={(e) =>
                    handleAddressChange(index, "state", e.target.value)
                  }
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Country"
                  value={address.country}
                  onChange={(e) =>
                    handleAddressChange(index, "country", e.target.value)
                  }
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  value={address.phoneNumber}
                  onChange={(e) =>
                    handleAddressChange(index, "phoneNumber", e.target.value)
                  }
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={() => removeAddress(index)}
                >
                  Remove Address
                </Button>
              </Grid>
            </Grid>
          ))}

          <Button variant="contained" sx={{ mt: 1 }} onClick={addAddress}>
            Add Address
          </Button>
        </Box>

        {/* SUBMIT */}
        <Button type="submit" variant="contained" color="success" sx={{ mt: 3 }}>
          Create User
        </Button>
      </Box>
    </Container>
  );
};

export default UserPage;
