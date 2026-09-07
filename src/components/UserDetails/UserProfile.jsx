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
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>

              {/* USER HEADER */}
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: "#facc15" }}>
                  <Person />
                </Avatar>

                <Box>
                  <Typography variant="body2">Hello,</Typography>
                  <Typography fontWeight="bold">
                    {firstName} {lastName}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 0 }} />

              {/* MENU */}
              <List>
                <ListItemButton
                  selected={selectedTab === "orders"}
                  onClick={() => setSelectedTab("orders")}
                  sx={{
                    borderLeft: "4px solid transparent",
                    "&.Mui-selected": {
                      backgroundColor: "#e0f2fe",
                      borderLeftColor: "#0284c7",
                      color: "#0369a1",
                      "&:hover": { backgroundColor: "#bae6fd" },
                    },
                  }}
                >
                  <ListItemText primary="MY ORDERS" />
                </ListItemButton>

                <Divider />

                <ListItem>
                  <ListItemText
                    primary="ACCOUNT SETTINGS"
                    primaryTypographyProps={{ fontWeight: "bold" }}
                  />
                </ListItem>

                <ListItemButton
                  selected={selectedTab === "profile"}
                  onClick={() => setSelectedTab("profile")}
                  sx={{
                    borderLeft: "4px solid transparent",
                    "&.Mui-selected": {
                      backgroundColor: "#e0f2fe",
                      borderLeftColor: "#0284c7",
                      color: "#0369a1",
                      "&:hover": { backgroundColor: "#bae6fd" },
                    },
                  }}
                >
                  <ListItemText primary="Profile Information" />
                </ListItemButton>

                <ListItemButton
                  selected={selectedTab === "addresses"}
                  onClick={() => setSelectedTab("addresses")}
                  sx={{
                    borderLeft: "4px solid transparent",
                    "&.Mui-selected": {
                      backgroundColor: "#e0f2fe",
                      borderLeftColor: "#0284c7",
                      color: "#0369a1",
                      "&:hover": { backgroundColor: "#bae6fd" },
                    },
                  }}
                >
                  <ListItemText primary="Manage Addresses" />
                </ListItemButton>

                <Divider sx={{ my: 1 }} />

                <ListItem>
                  <ListItemText
                    primary="PAYMENTS"
                    primaryTypographyProps={{ fontWeight: "bold" }}
                  />
                </ListItem>

                <ListItem button>
                  <ListItemText primary="Saved UPI" />
                </ListItem>

                <ListItem button>
                  <ListItemText primary="Saved Cards" />
                </ListItem>

                <Divider />
                <ListItem button onClick={signOut}>
                  <ListItemText primary="Logout" />
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
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Personal Information
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  {alertMessage && (
                    <Alert severity={alertType} sx={{ mb: 2 }}>
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
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Username"
                        value={userName}
                        fullWidth
                        InputProps={{ readOnly: true }}
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
                      />
                    </Grid>
                  </Grid>

                  <Box mt={4}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        px: 5,
                        backgroundColor: "#0f172a",
                        "&:hover": { backgroundColor: "#1e293b" },
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