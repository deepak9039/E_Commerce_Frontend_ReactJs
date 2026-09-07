import React, { use, useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Box,
    Divider,
    IconButton,
} from '@mui/material';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useNavigate } from 'react-router-dom';
import { getCartByUserId, quntityUpdatePlus, quntityUpdateMinus, removeCartItem, recentViewGet } from '../../services/apiService';
import { useCart } from '../Context/CartContext';

const CartPage = ({ user }) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [recentViewsProducts, setRecentViewsProducts] = React.useState([]);
    const recentRef = React.useRef(null);
    const { refreshCartCount } = useCart();

    console.log("cart items in cart page:", cartItems);

    const fetchCartItems = async () => {
        try {
            const userId = user?.userId; // Replace with actual user ID from auth context or props
            const response = await getCartByUserId(userId);
            console.log("Cart items fetched:", response);
            setCartItems(response || []);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }

    const updateQuantityPlus = async (id, userId, productId) => {
        try {
            const response = await quntityUpdatePlus(id, userId, productId);
            console.log("Quantity plus response:", response);
            fetchCartItems();
        } catch (error) {
            console.error('Error updating quantity Plus:', error);
        }
    };

    const updateQuantityMinus = async (id, userId, productId) => {
        try {
            const response = await quntityUpdateMinus(id, userId, productId);
            console.log("Quantity minus response:", response);
            fetchCartItems();
        } catch (error) {
            console.error('Error updating quantity Minus :', error);
        }
    };

    const removeFromCart = async (id, userId, productId) => {
        try {
            const response = await removeCartItem(id, userId, productId);
            console.log("Remove cart successfully:", response);
            fetchCartItems();
            refreshCartCount(userId);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const viewProduct = (id) => navigate(`/product/${id}`);

    const totalOrderPrice = cartItems.reduce((acc, item) => 0 + item?.totalOrderPrice, 0);
    const totalOrderDiscount = cartItems.reduce((acc,item) => 0 + item?.totalOrderDiscount,0);
    console.log("totalOrderPrice", totalOrderPrice);
    console.log("totalOrderDiscount", totalOrderDiscount);

    const fetchRecentViews = async (userId) => {
        try {
          const res = await recentViewGet(userId);
          setRecentViewsProducts(res || []);
        } catch (err) {
          console.error("User not logged in. Cannot fetch recent views:", err);
        }
      };

      const limitWords = (text, limit = 10) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.length <= limit ? text : words.slice(0, limit).join(' ') + '...';
  };

  const scrollSponsoredRecentViews = (dir = 'right') => {
    const el = recentRef.current;
    if (el) {
      const scrollAmount = 300;
      el.scrollLeft += dir === 'right' ? scrollAmount : -scrollAmount;
    }
  };
    
    useEffect(() => {
        fetchCartItems();
        if (user?.userId) {
            fetchRecentViews(user.userId);
        }
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 2, pb: 4 }}>
            <Grid container spacing={2}>
                {/* LEFT COLUMN (8) */}
                <Grid size={8}>
                    {cartItems.length === 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>

                            {user === null ? (

                                // 🔐 NOT LOGGED IN
                                <Box

                                >
                                    <ShoppingCartOutlinedIcon
                                        sx={{ fontSize: 50, color: "#9ca3af", mb: 2 }}
                                    />

                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 600, mb: 1 }}
                                    >
                                        Missing Cart items?
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{ color: "#6b7280", mb: 3 }}
                                    >
                                        Login to see the items you added previously
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        onClick={() => navigate("/signin")}
                                        size="small"
                                        sx={{
                                            backgroundColor: "#0f172a",
                                            "&:hover": { backgroundColor: "#1e293b" },
                                        }}
                                    >
                                        Login
                                    </Button>
                                </Box>

                            ) : (

                                // 🛒 CART EMPTY
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        px: 3,
                                    }}
                                >
                                    <ShoppingCartOutlinedIcon
                                        sx={{ fontSize: 40, color: "#9ca3af", mb: 2 }}
                                    />

                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 600, mb: 2 }}
                                    >
                                        Your cart is empty
                                    </Typography>
                                </Box>
                            )}

                        </Box>
                    ) : (
                        <>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                Shopping Cart
                            </Typography>
                            <Grid container sx={{ my: 2 }} spacing={2}>
                                {cartItems?.map((item, index) => (
                                    <Grid size={12} key={index}>
                                        <Card sx={{ display: 'flex', gap: 2 }}>
                                            <Grid size={3}>
                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: "100%", objectFit: 'contain', borderRadius: 1 }}
                                                    height={100}
                                                    image={`http://localhost:1234/image/product/${item?.product?.productImageUrl}`}
                                                    alt={item.productName}
                                                />
                                            </Grid>
                                            <Grid size={9} sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                <CardContent sx={{ flex: '1 0 auto' }}>
                                                    <Typography variant="h6">{item.productName}</Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                        {item.product.productDescription.length > 60
                                                            ? item?.product?.productDescription.slice(0, 60) + '...'
                                                            : item.product.productDescription}
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
                                                            ₹{item.product.discount > 0
                                                                ? item.product.discountPrice
                                                                : item.product.productPrice}
                                                        </Typography>

                                                        {item.product.discount > 0 && (
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
                                                                    ₹{item.product.productPrice}
                                                                </Typography>

                                                                <Typography
                                                                    component="span"
                                                                    sx={{
                                                                        color: "#16a34a",
                                                                        fontSize: 13,
                                                                        fontWeight: 600
                                                                    }}
                                                                >
                                                                    {item.product.discount}% OFF
                                                                </Typography>
                                                            </>
                                                        )}
                                                    </Box>
                                                    {/* <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
                                                        Price: ₹ {item?.product?.productPrice}
                                                    </Typography> */}
                                                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                            Quantity:
                                                            {/* MINUS BUTTON */}
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                disabled={item.quantity === 1}
                                                                onClick={() => updateQuantityMinus(item?.id, item?.userDlts?.userId, item?.product?.productId)}
                                                            >
                                                                -
                                                            </Button>

                                                            {/* QUANTITY */}
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', minWidth: 30, textAlign: 'center' }}>
                                                                {item.quantity}
                                                            </Typography>

                                                            {/* PLUS BUTTON */}
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() => updateQuantityPlus(item?.id, item?.userDlts?.userId, item?.product?.productId)}
                                                            >
                                                                +
                                                            </Button>

                                                        </Box>

                                                    </Typography>
                                                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
                                                        Total Price: ₹ {item?.totalPrice}
                                                    </Typography>

                                                </CardContent>
                                                <CardActions sx={{ mt: 'auto' }}>
                                                    <Button size="small" onClick={() => viewProduct(item?.product?.productId)}>
                                                        View Details
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        onClick={() => removeFromCart(item?.id, item?.userDlts?.userId, item?.product?.productId)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </CardActions>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </Grid>



                {/* RIGHT COLUMN (4) */}
                {cartItems.length > 0 && (
                    <Grid size={4} sx={{ mt: 6 }}>
                        <Box
                            sx={{
                                p: 3,
                                border: "1px solid #e5e7eb",
                                borderRadius: 2,
                                backgroundColor: "#ffffff",
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                PRICE DETAILS
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            {/* MRP */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography sx={{ color: "#475569" }}>MRP</Typography>
                                <Typography>₹ {totalOrderPrice}</Typography>
                            </Box>

                            {/* DISCOUNT */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <Typography sx={{ color: "#475569" }}>
                                        Discounts
                                    </Typography>
                                    <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
                                </Box>
                                <Typography sx={{ color: "green", fontWeight: 500 }}>
                                    - ₹ {totalOrderDiscount}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Typography sx={{ color: "#475569" }}>
                                Delivery Charges
                                </Typography>
                
                                {totalOrderPrice > 1000 ? (
                                <Typography sx={{ color: "#16a34a", fontWeight: 600 }}>
                                    FREE
                                </Typography>
                                ) : (
                                <Typography>
                                    ₹ 50
                                </Typography>
                                )}
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            {/* TOTAL */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Typography sx={{ fontWeight: 600 }}>
                                    Total Amount
                                </Typography>
                                <Typography sx={{ fontWeight: 600 }}>
                                    ₹ {totalOrderPrice}
                                </Typography>
                            </Box>

                            {/* SAVINGS BOX */}
                            <Box
                                sx={{
                                    backgroundColor: "#e6f4ea",
                                    color: "#1e7e34",
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 500,
                                    mb: 3,
                                }}
                            >
                                🎉 You'll save ₹{totalOrderDiscount} on this order!
                            </Box>

                            {/* SECURE TEXT */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    color: "#6b7280",
                                    fontSize: 14,
                                    mb: 3,
                                }}
                            >
                                🛡 Safe and secure payments. Easy returns. 100% Authentic products.
                            </Box>

                            {/* PLACE ORDER BUTTON */}
                            <Button
                                fullWidth
                                sx={{
                                    backgroundColor: "#facc15",
                                    color: "#000",
                                    fontWeight: 600,
                                    py: 1.5,
                                    fontSize: 16,
                                    "&:hover": {
                                        backgroundColor: "#eab308",
                                    },
                                }}
                                disabled={cartItems.length === 0}
                                onClick={() =>
                                    navigate("/order", {
                                        state: { totalAmount: totalOrderPrice, cartItems: cartItems, totalOrderDiscount: totalOrderDiscount },
                                    })
                                }
                            >
                                Place Order
                            </Button>
                        </Box>
                    </Grid>
                )}

            </Grid>
            {user !== null &&(
                <Box>
                    {recentViewsProducts && (
                        <Box maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                                Your browsing history
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
                        </Box>
                    )}
                </Box>
            ) }
        </Container>
    );
};

export default CartPage;
