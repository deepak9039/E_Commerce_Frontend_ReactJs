import * as React from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const ProductReviewPage = () => {
  const [rating, setRating] = React.useState(0);
  const [description, setDescription] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [error, setError] = React.useState(false);

  const handleSubmit = () => {
    if (!description.trim()) {
      setError(true);
      return;
    }

    setError(false);

    console.log({
      rating,
      title,
      description,
    });

    // Call API here
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 1000,
          margin: "0 auto",
          borderRadius: 2,
        }}
      >
        {/* Rate Product */}
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Rate this product
        </Typography>

        <Rating
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
          size="large"
        />

        <Divider sx={{ my: 4 }} />

        {/* Review Section */}
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Review this product
        </Typography>

        {/* Description */}
        <TextField
          fullWidth
          multiline
          minRows={6}
          label="Description"
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={error}
          helperText={error ? "Description cannot be empty" : ""}
          sx={{ mb: 3 }}
        />

        {/* Title */}
        <TextField
          fullWidth
          label="Title (optional)"
          placeholder="Review title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 4 }}
        />

        {/* Upload Image */}
        <Box sx={{ mb: 4 }}>
          <IconButton
            component="label"
            sx={{
              width: 80,
              height: 80,
              borderRadius: 2,
              backgroundColor: "#f0f0f0",
            }}
          >
            <PhotoCameraIcon />
            <input type="file" hidden />
          </IconButton>
        </Box>

        {/* Submit Button */}
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#ff6a00",
              px: 6,
              py: 1.5,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#e65c00",
              },
            }}
          >
            SUBMIT
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProductReviewPage;