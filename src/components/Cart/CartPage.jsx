import React, { use, useState,useEffect } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getCartByUserId, quntityUpdatePlus, quntityUpdateMinus, removeCartItem } from '../../services/apiService';
import { useCart } from '../Context/CartContext';

const CartPage = ({ user }) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
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

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 2, pb: 4 }}>

            <Typography variant="h5" sx={{ my: 4, fontWeight: 'bold' }}>
                Shopping Cart
            </Typography>
            <Grid container spacing={2}>
                {/* LEFT COLUMN (8) */}
                <Grid size={8}>
                    {cartItems.length === 0 ? (
                        <Typography>Your cart is empty.</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {cartItems?.map((item, index) => (
                                <Grid size={12} key={index}>
                                    <Card sx={{ display: 'flex', gap: 2 }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 140 }}
                                            image={`http://localhost:1234/image/product/${item?.product?.productImageUrl}`}
                                            alt={item.productName}
                                        />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <CardContent sx={{ flex: '1 0 auto' }}>
                                                <Typography variant="h6">{item.productName}</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    {item.product.productDescription.length > 60
                                                        ? item?.product?.productDescription.slice(0, 60) + '...'
                                                        : item.product.productDescription}
                                                </Typography>
                                                <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
                                                    Price: ₹ {item?.product?.productPrice}
                                                </Typography>
                                                <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
                                                    
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                        Quantity: 
                                                    {/* MINUS BUTTON */}
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        disabled={item.quantity === 1}
                                                        onClick={() => updateQuantityMinus(item?.id,item?.userDlts?.userId, item?.product?.productId)}
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
                                                        onClick={() => updateQuantityPlus(item?.id,item?.userDlts?.userId, item?.product?.productId)}
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
                                                    onClick={() => removeFromCart(item?.id,item?.userDlts?.userId, item?.product?.productId)}
                                                >
                                                    Remove
                                                </Button>
                                            </CardActions>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>



                {/* RIGHT COLUMN (4) */}
                <Grid size={4}>
                    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                        <Typography variant="h6">Cart Summary</Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography>Total Items: {cartItems.length}</Typography>
                        <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
                            Total Order Price: ₹ {totalOrderPrice}
                        </Typography>
                        <Button
                            variant="contained"
                            color="success"
                            sx={{ mt: 2 }}
                            disabled={cartItems.length === 0}
                            onClick={() => navigate('/order', { state: { totalAmount: totalOrderPrice, cartItems: cartItems } })}
                        >
                            Checkout
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CartPage;
