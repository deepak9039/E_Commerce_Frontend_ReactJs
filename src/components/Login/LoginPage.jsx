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
          backgroundColor: "#f1f3f6",
          p: 2,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 900,
            minHeight: 550,
            display: "flex",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 4,
          }}
        >
          {/* LEFT SIDE */}
          <Box
            sx={{
              width: "38%",
              background: "linear-gradient(180deg, #0f172a, #1e293b)",
              color: "#fff",
              p: 5,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                mb={2}
              >
                Login
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  lineHeight: 1.8,
                }}
              >
                Get access to your Orders,
                <br />
                Wishlist and Recommendations
              </Typography>
            </Box>

            {/* Bottom Image */}
            <Box textAlign="center">
              <img
                src={loginImage}
                alt="login"
                style={{
                  width: "80%",
                  objectFit: "contain",
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
              p: 5,
            }}
          >
            <CardContent sx={{ width: "100%", maxWidth: 420 }}>
              <Stack spacing={3}>
                {error && <Alert severity="error">{error}</Alert>}
                {success && (
                  <Alert severity="success">{success}</Alert>
                )}

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="#0f172a"
                  textAlign="center"
                >
                  Welcome Back
                </Typography>

                <Typography
                  variant="body2"
                  textAlign="center"
                  color="text.secondary"
                >
                  Login to continue
                </Typography>

                <TextField
                  label="Email"
                  variant="standard"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                  label="Password"
                  type="password"
                  variant="standard"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  By continuing, you agree to our{" "}
                  <span
                    style={{
                      color: "#0f172a",
                      fontWeight: 600,
                    }}
                  >
                    Terms of Use
                  </span>{" "}
                  and{" "}
                  <span
                    style={{
                      color: "#0f172a",
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
                    backgroundColor: "#0f172a",
                    py: 1.5,
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#1e293b",
                    },
                  }}
                >
                  Login
                </Button>

                <Typography
                  variant="body2"
                  textAlign="center"
                >
                  Don’t have an account?{" "}
                  <Typography
                    component="a"
                    href="/register"
                    sx={{
                      color: "#0f172a",
                      fontWeight: "bold",
                      textDecoration: "none",
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