import React, { useEffect, useState } from "react";
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
import { getUserById } from "../../services/apiService";


const UserProfile = ({ user }) => {
  // ---- USER STATES ----
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("default.png");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");

  // ---- ALERT STATES ----
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  /* ================= FETCH USER DATA ================= */
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

  /* ================= UPDATE PROFILE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId: user.userId,
      firstName,
      lastName,
      email
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Profile
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 3 }}>
        
        {/* ======= ALERT ======= */}
        {alertMessage && (
          <Alert severity={alertType} variant="filled">
            {alertMessage}
          </Alert>
        )}

        {/* PROFILE ICON */}
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

          <Box>
            <Typography fontWeight="bold">
              {firstName} {lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {role}
            </Typography>
          </Box>
        </Stack>

        {/* USER DETAILS */}
        <Grid container spacing={2}>
          {/* READ ONLY */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Username"
              value={userName}
              fullWidth
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Role"
              value={role}
              fullWidth
              disabled
            />
          </Grid>

          {/* EDITABLE */}
          <Grid item xs={12}>
            <TextField
              label="Email"
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

        {/* SUBMIT */}
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
        >
          Update Profile
        </Button>
      </Box>
    </Container>
  );
};

export default UserProfile;
