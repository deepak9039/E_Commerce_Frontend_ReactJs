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
  Paper,
  Pagination
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getProductById, addToCart, cartCountByUserId, getProductsByCategory, getProductReviews, fetchSimilarProducts } from "../../services/apiService";
import { useCart } from "../Context/CartContext";
import RelatedProducts from "./RelatedProducts";
import ProductReviews from "../Review/ProductReviews";
import SimilarProduct from "./SimilarProduct";
import Toast from "../Common/Toast";

const ProductDetails = ({ user }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedPage, setRelatedPage] = useState(0);
  const [relatedTotalPages, setRelatedTotalPages] = useState(0);
  const [reviews, setReviews] = useState([]);
  const RELATED_PAGE_SIZE = 10;
  const [successMessage, setSuccessMessage] = useState(null);
  const [similarProductsData, setSimilarProductsData] = useState([]);

  // Toast state
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  const [toastSeverity, setToastSeverity] = React.useState("success");
  
  console.log("simlarProductsData", similarProductsData);
  console.log("erer", relatedProducts);
  console.log("Product reviews:", reviews);

  const { refreshCartCount } = useCart();

  const fetchProduct = async () => {
    try {
      const res = await getProductById(id);
      const relatedProducts = await getProductsByCategory(res.categoryName, 0, RELATED_PAGE_SIZE);
      const reviews = await getProductReviews(id);
      const similarProduct = await fetchSimilarProducts(res?.productId);
      setSimilarProductsData(similarProduct);
      setReviews(reviews);
      setRelatedProducts(relatedProducts);
      setRelatedPage(relatedProducts.page || 0);
      setRelatedTotalPages(relatedProducts.totalPages || 0);
      setProduct(res);
    } catch (error) {
      console.log("Error fetching product:", error);
    }
    setLoading(false);
  };

  const fetchRelatedByPage = async (pageNo = 0) => {
    try {
      const res = await getProductsByCategory(product.categoryName, pageNo, RELATED_PAGE_SIZE);
      setRelatedProducts(res);
      setRelatedPage(res.page || 0);
      setRelatedTotalPages(res.totalPages || 0);
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const addToCartClick = async () => {
    try {
      await addToCart({ productId: product?.productId, userId: user?.userId });
      await cartCountByUserId(user?.userId);
      refreshCartCount(user?.userId);
      setToastMessage('Item added to cart. GO TO CART');
      setToastSeverity('success');
      setToastOpen(true);
      setSuccessMessage("Item added to cart successfully!");

    } catch (err) {
      console.error("Add to cart error:", err.response?.data?.message || err.message);
      const errorMessage = err.response?.data?.message || "Failed to add to cart";
      if (errorMessage === "User not found") {
        setToastMessage('Please log in to add items to your cart.');
        setToastSeverity('error');
        setToastOpen(true);
      } else {
        // setError(errorMessage);
        setToastMessage(errorMessage);
        setToastSeverity('error');
        setToastOpen(true);
      }
    }
  };

  const similarProducts = async () => {
    try {

    } catch (err) {
      console.error("Error fetching similar products:", err);
    }
  };

    const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setToastOpen(false);
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
                && `In stock (${product.stockQuantity} available)`
              }
            </Typography>

            {/* {successMessage && (
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#e6f4ea",
                  border: "1px solid #b7e1cd",
                }}
              >
                <Typography sx={{ color: "#1e7e34", fontWeight: 500 }}>
                  ✔ {successMessage}
                </Typography>
              </Box>
            )} */}

            {/* CTA */}
            <Button
              variant="contained"
              size="small"
              onClick={addToCartClick}
              disabled={product.stockQuantity === 0}
              sx={{
                px: 4,
                textTransform: "none",
                fontWeight: "bold",
                backgroundColor:
                  product.stockQuantity > 0 ? "#0f172a" : "#9ca3af",

                cursor:
                  product.stockQuantity > 0 ? "pointer" : "not-allowed",

                "&:hover": {
                  backgroundColor:
                    product.stockQuantity > 0 ? "#1e293b" : "#9ca3af",
                },

                "&.Mui-disabled": {
                  backgroundColor: "#9ca3af",
                  color: "#fff",
                },
              }}
            >
              {product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
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
          <RelatedProducts relatedProducts={relatedProducts} />
          {relatedTotalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={relatedTotalPages}
                page={relatedPage + 1}
                onChange={(e, value) => fetchRelatedByPage(value - 1)}
              />
            </Box>
          )}
          <SimilarProduct similarProductsData={similarProductsData} />
          <ProductReviews reviews={reviews} />
          
        </Box>
      </Container>
      <Toast open={toastOpen} message={toastMessage} severity={toastSeverity} onClose={handleToastClose} />

    </>


  );
};

export default ProductDetails;
