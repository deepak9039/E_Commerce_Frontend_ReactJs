import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Stack,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { registerUser } from "../../services/apiService";
import registerImage from "../../../public/images/cash-register.png";

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
              Register
            </Typography>

            <Typography
              sx={{
                opacity: 0.92,
                lineHeight: 1.8,
                fontSize: 16,
              }}
            >
              Create your account and
              <br />
              start shopping with ease.
            </Typography>
          </Box>

          {/* Bottom Image */}
          <Box textAlign="center" sx={{ position: "relative", zIndex: 1 }}>
            <img
              src={registerImage}
              alt="register"
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
            <Box textAlign="center" mb={3}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "#eaf1ff",
                  color: "#2563eb",
                  mx: "auto",
                  mb: 1.5,
                }}
              >
                <Person fontSize="large" />
              </Avatar>

              <Typography
                sx={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}
              >
                Create Account
              </Typography>

              <Typography
                sx={{ color: "#64748b", fontSize: 14, mt: 0.5 }}
              >
                Register to continue
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {alertMessage && (
                  <Alert severity={alertType} sx={{ borderRadius: "10px" }}>
                    {alertMessage}
                  </Alert>
                )}

                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
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
                  type="submit"
                  variant="contained"
                  fullWidth
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
                  Create Account
                </Button>

                <Typography
                  sx={{ textAlign: "center", fontSize: 14, color: "#475569" }}
                >
                  Already have an account?{" "}
                  <Typography
                    component="a"
                    href="/signin"
                    sx={{
                      color: "#2563eb",
                      fontWeight: 700,
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Login
                  </Typography>
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};

export default UserPage;
