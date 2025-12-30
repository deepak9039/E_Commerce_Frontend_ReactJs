import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
    Switch,
    FormControlLabel,
    Button,
    Box,
    Alert,
    Stack,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import { createCategory, findAllCategory, getCategoryById, updateCategory } from '../../services/apiService';

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categoryImage, setCategoryImage] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);


    const loadCategories = async () => {
        try {
            const res = await findAllCategory();
            setCategories(res);
        } catch (err) {
            console.log("Category fetch error:", err);
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setSubmitting(true);
    //     try {
    //         const formData = new FormData();

    //         const categoryPart = {
    //             categoryName,
    //             categoryDescription,
    //             categoryImage: categoryImage || '',
    //             isActive: isActive,
    //         };

    //         const categoryBlob = new Blob([JSON.stringify(categoryPart)], { type: 'application/json' });
    //         formData.append('categoryImage', categoryBlob);

    //         if (imageFile) {
    //             formData.append('image', imageFile);
    //         }

    //         const res = await createCategory(formData);
    //         setApiResponse(res);

    //         // reset fields
    //         setCategoryName('');
    //         setCategoryDescription('');
    //         setCategoryImage('');
    //         setIsActive(true);

    //         loadCategories(); // reload list

    //     } catch (err) {
    //         console.error(err);
    //         alert('Failed to create category');
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();

            const categoryPart = {
                categoryName,
                categoryDescription,
                categoryImage: categoryImage || '',
                active: isActive,
            };

            // 👉 Only add categoryId when editing
            if (editingId !== null) {
                categoryPart.categoryId = editingId;
            }

            const categoryBlob = new Blob([JSON.stringify(categoryPart)], {
                type: "application/json",
            });

            formData.append("category", categoryBlob);

            if (imageFile) {
                formData.append("image", imageFile);
            }

            let res;

            if (editingId === null) {
                res = await createCategory(formData); // CREATE
            } else {
                res = await updateCategory(formData); // UPDATE
            }

            console.log("API Response:", res?.message);

            setApiResponse(res?.message || "Category saved successfully !!.");

            // reset UI after update
            setCategoryName("");
            setCategoryDescription("");
            setIsActive(true);
            setCategoryImage("");
            setImageFile(null);
            setEditingId(null);

            loadCategories();

        } catch (err) {
            console.error(err);
            alert("Failed to save category");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (id) => {
        try {
            const data = await getCategoryById({ categoryId: id });

            setEditingId(id);
            setCategoryName(data.categoryName);
            setCategoryDescription(data.categoryDescription);
            setIsActive(data.active);
            setCategoryImage(data.categoryImage);
            setImageFile(null); // Reset file input
        } catch (err) {
            console.log("Edit load error:", err);
            alert("Failed to load category.");
        }
    };



    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={3}>

                {/* LEFT SIDE — 3 GRID (Add Category Form) */}
                <Grid item xs={12} md={3}>

                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {editingId ? "Edit Category" : "Add Category"}</Typography>

                    {apiResponse && (
                        <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
                            <Alert severity="success">{apiResponse}</Alert>
                        </Stack>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>

                        <TextField
                            label="Category Name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                        />

                        <TextField
                            label="Category Description"
                            value={categoryDescription}
                            onChange={(e) => setCategoryDescription(e.target.value)}
                            multiline
                            rows={3}
                        />

                        <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>Category Image</Typography>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setCategoryImage(file.name);
                                        setImageFile(file);
                                    } else {
                                        setCategoryImage('');
                                        setImageFile(null);
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                            {categoryImage && (
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption">Selected: {categoryImage}</Typography>
                                </Box>
                            )}
                        </Box>

                        <FormControlLabel
                            control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                            label="Is Active"
                        />

                        <Button type="submit" variant="contained" disabled={submitting}>
                            {submitting
                                ? (editingId ? "Updating..." : "Saving...")
                                : (editingId ? "Update Category" : "Create Category")}
                        </Button>
                    </Box>
                </Grid>
                {/* RIGHT SIDE — 9 GRID (Show Category List as rows with header) */}
                <Grid item xs={12} md={9}>
                    <Typography variant="h6" sx={{ mb: 2 }}>All Categories</Typography>

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
                            <Box sx={{ width: "120px" }}>Category Id</Box>
                            <Box sx={{ flex: 1 }}>Category Name</Box>
                            <Box sx={{ width: "120px" }}>Status</Box>
                            <Box sx={{ width: "160px" }}>Actions</Box>
                        </Box>

                        {/* Data Rows */}
                        {categories.map((cat) => (
                            <Box
                                key={cat.categoryId}
                                sx={{
                                    display: "flex",
                                    padding: "12px 16px",
                                    alignItems: "center",
                                    borderBottom: "1px solid #eee"
                                }}
                            >
                                {/* Category Id */}
                                <Box sx={{ width: "120px" }}>{cat.categoryId}</Box>

                                {/* Category Name */}
                                <Box sx={{ width: "200px", flex: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {cat.categoryName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        {cat.categoryDescription}
                                    </Typography>
                                </Box>

                                {/* Status */}
                                <Box sx={{ width: "120px" }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: cat.active ? "green" : "red",
                                            fontWeight: 600
                                        }}
                                    >
                                        {cat.active ? "Active" : "Inactive"}
                                    </Typography>
                                </Box>

                                {/* Actions */}
                                <Box sx={{ width: "160px", display: "flex", gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="primary"
                                        onClick={() => handleEdit(cat.categoryId)}
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
                </Grid>



            </Grid>
        </Container>
    );
};

export default AddCategory;
