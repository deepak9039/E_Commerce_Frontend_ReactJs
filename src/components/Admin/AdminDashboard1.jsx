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
import { ordersCount, productsCount, usersCount, categorySales } from "../../services/apiService";

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

const salesData = [
    { day: "Mon", orders: 120, sales: 4000 },
    { day: "Tue", orders: 90, sales: 3000 },
    { day: "Wed", orders: 70, sales: 2000 },
    { day: "Thu", orders: 200, sales: 2800 },
    { day: "Fri", orders: 240, sales: 2600 },
    { day: "Sat", orders: 380, sales: 2390 },
    { day: "Sun", orders: 420, sales: 3500 },
];

const pieData = [
    { name: "Electronics", value: 35 },
    { name: "Clothing", value: 26 },
    { name: "Home & Garden", value: 17 },
    { name: "Sports", value: 13 },
    { name: "Books", value: 9 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

// const stats = [
//     {
//         label: "Total Revenue",
//         value: "$45,231",
//         icon: <MonetizationOnIcon />,
//     },
//     {
//         label: "Orders",
//         value: "2,345",
//         icon: <ShoppingCartIcon />,
//     },
//     {
//         label: "Customers",
//         value: "1,234",
//         icon: <PeopleIcon />,
//     },
//     {
//         label: "Products",
//         value: "456",
//         icon: <InventoryIcon />,
//     },
// ];

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



export default function AdminDashboard() {

    const [counts, setCounts] = React.useState({
        orders: 0,
        products: 0,
        users: 0,
        revenue: 45231,
    });

    React.useEffect(() => {
        const fetchCounts = async () => {
            try {
                const orders = await ordersCount();
                const products = await productsCount();
                const users = await usersCount();

                setCounts({
                    orders: orders.ordersCount,
                    products: products.productsCount,
                    users: users.usersCount,
                    revenue: 45231, // replace if revenue API exists
                });
            } catch (err) {
                console.error("Dashboard API error:", err);
            }
        };

        fetchCounts();
    }, []);

    const stats = [
        {
            label: "Total Revenue",
            value: `$${counts.revenue.toLocaleString()}`,
            icon: <MonetizationOnIcon />,
        },
        {
            label: "Orders",
            value: counts.orders.toLocaleString(),
            icon: <ShoppingCartIcon />,
        },
        {
            label: "Customers",
            value: counts.users.toLocaleString(),
            icon: <PeopleIcon />,
        },
        {
            label: "Products",
            value: counts.products.toLocaleString(),
            icon: <InventoryIcon />,
        },
    ];

    const [categorySalesData, setCategorySalesData] = React.useState(null);

    console.log("Category Sales Data:", categorySalesData);

    const fetchCategorySales = async () => {
        try {
            const res = await categorySales();
            setCategorySalesData(res.data || []);
        } catch (err) {
            console.error("Category Sales API error:", err);
        }
    };

    React.useEffect(() => {
        const fetchCounts = async () => {
            let orders = await ordersCount();
            let products = await productsCount();
            let users = await usersCount();
            console.log("Orders:", orders);
            console.log("Products:", products);
            console.log("Users:", users);
        };
        fetchCounts();
        fetchCategorySales();
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
                    Welcome back! Here's what's happening today.
                </Typography>

                {/* Stat Cards (4 grid with icons) */}
                <Grid container spacing={2} mb={4}>
                    {stats.map((item) => (
                        <Grid size={3} key={item.label}>
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
                                            dataKey="sales"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="orders"
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
                                            labelLine={false}
                                        >
                                            {pieData.map((_, index) => (
                                                <Cell key={index} fill={COLORS[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Recent Orders & Top Products (6 / 6) */}
                <Grid container spacing={2} mt={1}>
                    {/* Recent Orders */}
                    <Grid size={6}>
                        <Card sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Typography fontWeight="bold">Recent Orders</Typography>
                                    <Typography color="primary" sx={{ cursor: "pointer" }}>View all</Typography>
                                </Box>


                                {[
                                    { id: "#ORD-001", name: "John Doe", amount: "$234.50", status: "Completed" },
                                    { id: "#ORD-002", name: "Jane Smith", amount: "$156.00", status: "Processing" },
                                    { id: "#ORD-003", name: "Bob Johnson", amount: "$89.99", status: "Pending" },
                                    { id: "#ORD-004", name: "Alice Brown", amount: "$445.00", status: "Completed" },
                                ].map((order) => (
                                    <Box key={order.id} mb={2}>
                                        <Box display="flex" justifyContent="space-between">
                                            <Box>
                                                <Typography fontWeight="500">{order.id}</Typography>
                                                <Typography variant="body2" color="text.secondary">{order.name}</Typography>
                                            </Box>
                                            <Typography fontWeight="500">{order.amount}</Typography>
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                px: 1.5,
                                                py: 0.3,
                                                borderRadius: 2,
                                                bgcolor:
                                                    order.status === "Completed"
                                                        ? "#dcfce7"
                                                        : order.status === "Processing"
                                                            ? "#dbeafe"
                                                            : "#fef3c7",
                                                color:
                                                    order.status === "Completed"
                                                        ? "#166534"
                                                        : order.status === "Processing"
                                                            ? "#1d4ed8"
                                                            : "#92400e",
                                            }}
                                        >
                                            {order.status}
                                        </Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Top Products */}
                    <Grid size={6}>
                        <Card sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Typography fontWeight="bold">Top Products</Typography>
                                    <Typography color="primary" sx={{ cursor: "pointer" }}>View all</Typography>
                                </Box>


                                {[
                                    { rank: "#1", name: "Wireless Headphones", sales: "245 sales", amount: "$12,250" },
                                    { rank: "#2", name: "Smart Watch", sales: "189 sales", amount: "$18,900" },
                                    { rank: "#3", name: "Laptop Stand", sales: "156 sales", amount: "$4,680" },
                                    { rank: "#4", name: "USB-C Cable", sales: "234 sales", amount: "$2,340" },
                                ].map((product) => (
                                    <Box key={product.rank} display="flex" justifyContent="space-between" mb={2}>
                                        <Box display="flex" gap={2}>
                                            <Avatar sx={{ bgcolor: "#f1f5f9", color: "#334155" }}>{product.rank}</Avatar>
                                            <Box>
                                                <Typography fontWeight="500">{product.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">{product.sales}</Typography>
                                            </Box>
                                        </Box>
                                        <Typography fontWeight="500">{product.amount}</Typography>
                                    </Box>
                                ))}
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
