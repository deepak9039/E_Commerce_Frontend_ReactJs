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
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [totalCartDiscount, setTotalCartDiscount] = useState(0);
    const [recentViewsProducts, setRecentViewsProducts] = React.useState([]);
    const recentRef = React.useRef(null);
    const { refreshCartCount } = useCart();

    console.log("cart items in cart page:", cartItems);

    const fetchCartItems = async () => {
        try {
            const userId = user?.userId; // Replace with actual user ID from auth context or props
            const response = await getCartByUserId(userId);
            console.log("Cart items fetched:", response.cartItems);
            setCartItems(response?.cartItems || []);
            setTotalCartPrice(response?.totalCartPrice || 0);
            setTotalCartDiscount(response?.totalCartDiscount || 0);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }

    console.log("totalCartPrice", totalCartPrice);
    console.log("totalCartDiscount", totalCartDiscount);

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
        <Container maxWidth="lg" sx={{ mt: 3, pb: 4 }}>
            <Grid container spacing={3}>
                {/* LEFT COLUMN (8) */}
                <Grid size={12}>
                    {cartItems.length === 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>

                            {user === null ? (

                                // 🔐 NOT LOGGED IN
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        py: 6,
                                        px: 5,
                                        borderRadius: '18px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: '#fff',
                                        width: '100%',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 84,
                                            height: 84,
                                            borderRadius: '50%',
                                            backgroundColor: '#eaf1ff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 2.5,
                                        }}
                                    >
                                        <ShoppingCartOutlinedIcon
                                            sx={{ fontSize: 42, color: "#2563eb" }}
                                        />
                                    </Box>

                                    <Typography
                                        sx={{ fontSize: 22, fontWeight: 700, color: '#0f172a', mb: 1 }}
                                    >
                                        Missing Cart items?
                                    </Typography>

                                    <Typography
                                        sx={{ color: "#64748b", mb: 3, fontSize: 14 }}
                                    >
                                        Login to see the items you added previously
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        onClick={() => navigate("/signin")}
                                        sx={{
                                            backgroundColor: "#2563eb",
                                            px: 4,
                                            py: 1.1,
                                            borderRadius: '10px',
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            boxShadow: 'none',
                                            "&:hover": {
                                                backgroundColor: "#1d4ed8",
                                                boxShadow: '0 8px 20px rgba(37,99,235,0.3)',
                                            },
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
                                        px: 5,
                                        py: 6,
                                        borderRadius: '18px',
                                        border: '1px dashed #cbd5e1',
                                        backgroundColor: '#f8fafc',
                                        width: '100%',
                                    }}
                                >
                                    <ShoppingCartOutlinedIcon
                                        sx={{ fontSize: 40, color: "#94a3b8", mb: 2 }}
                                    />

                                    <Typography
                                        sx={{ fontSize: 18, fontWeight: 700, color: '#334155', mb: 1 }}
                                    >
                                        Your cart is empty
                                    </Typography>
                                </Box>
                            )}

                        </Box>
                    ) : (
                        <>
                            <Grid container spacing={3}>
                                <Grid size={8}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                        <Box sx={{ width: 4, height: 26, borderRadius: 2, backgroundColor: '#2563eb' }} />
                                        <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 700, color: '#0f172a' }}>
                                            Shopping Cart
                                        </Typography>
                                        <Typography sx={{ color: '#64748b', fontSize: 14 }}>
                                            ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                                        </Typography>
                                    </Box>
                                    <Grid container sx={{ my: 2 }} spacing={2}>
                                        {cartItems?.map((item, index) => (
                                            <Grid size={12} key={index}>
                                                <Card
                                                    elevation={0}
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                        borderRadius: '16px',
                                                        border: '1px solid #e5e7eb',
                                                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                                        '&:hover': {
                                                            borderColor: '#cbd5e1',
                                                            boxShadow: '0 10px 24px rgba(15,23,42,0.08)',
                                                        },
                                                    }}
                                                >
                                                    <Grid size={3}>
                                                        <CardMedia
                                                            component="img"
                                                            sx={{ width: "100%", objectFit: 'contain', borderRadius: '14px 0 0 14px', backgroundColor: '#f8fafc' }}
                                                            height={140}
                                                            image={`http://localhost:1234/image/product/${item?.product?.productImageUrl}`}
                                                            alt={item.productName}
                                                        />
                                                    </Grid>
                                                    <Grid size={9} sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                        <CardContent sx={{ flex: '1 0 auto' }}>
                                                            <Typography sx={{ fontWeight: 600, fontSize: 16, color: '#0f172a' }}>{item.productName}</Typography>
                                                            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                                                                {item.product.productDescription.length > 60
                                                                    ? item?.product?.productDescription.slice(0, 60) + '...'
                                                                    : item.product.productDescription}
                                                            </Typography>
                                                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                                                <Typography
                                                                    component="span"
                                                                    sx={{
                                                                        fontWeight: 700,
                                                                        fontSize: 17,
                                                                        color: '#0f172a',
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
                                                                                fontSize: 13,
                                                                            }}
                                                                        >
                                                                            ₹{item.product.productPrice}
                                                                        </Typography>

                                                                        <Typography
                                                                            component="span"
                                                                            sx={{
                                                                                color: "#15803d",
                                                                                fontSize: 12.5,
                                                                                fontWeight: 700,
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
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                                                                <Typography sx={{ fontSize: 13, color: '#475569', fontWeight: 600, mr: 0.5 }}>
                                                                    Quantity:
                                                                </Typography>
                                                                {/* MINUS BUTTON */}
                                                                <IconButton
                                                                    size="small"
                                                                    disabled={item.quantity === 1}
                                                                    onClick={() => updateQuantityMinus(item?.id, item?.userDlts?.userId, item?.product?.productId)}
                                                                    sx={{
                                                                        border: '1px solid #e2e8f0',
                                                                        borderRadius: '8px',
                                                                        width: 28,
                                                                        height: 28,
                                                                        fontSize: 16,
                                                                        color: '#334155',
                                                                    }}
                                                                >
                                                                    −
                                                                </IconButton>

                                                                {/* QUANTITY */}
                                                                <Typography sx={{ fontWeight: 700, minWidth: 24, textAlign: 'center', color: '#0f172a' }}>
                                                                    {item.quantity}
                                                                </Typography>

                                                                {/* PLUS BUTTON */}
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => updateQuantityPlus(item?.id, item?.userDlts?.userId, item?.product?.productId)}
                                                                    sx={{
                                                                        border: '1px solid #e2e8f0',
                                                                        borderRadius: '8px',
                                                                        width: 28,
                                                                        height: 28,
                                                                        fontSize: 16,
                                                                        color: '#334155',
                                                                    }}
                                                                >
                                                                    +
                                                                </IconButton>
                                                            </Box>
                                                            <Typography sx={{ mt: 1.25, fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                                                                Total: ₹{item?.totalPrice}
                                                            </Typography>

                                                        </CardContent>
                                                        <CardActions sx={{ mt: 'auto', px: 2, pb: 2 }}>
                                                            <Button
                                                                size="small"
                                                                onClick={() => viewProduct(item?.product?.productId)}
                                                                sx={{ textTransform: 'none', fontWeight: 600, color: '#2563eb', '&:hover': { backgroundColor: 'rgba(37,99,235,0.08)' } }}
                                                            >
                                                                View Details
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                onClick={() => removeFromCart(item?.id, item?.userDlts?.userId, item?.product?.productId)}
                                                                sx={{ textTransform: 'none', fontWeight: 600, color: '#e11d48', '&:hover': { backgroundColor: 'rgba(225,29,72,0.08)' } }}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </CardActions>
                                                    </Grid>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                                <Grid size={4} sx={{ mt: 6 }}>
                                    {/* RIGHT COLUMN (4) */}
                                    {cartItems.length > 0 && (
                                        <Box
                                            sx={{
                                                p: 3,
                                                border: "1px solid #e2e8f0",
                                                borderRadius: '18px',
                                                backgroundColor: "#ffffff",
                                                position: 'sticky',
                                                top: 90,
                                            }}
                                        >
                                            <Typography sx={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.5px', color: '#64748b', mb: 2 }}>
                                                PRICE DETAILS
                                            </Typography>

                                            <Divider sx={{ mb: 2, borderColor: '#eef1f6' }} />

                                            {/* MRP */}
                                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.25 }}>
                                                <Typography sx={{ color: "#475569", fontSize: 14 }}>MRP</Typography>
                                                <Typography sx={{ fontSize: 14, color: '#1e293b', fontWeight: 500 }}>₹{totalCartPrice}</Typography>
                                            </Box>

                                            {/* DISCOUNT */}
                                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.25 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                    <Typography sx={{ color: "#475569", fontSize: 14 }}>
                                                        Discounts
                                                    </Typography>
                                                    <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                                </Box>
                                                <Typography sx={{ color: "#15803d", fontWeight: 700, fontSize: 14 }}>
                                                    − ₹{totalCartDiscount}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                                <Typography sx={{ color: "#475569", fontSize: 14 }}>
                                                    Delivery Charges
                                                </Typography>

                                                {totalCartPrice > 1000 ? (
                                                    <Typography sx={{ color: "#15803d", fontWeight: 700, fontSize: 14 }}>
                                                        FREE
                                                    </Typography>
                                                ) : (
                                                    <Typography sx={{ fontSize: 14, color: '#1e293b', fontWeight: 500 }}>
                                                        ₹50
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Divider sx={{ mb: 2, borderColor: '#eef1f6' }} />

                                            {/* TOTAL */}
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: 'center',
                                                    mb: 2.5,
                                                    backgroundColor: '#f0f7ff',
                                                    border: '1px solid #dbe7fe',
                                                    borderRadius: '12px',
                                                    px: 2,
                                                    py: 1.5,
                                                }}
                                            >
                                                <Typography sx={{ fontWeight: 600, color: '#334155', fontSize: 14 }}>
                                                    Total Amount
                                                </Typography>
                                                <Typography sx={{ fontWeight: 800, fontSize: 19, color: '#0f172a' }}>
                                                    ₹{totalCartPrice}
                                                </Typography>
                                            </Box>

                                            {/* SAVINGS BOX */}
                                            <Box
                                                sx={{
                                                    backgroundColor: "#f0fdf4",
                                                    border: '1px solid #dcfce7',
                                                    color: "#15803d",
                                                    px: 2,
                                                    py: 1.5,
                                                    borderRadius: '12px',
                                                    fontWeight: 600,
                                                    fontSize: 13.5,
                                                    mb: 2.5,
                                                }}
                                            >
                                                🎉 You'll save ₹{totalCartDiscount} on this order!
                                            </Box>

                                            {/* SECURE TEXT */}
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: 1,
                                                    color: "#64748b",
                                                    fontSize: 13,
                                                    mb: 2.5,
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                🛡️ Safe and secure payments. Easy returns. 100% Authentic products.
                                            </Box>

                                            {/* PLACE ORDER BUTTON */}
                                            <Button
                                                fullWidth
                                                sx={{
                                                    background: "linear-gradient(180deg, #ffd814 0%, #f7ca00 100%)",
                                                    color: "#111827",
                                                    fontWeight: 700,
                                                    py: 1.4,
                                                    fontSize: 15,
                                                    borderRadius: '10px',
                                                    textTransform: 'none',
                                                    boxShadow: '0 8px 18px rgba(247,202,0,0.35)',
                                                    "&:hover": {
                                                        background: "linear-gradient(180deg, #f7ca00 0%, #e6bd00 100%)",
                                                    },
                                                }}
                                                disabled={cartItems.length === 0}
                                                onClick={() =>
                                                    navigate("/order", {
                                                        state: { totalAmount: totalCartPrice, cartItems: cartItems, totalOrderDiscount: totalCartDiscount },
                                                    })
                                                }
                                            >
                                                Place Order
                                            </Button>
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>

                        </>
                    )}
                </Grid>





            </Grid>
            {user !== null && (
                <Box>
                    {recentViewsProducts && (
                        <Box maxWidth="lg" sx={{ mt: 5, mb: 4 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Box
                                    sx={{
                                        borderRadius: '18px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: '#fff',
                                        p: 3,
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                                        <Box sx={{ width: 4, height: 26, borderRadius: 2, backgroundColor: '#2563eb' }} />
                                        <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 700, color: '#0f172a' }}>
                                            Your browsing history
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
                        </Box>
                    )}
                </Box>
            )}
        </Container>
    );
};

export default CartPage;
