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

const ProductReviews = ({ reviews }) => {
  console.log("Reviews in ProductReviews component:", reviews);

  // Calculate rating summary from reviews data
  const calculateRatingSummary = (reviewsData) => {
    if (!reviewsData || !reviewsData.reviews || reviewsData.reviews.length === 0) {
      return {
        average: 0,
        totalReviews: 0,
        ratings: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const reviewList = reviewsData.reviews;
    const totalReviews = reviewList.length;

    // Calculate ratings breakdown
    const ratings = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRatingSum = 0;

    reviewList.forEach(review => {
      const rating = Math.floor(review.rating); // Ensure it's an integer
      if (ratings[rating] !== undefined) {
        ratings[rating]++;
      }
      totalRatingSum += review.rating;
    });

    const average = totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : 0;

    return {
      average: parseFloat(average),
      totalReviews,
      ratings
    };
  };

  const ratingSummary = calculateRatingSummary(reviews);

  // Check if there are no reviews
  const hasNoReviews = !reviews || !reviews.reviews || reviews.reviews.length === 0;

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Customer Reviews
      </Typography>

      {hasNoReviews ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No reviews available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Be the first to review this product!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4} sx={{pb:5}}>
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
                        ratingSummary.totalReviews > 0
                          ? (ratingSummary.ratings[star] / ratingSummary.totalReviews) * 100
                          : 0
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
            </Box>
          </Grid>

          {/* RIGHT SIDE - CUSTOMER REVIEWS */}
          <Grid item xs={12} md={8}>
            {reviews?.reviews?.map((review) => (
              <Box key={review.id} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar>
                    {review.userDlts?.firstName?.charAt(0) || 'U'}
                  </Avatar>

                  <Box>
                    <Typography fontWeight="bold">
                      {review.userDlts?.firstName || 'Anonymous'} {review.userDlts?.lastName || ''}
                    </Typography>

                    <Rating
                      value={review.rating}
                      readOnly
                      size="small"
                    />
                  </Box>
                </Box>

                <Typography sx={{ mt: 1 }}>
                  {review.description}
                </Typography>

                {/* Review Image */}
                {review.imageUrl && (
                  <Box sx={{ mt: 2 }}>
                    <Box
                      component="img"
                      src={`http://localhost:1234/image/review/${review.imageUrl}`}
                    //   alt="Review image"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: 100,
                        width: 'auto',
                        height: 'auto',
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.9
                        }
                      }}
                      onClick={() => {
                        // Open image in new tab for full view
                        window.open(`http://localhost:1234/image/review/${review.imageUrl}`, '_blank');
                      }}
                    />
                  </Box>
                )}

                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ProductReviews;