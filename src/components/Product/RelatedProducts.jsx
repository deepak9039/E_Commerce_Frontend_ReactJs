import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Rating
} from "@mui/material";

const relatedProducts = [
  {
    id: 1,
    name: "Puma Running Shoes",
    price: 2499,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
  },
  {
    id: 2,
    name: "Nike Air Max Sneakers",
    price: 3999,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552"
  },
  {
    id: 3,
    name: "Adidas Casual Shoes",
    price: 2999,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
  },
  {
    id: 4,
    name: "Reebok Training Shoes",
    price: 2799,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1528701800489-20be2f37f1a2"
  }
];

const RelatedProducts = () => {
  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Related Products
      </Typography>

      <Grid container spacing={3}>
        {relatedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card
              sx={{
                borderRadius: 3,
                transition: "0.3s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 4
                }
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={product.image}
              />

              <CardContent>
                <Typography fontWeight={600}>
                  {product.name}
                </Typography>

                <Typography sx={{ color: "green", fontWeight: 600 }}>
                  ₹{product.price}
                </Typography>

                <Rating value={product.rating} precision={0.5} readOnly size="small" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RelatedProducts;