import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Stack
} from '@mui/material';
import { findAllCategory, createProduct, getProduct, updateProduct } from '../../services/apiService';

const AddProduct = () => {

    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');

    // existing image from backend (filename)
    const [existingImage, setExistingImage] = useState('');

    // new uploaded file
    const [imageFile, setImageFile] = useState(null);

    const [categories, setCategories] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (id) loadProductForEdit();
    }, [id]);

    const loadProductForEdit = async () => {
        try {
            const res = await getProduct(id);

            setProductName(res.productName);
            setProductDescription(res.productDescription);
            setCategoryName(res.categoryName);
            setProductPrice(res.productPrice);
            setStockQuantity(res.stockQuantity);

            // store existing image name
            setExistingImage(res.productImage);

        } catch (err) {
            console.error("Error loading product", err);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await findAllCategory();
            setCategories(response);
        } catch (err) {
            console.log("Error loading categories", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();

            const productPart = {
                productName,
                productDescription,
                categoryName,
                productPrice: Number(productPrice),
                stockQuantity: Number(stockQuantity),

                // If user uploaded new file → send blank (backend will replace)
                // else → send existing filename
                productImage: imageFile ? "" : existingImage
            };

            if (id) {
                productPart.productId = Number(id);
            }

            const blob = new Blob([JSON.stringify(productPart)], { type: "application/json" });
            formData.append("product", blob);

            // only append new image if uploaded
            if (imageFile) {
                formData.append("image", imageFile);
            }

            let response;
            if (id) {
                response = await updateProduct(formData); // only update API
            } else {
                response = await createProduct(formData);
            }

            setApiResponse(response?.message || "Product saved successfully !!.");

        } catch (err) {
            console.error(err);
            alert("API Error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                {id ? "Edit Product" : "Add Product"}
            </Typography>

            {apiResponse && (
                <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
                    <Alert severity="success">{apiResponse}</Alert>
                </Stack>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>

                <TextField
                    label="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />

                <TextField
                    label="Product Description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    multiline
                    rows={3}
                />

                <FormControl fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        value={categoryName}
                        label="Category"
                        onChange={(e) => setCategoryName(e.target.value)}
                    >
                        <MenuItem value="">None</MenuItem>
                        {categories.map((c, i) => (
                            <MenuItem key={i} value={c.categoryName}>{c.categoryName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Product Price"
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                />

                <TextField
                    label="Stock Quantity"
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                />

                <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>Product Image</Typography>

                    {/* Image preview */}
                    {existingImage && !imageFile && (
                        <img
                            src={`http://localhost:8080/image/product/${existingImage}`}
                            alt="Existing"
                            width="120"
                            style={{ marginBottom: 8, borderRadius: 8 }}
                        />
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            setImageFile(file || null);
                        }}
                    />

                    {imageFile && (
                        <Typography variant="caption">
                            Selected: {imageFile.name}
                        </Typography>
                    )}
                </Box>

                <Button type="submit" variant="contained" disabled={submitting}>
                    {submitting ? "Saving..." : id ? "Update Product" : "Create Product"}
                </Button>

            </Box>
        </Container>
    );
};

export default AddProduct;
