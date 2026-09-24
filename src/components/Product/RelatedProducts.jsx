import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Rating
  , IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const RelatedProducts = ({ relatedProducts }) => {

  const navigate = useNavigate();

  const products = relatedProducts?.products || [];

  if (!products.length) {
    return (
      <Typography sx={{ mt: 4, color: '#64748b' }}>
        No related products available
      </Typography>
    );
  }

  const limitWords = (text, limit = 4) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length <= limit ? text : words.slice(0, limit).join(" ") + "...";
  };

  const swiperRef = React.useRef(null);

  const slidesPerViewSetting = Math.min(products.length, 4);

  return (
    <Box sx={{ mt: 6, position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ width: 4, height: 26, borderRadius: 2, backgroundColor: '#2563eb' }} />
        <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 700, color: '#0f172a' }}>
          Related Products
        </Typography>
      </Box>

      <Box sx={{ position: 'relative' }}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={slidesPerViewSetting}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          breakpoints={{
            1200: { slidesPerView: Math.min(products.length, 4) },
            900: { slidesPerView: Math.min(products.length, 3) },
            600: { slidesPerView: Math.min(products.length, 2) },
            0: { slidesPerView: 1 }
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.productId}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "16px",
                  border: "1px solid #eef1f6",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                  cursor: "pointer",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 32px rgba(15,23,42,0.14)",
                    borderColor: "#cbd5e1",
                  },
                  mb: 1
                }}
                onClick={() => navigate(`/product/${product.productId}`)}
              >
                <Box sx={{ backgroundColor: "#f8fafc" }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={`http://localhost:1234/image/product/${product.productImageUrl}`}
                    sx={{ objectFit: 'contain', p: 1.5 }}
                  />
                </Box>

                <CardContent sx={{ pt: 1.75 }}>
                  <Typography fontWeight={600} sx={{ fontSize: 14, color: '#1e293b', mb: 0.75, height: 20, overflow: 'hidden' }}>
                    {limitWords(product.productName)}
                  </Typography>

                  <Typography sx={{ color: "#0f172a", fontWeight: 700, fontSize: 16, mb: 0.75 }}>
                    ₹{product.discountPrice || product.productPrice}
                  </Typography>

                  <Rating
                    value={product.rating || 0}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom navigation buttons to avoid conflicts between multiple Swipers */}
        {products.length > 1 && (
          <>
            <IconButton
              aria-label="previous"
              onClick={() => swiperRef.current?.slidePrev()}
              sx={{
                position: 'absolute',
                left: -10,
                top: '42%',
                transform: 'translateY(-50%)',
                zIndex: 20,
                backgroundColor: '#fff',
                width: 38,
                height: 38,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(15,23,42,0.12)',
                '&:hover': { backgroundColor: '#f8fafc' }
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton
              aria-label="next"
              onClick={() => swiperRef.current?.slideNext()}
              sx={{
                position: 'absolute',
                right: -10,
                top: '42%',
                transform: 'translateY(-50%)',
                zIndex: 20,
                backgroundColor: '#fff',
                width: 38,
                height: 38,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(15,23,42,0.12)',
                '&:hover': { backgroundColor: '#f8fafc' }
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
};

export default RelatedProducts;
