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
  Pagination,
  Collapse
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
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
  const [imageTilt, setImageTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [highlightsOpen, setHighlightsOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);

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

  const handleImageHover = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    const rotateY = ((x / box.width) - 0.5) * 18;
    const rotateX = ((y / box.height) - 0.5) * -18;

    setImageTilt({
      rotateX,
      rotateY,
      scale: 1.06,
    });
  };

  const handleImageLeave = () => {
    setImageTilt({ rotateX: 0, rotateY: 0, scale: 1 });
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
        <CircularProgress size={50} sx={{ color: '#2563eb' }} />
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
      <Container maxWidth="lg" sx={{ mt: 5, mb: 2 }}>

        <Grid container spacing={6}>

          {/* IMAGE */}
          <Grid size={5}>
            <Box
              onMouseMove={handleImageHover}
              onMouseLeave={handleImageLeave}
              sx={{
                position: "sticky",
                top: 90,
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                p: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 420,
                background: "#f8fafc",
                overflow: "hidden",
                transition: "box-shadow 0.35s ease",
                "&:hover": {
                  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)",
                },
              }}
            >
              {product.discount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    backgroundColor: "#e11d48",
                    color: "#fff",
                    px: 1.25,
                    py: 0.4,
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: "6px",
                    zIndex: 2,
                  }}
                >
                  {product.discount}% OFF
                </Box>
              )}

              <Box
                component="img"
                className="product-image"
                src={`http://localhost:1234/image/product/${product.productImageUrl}`}
                alt={product.productName}
                sx={{
                  maxHeight: 380,
                  objectFit: "contain",
                  transition: "transform 0.2s ease, filter 0.2s ease",
                  transform: `perspective(1000px) rotateX(${imageTilt.rotateX}deg) rotateY(${imageTilt.rotateY}deg) scale(${imageTilt.scale})`,
                  filter: imageTilt.scale > 1 ? "drop-shadow(0 20px 30px rgba(15, 23, 42, 0.2))" : "none",
                }}
              />
            </Box>
          </Grid>

          {/* DETAILS */}
          <Grid size={7}>

            {/* CATEGORY */}
            <Typography
              variant="body2"
              sx={{
                display: "inline-block",
                color: "#2563eb",
                fontWeight: 600,
                fontSize: 13,
                mb: 1.25,
                backgroundColor: "#eaf1ff",
                px: 1.25,
                py: 0.4,
                borderRadius: "999px",
              }}
            >
              {product.categoryName}
            </Typography>

            {/* PRODUCT NAME */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#0f172a",
                mb: 2,
                lineHeight: 1.3,
              }}
            >
              {product.productName}
            </Typography>

            <Box sx={{ mb: 2.5, display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 1.25 }}>

              {/* Discounted Price */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                ₹{product.discountPrice || product.productPrice}
              </Typography>

              {/* Original Price */}
              {product.discount > 0 && (
                <Typography
                  component="span"
                  sx={{
                    textDecoration: "line-through",
                    color: "#94a3b8",
                    fontSize: 18,
                  }}
                >
                  ₹{product.productPrice}
                </Typography>
              )}

              {/* Discount Percentage */}
              {product.discount > 0 && (
                <Chip
                  label={`${product.discount}% OFF`}
                  size="small"
                  sx={{
                    backgroundColor: "#e11d48",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                />
              )}
            </Box>

            {/* You Save */}
            {product.discount > 0 && (
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: "#15803d",
                  fontWeight: 600,
                  display: "inline-block",
                  backgroundColor: "#f0fdf4",
                  px: 1.25,
                  py: 0.5,
                  borderRadius: "8px",
                }}
              >
                You save ₹{product.productPrice - product.discountPrice}
              </Typography>
            )}

            <Divider sx={{ my: 2, borderColor: "#eef1f6" }} />

            {/* SERVICE INFO */}
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ mb: 3, flexWrap: "wrap", rowGap: 1.5 }}
            >
              {[
                { icon: "🚚", label: "Free Delivery" },
                { icon: "🔄", label: "7-Day Return" },
                { icon: "💵", label: "Cash on Delivery" },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    backgroundColor: "#f8fafc",
                    border: "1px solid #eef1f6",
                    borderRadius: "999px",
                    px: 1.5,
                    py: 0.6,
                  }}
                >
                  <Typography sx={{ fontSize: 15, lineHeight: 1 }}>{item.icon}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 2, borderColor: "#eef1f6" }} />

            {/* DESCRIPTION */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1 }}>
              <Box sx={{ width: 4, height: 20, borderRadius: 2, backgroundColor: "#2563eb" }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#0f172a" }}
              >
                Description
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.7 }}
            >
              {product.productDescription}
            </Typography>

            {/* STOCK */}
            <Typography
              variant="body2"
              sx={{
                mb: 1.5,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                color:
                  product.stockQuantity > 0
                    ? "#15803d"
                    : "#dc2626",
              }}
            >
              {product.stockQuantity > 0 && (
                <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#15803d", display: "inline-block" }} />
              )}
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mt: 2 }}>
              <Button
                variant="contained"
                size="small"
                onClick={addToCartClick}
                disabled={product.stockQuantity === 0}
                sx={{
                  px: 2,
                  py: 0.8,
                  minHeight: 32,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 12.5,
                  borderRadius: "8px",
                  boxShadow: "none",
                  backgroundColor:
                    product.stockQuantity > 0 ? "#2563eb" : "#9ca3af",
                  cursor:
                    product.stockQuantity > 0 ? "pointer" : "not-allowed",
                  marginTop: 0,
                  "&:hover": {
                    backgroundColor:
                      product.stockQuantity > 0 ? "#1d4ed8" : "#9ca3af",
                    boxShadow: product.stockQuantity > 0 ? "0 6px 16px rgba(37,99,235,0.25)" : "none",
                  },

                  "&.Mui-disabled": {
                    backgroundColor: "#9ca3af",
                    color: "#fff",
                  },
                }}
              >
                {product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>

              <Button
                variant="outlined"
                size="small"
                disabled={product.stockQuantity === 0}
                sx={{
                  px: 2,
                  py: 0.8,
                  minHeight: 32,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 12.5,
                  borderRadius: "8px",
                  borderColor: "#2563eb",
                  color: "#2563eb",
                  backgroundColor: "#fff",
                  cursor:
                    product.stockQuantity > 0 ? "pointer" : "not-allowed",
                  "&:hover": {
                    borderColor: "#1d4ed8",
                    backgroundColor: "#eff6ff",
                  },
                  "&.Mui-disabled": {
                    borderColor: "#9ca3af",
                    color: "#9ca3af",
                    backgroundColor: "#fff",
                  },
                }}
              >
                Buy Now
              </Button>
              </Box>

            {/* Product Highlight */}
            <Box
              onClick={() => setHighlightsOpen((isOpen) => !isOpen)}
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.25, mb: 1, cursor: "pointer", mt: 3 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box sx={{ width: 4, height: 20, borderRadius: 2, backgroundColor: "#2563eb" }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#0f172a" }}
              >
                Product Highlights
              </Typography>
              </Box>
              {highlightsOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </Box>
            <Collapse in={highlightsOpen}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                {product.productDescription}
              </Typography>
            </Collapse>

            {/* Product All Details */}
            <Box
              onClick={() => setDetailsOpen((isOpen) => !isOpen)}
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.25, mb: 1, cursor: "pointer" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box sx={{ width: 4, height: 20, borderRadius: 2, backgroundColor: "#2563eb" }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#0f172a" }}
              >
                All Details
              </Typography>
              </Box>
              {detailsOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </Box>
            <Collapse in={detailsOpen}>
              <Box sx={{ mb: 2, color: "#475569" }}>
                <Typography variant="body2">Category: {product.categoryName}</Typography>
                <Typography variant="body2">Available stock: {product.stockQuantity}</Typography>
                <Typography variant="body2">Price: ₹{product.discountPrice || product.productPrice}</Typography>
              </Box>
            </Collapse>

          </Grid>
        </Grid>
        {/* RELATED PRODUCTS */}
        <Box sx={{ mt: 8 }}>
          <Divider sx={{ mb: 1, borderColor: "#eef1f6" }} />
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
                shape="rounded"
                sx={{
                  '& .MuiPaginationItem-root': { fontWeight: 600, color: '#475569' },
                  '& .MuiPaginationItem-root.Mui-selected': {
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#1d4ed8' },
                  },
                }}
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
