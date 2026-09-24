import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { getUserById, updateUserProfile, logoutUser } from "../../services/apiService";
import UserAddress from "./UserAddress";
import UserOrders from "../OrderPage/UserOrders";

const UserProfile = ({ user, setUser }) => {
  const [selectedTab, setSelectedTab] = useState("profile");

  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("default.png");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId: user.userId,
      firstName,
      lastName,
      email,
    };

    try {
      const response = await updateUserProfile(payload);
      setAlertType("success");
      setAlertMessage(response?.message || "Profile updated successfully");
    } catch (error) {
      console.error(error);
      setAlertType("error");
      setAlertMessage("Profile update failed!");
    }
  };

  const signOut = async () => {
    localStorage.removeItem("user");
    setUser(null);
    await logoutUser();
    navigate("/signin");
  };

  useEffect(() => {
    if (!user?.userId) return;

    const fetchProfile = async () => {
      try {
        const res = await getUserById(user?.userId);

        setUserName(res.userName);
        setEmail(res.email);
        setFirstName(res.firstName);
        setLastName(res.lastName);
        setRole(res.role);
        setProfilePicture(res.profilePicture || "default.png");
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [user?.userId]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={3}>

        {/* ===== LEFT SIDEBAR ===== */}
        <Grid size={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "18px",
              border: "1px solid #e2e8f0",
              position: "sticky",
              top: 90,
            }}
          >
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>

              {/* USER HEADER */}
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  p: 2.5,
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                }}
              >
                <Avatar sx={{ bgcolor: "#fff", color: "#2563eb", fontWeight: 700 }}>
                  <Person />
                </Avatar>

                <Box>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                    Hello,
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>
                    {firstName} {lastName}
                  </Typography>
                </Box>
              </Stack>

              {/* MENU */}
              <List sx={{ py: 0.5 }}>
                <ListItemButton
                  selected={selectedTab === "orders"}
                  onClick={() => setSelectedTab("orders")}
                  sx={{
                    borderLeft: "4px solid transparent",
                    py: 1.25,
                    "&.Mui-selected": {
                      backgroundColor: "#eaf1ff",
                      borderLeftColor: "#2563eb",
                      color: "#2563eb",
                      "&:hover": { backgroundColor: "#dbe7fe" },
                    },
                  }}
                >
                  <ListItemText
                    primary="MY ORDERS"
                    primaryTypographyProps={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.4px" }}
                  />
                </ListItemButton>

                <Divider sx={{ borderColor: "#eef1f6" }} />

                <ListItem>
                  <ListItemText
                    primary="ACCOUNT SETTINGS"
                    primaryTypographyProps={{ fontWeight: 700, fontSize: 12, color: "#94a3b8", letterSpacing: "0.5px" }}
                  />
                </ListItem>

                <ListItemButton
                  selected={selectedTab === "profile"}
                  onClick={() => setSelectedTab("profile")}
                  sx={{
                    borderLeft: "4px solid transparent",
                    py: 1.1,
                    "&.Mui-selected": {
                      backgroundColor: "#eaf1ff",
                      borderLeftColor: "#2563eb",
                      color: "#2563eb",
                      "&:hover": { backgroundColor: "#dbe7fe" },
                    },
                  }}
                >
                  <ListItemText
                    primary="Profile Information"
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                  />
                </ListItemButton>

                <ListItemButton
                  selected={selectedTab === "addresses"}
                  onClick={() => setSelectedTab("addresses")}
                  sx={{
                    borderLeft: "4px solid transparent",
                    py: 1.1,
                    "&.Mui-selected": {
                      backgroundColor: "#eaf1ff",
                      borderLeftColor: "#2563eb",
                      color: "#2563eb",
                      "&:hover": { backgroundColor: "#dbe7fe" },
                    },
                  }}
                >
                  <ListItemText
                    primary="Manage Addresses"
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                  />
                </ListItemButton>

                <Divider sx={{ my: 1, borderColor: "#eef1f6" }} />

                <ListItem>
                  <ListItemText
                    primary="PAYMENTS"
                    primaryTypographyProps={{ fontWeight: 700, fontSize: 12, color: "#94a3b8", letterSpacing: "0.5px" }}
                  />
                </ListItem>

                <ListItem button sx={{ py: 1.1, cursor: "pointer", "&:hover": { backgroundColor: "#f8fafc" } }}>
                  <ListItemText primary="Saved UPI" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
                </ListItem>

                <ListItem button sx={{ py: 1.1, cursor: "pointer", "&:hover": { backgroundColor: "#f8fafc" } }}>
                  <ListItemText primary="Saved Cards" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
                </ListItem>

                <Divider sx={{ borderColor: "#eef1f6" }} />
                <ListItem
                  button
                  onClick={signOut}
                  sx={{ py: 1.1, cursor: "pointer", color: "#e11d48", "&:hover": { backgroundColor: "#fef2f4" } }}
                >
                  <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }} />
                </ListItem>


              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* ===== RIGHT PROFILE SECTION ===== */}
        <Grid size={9}>
          {selectedTab === "orders" ? (
            <UserOrders user={user} />
          ) : selectedTab === "addresses" ? (
            <UserAddress user={user} />
          ) : (
            <Card
              elevation={0}
              sx={{ borderRadius: "18px", border: "1px solid #e2e8f0" }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                  <Box sx={{ width: 4, height: 26, borderRadius: 2, backgroundColor: "#2563eb" }} />
                  <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 700, color: "#0f172a" }}>
                    Personal Information
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit}>
                  {alertMessage && (
                    <Alert severity={alertType} sx={{ mb: 2, borderRadius: "10px" }}>
                      {alertMessage}
                    </Alert>
                  )}

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                          },
                          "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                          },
                          "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Username"
                        value={userName}
                        fullWidth
                        InputProps={{ readOnly: true }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            backgroundColor: "#f8fafc",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      {/* <TextField
                        label="Role"
                        value={role}
                        disabled
                        fullWidth
                      /> */}
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Email Address"
                        value={email}
                        disabled
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            backgroundColor: "#f8fafc",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box mt={4}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        px: 5,
                        py: 1.2,
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 700,
                        boxShadow: "none",
                        backgroundColor: "#2563eb",
                        "&:hover": {
                          backgroundColor: "#1d4ed8",
                          boxShadow: "0 8px 20px rgba(37, 99, 235,0.3)",
                        },
                      }}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

      </Grid>
    </Container>
  );
};

export default UserProfile;
