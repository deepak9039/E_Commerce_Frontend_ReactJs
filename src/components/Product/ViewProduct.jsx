import React from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { findAllProduct } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';

const ViewProduct = ({ onEditProduct }) => {
    const navigate = useNavigate();

    const PAGE_SIZE = 50;

    // const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [products, setProducts] = useState([]);

    console.log("Products i am view product:", products);

    // const fetchProducts = async () => {
    //     try {
    //         const response = await findAllProduct();
    //         setProducts(response);
    //     } catch (error) {
    //         console.error('Error fetching products:', error);
    //     }

    // };
    const fetchProducts = async (pageNo = 0) => {
    try {
        const payload = { page: pageNo, pageSize: PAGE_SIZE };
        const response = await findAllProduct(payload);

            setProducts(response.products || []);
            setPage(response.page || 0);
            setTotalPages(response.totalPages || 0);

        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        }
    };

    const handlePageChange = (e, value) => {
        const newPage = value - 1;
        fetchProducts(newPage);
    };

    useEffect(() => {
        fetchProducts(0);
    }, []);

    return (
        <Box component="container" sx={{ p: 5 }}>
            <Grid size={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>All Products</Typography>

                <Box sx={{ border: "1px solid #ccc", borderRadius: 2 }}>

                    {/* Header Row */}
                    <Box
                        sx={{
                            display: "flex",
                            padding: "12px 16px",
                            backgroundColor: "#f5f5f5",
                            fontWeight: 600,
                            borderBottom: "1px solid #ccc"
                        }}
                    >
                        <Box sx={{ width: "120px" }}>Product Id</Box>
                        <Box sx={{ flex: 1 }}>Product Name</Box>
                        <Box sx={{ width: "120px" }}>Category</Box>
                        <Box sx={{ width: "120px" }}>Price</Box>
                        <Box sx={{ width: "120px" }}>Stock</Box>
                        <Box sx={{ width: "120px" }}>Image</Box>
                        <Box sx={{ width: "160px" }}>Actions</Box>
                    </Box>

                    {/* Data Rows */}
                    {products.map((product) => (
                        <Box
                            key={product.productId}
                            sx={{
                                display: "flex",
                                padding: "12px 16px",
                                alignItems: "center",
                                borderBottom: "1px solid #eee"
                            }}
                        >
                            {/* Category Id */}
                            <Box sx={{ width: "120px" }}>{product.productId}</Box>

                            {/* Category Name */}
                            <Box sx={{ width: "120px", flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {product.productName}
                                </Typography>
                                {/* <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        {cat.categoryDescription}
                                    </Typography> */}
                            </Box>
                            {/* Category */}
                            <Box sx={{ width: "120px" }}>{product.categoryName}</Box>

                            {/* Price */}
                            <Box sx={{ width: "120px" }}>{product.productPrice}</Box>

                            {/* Stock */}
                            <Box sx={{ width: "120px" }}>{product.stockQuantity}</Box>
                            {/* Image */}
                            <Box sx={{ width: "120px" }}>
                                <img
                                    src={`http://localhost:1234/image/product/${product.productImageUrl}`}
                                    alt={product.productName}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                            </Box>
                            {/* Actions */}
                            <Box sx={{ width: "160px", display: "flex", gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="primary"
                                    onClick={() => onEditProduct ? onEditProduct(product.productId) : navigate(`/edit-product/${product.productId}`)}
                                >
                                    Edit
                                </Button>

                                <Button variant="outlined" size="small" color="error">
                                    Delete
                                </Button>
                            </Box>
                        </Box>
                    ))}
                </Box>
                {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                            count={totalPages}
                            page={page + 1}
                            onChange={handlePageChange}
                        />
                    </Box>
                )}
            </Grid>

        </Box>
    )
}

export default ViewProduct
