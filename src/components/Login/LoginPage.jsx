import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { loginUser } from "../../services/apiService";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleLoginClick = async () => {
    
    if (!email || !password) {
      setError("email and Password are required");
      return;
    }

    const result = await handleLogin(email, password);


    if (result?.data?.status === "FAILED") {
      console.log("Login failed result:", result);
      setError(result?.data?.message || "Login failed. Please try again.");
      return;
    }

    setError("");
    setSuccess("");


    const loggedUser = result;
    console.log("Logged in user ======:", loggedUser, "+++++++",result.data);


    if (loggedUser?.role === "ROLE_ADMIN") {
      navigate("/admin");
    } else if (loggedUser?.role === "ROLE_USER") {
      navigate("/");
    }

  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{ mt: 5 }}
    >
      <Card sx={{ width: 380, borderRadius: 4, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" fontWeight="bold" mb={3}>
            User Login
          </Typography>

          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <TextField
              label="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleLoginClick}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#115293" },
              }}
            >
              Login
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
