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
  Alert,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { getUserById, updateUserProfile } from "../../services/apiService";

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

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ===== PAGE TITLE ===== */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: 3, color: "#0f172a" }}
      >
        My Profile
      </Typography>

      <Card sx={{ borderRadius: 4, boxShadow: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "grid", gap: 4 }}
          >
            {/* ===== ALERT ===== */}
            {alertMessage && (
              <Alert severity={alertType} variant="filled">
                {alertMessage}
              </Alert>
            )}

            {/* ===== PROFILE HEADER ===== */}
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar
                sx={{
                  width: 90,
                  height: 90,
                  bgcolor: "#e5e7eb",
                  color: "#1e293b",
                }}
              >
                <Person sx={{ fontSize: 50 }} />
              </Avatar>

              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {firstName} {lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {email}
                </Typography>
              </Box>
            </Stack>

            <Divider />

            {/* ===== USER DETAILS ===== */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Username"
                  value={userName}
                  fullWidth
                  InputProps={{ readOnly: true }}
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

              <Grid item xs={12}>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                  fullWidth
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

            {/* ===== ACTION ===== */}
            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  px: 4,
                  py: 1.2,
                  backgroundColor: "#0f172a",
                  "&:hover": { backgroundColor: "#1e293b" },
                }}
              >
                Update Profile
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserProfile;
