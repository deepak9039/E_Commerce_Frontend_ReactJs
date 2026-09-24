import React from 'react';
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
import Toast from '../Common/Toast';
import Pagination from '@mui/material/Pagination';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import { findAllProduct, findAllCategory, getProductsByCategory, findAllSponsoredProducts, recentViewPost, recentViewGet, fetchRecommendedProducts, addToCart } from '../../services/apiService';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import CarouselHome from './CarouselHome';
import DiscountProductsSlider from '../Product/DiscountProductsSlider';
import OfferModal from '../OfferComponent/OfferModal';

const PAGE_SIZE = 52;

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
  const { refreshCartCount } = useCart();
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  const [toastSeverity, setToastSeverity] = React.useState("success");
  const [offerOpen, setOfferOpen] = React.useState(false);
  const offerTimerRef = React.useRef(null);

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

  const limitWords = (text, limit = 10) => {
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

  const handleAddToCart = async (e, product) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      await addToCart({ productId: product?.productId, userId: user?.userId });
      refreshCartCount(user?.userId);
      setToastMessage('Item added to cart. GO TO CART');
      setToastSeverity('success');
      setToastOpen(true);
    } catch (err) {
      const errMessage = err?.response?.data?.message || 'Failed to add to cart';
      setToastMessage(errMessage === 'User not found' ? 'Please log in to add items to your cart.' : errMessage);
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setToastOpen(false);
  };

  const handleOfferClose = () => {
    setOfferOpen(false);
    if (offerTimerRef.current) {
      clearTimeout(offerTimerRef.current);
      offerTimerRef.current = null;
    }
  };

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

  // Show offer modal on first visit and auto-close after 20s
  React.useEffect(() => {
    setOfferOpen(true);
    offerTimerRef.current = setTimeout(() => {
      setOfferOpen(false);
      offerTimerRef.current = null;
    }, 200000);

    return () => {
      if (offerTimerRef.current) {
        clearTimeout(offerTimerRef.current);
      }
    };
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
      <OfferModal open={offerOpen} handleClose={handleOfferClose} />
      {/* ================= CATEGORY BAR ================= */}
      <Box
        sx={{
          position: "sticky",
          top: 64,
          zIndex: 1000,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
        }}>
        <Container maxWidth="lg" sx={{
          position: "sticky",
          top: 64,
          zIndex: 1000,
          backgroundColor: "#ffffff",
          py: 1.25,
        }}>

          <Box
            sx={{
              px: 3,
              display: "flex",
              alignItems: "center",
              overflowX: "auto",
              gap: 1,
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
                whiteSpace: "nowrap",
                px: 1.75,
                py: 0.6,
                borderRadius: "999px",
                backgroundColor: !selectedCategoryId ? "#e8f0fe" : "transparent",
                transition: "background-color 180ms ease",
                "&:hover": {
                  backgroundColor: !selectedCategoryId ? "#e8f0fe" : "#f1f5f9",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: !selectedCategoryId ? "#2563eb" : "#475569",
                }}
              >
                All
              </Typography>
            </Box>

            {categories.map((cat) => (
              <Box
                key={cat.id}
                onClick={() => handleCategoryClick(cat.categoryName, 0)}
                sx={{
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  px: 1.75,
                  py: 0.6,
                  borderRadius: "999px",
                  backgroundColor:
                    selectedCategoryId === cat.categoryName ? "#e8f0fe" : "transparent",
                  transition: "background-color 180ms ease",
                  "&:hover": {
                    backgroundColor:
                      selectedCategoryId === cat.categoryName ? "#e8f0fe" : "#f1f5f9",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: selectedCategoryId === cat.categoryName ? 600 : 500,
                    color:
                      selectedCategoryId === cat.categoryName ? "#2563eb" : "#475569",
                  }}
                >
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
            <Container maxWidth="lg" sx={{ pt: 4 }}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    borderRadius: '18px',
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    p: { xs: 2, md: 3 },
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                    <Box sx={{ width: 4, height: 26, borderRadius: 2, background: '#2563eb' }} />
                    <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 700, color: '#0f172a' }}>
                      You may also like
                    </Typography>
                  </Box>

                  <Box
                    ref={recentRef}
                    sx={{
                      display: 'flex',
                      gap: 2.5,
                      overflowX: 'auto',
                      px: 0.5,
                      py: 0.5,
                      '&::-webkit-scrollbar': { display: 'none' }
                    }}
                  >
                    {recentViewsProducts.length === 0 && (
                      <Typography sx={{ color: '#64748b', fontSize: 14 }}>
                        No recently viewed products found.
                      </Typography>
                    )}
                    {recentViewsProducts.map((sp) => (
                      <Box
                        key={sp.productId}
                        sx={{
                          minWidth: 200,
                          flex: '0 0 auto',
                          borderRadius: '14px',
                          border: '1px solid #eef1f6',
                          backgroundColor: '#fff',
                          p: 1.5,
                          transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 24px rgba(15,23,42,0.1)',
                            borderColor: '#cbd5e1',
                          }
                        }}
                        onClick={() => navigate(`/product/${sp.productId}`)}
                      >
                        <Box sx={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '10px',
                          height: 160,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                        }}>
                          <Box
                            component="img"
                            src={`http://localhost:1234/image/product/${sp.productImageUrl}`}
                            sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </Box>
                        <Typography sx={{ mt: 1.25, fontSize: 13, fontWeight: 500, color: '#1e293b' }}>
                          {limitWords(sp.productName, 3)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <IconButton
                  onClick={() => scrollSponsoredRecentViews('left')}
                  sx={{
                    position: 'absolute',
                    right: 64,
                    top: 58,
                    bgcolor: '#fff',
                    border: '1px solid #e2e8f0',
                    width: 36,
                    height: 36,
                    boxShadow: '0 4px 14px rgba(15,23,42,0.12)',
                    '&:hover': { bgcolor: '#f8fafc' },
                  }}
                >
                  <ArrowBackIosNewIcon sx={{ fontSize: 15 }} />
                </IconButton>

                <IconButton
                  onClick={() => scrollSponsoredRecentViews('right')}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: 58,
                    bgcolor: '#fff',
                    border: '1px solid #e2e8f0',
                    width: 36,
                    height: 36,
                    boxShadow: '0 4px 14px rgba(15,23,42,0.12)',
                    '&:hover': { bgcolor: '#f8fafc' },
                  }}
                >
                  <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
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
                    borderRadius: '18px',
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    p: { xs: 2, md: 3 },
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                    <Box sx={{ width: 4, height: 26, borderRadius: 2, background: '#2563eb' }} />
                    <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 700, color: '#0f172a' }}>
                      Recommended for you
                    </Typography>
                  </Box>

                  <Box
                    ref={recommendedRef}
                    sx={{
                      display: 'flex',
                      gap: 2.5,
                      overflowX: 'auto',
                      px: 0.5,
                      py: 0.5,
                      '&::-webkit-scrollbar': { display: 'none' }
                    }}
                  >
                    {recommendedProducts.length === 0 && (
                      <Typography sx={{ color: '#64748b', fontSize: 14 }}>
                        No recommended products found.
                      </Typography>
                    )}
                    {recommendedProducts.map((sp) => (
                      <Box
                        key={sp.productId}
                        sx={{
                          minWidth: 200,
                          flex: '0 0 auto',
                          borderRadius: '14px',
                          border: '1px solid #eef1f6',
                          backgroundColor: '#fff',
                          p: 1.5,
                          transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 24px rgba(15,23,42,0.1)',
                            borderColor: '#cbd5e1',
                          }
                        }}
                        onClick={() => navigate(`/product/${sp.productId}`)}
                      >
                        <Box sx={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '10px',
                          height: 160,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                        }}>
                          <Box
                            component="img"
                            src={`http://localhost:1234/image/product/${sp.productImageUrl}`}
                            sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </Box>
                        <Typography sx={{ mt: 1.25, fontSize: 13, fontWeight: 500, color: '#1e293b' }}>
                          {limitWords(sp.productName, 3)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <IconButton
                  onClick={() => scrollSponsoredRecommended('left')}
                  sx={{
                    position: 'absolute',
                    right: 64,
                    top: 58,
                    bgcolor: '#fff',
                    border: '1px solid #e2e8f0',
                    width: 36,
                    height: 36,
                    boxShadow: '0 4px 14px rgba(15,23,42,0.12)',
                    '&:hover': { bgcolor: '#f8fafc' },
                  }}
                >
                  <ArrowBackIosNewIcon sx={{ fontSize: 15 }} />
                </IconButton>

                <IconButton
                  onClick={() => scrollSponsoredRecommended('right')}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: 58,
                    bgcolor: '#fff',
                    border: '1px solid #e2e8f0',
                    width: 36,
                    height: 36,
                    boxShadow: '0 4px 14px rgba(15,23,42,0.12)',
                    '&:hover': { bgcolor: '#f8fafc' },
                  }}
                >
                  <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Box>
            </Container>
          )}
        </>
      )}

      <Box sx={{ backgroundColor: '#f5f7fa', mx: { xs: 2, md: 4 }, my: 3, borderRadius: '18px' }} >
        <DiscountProductsSlider />
      </Box>

      {/* PRODUCT LIST */}
      <Container maxWidth="lg" sx={{ pb: 6, pt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box sx={{ width: 4, height: 26, borderRadius: 2, background: '#2563eb' }} />
          <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 700, color: '#0f172a' }}>
            {selectedCategoryId ? selectedCategoryId : 'All products'}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid size={3} xs={12} sm={6} md={4} lg={3} key={product.productId}>
              <Box
                onClick={() => handleProductClick(product)}
                sx={{
                  cursor: "pointer",
                  borderRadius: "16px",
                  overflow: "hidden",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  transition: "border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
                  position: "relative",

                  "&:hover": {
                    borderColor: "#cbd5e1",
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 32px rgba(15,23,42,0.14)",
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
                        backgroundColor: "#e11d48",
                        color: "#fff",
                        px: 1.1,
                        py: 0.35,
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: "6px",
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

                  {/* error messages are shown via Snackbar/Alert */}

                  {/* ADD TO CART BUTTON (HOVER) */}
                  <Box
                    className="addToCartBtn"
                    onClick={(e) => handleAddToCart(e, product)}
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 42,
                      height: 42,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 6px 16px rgba(37,99,235,0.35)",
                      opacity: 0,
                      transform: "translateY(10px)",
                      transition: "all 0.3s ease",

                      "&:hover": {
                        backgroundColor: "#1d4ed8",
                      },
                    }}
                  >
                    <ShoppingCartIcon fontSize="small" />
                  </Box>
                </Box>

                {/* DETAILS */}
                <Box sx={{ p: 1.75 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#1e293b",
                      height: 36,
                      overflow: "hidden",
                    }}
                  >
                    {limitWords(product.productName, 5)}
                  </Typography>

                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 0.75 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 17, color: "#0f172a" }}>
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
                          }}
                        >
                          ₹{product.productPrice}
                        </Typography>

                        <Typography
                          component="span"
                          sx={{
                            color: "#15803d",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {product.discount}% off
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
      <Toast open={toastOpen} message={toastMessage} severity={toastSeverity} onClose={handleToastClose} />
    </>
  );
};

export default HomePage;
