import React, { useState, useEffect } from "react";
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
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CategoryIcon from "@mui/icons-material/Category";

import {
  createCategory,
  findAllCategory,
  getCategoryById,
  updateCategory,
} from "../../services/apiService";

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


    const columns = [
  {
    field: "categoryId",
    headerName: "ID",
    width: 90,
  },
  {
    field: "image",
    headerName: "Image",
    width: 100,
    sortable: false,
    renderCell: (params) => (
      <Avatar
        variant="rounded"
        src={params.row.categoryImage}
        sx={{
          width: 45,
          height: 45,
          bgcolor: "#f5f5f5",
        }}
      >
        <CategoryIcon />
      </Avatar>
    ),
  },
  {
    field: "categoryName",
    headerName: "Category",
    flex: 1,
    renderCell: (params) => (
      <Box sx={{ py: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700 }}
        >
          {params.row.categoryName}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {params.row.categoryDescription}
        </Typography>
      </Box>
    ),
  },
  {
    field: "active",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <Chip
        label={params.value ? "Active" : "Inactive"}
        color={params.value ? "success" : "error"}
        size="small"
      />
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 140,
    sortable: false,
    renderCell: (params) => (
      <>
        <IconButton
          color="primary"
          onClick={() =>
            handleEdit(params.row.categoryId)
          }
        >
          <EditIcon />
        </IconButton>

        <IconButton color="error">
          <DeleteIcon />
        </IconButton>
      </>
    ),
  },
];


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
  <Container maxWidth="xl" sx={{ py: 4 }}>
    <Grid container spacing={3}>
      {/* LEFT SIDE */}
      <Grid size={3}>
        <Card
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            position: "sticky",
            top: 20,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#2874f0",
              mb: 3,
            }}
          >
            {editingId
              ? "Edit Category"
              : "Add Category"}
          </Typography>

          {apiResponse && (
            <Stack spacing={2} sx={{ mb: 2 }}>
              <Alert severity="success">
                {apiResponse}
              </Alert>
            </Stack>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Category Name"
              value={categoryName}
              onChange={(e) =>
                setCategoryName(e.target.value)
              }
              fullWidth
              required
            />

            <TextField
              label="Category Description"
              value={categoryDescription}
              onChange={(e) =>
                setCategoryDescription(
                  e.target.value
                )
              }
              multiline
              rows={3}
            />

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Upload Image

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file =
                    e.target.files?.[0];

                  if (file) {
                    setCategoryImage(file.name);
                    setImageFile(file);
                  }
                }}
              />
            </Button>

            {categoryImage && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Selected: {categoryImage}
              </Typography>
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) =>
                    setIsActive(
                      e.target.checked
                    )
                  }
                />
              }
              label="Active"
            />

            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                py: 1.2,
                borderRadius: 2,
                backgroundColor: "#2874f0",
              }}
            >
              {submitting
                ? editingId
                  ? "Updating..."
                  : "Saving..."
                : editingId
                ? "Update Category"
                : "Create Category"}
            </Button>
          </Box>
        </Card>
      </Grid>

      {/* RIGHT SIDE */}
      <Grid size={9}>
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom:
                "1px solid #eeeeee",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700 }}
            >
              All Categories
            </Typography>

            <Chip
              label={`${categories.length} Categories`}
              color="primary"
            />
          </Box>

          <Box
            sx={{
              height: 650,
              width: "100%",
            }}
          >
            <DataGrid
              rows={categories}
              columns={columns}
              getRowId={(row) =>
                row.categoryId
              }
              pageSizeOptions={[
                5,
                10,
                20,
              ]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              disableRowSelectionOnClick
              sx={{
                border: 0,

                "& .MuiDataGrid-columnHeaders":
                  {
                    backgroundColor:
                      "#fafafa",
                    fontWeight: 700,
                  },

                "& .MuiDataGrid-row:hover":
                  {
                    backgroundColor:
                      "#f5f7ff",
                  },

                "& .MuiDataGrid-cell":
                  {
                    borderBottom:
                      "1px solid #f1f1f1",
                  },
              }}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
  </Container>
);
};

export default AddCategory;
