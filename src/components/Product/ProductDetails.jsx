import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Stack,
  Grid,
  Button,
  Divider,
  Chip,
  Paper
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getProductById, addToCart, cartCountByUserId } from "../../services/apiService";
import { useCart } from "../Context/CartContext";
import RelatedProducts from "./RelatedProducts";
import ProductReviews from "../Review/ProductReviews";

const ProductDetails = ({ user }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { refreshCartCount } = useCart();

  const fetchProduct = async () => {
    try {
      const res = await getProductById(id);
      setProduct(res);
    } catch (error) {
      console.log("Error fetching product:", error);
    }
    setLoading(false);
  };

  const addToCartClick = async () => {
    try {
      await addToCart({ productId: product?.productId, userId: user?.userId });
      await cartCountByUserId(user?.userId);
      refreshCartCount(user?.userId);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Stack alignItems="center" mt={6}>
        <CircularProgress size={50} />
      </Stack>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">Product Not Found</Typography>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 8 }}>

        <Grid container spacing={6}>

          {/* IMAGE */}
          <Grid size={5}>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 1,
                p: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 420,
              }}
            >
              <CardMedia
                component="img"
                image={`http://localhost:1234/image/product/${product.productImageUrl}`}
                alt={product.productName}
                sx={{
                  maxHeight: 380,
                  objectFit: "contain",
                }}
              />
            </Box>
          </Grid>

          {/* DETAILS */}
          <Grid size={7}>

            {/* PRODUCT NAME */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#0f172a",
                mb: 1,
              }}
            >
              {product.productName}
            </Typography>

            {/* CATEGORY */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Category: {product.categoryName}
            </Typography>

            <Box sx={{ mb: 2 }}>

              {/* Discounted Price */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "#0f172a",
                  display: "inline-block",
                  mr: 2,
                }}
              >
                ₹ {product.discountPrice || product.productPrice}
              </Typography>

              {/* Original Price */}
              {product.discount > 0 && (
                <Typography
                  component="span"
                  sx={{
                    textDecoration: "line-through",
                    color: "#94a3b8",
                    fontSize: 18,
                    mr: 2,
                  }}
                >
                  ₹ {product.productPrice}
                </Typography>
              )}

              {/* Discount Percentage */}
              {product.discount > 0 && (
                <Chip
                  label={`${product.discount}% OFF`}
                  size="small"
                  sx={{
                    backgroundColor: "#dcfce7",
                    color: "#15803d",
                    fontWeight: "bold",
                  }}
                />
              )}

              {/* You Save */}
              {product.discount > 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    color: "#15803d",
                    fontWeight: 500,
                  }}
                >
                  You save ₹ {product.productPrice - product.discountPrice}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* SERVICE INFO */}
            <Stack spacing={1.2} sx={{ mb: 3 }}>
              <Typography variant="body2">🚚 Free Delivery</Typography>
              <Typography variant="body2">🔄 7-Day Return Available</Typography>
              <Typography variant="body2">💵 Cash on Delivery</Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* DESCRIPTION */}
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", mb: 0.5, color: "#0f172a" }}
            >
              Description
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              {product.productDescription}
            </Typography>

            {/* STOCK */}
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                fontWeight: 500,
                color:
                  product.stockQuantity > 0
                    ? "success.main"
                    : "error.main",
              }}
            >
              {product.stockQuantity > 0
                ? `In stock (${product.stockQuantity} available)`
                : "Out of stock"}
            </Typography>

            {/* CTA */}
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={addToCartClick}
              sx={{
                px: 4,
                textTransform: "none",
                fontWeight: "bold",
                backgroundColor: "#0f172a",
                "&:hover": { backgroundColor: "#1e293b" },
              }}
            >
              Add to Cart
            </Button>

          </Grid>
        </Grid>
        {/* RELATED PRODUCTS */}
        <Box sx={{ mt: 8 }}>
          <Divider sx={{ mb: 3 }} />
          {/* <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#0f172a", mb: 3 }}
          >
            Related Products
          </Typography> */}
          <RelatedProducts />
          <ProductReviews />
        </Box>
      </Container>

    </>


  );
};

export default ProductDetails;
