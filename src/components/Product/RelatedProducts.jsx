import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Rating
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const RelatedProducts = ({ relatedProducts }) => {

  const navigate = useNavigate();

  const products = relatedProducts?.products || [];

  const slidesToShow = products.length >= 4 ? 4 : products.length;

  if (!products.length) {
    return (
      <Typography sx={{ mt: 4 }}>
        No related products available
      </Typography>
    );
  }

  const limitWords = (text, limit = 3) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length <= limit ? text : words.slice(0, limit).join(" ") + "...";
};

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Related Products
      </Typography>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={slidesToShow}
        navigation={products.length > 4}
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
              />

              <CardContent>
                <Typography fontWeight={600}>
                  {limitWords(product.productName)}
                </Typography>

                <Typography sx={{ color: "green", fontWeight: 600 }}>
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
    </Box>
  );
};

export default RelatedProducts;