import React from "react";
import {
  Box,
  Typography,
  Grid,
  Rating,
  LinearProgress,
  Avatar,
  Divider,
  Button,
} from "@mui/material";

const ratingSummary = {
  average: 4.3,
  totalReviews: 124,
  ratings: {
    5: 80,
    4: 25,
    3: 10,
    2: 5,
    1: 4,
  },
};

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    rating: 5,
    comment:
      "Amazing product! Quality is very good and delivery was fast. Highly recommended.",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Priya Verma",
    rating: 4,
    comment:
      "Very comfortable shoes. Worth the price. Packaging was also nice.",
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Amit Kumar",
    rating: 4,
    comment:
      "Good product but size runs slightly small. Overall satisfied.",
    date: "2 weeks ago",
  },
];

const ProductReviews = () => {
  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Customer Reviews
      </Typography>

      <Grid container spacing={4}>
        {/* LEFT SIDE - RATING SUMMARY */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              p: 3,
            }}
          >
            <Typography variant="h3" fontWeight="bold">
              {ratingSummary.average}
            </Typography>

            <Rating
              value={ratingSummary.average}
              precision={0.1}
              readOnly
              sx={{ mt: 1 }}
            />

            <Typography color="text.secondary">
              {ratingSummary.totalReviews} ratings
            </Typography>

            <Box sx={{ mt: 3 }}>
              {[5, 4, 3, 2, 1].map((star) => (
                <Box
                  key={star}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Typography sx={{ width: 20 }}>{star}</Typography>

                  <LinearProgress
                    variant="determinate"
                    value={
                      (ratingSummary.ratings[star] /
                        ratingSummary.totalReviews) *
                      100
                    }
                    sx={{
                      flex: 1,
                      height: 8,
                      borderRadius: 5,
                    }}
                  />

                  <Typography sx={{ width: 30 }}>
                    {ratingSummary.ratings[star]}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 3 }}
            >
              Write a Review
            </Button> */}
          </Box>
        </Grid>

        {/* RIGHT SIDE - CUSTOMER REVIEWS */}
        <Grid item xs={12} md={8}>
          {reviews.map((review) => (
            <Box key={review.id} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar>{review.name.charAt(0)}</Avatar>

                <Box>
                  <Typography fontWeight="bold">
                    {review.name}
                  </Typography>

                  <Rating
                    value={review.rating}
                    readOnly
                    size="small"
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {review.date} • Verified Purchase
                  </Typography>
                </Box>
              </Box>

              <Typography sx={{ mt: 1 }}>
                {review.comment}
              </Typography>

              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductReviews;