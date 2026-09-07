import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Rating,
  LinearProgress,
  Avatar,
  Button,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const ProductReviews = ({ reviews }) => {
  console.log("Reviews in ProductReviews component:", reviews);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = React.useRef(null);
  const CARD_WIDTH = 300;

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

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const amount = CARD_WIDTH + 16;
      scrollContainerRef.current.scrollBy({
        left: direction === 'right' ? amount : -amount,
        behavior: 'smooth'
      });
    }
  };

  // Check if there are no reviews
  const hasNoReviews = !reviews || !reviews.reviews || reviews.reviews.length === 0;

  return (
    <Box sx={{ mt: 1 }}>
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
          <Grid size={3}>
            <Box
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                p: 3,
                height: '100%',
                backgroundColor: '#f9fafb',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                }
              }}
            >
              {/* Average Rating */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                <Box>
                  <Typography variant="h2" fontWeight="900" sx={{ fontSize: 44, lineHeight: 1 }}>
                    {ratingSummary.average}
                  </Typography>
                  <Rating
                    value={ratingSummary.average}
                    precision={0.1}
                    readOnly
                    sx={{ mt: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 12 }}>
                    {ratingSummary.totalReviews} {ratingSummary.totalReviews === 1 ? 'rating' : 'ratings'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2.5 }} />

              {/* Rating Breakdown */}
              <Box sx={{ mt: 2.5 }}>
                {[5, 4, 3, 2, 1].map((star) => (
                  <Box
                    key={star}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 1.5,
                      cursor: 'pointer',
                      transition: 'opacity 0.2s',
                      '&:hover': { opacity: 0.7 }
                    }}
                  >
                    <Typography sx={{ width: 30, fontSize: 12, fontWeight: 600 }}>
                      {star} ★
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={
                        ratingSummary.totalReviews > 0
                          ? (ratingSummary.ratings[star] / ratingSummary.totalReviews) * 100
                          : 0
                      }
                      sx={{
                        flex: 1,
                        height: 6,
                        borderRadius: 10,
                        backgroundColor: '#e5e7eb',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#fbbf24',
                        }
                      }}
                    />

                    <Typography sx={{ width: 28, fontSize: 12, color: '#6b7280', fontWeight: 500 }}>
                      {ratingSummary.ratings[star]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* RIGHT SIDE - CUSTOMER REVIEWS */}
          <Grid size={9}>
            <Box sx={{ position: 'relative' }}>
              {/* Scroll Container */}
              <Box
                ref={scrollContainerRef}
                sx={{
                  display: 'flex',
                  gap: 2.5,
                  overflowX: 'auto',
                  pb: 1,
                  '&::-webkit-scrollbar': { 
                    height: 6,
                    display: 'none'
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f0f0f0',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#d0d0d0',
                    borderRadius: 3,
                  }
                }}
              >
                {reviews?.reviews?.map((review) => (
                  <Box
                    key={review.id}
                    sx={{
                      flex: '0 0 auto',
                      width: 300,
                      border: '1px solid #e5e7eb',
                      borderRadius: 2,
                      p: 3,
                      backgroundColor: '#ffffff',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                        borderColor: '#d1d5db',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    {/* Header with User & Verified Badge */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            bgcolor: '#fbbf24', 
                            color: '#ffffff', 
                            fontWeight: 700,
                            fontSize: 16
                          }}
                        >
                          {review.userDlts?.firstName?.charAt(0) || 'U'}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight="600" sx={{ fontSize: 13 }}>
                            {review.userDlts?.firstName || 'Anonymous'}
                          </Typography>
                          <Rating value={review.rating} readOnly size="small" sx={{ mt: 0.3 }} />
                        </Box>
                      </Box>
                      <Chip
                        icon={<VerifiedUserIcon sx={{ fontSize: 14 }} />}
                        label="Verified"
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: 11,
                          backgroundColor: '#dbeafe',
                          color: '#0284c7',
                          fontWeight: 600,
                          '& .MuiChip-icon': {
                            color: '#0284c7',
                          }
                        }}
                      />
                    </Box>

                    <Divider sx={{ mb: 2, my: 1 }} />

                    {/* Review Text */}
                    <Typography sx={{ mb: 2, fontSize: 13, color: '#374151', lineHeight: 1.6, fontWeight: 500 }}>
                      "{review.description?.substring(0, 100)}..."
                    </Typography>

                    {/* Review Image */}
                    {review.imageUrl && (
                      <Box sx={{ mb: 2 }}>
                        <Box
                          component="img"
                          src={`http://localhost:1234/image/review/${review.imageUrl}`}
                          alt="Review"
                          sx={{
                            width: '100%',
                            height: 110,
                            objectFit: 'cover',
                            borderRadius: 1.5,
                            border: '1px solid #e5e7eb',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                              opacity: 0.85,
                              transform: 'scale(1.02)',
                            }
                          }}
                          onClick={() => {
                            window.open(`http://localhost:1234/image/review/${review.imageUrl}`, '_blank');
                          }}
                        />
                      </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<ThumbUpIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          textTransform: 'none',
                          color: '#6b7280',
                          fontSize: 12,
                          fontWeight: 500,
                          padding: '4px 8px',
                          '&:hover': {
                            backgroundColor: 'rgba(59, 130, 246, 0.08)',
                            color: '#3b82f6',
                          }
                        }}
                      >
                        Helpful
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          textTransform: 'none',
                          color: '#6b7280',
                          fontSize: 12,
                          fontWeight: 500,
                          padding: '4px 8px',
                          '&:hover': {
                            backgroundColor: 'rgba(249, 115, 22, 0.08)',
                            color: '#f97316',
                          }
                        }}
                      >
                        Report
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Arrow Buttons */}
              {reviews?.reviews && reviews.reviews.length > 3 && (
                <>
                  <IconButton
                    onClick={() => handleScroll('left')}
                    sx={{
                      position: 'absolute',
                      left: -45,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      width: 40,
                      height: 40,
                      color: '#374151',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#f3f4f6',
                        borderColor: '#d1d5db',
                        color: '#1f2937',
                      }
                    }}
                  >
                    <ArrowBackIcon sx={{ fontSize: 20 }} />
                  </IconButton>

                  <IconButton
                    onClick={() => handleScroll('right')}
                    sx={{
                      position: 'absolute',
                      right: -45,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      width: 40,
                      height: 40,
                      color: '#374151',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#f3f4f6',
                        borderColor: '#d1d5db',
                        color: '#1f2937',
                      }
                    }}
                  >
                    <ArrowForwardIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ProductReviews;