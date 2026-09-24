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
        borderRadius: "18px",
        border: "1px solid #e2e8f0",
        p: { xs: 2, md: 3 },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
          pb: 2,
          borderBottom: "1px solid #eef1f6",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 4, height: 28, borderRadius: 2, background: "#e11d48" }} />
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "20px", md: "26px" },
                fontWeight: 700,
                color: "#0f172a",
                lineHeight: 1.2,
              }}
            >
              Up to 40% off, today only
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: 13, mt: 0.3 }}>
              Deals refresh daily &mdash; grab them before they're gone
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            color: "#2563eb",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            whiteSpace: "nowrap",
            borderBottom: "1px solid transparent",
            "&:hover": {
              borderBottom: "1px solid #2563eb",
            },
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
          top: "58%",
          transform: "translateY(-50%)",
          zIndex: 2,
          background: "#fff",
          width: 38,
          height: 38,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 14px rgba(15,23,42,0.12)",

          "&:hover": {
            background: "#f8fafc",
          },
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
      </IconButton>

      {/* RIGHT BUTTON */}
      <IconButton
        onClick={scrollRight}
        sx={{
          position: "absolute",
          right: 10,
          top: "58%",
          transform: "translateY(-50%)",
          zIndex: 2,
          background: "#fff",
          width: 38,
          height: 38,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 14px rgba(15,23,42,0.12)",

          "&:hover": {
            background: "#f8fafc",
          },
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
      </IconButton>

      {/* PRODUCTS */}
      <Box
        ref={sliderRef}
        sx={{
          display: "flex",
          gap: 2.5,
          overflowX: "auto",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          pb: 0.5,

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
            elevation={0}
            sx={{
              minWidth: 168,
              flexShrink: 0,
              boxShadow: "none",
              border: "1px solid #eef1f6",
              borderRadius: "14px",
              textAlign: "center",
              cursor: "pointer",
              background: "#fff",
              textDecoration: 'none',
              p: 1.5,
              transition: "border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",

              "&:hover": {
                borderColor: "#cbd5e1",
                boxShadow: "0 10px 20px rgba(15,23,42,0.08)",
                transform: "translateY(-3px)",
              },
              "&:hover img": {
                transform: "scale(1.06)",
              },
            }}
          >
            {/* CIRCLE BACKGROUND */}
            <Box
              sx={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                background:
                  "linear-gradient(180deg, #eaf1ff 0%, #dbe7fe 100%)",
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

            <CardContent sx={{ p: '10px 0 0', "&:last-child": { pb: 0 } }}>
              <Typography
              sx={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#1e293b",
                    height: 34,
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
