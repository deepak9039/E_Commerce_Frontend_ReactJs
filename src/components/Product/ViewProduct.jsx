import React, { useState, useEffect } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { findAllProductAdmin } from '../../services/apiService';
import { fetchAdminProducts } from '../../services/adminService';

const ViewProduct = ({ onEditProduct, user }) => {
    const navigate = useNavigate();

    const PAGE_SIZE = 50;

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async (pageNo = 0) => {
        setLoading(true);
        try {
            const payload = { page: pageNo, pageSize: PAGE_SIZE };

            if (user && user.role === 'ROLE_SUPER_ADMIN') {
                const response = await findAllProductAdmin(payload);
                setProducts(response.products || []);
                setPage(response.page || 0);
                setTotalPages(response.totalPages || 0);
            } else {
                const response = await fetchAdminProducts(payload);
                setProducts(response.products || []);
                setPage(response.page || 0);
                setTotalPages(response.totalPages || 0);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePaginationModelChange = (newModel) => {
        const newPage = newModel.page;
        if (newPage !== page) {
            setPage(newPage);
            fetchProducts(newPage);
        }
    };

    useEffect(() => {
        fetchProducts(0);
    }, [user?.role]);

    const rows = products.map((product) => ({
        id: product.productId,
        productId: product.productId,
        productName: product.productName,
        categoryName: product.categoryName,
        productPrice: product.productPrice,
        stockQuantity: product.stockQuantity,
        productImageUrl: product.productImageUrl,
    }));

    const columns = [
        { field: 'productId', headerName: 'Product Id', width: 110 },
        {
            field: 'productName',
            headerName: 'Product Name',
            flex: 1.2,
            minWidth: 220,
            renderCell: (params) => (
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {params.value}
                </Typography>
            ),
        },
        { field: 'categoryName', headerName: 'Category', width: 140 },
        {
            field: 'productPrice',
            headerName: 'Price',
            width: 120,
            renderCell: (params) => <Box>₹{params.value}</Box>,
        },
        { field: 'stockQuantity', headerName: 'Stock', width: 100 },
        {
            field: 'productImageUrl',
            headerName: 'Image',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <img
                    src={`http://localhost:1234/image/product/${params.value}`}
                    alt={params.row.productName}
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 6 }}
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={() => onEditProduct ? onEditProduct(params.row.productId) : navigate(`/edit-product/${params.row.productId}`)}
                    >
                        Edit
                    </Button>
                    <Button variant="outlined" size="small" color="error">
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: 5 }}>
            {/* <Typography variant="h6" sx={{ mb: 2 }}>
                All Products
            </Typography> */}

            <Box sx={{ height: 700, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    rowCount={totalPages > 0 ? totalPages * PAGE_SIZE : products.length}
                    paginationMode="server"
                    paginationModel={{ page, pageSize: PAGE_SIZE }}
                    onPaginationModelChange={handlePaginationModelChange}
                    pageSizeOptions={[PAGE_SIZE]}
                    disableRowSelectionOnClick
                    sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f5f5f5',
                            fontWeight: 600,
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default ViewProduct;