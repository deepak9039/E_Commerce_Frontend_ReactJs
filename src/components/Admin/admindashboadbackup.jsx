import React from "react";
import {
    Container,
    Card,
    CardContent,
    Grid,
    Button,
    Typography
} from "@mui/material";

import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";

import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const menuItems = [
        { title: "Add Category", icon: <CategoryIcon sx={{ fontSize: 40 }} />, path: "/add-category" },
        { title: "Add Product", icon: <InventoryIcon sx={{ fontSize: 40 }} />, path: "/add-product" },
        { title: "View Products", icon: <ListAltIcon sx={{ fontSize: 40 }} />, path: "/view-products" },
        { title: "Orders", icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />, path: "/admin-orders" },
        { title: "Users", icon: <PeopleIcon sx={{ fontSize: 40 }} />, path: "/users" },
        { title: "Reports", icon: <BarChartIcon sx={{ fontSize: 40 }} />, path: "/reports" },
        { title: "Settings", icon: <SettingsIcon sx={{ fontSize: 40 }} />, path: "/settings" }
    ];

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Card sx={{ borderRadius: 3, p: 3, boxShadow: 4 }}>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}
                >
                    Admin Dashboard
                </Typography>

                <CardContent>
                    <Grid container spacing={3}>
                        {menuItems.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        height: 130,
                                        borderRadius: 3,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                        textTransform: "none",
                                        fontSize: 16,
                                        fontWeight: 600
                                    }}
                                    onClick={() => navigate(item.path)}
                                >
                                    {item.icon}
                                    {item.title}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

export default AdminDashboard;
