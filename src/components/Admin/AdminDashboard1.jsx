import * as React from "react";
import {
    Box,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Card,
    CardContent,
    Grid,
    Avatar,
} from "@mui/material";
import {
    ordersCount,
    productsCount,
    usersCount,
    categorySales,
    topSellingproducts,
    getAllOrders,
    ordersDesc,
    totalRevenue,
    salesOverview,
} from "../../services/apiService";
import { fetchAdminProductsCount, fetchAdminOrdersCount, fetchAdminRevenue, fetchAdminRecentOrders, fetchAdminTopProducts } from "../../services/adminService";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";


const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

const renderPieLabel = ({ name, value }) => {
    return `${name} (${value}%)`;
};

const CustomPieTooltip = ({ active, payload }) => {

    if (active && payload && payload.length) {
        return (
            <Box
                sx={{
                    bgcolor: "#ffffff",
                    p: 1,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Typography fontWeight="bold">
                    {payload[0].name}
                </Typography>
                <Typography variant="body2">
                    Value: {payload[0].value}%
                </Typography>
            </Box>
        );
    }
    return null;
};



export default function AdminDashboard({ user }) {

    const [counts, setCounts] = React.useState({
        orders: 0,
        products: 0,
        users: 0,
        revenue: 0,
    });

    const [salesData, setSalesData] = React.useState([]);

    const fetchSalesOverview = async () => {
        try {
            const res = await salesOverview();
            setSalesData(res.data || []);
        } catch (err) {
            console.error("Sales Overview API error:", err);
        }
    };

    const fetchCounts = async () => {
        try {
            const orders = await ordersCount();
            const products = await productsCount();
            const users = await usersCount();
            const revenue = await totalRevenue();
            setCounts({
                orders: orders.ordersCount,
                products: products.productsCount,
                users: users.usersCount,
                revenue: revenue.totalRevenue, // replace if revenue API exists
            });
        } catch (err) {
            console.error("Dashboard API error:", err);
        }
    };

    const adminMatrics = async () => {
        try {
            const products = await fetchAdminProductsCount();
            const orders = await fetchAdminOrdersCount();
            const revenue = await fetchAdminRevenue();

            const adminRecentOrders = await fetchAdminRecentOrders();
            const adminTopProducts = await fetchAdminTopProducts();

            console.log("Admin Recent Orders:", adminRecentOrders);
            console.log("Admin Top Products:", adminTopProducts);

            setCounts({
                orders: orders.ordersCount,
                products: products.productCount,
                revenue: revenue.revenue, // replace if revenue API exists
            });
        }
        catch (err) {
            console.error("Admin Metrics API error:", err);
        }
    };
    React.useEffect(() => {
        if (user?.role === "ROLE_SUPER_ADMIN") {
            fetchCounts();
            fetchSalesOverview();
        } else {
            adminMatrics();
        }
    }, []);

    const stats = [
        {
            label: "Total Revenue",
            value: `₹${counts?.revenue?.toLocaleString()}`,
            icon: <MonetizationOnIcon />,
        },
        {
            label: "Orders",
            value: counts?.orders?.toLocaleString(),
            icon: <ShoppingCartIcon />,
        },
        // Show only for SUPER ADMIN
        ...(user?.role === "ROLE_SUPER_ADMIN"
            ? [{
                label: "Customers",
                value: counts?.users?.toLocaleString(),
                icon: <PeopleIcon />,
            }]
            : []),
        {
            label: "Products",
            value: counts?.products?.toLocaleString(),
            icon: <InventoryIcon />,
        },
    ];

    const [categorySalesData, setCategorySalesData] = React.useState(null);
    const [topSellingProducts, setTopSellingProductsTop] = React.useState(null);
    const [orders, setOrders] = React.useState([]);
    const [totalRev, setTotalRev] = React.useState(0);


    console.log("Category Sales Data:", categorySalesData);
    console.log("top sell product :", topSellingProducts);
    console.log("recent orders", orders);

    const fetchCategorySales = async () => {
        try {
            const res = await categorySales();
            setCategorySalesData(res.data || []);
        } catch (err) {
            console.error("Category Sales API error:", err);
        }
    };

    const topSalesProduct = async () => {
        try {
            const res = await topSellingproducts();
            setTopSellingProductsTop(res?.products || []);
            console.log("sdsdsdsdsd", res);
        } catch (err) {
            console.log("top sale products", err);
        }
    }

    const fetchOrders = async () => {
        try {
            const res = await ordersDesc();
            setOrders(res.orders || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    //Admin Recent Orders and Top Products will be fetched using adminMatrics function which calls fetchAdminRecentOrders and fetchAdminTopProducts APIs respectively. These APIs are created to fetch data specific to admin dashboard and will have different data structure compared to normal orders and products APIs. So we need to use those APIs instead of normal orders and products APIs in order to get the correct data for admin dashboard.
    const fetchAdminRecentOrdersDataAndTopProducts = async () => {
        try {
            const adminRecentOrders = await fetchAdminRecentOrders();
            const adminTopProducts = await fetchAdminTopProducts();
            setOrders(adminRecentOrders.orders || []);
            setTopSellingProductsTop(adminTopProducts.products || []);

        } catch (err) {
            console.error("Error fetching admin recent orders and top products:", err);
        }
    }


    const fetchCountsSuperUser = async () => {
        let orders = await ordersCount();
        let products = await productsCount();
        let users = await usersCount();
        console.log("Orders:", orders);
        console.log("Products:", products);
        console.log("Users:", users);
    };

    React.useEffect(() => {
        fetchCountsSuperUser();
        fetchCategorySales();

        if (user?.role === "ROLE_SUPER_ADMIN") {
            topSalesProduct();
            fetchOrders();
        } else {
            fetchAdminRecentOrdersDataAndTopProducts();
        }

        // topSalesProduct();
        // fetchOrders();
    }, []);

    return (
        <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            <CssBaseline />

            {/* Top Title Bar */}
            {/* <AppBar position="static" elevation={0} color="transparent">
                <Toolbar>
                    <Typography variant="h6" fontWeight="bold">
                        Dashboard
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Avatar>J</Avatar>
                </Toolbar>
            </AppBar> */}

            <Box sx={{ p: 3 }}>
                <Typography color="text.secondary" mb={3}>
                    Welcome back! Here's what's happening today. dd
                </Typography>

                {/* Stat Cards (4 grid with icons) */}
                <Grid container spacing={2} mb={4}>
                    {stats.map((item) => (
                        <Grid size={
                            user?.role === "ROLE_SUPER_ADMIN" ? 3 : 4
                        } key={item.label}>
                            <Card sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar sx={{ bgcolor: item.color }}>{item.icon}</Avatar>
                                    <Box>

                                    </Box>
                                </CardContent>
                                <CardContent sx={{ pt: 0 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.label}
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        {item.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Charts (6 / 6 grid) */}
                {user?.role === "ROLE_SUPER_ADMIN" && (
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <Card sx={{ borderRadius: 3, height: 360 }}>
                                <CardContent>
                                    <Typography fontWeight="bold">Sales Overview</Typography>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <LineChart data={salesData}>
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="totalSales"
                                                stroke="#2563eb"
                                                strokeWidth={2}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="totalOrders"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={6}>
                            <Card sx={{ borderRadius: 3, height: 360 }}>
                                <CardContent>
                                    <Typography fontWeight="bold">Sales by Category</Typography>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <PieChart>
                                            <Tooltip content={<CustomPieTooltip />} />
                                            <Pie
                                                data={categorySalesData}
                                                dataKey="totalSales"
                                                nameKey="categoryName"
                                                outerRadius={95}
                                                label={renderPieLabel}   // 👈 always visible
                                                labelLine={true}
                                            >
                                                {categorySalesData?.map((entry, index) => (
                                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>

                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                {/* Recent Orders & Top Products (6 / 6) */}
                <Grid container spacing={2} mt={1}>
                    {/* Recent Orders */}
                    <Grid size={6}>
                        <Card sx={{ borderRadius: 3, height: 500 }}>
                            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>

                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Typography fontWeight="bold">Recent Orders</Typography>
                                    <Typography color="primary" sx={{ cursor: "pointer" }}>
                                        View all
                                    </Typography>
                                </Box>

                                {/* Scroll Area */}
                                <Box sx={{ overflowY: "auto", pr: 1 }}>
                                    {orders.map((order) => (
                                        <Box key={order.id} mb={2}>
                                            <Grid container alignItems="center" spacing={2}>

                                                {/* Left Side - Order Info */}
                                                <Grid size={8}>
                                                    <Typography fontWeight="500">
                                                        {order.orderId.slice(0, 5)}
                                                    </Typography>

                                                    <Typography variant="body2" color="text.secondary">
                                                        {order.product.productName}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            px: 1.5,
                                                            py: 0.3,
                                                            borderRadius: 2,
                                                            display: "inline-block",
                                                            mt: 0.5,
                                                            bgcolor:
                                                                order.status === "DELIVERED"
                                                                    ? "#dcfce7"
                                                                    : order.status === "IN_PROGRESS"
                                                                        ? "#dbeafe"
                                                                        : "#fef3c7",
                                                            color:
                                                                order.status === "DELIVERED"
                                                                    ? "#166534"
                                                                    : order.status === "IN_PROGRESS"
                                                                        ? "#1d4ed8"
                                                                        : "#92400e",
                                                        }}
                                                    >
                                                        {order.status}
                                                    </Typography>
                                                </Grid>

                                                {/* Middle - Order Date */}
                                                <Grid size={2} textAlign="center">
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(order.orderDate).toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </Typography>
                                                </Grid>

                                                {/* Right Side - Price + Status */}
                                                <Grid size={2} textAlign="right">
                                                    <Typography fontWeight="500">
                                                        ₹ {order.price}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))}
                                </Box>

                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Top Products */}
                    <Grid size={6}>
                        <Card sx={{ borderRadius: 3, height: 500 }}>
                            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>

                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Typography fontWeight="bold">Top Products</Typography>
                                    <Typography color="primary" sx={{ cursor: "pointer" }}>
                                        View all
                                    </Typography>
                                </Box>

                                {/* Scroll Area */}
                                <Box sx={{ overflowY: "auto", pr: 1 }}>
                                    {topSellingProducts?.map((product) => (
                                        <Box
                                            key={product.productId}
                                            display="flex"
                                            justifyContent="space-between"
                                            mb={2}
                                        >
                                            <Box display="flex" gap={2}>
                                                <Avatar sx={{ bgcolor: "#f1f5f9", color: "#334155" }}>
                                                    {product.productId}
                                                </Avatar>

                                                <Box>
                                                    <Typography fontWeight="500">
                                                        {product.productName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {product.quantity} sales
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Typography fontWeight="500">
                                                ₹ {product.totalAmount}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Quick Actions (3 / 3 / 3 / 3) */}
                <Grid container spacing={2} mt={3}>
                    <Grid size={3}>
                        <Card
                            variant="outlined"
                            sx={{
                                borderStyle: "dashed",
                                borderRadius: 3,
                                textAlign: "center",
                                py: 4,
                                cursor: "pointer",
                            }}
                        >
                            <CardContent>
                                <InventoryIcon sx={{ fontSize: 32, color: "#64748b" }} />
                                <Typography mt={1} fontWeight="500">Add Product</Typography>
                            </CardContent>
                        </Card>
                    </Grid>


                    <Grid size={3}>
                        <Card
                            variant="outlined"
                            sx={{
                                borderStyle: "dashed",
                                borderRadius: 3,
                                textAlign: "center",
                                py: 4,
                                cursor: "pointer",
                            }}
                        >
                            <CardContent>
                                <ShoppingCartIcon sx={{ fontSize: 32, color: "#64748b" }} />
                                <Typography mt={1} fontWeight="500">Create Order</Typography>
                            </CardContent>
                        </Card>
                    </Grid>


                    <Grid size={3}>
                        <Card
                            variant="outlined"
                            sx={{
                                borderStyle: "dashed",
                                borderRadius: 3,
                                textAlign: "center",
                                py: 4,
                                cursor: "pointer",
                            }}
                        >
                            <CardContent>
                                <PeopleIcon sx={{ fontSize: 32, color: "#64748b" }} />
                                <Typography mt={1} fontWeight="500">Add Customer</Typography>
                            </CardContent>
                        </Card>
                    </Grid>


                    <Grid size={3}>
                        <Card
                            variant="outlined"
                            sx={{
                                borderStyle: "dashed",
                                borderRadius: 3,
                                textAlign: "center",
                                py: 4,
                                cursor: "pointer",
                            }}
                        >
                            <CardContent>
                                <MonetizationOnIcon sx={{ fontSize: 32, color: "#64748b" }} />
                                <Typography mt={1} fontWeight="500">View Reports</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
