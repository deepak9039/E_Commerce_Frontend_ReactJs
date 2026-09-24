import React from "react";
import Slider from "react-slick";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';

const CarouselHome = ({ products }) => {

    const navigate = useNavigate();


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    // enable center mode with padding so next/previous cards peek in view
    centerMode: true,
    centerPadding: '60px',
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 1,
          centerPadding: '40px',
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        backgroundColor: '#eef2f7',
        borderBottom: '1px solid #e2e8f0',
        pt: 2,
      }}
    >
    <Box
      sx={{
        px: 5,
        position: 'relative',
        maxWidth: 1400,
        mx: 'auto',
        // reserve space below slides for dots so they render outside images
        pb: '40px',
        // tighten and center react-slick dots
        '& .slick-list': {
          overflow: 'hidden',
        },
        // prevent parent box from showing a vertical scrollbar
        overflowY: 'hidden',
        '& .slick-dots': {
          position: 'absolute',
          bottom: '-32px',
          left: 0,
          right: 0,
          margin: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          padding: 0,
          listStyle: 'none',
          zIndex: 10,
        },
        '& .slick-dots li': {
          margin: 0,
          width: 'auto',
          display: 'inline-block',
        },
        '& .slick-dots li button': {
          padding: 0,
          width: 22,
          height: 6,
          borderRadius: 3,
        },
        '& .slick-dots li button:before': {
          fontSize: '0px',
          content: "''",
          backgroundColor: '#c7d0dc',
          display: 'block',
          width: 22,
          height: 6,
          borderRadius: 3,
          opacity: 1,
          transition: 'background-color 200ms ease',
        },
        '& .slick-dots li.slick-active button:before': {
          backgroundColor: '#2563eb',
        },
      }}
    >
      <Slider {...settings}>
        {products.map((item) => (
          <Box key={item.id} sx={{ px: { xs: 1, sm: 1.25 } }}>
            <Card
              elevation={0}
              sx={{
                position: 'relative',
                borderRadius: '18px',
                overflow: "hidden",
                cursor: "pointer",
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
                transition: 'box-shadow 220ms ease, transform 220ms ease',
                '&:hover': {
                  boxShadow: '0 16px 32px rgba(15,23,42,0.16)',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  zIndex: 5,
                }}
              >
                <Box sx={{
                  bgcolor: 'rgba(15,23,42,0.78)',
                  color: '#fff',
                  px: 1.25,
                  py: '3px',
                  borderRadius: '6px',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.2px',
                }}>Sponsored</Box>
              </Box>

              <CardMedia
                component="img"
                height="220"
                image={item.productImageUrl ? `http://localhost:1234/image/product/${item.productImageUrl}` : "https://via.placeholder.com/300x180?text=No+Image"  }
                alt={item.productName}
                onClick={() => navigate(`/product/${item.productId}`)}
                sx={{
                  backgroundColor: '#f8fafc',
                  objectFit: 'cover',
                }}
              />
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
    </Box>
  );
};

export default CarouselHome;
