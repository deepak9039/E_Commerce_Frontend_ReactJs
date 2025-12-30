import React, { use, useEffect, useState } from "react";
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
  Divider
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getProductById, addToCart, cartCountByUserId } from "../../services/apiService";
import { useCart } from "../Context/CartContext";

const ProductDetails = ({ user }) => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { refreshCartCount } = useCart();


  console.log("Product ID from params: User ID ",product?.productId, user);

  const fetchProduct = async () => {
    try {
      const res = await getProductById(id);
      setProduct(res);
    } catch (error) {
      console.log("Error fetching product:", error);
    }
    setLoading(false);
  };

  const addToCartClick =  async() => {
     try{
      const cartRes = await addToCart({productId: product?.productId, userId: user?.userId});
      const count = await cartCountByUserId(user?.userId);
      console.log("Cart Count after adding product:", count);
      console.log("Cart Response:", cartRes);
      // 🔥 GLOBAL UPDATE
      refreshCartCount(user?.userId);
     }
     catch(err){
      console.error("Add to cart error:", err);
    }
  }
    

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Stack alignItems="center" mt={4}>
        <CircularProgress />
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
    <Grid container spacing={2} sx={{ p: 4 }}>
      
      {/* 🔵 LEFT SIDE IMAGE */}
      <Grid size={6}>
        <CardMedia
          sx={{ height: 600, borderRadius: "10px" }}
          image={`http://localhost:1234/image/product/${product.productImageUrl}`}
          title={product.productName}
        />
      </Grid>

      {/* 🔵 RIGHT SIDE DETAILS */}
      <Grid size={6}>
        < Card sx={{ boxShadow: 0 }}>
          <CardContent>

            {/* PRODUCT NAME */}
            <Typography variant="h4" sx={{ mb: 2 }}>
              {product.productName}
            </Typography>

            {/* PRICE */}
            <Typography variant="h5" color="success.main" sx={{ mb: 2, fontWeight: "bold" }}>
              ₹ {product.productPrice}
            </Typography>

            {/* 🔵 SERVICE BADGES */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                🚚 <strong>Free Delivery</strong>
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                🔄 <strong>7-Day Return Available</strong>
              </Typography>
              <Typography variant="body1">
                💵 <strong>Cash on Delivery</strong>
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* DESCRIPTION */}
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Description:</strong> {product.productDescription}
            </Typography>

            {/* CATEGORY */}
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Category:</strong> {product.categoryName}
            </Typography>

            {/* STOCK */}
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Stock:</strong> {product.stockQuantity}
            </Typography>

            {/* ADD TO CART BUTTON */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 3, py: 1.5, fontSize: "18px" }}
              onClick={addToCartClick}
            >
              Add to Cart
            </Button>

          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProductDetails;
