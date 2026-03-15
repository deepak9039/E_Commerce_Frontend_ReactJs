import React from 'react';
import {
  Grid,
  Typography,
  Box,
  IconButton,
  Container
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { findAllProduct, findAllCategory, getProductsByCategory, findAllSponsoredProducts } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 50;

const HomePage = () => {
  const [products, setProducts] = React.useState([]);
  const [sponsoredProducts, setSponsoredProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [sliderIndex, setSliderIndex] = React.useState(0);

  const navigate = useNavigate();

  const fetchAllProducts = async (pageNo = 0) => {
    try {
      const payload = { page: pageNo, pageSize: PAGE_SIZE };
      const res = await findAllProduct(payload);
      const sponsoredProducts = await findAllSponsoredProducts();
      setSponsoredProducts(sponsoredProducts?.products || []);
      setProducts(res.products || []);
      setPage(res.page || 0);
      setTotalPages(res.totalPages || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await findAllCategory();
      setCategories(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategoryClick = async (categoryName, pageNo = 0) => {
    try {
      setSelectedCategoryId(categoryName);
      const payload = { page: pageNo, pageSize: PAGE_SIZE };
      const res = await getProductsByCategory(categoryName, payload);

      setProducts(res.products || []);
      setPage(res.page || 0);
      setTotalPages(res.totalPages || 0);
    } catch (err) {
      setProducts([]);
    }
  };

  const handlePageChange = (e, value) => {
    const newPage = value - 1;
    selectedCategoryId
      ? handleCategoryClick(selectedCategoryId, newPage)
      : fetchAllProducts(newPage);
  };

  const limitWords = (text, limit = 18) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.length <= limit ? text : words.slice(0, limit).join(' ') + '...';
  };

  React.useEffect(() => {
    fetchCategories();
    fetchAllProducts(0);
  }, []);

  const sliderProducts = products.filter(p => p.isSponsored === true);

  console.log("Slider products:", sponsoredProducts);

  return (
    <>
      {/* ================= CATEGORY BAR ================= */}
      <Box
      sx={{
          position: "sticky",
          top: 64,
          zIndex: 1000,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}>
      <Container maxWidth="lg" sx={{
          position: "sticky",
          top: 64,
          zIndex: 1000,
          backgroundColor: "#ffffff",
          py: 1,
        }}>
      
        <Box
          sx={{
            px: 3,
            display: "flex",
            alignItems: "center",
            overflowX: "auto",
            gap: 4,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box
            onClick={() => fetchAllProducts(0)}
            sx={{
              cursor: "pointer",
              fontWeight: 600,
              color: !selectedCategoryId ? "primary.main" : "#475569",
              borderBottom: !selectedCategoryId ? "2px solid #1976d2" : "none",
              pb: 0.5,
            }}
          >
            <Typography fontWeight={600}>All</Typography>
          </Box>

          {categories.map((cat) => (
            <Box
              key={cat.id}
              onClick={() => handleCategoryClick(cat.categoryName, 0)}
              sx={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                color:
                  selectedCategoryId === cat.categoryName
                    ? "primary.main"
                    : "#475569",
                borderBottom:
                  selectedCategoryId === cat.categoryName
                    ? "2px solid #1976d2"
                    : "none",
                pb: 0.5,
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                {cat.categoryName}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container> 
      </Box>
      {/* HERO SLIDER */}
      {sponsoredProducts.length > 0 && (
        <Box
          sx={{
            width: '100%',
            height: 300,
            backgroundColor: '#fde2e4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            mb: 4,
          }}
        >
          <IconButton
            onClick={() =>
              setSliderIndex(
                sliderIndex === 0 ? sponsoredProducts.length - 1 : sliderIndex - 1
              )
            }
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <Grid
            container
            alignItems="center"
            spacing={4}
            onClick={() =>
              navigate(`/product/${sponsoredProducts[sliderIndex].productId}`)
            }
            sx={{ cursor: 'pointer' }}
          >
            <Grid item xs={6}>
              <Typography variant="h4" fontWeight="bold">
                {limitWords(sponsoredProducts[sliderIndex]?.productName, 10)}
              </Typography>

              {/* SLIDER PRICE UI */}
              <Box sx={{ mt: 2 }}>
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 700,
                    fontSize: 22,
                    mr: 2
                  }}
                >
                  ₹{sponsoredProducts[sliderIndex].discount > 0
                    ? sponsoredProducts[sliderIndex].discountPrice
                    : sponsoredProducts[sliderIndex].productPrice}
                </Typography>

                {sponsoredProducts[sliderIndex].discount > 0 && (
                  <>
                    <Typography
                      component="span"
                      sx={{
                        textDecoration: "line-through",
                        color: "#64748b",
                        mr: 1
                      }}
                    >
                      ₹{sponsoredProducts[sliderIndex].productPrice}
                    </Typography>

                    <Typography
                      component="span"
                      sx={{
                        color: "#16a34a",
                        fontWeight: 600
                      }}
                    >
                      {sponsoredProducts[sliderIndex].discount}% OFF
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 260,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {sponsoredProducts[sliderIndex].discount > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      px: 1,
                      py: 0.3,
                      fontSize: 12,
                      fontWeight: 700,
                      borderRadius: 1,
                    }}
                  >
                    {/* {sponsoredProducts[sliderIndex].discount}% OFF */}
                    sponsored
                  </Box>
                )}

                <Box
                  component="img"
                  src={`http://localhost:1234/image/product/${sponsoredProducts[sliderIndex]?.productImageUrl}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <IconButton
            onClick={() =>
              setSliderIndex((sliderIndex + 1) % sponsoredProducts.length)
            }
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      )}

      {/* PRODUCT LIST */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Products
        </Typography> */}

        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={3} key={product.productId}>
              <Box
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/product/${product.productId}`)}
              >
                {/* IMAGE WITH BADGE */}
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 3,
                    overflow: "hidden",
                    backgroundColor: "#f8fafc"
                  }}
                >
                  {product.discount > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        backgroundColor: "#dc2626",
                        color: "#fff",
                        px: 1,
                        py: 0.3,
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: 1,
                      }}
                    >
                      {product.discount}% OFF
                    </Box>
                  )}

                  <Box
                    component="img"
                    src={`http://localhost:1234/image/product/${product.productImageUrl}`}
                    sx={{
                      width: "100%",
                      height: 260,
                      objectFit: "cover",
                    }}
                  />
                </Box>

                {/* DETAILS */}
                <Box sx={{ mt: 1 }}>
                  <Typography fontWeight={700} fontSize={14}>
                    {limitWords(product.productName, 4)}
                  </Typography>

                  <Box sx={{ mt: 0.5 }}>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 700,
                        fontSize: 16,
                        mr: 1
                      }}
                    >
                      ₹{product.discount > 0
                        ? product.discountPrice
                        : product.productPrice}
                    </Typography>

                    {product.discount > 0 && (
                      <>
                        <Typography
                          component="span"
                          sx={{
                            textDecoration: "line-through",
                            color: "#94a3b8",
                            fontSize: 14,
                            mr: 1
                          }}
                        >
                          ₹{product.productPrice}
                        </Typography>

                        <Typography
                          component="span"
                          sx={{
                            color: "#16a34a",
                            fontSize: 13,
                            fontWeight: 600
                          }}
                        >
                          {product.discount}% OFF
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={handlePageChange}
            />
          </Box>
        )}
      </Container>
    </>
  );
};

export default HomePage;