import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Container,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { searchProducts } from "../../services/apiService";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q");

  console.log("prodyctv search", products);

  const limitWords = (text, limit = 18) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.length <= limit ? text : words.slice(0, limit).join(' ') + '...';
  };

  useEffect(() => {
  const fetchSearchResults = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const payload = { query };
      const res = await searchProducts(payload);

      console.log("API response:", res);

      // ✅ FIX HERE
      setProducts(res?.products || []);
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    }
    setLoading(false);
  };

  fetchSearchResults();
}, [query]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Search Results for "{query}"
      </Typography>

      {loading && (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && products.length === 0 && (
        <Typography>No products found.</Typography>
      )}

      <Grid container spacing={3}>
        {products.map((product) => (
                    <Grid size={3} key={product.productId}>
                      <Box
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/product/${product.productId}`)}
                      >
                        {/* IMAGE */}
                        <Box
                          sx={{
                            position: "relative",
                            borderRadius: 3,
                            overflow: "hidden",
                            backgroundColor: "#f8fafc",
                          }}
                        >
                          <Box
                            component="img"
                            src={`http://localhost:1234/image/product/${product.productImageUrl}`}
                            sx={{
                              width: "100%",
                              height: 260,
                              objectFit: "cover",
                            }}
                          />
        
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 10,
                              left: 10,
                              backgroundColor: "#ffffff",
                              px: 1,
                              py: 0.3,
                              borderRadius: 1,
                              fontSize: 14,
                              fontWeight: 600,
                            }}
                          >
                            4.3 ⭐
                          </Box>
                        </Box>
        
                        {/* DETAILS */}
                        <Box sx={{ mt: 1 }}>
                          <Typography fontWeight={700} fontSize={14}>
                            {limitWords(product.productName, 4)}
                          </Typography>
        
                          <Typography variant="body2" sx={{ color: "#64748b", fontSize: 13 }}>
                            {limitWords(product.productDescription, 6)}
                          </Typography>
        
                          <Box sx={{ mt: 0.5 }}>
                            <Typography
                              component="span"
                              sx={{
                                textDecoration: "line-through",
                                color: "#94a3b8",
                                fontSize: 13,
                                mr: 1,
                              }}
                            >
                              ₹{Number(product.productPrice)}
                            </Typography>
        
                            <Typography component="span" sx={{ fontWeight: 700 }}>
                              ₹{product.discountPrice}
                            </Typography>
                          </Box>
        
                          <Typography
                            sx={{
                              color: "#1d4ed8",
                              fontWeight: 600,
                              fontSize: 14,
                              mt: 0.5,
                            }}
                          >
                            Buy at ₹{product.discountPrice}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
      </Grid>
    </Container>
  );
};

export default SearchResults;