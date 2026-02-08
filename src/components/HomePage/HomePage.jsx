import React from 'react';
import {
    Grid,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Box,
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { findAllProduct, findAllCategory, getProductsByCategory } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 50;

const HomePage = () => {
    const [products, setProducts] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = React.useState(null);

    const [page, setPage] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);

    const navigate = useNavigate();

    // =========================
    // FETCH ALL PRODUCTS
    // =========================
    const fetchAllProducts = async (pageNo = 0) => {
        try {
            const payload = {
                page: pageNo,
                pageSize: PAGE_SIZE,
            };

            const res = await findAllProduct(payload);

            setProducts(res.products || []);
            setPage(res.page || 0);
            setTotalPages(res.totalPages || 0);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // =========================
    // FETCH CATEGORIES
    // =========================
    const fetchCategories = async () => {
        try {
            const res = await findAllCategory();
            setCategories(res);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // =========================
    // CATEGORY CLICK (WITH PAGINATION)
    // =========================
    const handleCategoryClick = async (categoryName, pageNo = 0) => {
        try {
            setSelectedCategoryId(categoryName);

            const payload = {
                page: pageNo,
                pageSize: PAGE_SIZE,
            };

            const res = await getProductsByCategory(categoryName, payload);

            setProducts(res.products || []);
            setPage(res.page || 0);
            setTotalPages(res.totalPages || 0);
        } catch (error) {
            console.error('Error fetching category products:', error);
            setProducts([]);
        }
    };

    // =========================
    // PAGINATION CHANGE
    // =========================
    const handlePageChange = (event, value) => {
        const newPage = value - 1; // MUI is 1-based

        if (selectedCategoryId) {
            handleCategoryClick(selectedCategoryId, newPage);
        } else {
            fetchAllProducts(newPage);
        }
    };

    // =========================
    // LIMIT WORDS
    // =========================
    const limitWords = (text, limit = 18) => {
        if (!text) return '';
        const words = text.split(' ');
        return words.length <= limit
            ? text
            : words.slice(0, limit).join(' ') + '...';
    };

    // =========================
    // INITIAL LOAD
    // =========================
    React.useEffect(() => {
        fetchCategories();
        fetchAllProducts(0);
    }, []);

    return (
        <>
            {/* ================= CATEGORY BAR ================= */}
            <Box
                sx={{
                    height: 140,
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    boxShadow: 3,
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
                        onClick={() => {
                            setSelectedCategoryId(null);
                            fetchAllProducts(0);
                        }}
                    >
                        <Typography variant="body2" fontWeight={600}>
                            All
                        </Typography>
                    </Grid>

                    {categories.map((cat) => (
                        <Grid
                            item
                            xs={1.5}
                            key={cat.id}
                            sx={{ textAlign: 'center', cursor: 'pointer' }}
                            onClick={() => handleCategoryClick(cat.categoryName, 0)}
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
                                    '&:hover': { transform: 'scale(1.1)' },
                                }}
                            />
                            <Typography variant="body2" fontWeight={500}>
                                {cat.categoryName}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* ================= PRODUCT LIST ================= */}
            <Box sx={{ m: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Products
                </Typography>

                {products.length === 0 ? (
                    <Typography variant="body1">
                        {selectedCategoryId
                            ? 'No products available in this category.'
                            : 'No products available.'}
                    </Typography>
                ) : (
                    <Grid container spacing={2}>
                        {products.map((product) => (
                            <Grid size={3} key={product.productId}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() =>
                                        navigate(`/product/${product.productId}`)
                                    }
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{ width: "100%", height: "100%", objectFit: 'contain', borderRadius: 1 }}
                                        alt={product.productName}
                                        image={`http://localhost:1234/image/product/${product.productImageUrl}`}
                                        title={product.productName}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">
                                            {product.productName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {limitWords(product.productDescription)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">Add to Cart</Button>
                                        <Button
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/product/${product.productId}`);
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* ================= PAGINATION ================= */}
                {totalPages > 1 && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 4,
                        }}
                    >
                        <Pagination
                            count={totalPages}
                            page={page + 1}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                )}

                {totalPages > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Page {page + 1} of {totalPages}
                        </Typography>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default HomePage;
