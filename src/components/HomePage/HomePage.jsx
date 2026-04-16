import React, { use } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Container
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import { findAllProduct, findAllCategory, getProductsByCategory, findAllSponsoredProducts, recentViewPost, recentViewGet, fetchRecommendedProducts } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import CarouselHome from './CarouselHome';

const PAGE_SIZE = 50;

const HomePage = ({ user }) => {
  const [products, setProducts] = React.useState([]);
  const [sponsoredProducts, setSponsoredProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [sliderIndex, setSliderIndex] = React.useState(0);
  const [recentViewsProducts, setRecentViewsProducts] = React.useState([]);
  const [recommendedProducts, setRecommendedProducts] = React.useState([]);
  const sponsoredRef = React.useRef(null);
  const recentRef = React.useRef(null);
  const recommendedRef = React.useRef(null);

  const navigate = useNavigate();

  console.log("HomePage Component - User:", user?.userId);

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
      // const payload = { page: pageNo, pageSize: PAGE_SIZE };
      const res = await getProductsByCategory(categoryName, pageNo, PAGE_SIZE);

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

  let lastViewedId = null;

  const handleProductClick = (product) => {
    if (user?.userId) {
      recentViewPost(user.userId, product.productId);
    } else {
      console.log("User not logged in. Cannot track recent view.");
    }
    navigate(`/product/${product.productId}`);
  };

  const fetchRecentViews = async (userId) => {
    try {
      const res = await recentViewGet(userId);
      setRecentViewsProducts(res || []);
    } catch (err) {
      console.error("User not logged in. Cannot fetch recent views:", err);
    }
  };

  const fetchRecommended = async (userId) => {
    try {
      const res = await fetchRecommendedProducts(userId);
      setRecommendedProducts(res || []);
    } catch (err) {
      console.error("User not logged in. Cannot fetch recommendations:", err);
    }
  };

  console.log("Recent views:", recentViewsProducts);

  React.useEffect(() => {
    if (user?.userId) {
      fetchRecentViews(user.userId);
      fetchRecommended(user.userId);
    }
    else {
      console.log("User not logged in. Skipping fetch of recent views or recommendations.");
    }
    fetchCategories();
    fetchAllProducts(0);
  }, []);

  const sliderProducts = products.filter(p => p.isSponsored === true);

  console.log("Slider products:", sponsoredProducts);

  const scrollSponsoredRecentViews = (dir = 'right') => {
    const el = recentRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  const scrollSponsoredRecommended = (dir = 'right') => {
    const el = recommendedRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

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
              onClick={() => {
                setSelectedCategoryId(null);
                fetchAllProducts(0);
              }}
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
      <CarouselHome products={sponsoredProducts} />
      {/* {sponsoredProducts.length > 0 && (
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
      )} */}

      {user?.userId && (
        <>
      {/* Recent View Products */}
      {recentViewsProducts && (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                borderRadius: 3,
                background: 'linear-gradient(180deg,#e6f0ff 0%, #f8fbff 100%)',
                p: 3,
                overflow: 'hidden'
              }}
            >
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                You may also like
              </Typography>

              <Box
                ref={recentRef}
                sx={{
                  display: 'flex',
                  gap: 3,
                  overflowX: 'auto',
                  px: 1,
                  py: 1,
                  '&::-webkit-scrollbar': { display: 'none' }
                }}
              >
                {recentViewsProducts.length === 0 && (
                  <Typography sx={{ mt: 2 }}>
                    No recently viewed products found.
                  </Typography>
                )}
                {recentViewsProducts.map((sp) => (
                  <Box
                    key={sp.productId}
                    sx={{
                      minWidth: 240,
                      flex: '0 0 auto',
                      borderRadius: 3,
                      backgroundColor: '#fff',
                      p: 1,
                      boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
                      transition: 'transform 200ms, box-shadow 200ms, background-color 200ms',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 8px 20px rgba(15,23,42,0.12)',
                        backgroundColor: '#fbfdff'
                      }
                    }}
                    onClick={() => navigate(`/product/${sp.productId}`)}
                  >
                    <Box
                      component="img"
                      src={`http://localhost:1234/image/product/${sp.productImageUrl}`}
                      sx={{ width: '100%', height: 180, objectFit: 'contain', borderRadius: 2 }}
                    />
                    <Typography sx={{ mt: 1 }}>
                      {limitWords(sp.productName, 3)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <IconButton
              onClick={() => scrollSponsoredRecentViews('left')}
              sx={{ position: 'absolute', right: 64, top: '50%', transform: 'translateY(-50%)', bgcolor: '#fff' }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            <IconButton
              onClick={() => scrollSponsoredRecentViews('right')}
              sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: '#fff' }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Container>
      )}

      {/* Recommended Products */}
      {recommendedProducts && (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                borderRadius: 3,
                background: 'linear-gradient(180deg,#e6f0ff 0%, #f8fbff 100%)',
                p: 3,
                overflow: 'hidden'
              }}
            >
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                Recommended for you
              </Typography>

              <Box
                ref={recommendedRef}
                sx={{
                  display: 'flex',
                  gap: 3,
                  overflowX: 'auto',
                  px: 1,
                  py: 1,
                  '&::-webkit-scrollbar': { display: 'none' }
                }}
              >
                {recommendedProducts.length === 0 && (
                  <Typography sx={{ mt: 2 }}>
                    No recommended products found.
                  </Typography>
                )}
                {recommendedProducts.map((sp) => (
                  <Box
                    key={sp.productId}
                    sx={{
                      minWidth: 240,
                      flex: '0 0 auto',
                      borderRadius: 3,
                      backgroundColor: '#fff',
                      p: 1,
                      boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
                      transition: 'transform 200ms, box-shadow 200ms, background-color 200ms',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 8px 20px rgba(15,23,42,0.12)',
                        backgroundColor: '#fbfdff'
                      }
                    }}
                    onClick={() => navigate(`/product/${sp.productId}`)}
                  >
                    <Box
                      component="img"
                      src={`http://localhost:1234/image/product/${sp.productImageUrl}`}
                      sx={{ width: '100%', height: 180, objectFit: 'contain', borderRadius: 2 }}
                    />
                    <Typography sx={{ mt: 1 }}>
                      {limitWords(sp.productName, 3)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <IconButton
              onClick={() => scrollSponsoredRecommended('left')}
              sx={{ position: 'absolute', right: 64, top: '50%', transform: 'translateY(-50%)', bgcolor: '#fff' }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            <IconButton
              onClick={() => scrollSponsoredRecommended('right')}
              sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: '#fff' }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Container>
      )}
        </>
      )}

      {/* PRODUCT LIST */}
      <Container maxWidth="lg" sx={{ pb: 5 }}>
        {/* <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Products
        </Typography> */}

        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid size={3} xs={12} sm={6} md={4} lg={3} key={product.productId}>
  <Box
    onClick={() => handleProductClick(product)}
    sx={{
      cursor: "pointer",
      borderRadius: 3,
      overflow: "hidden",
      backgroundColor: "#ffffff",
      border: "1px solid #e5e7eb",
      transition: "all 0.3s ease",
      position: "relative",

      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
      },

      "&:hover .addToCartBtn": {
        opacity: 1,
        transform: "translateY(0)",
      },
    }}
  >
    {/* IMAGE SECTION */}
    <Box
      sx={{
        position: "relative",
        height: 220,
        backgroundColor: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* DISCOUNT */}
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
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 1,
          }}
        >
          {product.discount}% OFF
        </Box>
      )}

      {/* IMAGE */}
      <Box
        component="img"
        src={`http://localhost:1234/image/product/${product.productImageUrl}`}
        sx={{
          maxHeight: "90%",
          maxWidth: "90%",
          objectFit: "contain",
        }}
      />

      {/* ADD TO CART BUTTON (HOVER) */}
      <Box
        className="addToCartBtn"
        onClick={(e) => {
          e.stopPropagation(); // prevent opening product page
          handleAddToCart(product);
        }}
        sx={{
          position: "absolute",
          bottom: 10,
          right: 10,
          backgroundColor: "#0f172a",
          color: "#fff",
          borderRadius: "50%",
          width: 42,
          height: 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
          opacity: 0,
          transform: "translateY(10px)",
          transition: "all 0.3s ease",

          "&:hover": {
            backgroundColor: "#1e293b",
          },
        }}
      >
        <ShoppingCartIcon fontSize="small" />
      </Box>
    </Box>

    {/* DETAILS */}
    <Box sx={{ p: 1.5 }}>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: 14,
          height: 36,
          overflow: "hidden",
        }}
      >
        {limitWords(product.productName, 5)}
      </Typography>

      <Box sx={{ mt: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 16, mr: 1 }}>
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
                fontSize: 13,
                mr: 1,
              }}
            >
              ₹{product.productPrice}
            </Typography>

            <Typography
              component="span"
              sx={{
                color: "#16a34a",
                fontSize: 12,
                fontWeight: 600,
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

        {totalPages >= 1 && (
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