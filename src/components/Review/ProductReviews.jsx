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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ width: 4, height: 26, borderRadius: 2, backgroundColor: '#2563eb' }} />
        <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 700, color: '#0f172a' }}>
          Customer Reviews
        </Typography>
      </Box>

      {hasNoReviews ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 3,
            borderRadius: '16px',
            // border: '1px dashed #cbd5e1',
            // backgroundColor: '#f8fafc',
          }}
        >
          <Typography variant="h6" sx={{ color: '#334155', fontWeight: 700 }}>
            No reviews available
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
            Be the first to review this product!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4} sx={{pb:5}}>
          {/* LEFT SIDE - RATING SUMMARY */}
          <Grid size={3}>
            <Box
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                p: 3,
                height: '100%',
                backgroundColor: '#f8fafc',
                position: 'sticky',
                top: 90,
              }}
            >
              {/* Average Rating */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                <Box>
                  <Typography sx={{ fontSize: 44, fontWeight: 800, lineHeight: 1, color: '#0f172a' }}>
                    {ratingSummary.average}
                  </Typography>
                  <Rating
                    value={ratingSummary.average}
                    precision={0.1}
                    readOnly
                    sx={{ mt: 0.5, color: '#fbbf24' }}
                  />
                  <Typography variant="body2" sx={{ mt: 0.5, fontSize: 12, color: '#64748b' }}>
                    {ratingSummary.totalReviews} {ratingSummary.totalReviews === 1 ? 'rating' : 'ratings'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2.5, borderColor: '#e2e8f0' }} />

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
                    <Typography sx={{ width: 30, fontSize: 12, fontWeight: 600, color: '#334155' }}>
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
                        backgroundColor: '#e2e8f0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#fbbf24',
                          borderRadius: 10,
                        }
                      }}
                    />

                    <Typography sx={{ width: 28, fontSize: 12, color: '#64748b', fontWeight: 500 }}>
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
                      border: '1px solid #eef1f6',
                      borderRadius: "16px",
                      p: 3,
                      backgroundColor: '#ffffff',
                      boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 14px 28px rgba(15,23,42,0.12)',
                        borderColor: '#cbd5e1',
                        transform: 'translateY(-3px)',
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
                            bgcolor: '#2563eb', 
                            color: '#ffffff', 
                            fontWeight: 700,
                            fontSize: 16
                          }}
                        >
                          {review.userDlts?.firstName?.charAt(0) || 'U'}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight="600" sx={{ fontSize: 13, color: '#0f172a' }}>
                            {review.userDlts?.firstName || 'Anonymous'}
                          </Typography>
                          <Rating value={review.rating} readOnly size="small" sx={{ mt: 0.3, color: '#fbbf24' }} />
                        </Box>
                      </Box>
                      <Chip
                        icon={<VerifiedUserIcon sx={{ fontSize: 14 }} />}
                        label="Verified"
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: 11,
                          backgroundColor: '#eaf1ff',
                          color: '#2563eb',
                          fontWeight: 600,
                          '& .MuiChip-icon': {
                            color: '#2563eb',
                          }
                        }}
                      />
                    </Box>

                    <Divider sx={{ mb: 2, my: 1, borderColor: '#eef1f6' }} />

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
                            borderRadius: "10px",
                            border: '1px solid #eef1f6',
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

                    <Divider sx={{ my: 2, borderColor: '#eef1f6' }} />

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
                          borderRadius: '8px',
                          '&:hover': {
                            backgroundColor: 'rgba(37, 99, 235, 0.08)',
                            color: '#2563eb',
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
                          borderRadius: '8px',
                          '&:hover': {
                            backgroundColor: 'rgba(225, 29, 72, 0.08)',
                            color: '#e11d48',
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
                      border: '1px solid #e2e8f0',
                      width: 38,
                      height: 38,
                      color: '#374151',
                      boxShadow: '0 4px 14px rgba(15,23,42,0.12)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                        borderColor: '#cbd5e1',
                        color: '#1f2937',
                      }
                    }}
                  >
                    <ArrowBackIcon sx={{ fontSize: 18 }} />
                  </IconButton>

                  <IconButton
                    onClick={() => handleScroll('right')}
                    sx={{
                      position: 'absolute',
                      right: -45,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      width: 38,
                      height: 38,
                      color: '#374151',
                      boxShadow: '0 4px 14px rgba(15,23,42,0.12)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                        borderColor: '#cbd5e1',
                        color: '#1f2937',
                      }
                    }}
                  >
                    <ArrowForwardIcon sx={{ fontSize: 18 }} />
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
