import * as React from "react";
import { useLocation } from "react-router-dom";
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
import { writeReview } from "../../services/apiService";
import AlertMessage from "../Message/AlertMessage";

const ProductReviewPage = () => {
  const location = useLocation();
  const { user, product, orderId } = location.state || {};

  const [rating, setRating] = React.useState(0);
  const [description, setDescription] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [error, setError] = React.useState(false);
  const [imageFile, setImageFile] = React.useState(null);
  const [apiResponse, setApiResponse] = React.useState(null);

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError(true);
      return;
    }

    setError(false);

    const formData = new FormData();

    // Add the review data as a JSON string
    const reviewData = {
      userDlts: {
        userId: user?.userId
      },
      product: {
        productId: product?.productId
      },
      rating: rating,
      title: title,
      description: description
    };

    formData.append("review", new Blob([JSON.stringify(reviewData)], { type: "application/json" }));

    // Add the image file if selected
    if (imageFile) {
      formData.append("image", imageFile);
    }

    console.log("Submitting review with FormData:", {
      review: reviewData,
      image: imageFile?.name
    });

    try {
      // Call API here
      const response = await writeReview(formData);
      console.log("Review submitted successfully:", response, apiResponse);
      setApiResponse(response);
      // You can add navigation or success message here
    } catch (error) {
      console.error("Error submitting review:", error);
      setApiResponse({ status: "error", message: "Failed to submit review." });
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        p: 4,
      }}
    >
      {apiResponse && (
        <AlertMessage
          message={apiResponse.message}
          severity={apiResponse.status === "success" ? "success" : "error"}
        />
      )}
      

      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 1000,
          margin: "0 auto",
          borderRadius: 2,
        }}
      >
        {/* Product Information */}
        {product && (
          <Box sx={{ mb: 4, p: 2, backgroundColor: "#f8f9fa", borderRadius: 1 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Review for: {product.productName}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Box
                component="img"
                src={`http://localhost:1234/image/product/${product.productImageUrl}`}
                alt={product.productName}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: "contain",
                  borderRadius: 1,
                  border: "1px solid #e0e0e0"
                }}
              />
              <Box>
                <Typography variant="body1" fontWeight="500">
                  {product.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {product.categoryName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ₹{product.productPrice}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Rate Product */}

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
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setImageFile(file || null);
              }}
            />
          </IconButton>
          {imageFile && (
            <Typography variant="caption" sx={{ ml: 2 }}>
              Selected: {imageFile.name}
            </Typography>
          )}
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