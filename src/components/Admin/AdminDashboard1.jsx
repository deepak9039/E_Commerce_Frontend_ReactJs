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
    Stack,
    Chip,
    Divider,
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
            bg: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
            textColor: "#fff",
            accent: "rgba(255,255,255,0.18)",
        },
        {
            label: "Orders",
            value: counts?.orders?.toLocaleString(),
            icon: <ShoppingCartIcon />,
            bg: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
            textColor: "#fff",
            accent: "rgba(255,255,255,0.18)",
        },
        // Show only for SUPER ADMIN
        ...(user?.role === "ROLE_SUPER_ADMIN"
            ? [{
                label: "Customers",
                value: counts?.users?.toLocaleString(),
                icon: <PeopleIcon />,
                bg: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
                textColor: "#fff",
                accent: "rgba(255,255,255,0.18)",
            }]
            : []),
        {
            label: "Products",
            value: counts?.products?.toLocaleString(),
            icon: <InventoryIcon />,
            bg: "linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)",
            textColor: "#fff",
            accent: "rgba(255,255,255,0.18)",
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

    const todayLabel = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <Box sx={{ background: "linear-gradient(135deg, #f8fbff 0%, #f8fafc 100%)", minHeight: "100vh", py: 3 }}>
            <CssBaseline />

            <Box sx={{ px: { xs: 2, md: 3 } }}>
                <Box
                    sx={{
                        background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #6366f1 100%)",
                        borderRadius: 4,
                        p: { xs: 3, md: 4 },
                        color: "#fff",
                        boxShadow: "0 18px 45px rgba(15, 23, 42, 0.24)",
                        mb: 3,
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    <Box sx={{ position: "absolute", inset: 0, background: "radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 38%)" }} />
                    <Box sx={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                        <Box>
                            <Typography variant="h4" fontWeight="700" mb={1}>
                                Admin Dashboard
                            </Typography>
                            <Typography sx={{ opacity: 0.92, maxWidth: 720 }}>
                                Welcome back! Here’s a quick view of your store performance, recent activity, and growth insights.
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, bgcolor: "rgba(255,255,255,0.14)", px: 1.8, py: 1.2, borderRadius: 999 }}>
                            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 40, height: 40 }}>{user?.name?.charAt(0) || "A"}</Avatar>
                            <Box>
                                <Typography variant="body2" fontWeight="700">{user?.name || "Admin"}</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.85 }}>{todayLabel}</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mt={2.2} sx={{ position: "relative" }}>
                        <Chip label="Live analytics" sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "#fff", fontWeight: 600 }} />
                        <Chip label="Orders & inventory" sx={{ bgcolor: "rgba(255,255,255,0.14)", color: "#fff", fontWeight: 600 }} />
                        <Chip label="Customer insights" sx={{ bgcolor: "rgba(255,255,255,0.14)", color: "#fff", fontWeight: 600 }} />
                    </Stack>
                </Box>

                <Grid container spacing={2} mb={3}>
                    {stats.map((item) => (
                        <Grid size={user?.role === "ROLE_SUPER_ADMIN" ? 3 : 4} key={item.label}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    background: item.bg,
                                    color: item.textColor,
                                    boxShadow: "0 16px 35px rgba(15, 23, 42, 0.12)",
                                    border: "1px solid rgba(255,255,255,0.22)",
                                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                    cursor: "default",
                                    '&:hover': {
                                        transform: "translateY(-3px)",
                                        boxShadow: "0 20px 45px rgba(15, 23, 42, 0.16)",
                                    },
                                }}
                            >
                                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, pb: 1 }}>
                                    <Avatar sx={{ bgcolor: item.accent, color: "#fff", width: 48, height: 48 }}>
                                        {item.icon}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            {item.label}
                                        </Typography>
                                        <Typography variant="h5" fontWeight="700">
                                            {item.value}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {user?.role === "ROLE_SUPER_ADMIN" && (
                    <Grid container spacing={2} mb={3}>
                        <Grid size={6}>
                            <Card sx={{ borderRadius: 3, height: 360, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)", border: "1px solid #eef2ff" }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography fontWeight="700">Sales Overview</Typography>
                                        <Typography variant="caption" color="primary" fontWeight="600">This week</Typography>
                                    </Box>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <LineChart data={salesData}>
                                            <XAxis dataKey="day" tickLine={false} axisLine={false} />
                                            <YAxis tickLine={false} axisLine={false} />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="totalSales"
                                                stroke="#2563eb"
                                                strokeWidth={3}
                                                dot={{ r: 3 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="totalOrders"
                                                stroke="#10b981"
                                                strokeWidth={3}
                                                dot={{ r: 3 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={6}>
                            <Card sx={{ borderRadius: 3, height: 360, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)", border: "1px solid #eef2ff" }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography fontWeight="700">Sales by Category</Typography>
                                        <Typography variant="caption" color="primary" fontWeight="600">Live split</Typography>
                                    </Box>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <PieChart>
                                            <Tooltip content={<CustomPieTooltip />} />
                                            <Pie
                                                data={categorySalesData}
                                                dataKey="totalSales"
                                                nameKey="categoryName"
                                                outerRadius={95}
                                                label={renderPieLabel}
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

                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Card sx={{ borderRadius: 3, height: 500, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)", border: "1px solid #eef2ff" }}>
                            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.2}>
                                    <Box>
                                        <Typography fontWeight="700">Recent Orders</Typography>
                                        <Typography variant="caption" color="text.secondary">Latest updates from your store</Typography>
                                    </Box>
                                    <Typography color="primary" sx={{ cursor: "pointer", fontWeight: 600 }}>
                                        View all
                                    </Typography>
                                </Box>

                                <Box sx={{ overflowY: "auto", pr: 1, flexGrow: 1 }}>
                                    {orders.map((order) => (
                                        <Box
                                            key={order.id}
                                            mb={2}
                                            p={2}
                                            sx={{
                                                border: "1px solid #e2e8f0",
                                                borderRadius: 2,
                                                background: "#fff",
                                                '&:hover': { background: "#f8fafc" },
                                            }}
                                        >
                                            <Grid container alignItems="center" spacing={2}>
                                                <Grid size={8}>
                                                    <Typography fontWeight="600">
                                                        {order.orderId.slice(0, 5)}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {order.product.productName}
                                                    </Typography>
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            px: 1.5,
                                                            py: 0.45,
                                                            borderRadius: 2,
                                                            display: "inline-block",
                                                            mt: 0.7,
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
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {order.status}
                                                    </Box>
                                                </Grid>

                                                <Grid size={2} textAlign="center">
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(order.orderDate).toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </Typography>
                                                </Grid>

                                                <Grid size={2} textAlign="right">
                                                    <Typography fontWeight="600">
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

                    <Grid size={6}>
                        <Card sx={{ borderRadius: 3, height: 500, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)", border: "1px solid #eef2ff" }}>
                            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.2}>
                                    <Box>
                                        <Typography fontWeight="700">Top Products</Typography>
                                        <Typography variant="caption" color="text.secondary">Best performers this month</Typography>
                                    </Box>
                                    <Typography color="primary" sx={{ cursor: "pointer", fontWeight: 600 }}>
                                        View all
                                    </Typography>
                                </Box>

                                <Box sx={{ overflowY: "auto", pr: 1, flexGrow: 1 }}>
                                    {topSellingProducts?.map((product) => (
                                        <Box
                                            key={product.productId}
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            mb={2}
                                            p={2}
                                            sx={{
                                                border: "1px solid #e2e8f0",
                                                borderRadius: 2,
                                                background: "#fff",
                                                '&:hover': { background: "#f8fafc" },
                                            }}
                                        >
                                            <Box display="flex" gap={2} alignItems="center">
                                                <Avatar sx={{ bgcolor: "linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)", color: "#1d4ed8" }}>
                                                    {product.productId}
                                                </Avatar>

                                                <Box>
                                                    <Typography fontWeight="600">
                                                        {product.productName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {product.quantity} sales
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Typography fontWeight="600">
                                                ₹ {product.totalAmount}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={2} mt={1}>
                    {[
                        { label: "Add Product", icon: <InventoryIcon sx={{ fontSize: 30 }} />, color: "#2563eb" },
                        { label: "Create Order", icon: <ShoppingCartIcon sx={{ fontSize: 30 }} />, color: "#0f766e" },
                        { label: "Add Customer", icon: <PeopleIcon sx={{ fontSize: 30 }} />, color: "#7c3aed" },
                        { label: "View Reports", icon: <MonetizationOnIcon sx={{ fontSize: 30 }} />, color: "#ea580c" },
                    ].map((item) => (
                        <Grid size={3} key={item.label}>
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: 3,
                                    textAlign: "center",
                                    py: 4,
                                    cursor: "pointer",
                                    borderColor: "#e2e8f0",
                                    boxShadow: "0 8px 22px rgba(15, 23, 42, 0.04)",
                                    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                    '&:hover': {
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 16px 35px rgba(15, 23, 42, 0.08)",
                                    },
                                }}
                            >
                                <CardContent>
                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mx: "auto",
                                            mb: 1.5,
                                            background: `linear-gradient(135deg, ${item.color}22 0%, ${item.color}10 100%)`,
                                            color: item.color,
                                        }}
                                    >
                                        {item.icon}
                                    </Box>
                                    <Typography fontWeight="600">{item.label}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}
