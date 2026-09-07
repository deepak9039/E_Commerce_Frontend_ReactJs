import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Rating,
  IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const SimilarProduct = ({ similarProductsData }) => {
    const navigate = useNavigate();

    console.log("SimilarProduct Component - similarProductsData:", similarProductsData);

  const products = similarProductsData || [];

  const slidesPerViewSetting = Math.min(products.length || 1, 4);

//   if (!products.length) {
//     return (
//       <Typography sx={{ mt: 4 }}>
//         No related products available
//       </Typography>
//     );
//   }

  const limitWords = (text, limit = 3) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length <= limit ? text : words.slice(0, limit).join(" ") + "...";
};

  const swiperRef = React.useRef(null);

  return (
    <Box sx={{ mt: 6, position: 'relative' }}>
        { products.length > 0 && (
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Similar Products
            </Typography>
        )}

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
                sx={{
                  borderRadius: 3,
                  transition: "0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 4
                  },
                  mb: 1
                }}
                onClick={() => navigate(`/product/${product.productId}`)}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={`http://localhost:1234/image/product/${product.productImageUrl}`}
                  sx={{ objectFit: 'cover' }}
                />

                <CardContent>
                  <Typography fontWeight={600} sx={{ fontSize: 15, mb: 0.5 }}>
                    {limitWords(product.productName)}
                  </Typography>

                  <Typography sx={{ color: "#059669", fontWeight: 700 }}>
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

        {/* Custom navigation to avoid cross-swiper conflicts */}
        {products.length > 1 && (
          <>
            <IconButton
              aria-label="previous"
              onClick={() => swiperRef.current?.slidePrev()}
              sx={{
                position: 'absolute',
                left: -10,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 20,
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                '&:hover': { backgroundColor: '#f8fafc' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <IconButton
              aria-label="next"
              onClick={() => swiperRef.current?.slideNext()}
              sx={{
                position: 'absolute',
                right: -10,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 20,
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                '&:hover': { backgroundColor: '#f8fafc' }
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
}

export default SimilarProduct
