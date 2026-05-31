import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { fetchDiscountedProducts } from "../../services/apiService";

const DiscountProductsSlider = () => {
  const sliderRef = useRef();
  const [products, setProducts] = React.useState([]);


  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -400,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: 400,
      behavior: "smooth",
    });
  };

  const limitWords = (text, limit = 18) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.length <= limit ? text : words.slice(0, limit).join(' ') + '...';
  };

  useEffect(() => {
    // Fetch discounted products from API and update state
    const fetchProducts = async () => {
      try {
        const data = await fetchDiscountedProducts();
        // Update products state with fetched data
        setProducts(data?.products);
      } catch (error) {
        console.error("Error fetching discounted products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box
      sx={{
        background: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "22px", md: "30px" },
            fontWeight: 600,
            color: "#111",
          }}
        >
          Up to 40% off | Best Deals
        </Typography>

        <Typography
          sx={{
            color: "#2874f0",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Explore more
        </Typography>
      </Box>

      {/* LEFT BUTTON */}
      <IconButton
        onClick={scrollLeft}
        sx={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          background: "#fff",
          width: 25,
          height: 50,
          borderRadius: "0 8px 8px 0",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",

          "&:hover": {
            background: "#fff",
          },
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      {/* RIGHT BUTTON */}
      <IconButton
        onClick={scrollRight}
        sx={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          background: "#fff",
          width: 25,
          height: 50,
          borderRadius: "8px 0 0 8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",

          "&:hover": {
            background: "#fff",
          },
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>

      {/* PRODUCTS */}
      <Box
        ref={sliderRef}
        sx={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",

          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {products.map((product) => (
          <Card
            component={RouterLink}
            to={`/product/${product.productId}`}
            key={product.productId}
            sx={{
              minWidth: 220,
              flexShrink: 0,
              boxShadow: "none",
              borderRadius: 0,
              textAlign: "center",
              cursor: "pointer",
              background: "transparent",
              textDecoration: 'none',

              "&:hover img": {
                transform: "scale(1.06)",
              },
            }}
          >
            {/* CIRCLE BACKGROUND */}
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background:
                  "linear-gradient(180deg, #9ff5ff 0%, #82ecf5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                mx: "auto",
              }}
            >
              <Box
                component="img"
                src={`http://localhost:1234/image/product/${product.productImageUrl}`}
                alt={product.productName}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transition: "0.3s ease",
                }}
              />
            </Box>

            <CardContent>
              <Typography
              sx={{
                    fontWeight: 600,
                    fontSize: 14,
                    height: 36,
                    overflow: "hidden",
                  }}
              >
                {limitWords(product.productName, 3)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default DiscountProductsSlider;