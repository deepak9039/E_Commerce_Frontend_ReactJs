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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../Message/AlertMessage";
import loginImage from "../../../public/images/hacker.png";

const LoginPage = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleLoginClick = async () => {
    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    const result = await handleLogin(email, password);

    console.log("handle login resp", result);

    if (result?.status === "FAILED") {
      setError(result?.message || "Login failed. Please try again.");
      return;
    }

    setError("");
    setSuccess("");

    const loggedUser = result;

    if (loggedUser?.role === "ROLE_ADMIN") {
      navigate("/admin");
    } else if (loggedUser?.role === "ROLE_SUPER_ADMIN") {
      navigate("/admin");
    } else if (loggedUser?.role === "ROLE_USER") {
      navigate("/");
    }
  };

  return (
    <Box>
      <AlertMessage />

      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "#f5f7fa",
          p: 2,
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 900,
            minHeight: 550,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            boxShadow: "0 24px 60px rgba(15,23,42,0.12)",
          }}
        >
          {/* LEFT SIDE */}
          <Box
            sx={{
              width: { xs: "100%", md: "38%" },
              background: "linear-gradient(160deg, #2563eb 0%, #1d4ed8 55%, #1e3a8a 100%)",
              color: "#fff",
              p: 5,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* soft glow accents */}
            <Box
              sx={{
                position: "absolute",
                width: 220,
                height: 220,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.10)",
                top: -70,
                right: -70,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
                bottom: 100,
                left: -60,
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                sx={{ fontSize: { xs: 32, md: 38 }, fontWeight: 800, mb: 1.5 }}
              >
                Login
              </Typography>

              <Typography
                sx={{
                  opacity: 0.92,
                  lineHeight: 1.8,
                  fontSize: 16,
                }}
              >
                Get access to your Orders,
                <br />
                Wishlist and Recommendations
              </Typography>
            </Box>

            {/* Bottom Image */}
            <Box textAlign="center" sx={{ position: "relative", zIndex: 1 }}>
              <img
                src={loginImage}
                alt="login"
                style={{
                  width: "78%",
                  objectFit: "contain",
                  filter: "drop-shadow(0 16px 30px rgba(0,0,0,0.28))",
                }}
              />
            </Box>
          </Box>

          {/* RIGHT SIDE */}
          <Box
            sx={{
              flex: 1,
              bgcolor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 3, md: 5 },
            }}
          >
            <CardContent sx={{ width: "100%", maxWidth: 420 }}>
              <Stack spacing={3}>
                {error && (
                  <Alert severity="error" sx={{ borderRadius: "10px" }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ borderRadius: "10px" }}>
                    {success}
                  </Alert>
                )}

                <Box textAlign="center">
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: "50%",
                      backgroundColor: "#eaf1ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 1.5,
                    }}
                  >
                    <LockOutlinedIcon sx={{ color: "#2563eb", fontSize: 26 }} />
                  </Box>

                  <Typography
                    sx={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}
                  >
                    Welcome Back
                  </Typography>

                  <Typography
                    sx={{ color: "#64748b", fontSize: 14, mt: 0.5 }}
                  >
                    Login to continue
                  </Typography>
                </Box>

                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
                  }}
                />

                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
                  }}
                />

                <Typography
                  sx={{ color: "#64748b", fontSize: 12.5, lineHeight: 1.7 }}
                >
                  By continuing, you agree to our{" "}
                  <span
                    style={{
                      color: "#2563eb",
                      fontWeight: 600,
                    }}
                  >
                    Terms of Use
                  </span>{" "}
                  and{" "}
                  <span
                    style={{
                      color: "#2563eb",
                      fontWeight: 600,
                    }}
                  >
                    Privacy Policy
                  </span>
                  .
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleLoginClick}
                  sx={{
                    backgroundColor: "#2563eb",
                    py: 1.4,
                    fontSize: "15px",
                    fontWeight: 700,
                    borderRadius: "10px",
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#1d4ed8",
                      boxShadow: "0 10px 24px rgba(37,99,235,0.32)",
                    },
                  }}
                >
                  Login
                </Button>

                <Typography
                  sx={{ textAlign: "center", fontSize: 14, color: "#475569" }}
                >
                  Don’t have an account?{" "}
                  <Typography
                    component="a"
                    href="/register"
                    sx={{
                      color: "#2563eb",
                      fontWeight: 700,
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Register
                  </Typography>
                </Typography>
              </Stack>
            </CardContent>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;
