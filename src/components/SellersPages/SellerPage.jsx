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
import { createSeller } from "../../services/adminService";
import storeImage from "../../../public/images/store.png";

const SellerPage = () => {
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
      const response = await createSeller(userJson);
      setAlertType("success");
      setAlertMessage(response);
    } catch (error) {
      setAlertType("error");
      setAlertMessage(
        error?.response?.data || "Error creating seller!"
      );
    }
  };

  return (
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
              Sell Online
            </Typography>

            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                lineHeight: 1.8,
              }}
            >
              Join us as a seller and
              <br />
              start growing your business.
            </Typography>
          </Box>

          {/* Bottom Image */}
          <Box textAlign="center">
            <img
              src={storeImage}
              alt="seller"
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
                color="#0f172a"
              >
                Become a Seller
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Register to start selling
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {alertMessage && (
                  <Alert severity={alertType}>
                    {alertMessage.message || alertMessage}
                  </Alert>
                )}

                <TextField
                  label="Email"
                  type="email"
                  variant="standard"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  fullWidth
                  required
                />

                <TextField
                  label="Password"
                  type="password"
                  variant="standard"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  fullWidth
                  required
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
                  type="submit"
                  variant="contained"
                  fullWidth
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
                  Become a Seller
                </Button>

                <Typography
                  variant="body2"
                  textAlign="center"
                >
                  Already have an account?{" "}
                  <Typography
                    component="a"
                    href="/signin"
                    sx={{
                      color: "#0f172a",
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
        </Box>
      </Card>
    </Box>
  );
};

export default SellerPage;