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
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
      setError(result?.data?.message || "Login failed. Please try again.");
      return;
    }

    setError("");
    setSuccess("");

    const loggedUser = result;

    if (loggedUser?.role === "ROLE_ADMIN") {
      navigate("/admin");
    } else if (loggedUser?.role === "ROLE_USER") {
      navigate("/");
    }
  };

  return (
    <Box
      minHeight="70vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
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
                bgcolor: "primary.main",
                mx: "auto",
                mb: 1,
              }}
            >
              <LockOutlinedIcon fontSize="large" />
            </Avatar>

            <Typography
              variant="h5"
              fontWeight="bold"
              color="primary.main"
            >
              Welcome Back
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Login to your account
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
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
                py: 1.3,
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 3,
              }}
            >
              Login
            </Button>

            <Typography variant="body2" textAlign="center">
              Don’t have an account?{" "}
              <Typography
                component="a"
                href="/register"
                sx={{
                  color: "primary.main",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Register
              </Typography>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
