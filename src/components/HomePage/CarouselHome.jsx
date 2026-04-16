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
        px: 5,
        mt: 2,
        position: 'relative',
        // reserve space below slides for dots so they render outside images
        pb: '48px',
        // tighten and center react-slick dots
        '& .slick-list': {
          overflow: 'hidden',
        },
        // prevent parent box from showing a vertical scrollbar
        overflowY: 'hidden',
        '& .slick-dots': {
          position: 'absolute',
          bottom: '-30px',
          left: 0,
          right: 0,
          margin: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 0,
          padding: 0,
          listStyle: 'none',
          zIndex: 10,
        },
        '& .slick-dots li': {
          margin: '0 2px',
          width: 'auto',
          display: 'inline-block',
        },
        '& .slick-dots li button': {
          padding: 0,
          width: 10,
          height: 10,
          borderRadius: '50%',
        },
        '& .slick-dots li button:before': {
          fontSize: '0px',
          content: "''",
          backgroundColor: '#c4c4c4',
          display: 'block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          opacity: 1,
        },
        '& .slick-dots li.slick-active button:before': {
          backgroundColor: '#1976d2',
          transform: 'scale(1.15)'
        },
      }}
    >
      <Slider {...settings}>
        {products.map((item) => (
          <Box key={item.id} sx={{ px: { xs: 1, sm: 1 } }}>
            <Card
              sx={{
                position: 'relative',
                borderRadius: 3,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: 3,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  zIndex: 5,
                }}
              >
                <Box sx={{
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  px: 1.2,
                  py: '2px',
                  borderRadius: 1,
                  fontSize: 11,
                  fontWeight: 700,
                }}>Sponsored</Box>
              </Box>

              <CardMedia
                component="img"
                height="180"
                image={item.productImageUrl ? `http://localhost:1234/image/product/${item.productImageUrl}` : "https://via.placeholder.com/300x180?text=No+Image"  }
                alt={item.productName}
                onClick={() => navigate(`/product/${item.productId}`)}
              />
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default CarouselHome;
