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
import Pagination from '@mui/material/Pagination';


const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = React.useState(0);
  const [page, setPage] = React.useState(0);

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
      const payload = { query, page: page, pageSize: 52 };
      const res = await searchProducts(payload);

      console.log("API response:", res);

      // ✅ FIX HERE
      setProducts(res?.products || []);
      setTotalPages(res?.totalPages || 0);
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    }
    setLoading(false);
  };

  fetchSearchResults();
}, [query, page]);

  const handlePageChange = (event, value) => {
    setPage(value - 1); // Update the page state (value is 1-based, so subtract 1)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3.5 }}>
        <Box sx={{ width: 4, height: 26, borderRadius: 2, backgroundColor: '#2563eb' }} />
        <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 700, color: '#0f172a' }}>
          Search Results for "{query}"
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress sx={{ color: '#2563eb' }} />
        </Box>
      )}

      {!loading && products.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            borderRadius: '16px',
            border: '1px dashed #cbd5e1',
            backgroundColor: '#f8fafc',
          }}
        >
          <Typography sx={{ color: '#334155', fontWeight: 700 }}>No products found.</Typography>
          <Typography sx={{ color: '#64748b', fontSize: 13, mt: 0.5 }}>
            Try a different keyword or check the spelling.
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {products.map((product) => (
                    <Grid size={3} key={product.productId}>
                      <Box
                        sx={{
                          cursor: 'pointer',
                          borderRadius: "16px",
                          border: "1px solid #e5e7eb",
                          backgroundColor: "#ffffff",
                          overflow: "hidden",
                          transition: "border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
                          "&:hover": {
                            borderColor: "#cbd5e1",
                            transform: "translateY(-6px)",
                            boxShadow: "0 16px 32px rgba(15,23,42,0.14)",
                          },
                        }}
                        onClick={() => navigate(`/product/${product.productId}`)}
                      >
                        {/* IMAGE */}
                        <Box
                          sx={{
                            position: "relative",
                            overflow: "hidden",
                            backgroundColor: "#f8fafc",
                          }}
                        >
                          <Box
                            component="img"
                            src={`http://localhost:1234/image/product/${product.productImageUrl}`}
                            sx={{
                              width: "100%",
                              height: 220,
                              objectFit: "contain",
                            }}
                          />
        
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 10,
                              left: 10,
                              backgroundColor: "rgba(15,23,42,0.85)",
                              color: "#fff",
                              px: 1.1,
                              py: 0.35,
                              borderRadius: "6px",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            4.3 ⭐
                          </Box>
                        </Box>
        
                        {/* DETAILS */}
                        <Box sx={{ p: 1.75 }}>
                          <Typography fontWeight={600} sx={{ fontSize: 14, color: "#1e293b", height: 20, overflow: "hidden" }}>
                            {limitWords(product.productName, 4)}
                          </Typography>
        
                          <Typography variant="body2" sx={{ color: "#64748b", fontSize: 12.5, mt: 0.5, height: 32, overflow: "hidden" }}>
                            {limitWords(product.productDescription, 6)}
                          </Typography>
        
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                            <Typography component="span" sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>
                              ₹{product.discountPrice}
                            </Typography>

                            <Typography
                              component="span"
                              sx={{
                                textDecoration: "line-through",
                                color: "#94a3b8",
                                fontSize: 13,
                              }}
                            >
                              ₹{Number(product.productPrice)}
                            </Typography>
                          </Box>
        
                          <Typography
                            sx={{
                              color: "#2563eb",
                              fontWeight: 600,
                              fontSize: 13,
                              mt: 0.75,
                            }}
                          >
                            Buy at ₹{product.discountPrice || product.productPrice}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
      </Grid>

      {totalPages >= 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 600,
                color: '#475569',
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                backgroundColor: '#2563eb',
                color: '#fff',
                '&:hover': { backgroundColor: '#1d4ed8' },
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default SearchResults;
