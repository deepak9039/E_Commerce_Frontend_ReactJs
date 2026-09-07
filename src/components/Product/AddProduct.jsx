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

const AddProduct = ({ editProductId, onProductSaved }) => {

    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');

    // existing image from backend (filename)
    const [existingImage, setExistingImage] = useState('');

    // new uploaded file
    const [imageFile, setImageFile] = useState(null);

    const [categories, setCategories] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);

    const { id } = useParams();
    // Use editProductId prop as fallback if no URL param
    const productId = id || editProductId;

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (productId) loadProductForEdit();
    }, [productId]);

    // Reset form when switching to add mode (editProductId becomes null)
    useEffect(() => {
        if (!editProductId && !id) {
            resetForm();
        }
    }, [editProductId, id]);

    const resetForm = () => {
        setProductName('');
        setProductDescription('');
        setCategoryName('');
        setProductPrice('');
        setDiscount('');
        setDiscountPrice('');
        setStockQuantity('');
        setExistingImage('');
        setImageFile(null);
        setApiResponse(null);
    };

    const loadProductForEdit = async () => {
        try {
            const res = await getProduct(productId);

            setProductName(res.productName);
            setProductDescription(res.productDescription);
            setCategoryName(res.categoryName);
            setProductPrice(res.productPrice);
            setDiscount(res.discount);
            setDiscountPrice(res.discountPrice);
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
                discount: Number(discount),
                discountPrice: Number(discountPrice),
                stockQuantity: Number(stockQuantity),
                // If user uploaded new file → send blank (backend will replace)
                // else → send existing filename
                productImage: imageFile ? "" : existingImage
            };

            if (productId) {
                productPart.productId = Number(productId);
            }

            const blob = new Blob([JSON.stringify(productPart)], { type: "application/json" });
            formData.append("product", blob);

            // only append new image if uploaded
            if (imageFile) {
                formData.append("image", imageFile);
            }

            let response;
            if (productId) {
                response = await updateProduct(formData); // only update API
            } else {
                response = await createProduct(formData);
            }

            setApiResponse(response?.message || "Product saved successfully !!.");

            // Call callback if provided (from admin layout)
            if (onProductSaved) {
                setTimeout(() => onProductSaved(), 1500);
            }

        } catch (err) {
            console.error(err);
            alert("API Error");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
    if (productPrice && discount) {
        const price = Number(productPrice);
        const disc = Number(discount);

        if (!isNaN(price) && !isNaN(disc)) {
            const calculated = price - (price * disc) / 100;
            setDiscountPrice(calculated.toFixed(2));
            }
        } else {
            setDiscountPrice('');
        }
    }, [productPrice, discount]);

    return (
    <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
            sx={{
                bgcolor: "#fff",
                borderRadius: 4,
                p: 4,
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            }}
        >
            {/* Header */}
            <Box textAlign="center" mb={4}>
                {/* <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary"
                >
                    {productId ? "Edit Product" : "Add Product"}
                </Typography> */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                >
                    Manage your store products easily
                </Typography>
            </Box>

            {apiResponse && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                    }}
                >
                    {apiResponse}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "1fr 1fr",
                        },
                        gap: 3,
                    }}
                >
                    {/* Product Name */}
                    <TextField
                        label="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        fullWidth
                    />

                    {/* Category */}
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={categoryName}
                            label="Category"
                            onChange={(e) => setCategoryName(e.target.value)}
                        >
                            <MenuItem value="">None</MenuItem>

                            {categories.map((c, i) => (
                                <MenuItem
                                    key={i}
                                    value={c.categoryName}
                                >
                                    {c.categoryName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Description */}
                    <Box sx={{ gridColumn: "1 / -1" }}>
                        <TextField
                            label="Product Description"
                            value={productDescription}
                            onChange={(e) =>
                                setProductDescription(e.target.value)
                            }
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </Box>

                    {/* Price */}
                    <TextField
                        label="Product Price"
                        type="number"
                        value={productPrice}
                        onChange={(e) =>
                            setProductPrice(e.target.value)
                        }
                        fullWidth
                    />

                    {/* Discount */}
                    <TextField
                        label="Discount (%)"
                        type="number"
                        value={discount}
                        onChange={(e) =>
                            setDiscount(e.target.value)
                        }
                        fullWidth
                    />

                    {/* Discount Price */}
                    <TextField
                        label="Discount Price"
                        type="number"
                        value={discountPrice}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        sx={{
                            "& .MuiInputBase-root": {
                                bgcolor: "#f5f5f5",
                                fontWeight: 600,
                            },
                        }}
                    />

                    {/* Stock */}
                    <TextField
                        label="Stock Quantity"
                        type="number"
                        value={stockQuantity}
                        onChange={(e) =>
                            setStockQuantity(e.target.value)
                        }
                        fullWidth
                    />
                </Box>

                {/* Image Upload */}
                <Box
                    sx={{
                        mt: 4,
                        p: 3,
                        border: "2px dashed #d1d5db",
                        borderRadius: 3,
                        textAlign: "center",
                    }}
                >
                    <Typography
                        fontWeight={600}
                        mb={2}
                    >
                        Product Image
                    </Typography>

                    {existingImage && !imageFile && (
                        <Box mb={2}>
                            <img
                                src={`http://localhost:8080/image/product/${existingImage}`}
                                alt="Existing"
                                width="180"
                                style={{
                                    borderRadius: 12,
                                    boxShadow:
                                        "0 4px 12px rgba(0,0,0,0.12)",
                                }}
                            />
                        </Box>
                    )}

                    {imageFile && (
                        <Box mb={2}>
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Preview"
                                width="180"
                                style={{
                                    borderRadius: 12,
                                    boxShadow:
                                        "0 4px 12px rgba(0,0,0,0.12)",
                                }}
                            />
                        </Box>
                    )}

                    <Button
                        component="label"
                        variant="outlined"
                    >
                        Upload Image
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file =
                                    e.target.files?.[0];
                                setImageFile(file || null);
                            }}
                        />
                    </Button>

                    {imageFile && (
                        <Typography
                            variant="body2"
                            mt={1}
                            color="text.secondary"
                        >
                            {imageFile.name}
                        </Typography>
                    )}
                </Box>

                {/* Submit */}
                <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    sx={{
                        mt: 4,
                        py: 1.6,
                        fontSize: "1rem",
                        fontWeight: 700,
                        borderRadius: 3,
                        textTransform: "none",
                    }}
                >
                    {submitting
                        ? "Saving..."
                        : productId
                        ? "Update Product"
                        : "Create Product"}
                </Button>
            </Box>
        </Box>
    </Container>
);
};

export default AddProduct;
