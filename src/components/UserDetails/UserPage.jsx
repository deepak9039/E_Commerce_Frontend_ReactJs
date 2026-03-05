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
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { registerUser } from "../../services/apiService";

const UserPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture] = useState("default.png");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const [addresses, setAddresses] = useState([
    { city: "", state: "", country: "", phoneNumber: "" },
  ]);

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

    try {
      const response = await registerUser(userJson);
      setAlertType("success");
      setAlertMessage(response);
    } catch (error) {
      setAlertType("error");
      setAlertMessage("Error creating user!");
    }
  };

  return (
    <Box
      minHeight="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: "#f4f6f8" }}
    >
      <Card sx={{ width: 420, borderRadius: 4, boxShadow: 4 }}>
        <CardContent sx={{ p: 4 }}>
          {/* ===== HEADER (STYLE ONLY) ===== */}
          <Box textAlign="center" mb={3}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#0f172a",
                mx: "auto",
                mb: 1,
              }}
            >
              <Person fontSize="large" />
            </Avatar>

            <Typography
              variant="h5"
              fontWeight="bold"
            >
              Create Account
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Register to continue
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {alertMessage && (
                <Alert severity={alertType} variant="filled">
                  {alertMessage}
                </Alert>
              )}

              <TextField
                label="Email"
                type="email"
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                size="small"
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                color="primary"
                sx={{
                  backgroundColor: "#0f172a",
                  "&:hover": { backgroundColor: "#1e293b" },
                }}
              >
                Create Account
              </Button>

              <Typography variant="body2" textAlign="center">
                Already have an account?{" "}
                <Typography
                  component="a"
                  href="/signin"
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  Login
                </Typography>
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserPage;
