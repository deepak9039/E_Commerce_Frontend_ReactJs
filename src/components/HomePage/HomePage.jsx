import React from 'react';
import {
    Container,
    Grid,
    Typography,
    Card, CardMedia, CardContent, CardActions, Button, Box,
} from '@mui/material';
import CategorySidebar from '../Category/CategorySidebar';
import { findAllProduct, findAllCategory, getProductsByCategory } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [products, setProducts] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = React.useState(null);

    const [adding, setAdding] = React.useState(false);

    const navigate = useNavigate();

    const fetchAllProducts = async () => {
        try {
            const productResponse = await findAllProduct();
            setProducts(productResponse);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchProductsAndCategories = async () => {
        try {
            const categoryResponse = await findAllCategory();
            setCategories(categoryResponse);
            await fetchAllProducts();
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCategoryClick = async (categoryName) => {
        setSelectedCategoryId(categoryName);
        try {
            const res = await getProductsByCategory(categoryName);
            setProducts(res.products || []);
        } catch (error) {
            console.error('Error fetching products by category:', error);
            setProducts([]);
        }
    };

    const addToCart = (product) => {
        try {
            setAdding(true);
            const cartJson = localStorage.getItem('cart');
            const cart = cartJson ? JSON.parse(cartJson) : [];
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${product.productName} added to cart`);
        } catch (err) {
            console.error('Add to cart error', err);
            alert('Failed to add to cart');
        } finally {
            setAdding(false);
        }
    };

    const limitWords = (text, limit = 20) => {
    const words = text.split(" ");
    if (words.length <= limit) return text;
        return words.slice(0, limit).join(" ") + "...";
    };

    React.useEffect(() => {
        fetchProductsAndCategories();
    }, []);

    return (
        <>
        <Box
        sx={{
            height: 140,
            mb: 3,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: 3,
            m: 2,
            display: 'flex',
            alignItems: 'center',
            px: 2,
        }}
        >
        <Grid container spacing={2}>
            <Grid
                item
                xs={1.5}
                sx={{ textAlign: 'center', cursor: 'pointer' }}
                onClick={() => { setSelectedCategoryId(null); fetchAllProducts(); }}
            >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>All</Typography>
            </Grid>
            {categories.map((cat) => (
            <Grid
                item
                xs={1.5}   // 12 / 8 = 1.5 → exactly 8 items in a row
                key={cat.id}
                sx={{ textAlign: 'center', cursor: 'pointer' }}
                onClick={() => handleCategoryClick(cat.categoryName)}
            >
                <Box
                component="img"
                src={`http://localhost:1234/image/category/${cat.categoryImage}`}
                alt={cat.categoryName}
                sx={{
                    width: 60,
                    height: 60,
                    objectFit: 'contain',
                    mb: 1,
                    transition: 'transform 0.2s',
                    '&:hover': {
                    transform: 'scale(1.1)',
                    },
                }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {cat.categoryName}
                </Typography>
            </Grid>
            ))}
        </Grid>
        </Box>

        <Box sx={{m:2}}>
            <Grid container spacing={2}>
                {/* <Grid size={3}>
                    <CategorySidebar />
                </Grid> */}
        
                <Grid size={12}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Products</Typography>

                    {/* render products in a 4-column layout (one row of 4 on md+) */}
                    {products.length === 0 ? (
                        <Typography variant="body1">
                            {selectedCategoryId ? "No products available in this category." : "No products available."}
                        </Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {products.map((product) => (
                                <Grid size={3} key={product.productId}>
                                    <Card 
                                        sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                                        onClick={() => navigate(`/product/${product.productId}`)}
                                    >
                                        <CardMedia
                                            sx={{ height: 140, width: '100%', objectFit: 'cover' }}
                                            image={`http://localhost:1234/image/product/${product.productImageUrl}`}
                                            title={product.productName}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {product.productName}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                {limitWords(product.productDescription, 18)}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small">Add to Cart</Button>
                                            {/* <Button size="small">View Details</Button> */}
                                            <Button size="small" onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/product/${product.productId}`);
                                            }}>
                                                View Details
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                </Grid>
            </Grid>
        </Box>
        </>
    );
};

export default HomePage;
