import React from "react";
import { useLocation } from "react-router-dom";
import {
    Box,
    Grid,
    Paper,
    Typography,
    Divider,
    Stack,
    Avatar,
    Button,
    IconButton,
    Rating,
    Container,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";


// Replace these with your real API responses (order + payment), or pass as props.
const orderData = {
    orderId: "4cd7625b-9514-45cd-ad9f-d7892dfe3f61",
    orderDate: "2026-09-01T18:36:33.661+00:00",
    product: {
        productName: "Redmi Note 13 Pro",
        productDescription: "AMOLED display, 200MP camera.",
        productImageUrl: null,
    },
    variant: "256GB, Aurora Purple",
    seller: "Xiaomi Retail India Pvt Ltd",
    price: 25999.0,
    quantity: 1,
    status: "DELIVERED",
    confirmedDate: "Sep 1",
    deliveredDate: "Sep 4",
    orderAddress: {
        firstName: "user",
        lastName: "",
        phoneNumber: "09131116073",
        address: "add kine one",
        city: "BHOPAL",
        state: "MADHYA PRADESH",
    },
};

const paymentData = {
    amount: 25999.0,
    method: "CREDIT_CARD",
    status: "SUCCESS",
    createdAt: "2026-09-02T00:07:55.424941",
};

const formatCurrency = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

const toTitleCase = (str) =>
    str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const UserOrderPaymentPage = ({ order = orderData,
    payment = paymentData, paymentDetails, orderDetails }) => {
    const location = useLocation();
    const routePaymentDetails = location.state?.paymentDetails;
    const routeOrderDetails = location.state?.orderDetails;
    const resolvedPaymentDetails = paymentDetails ?? routePaymentDetails ?? payment;
    const resolvedOrderDetails = orderDetails ?? routeOrderDetails ?? order;
    const { product, orderAddress } = resolvedOrderDetails;
    const customerName = `${orderAddress.firstName} ${orderAddress.lastName || ""}`.trim();
    
    console.log("UserOrderPaymentPage - paymentDetails:", resolvedPaymentDetails);
    console.log("UserOrderPaymentPage - orderDetails:", resolvedOrderDetails);

    return (
        <Box sx={{ bgcolor: "#F1F3F6", minHeight: "100vh", py: { xs: 2, md: 4 } }}>
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    {/* Left column */}
                    <Grid item xs={12} md={7} size={ 8 }  >
                        <Paper variant="outlined" sx={{ borderRadius: 2, p: 3, mb: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="h6" fontWeight={400}>
                                        {product.productName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                                        {resolvedOrderDetails.variant}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mt={1.5}>
                                        Seller: {resolvedOrderDetails.seller}
                                    </Typography>
                                    <Typography variant="h6" fontWeight={700} mt={1}>
                                        {formatCurrency(resolvedOrderDetails.price)}
                                    </Typography>
                                </Box>
                                <Avatar
                                    variant="rounded"
                                    // src={resolvedOrderDetails.product.productImageUrl || undefined}
                                    src={`http://localhost:1234/image/product/${resolvedOrderDetails.product.productImageUrl}`}
                                    sx={{ width: 96, height: 96, bgcolor: "grey.100" }}
                                >
                                    {!resolvedOrderDetails.product.productImageUrl && resolvedOrderDetails.product.productName.charAt(0)}
                                </Avatar>
                            </Stack>

                            <Divider sx={{ my: 2.5 }} />

                            {/* Status timeline */}
                            <Stack spacing={0}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <CheckCircleIcon sx={{ color: "success.main" }} />
                                    <Typography variant="body1">
                                        Order Confirmed, {resolvedOrderDetails.confirmedDate}
                                    </Typography>
                                </Stack>
                                <Box sx={{ width: 2, height: 28, bgcolor: "success.main", ml: 1.4 }} />
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <CheckCircleIcon sx={{ color: "success.main" }} />
                                    <Typography variant="body1">
                                        Delivered, {resolvedOrderDetails.deliveredDate}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Button sx={{ mt: 2, px: 0, textTransform: "none", fontWeight: 600 }}>
                                See All Updates &rsaquo;
                            </Button>
                        </Paper>

                        <Paper variant="outlined" sx={{ borderRadius: 2, py: 2, mb: 2, textAlign: "center" }}>
                            <Button
                                startIcon={<ChatBubbleOutlineIcon />}
                                sx={{ textTransform: "none", fontWeight: 600, color: "text.primary" }}
                            >
                                Chat with us
                            </Button>
                        </Paper>

                        <Paper variant="outlined" sx={{ borderRadius: 2, p: 3, mb: 2 }}>
                            <Typography variant="h6" fontWeight={700} mb={2}>
                                Rate your experience
                            </Typography>
                            <Box sx={{ bgcolor: "grey.50", borderRadius: 2, p: 2 }}>
                                <Typography variant="body1" mb={1.5}>
                                    Rate the product
                                </Typography>
                                <Rating size="large" />
                            </Box>
                        </Paper>

                        <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Order #{resolvedOrderDetails.orderId.replace(/-/g, "").slice(0, 20).toUpperCase()}
                            </Typography>
                            <IconButton size="small">
                                <ContentCopyIcon fontSize="inherit" />
                            </IconButton>
                        </Stack>
                    </Grid>

                    {/* Right column */}
                    <Grid item xs={12} md={5} size={ 4 }  >
                        <Paper variant="outlined" sx={{ borderRadius: 2, p: 3, mb: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight={700}>
                                    Delivery details
                                </Typography>
                                <IconButton size="small">
                                    <ExpandLessIcon />
                                </IconButton>
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
                                <WorkOutlineIcon color="action" />
                                <Box>
                                    <Typography component="span" fontWeight={700} mr={1}>
                                        Work
                                    </Typography>
                                    <Typography component="span" color="text.secondary">
                                        {orderAddress.address}, {toTitleCase(orderAddress.city)},{" "}
                                        {toTitleCase(orderAddress.state)}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Divider sx={{ my: 2 }} />

                            <Stack direction="row" spacing={2} alignItems="center">
                                <PersonOutlineIcon color="action" />
                                <Typography>
                                    <Typography component="span" fontWeight={700} mr={1}>
                                        {customerName}
                                    </Typography>
                                    <Typography component="span" color="text.secondary">
                                        {orderAddress.phoneNumber}
                                    </Typography>
                                </Typography>
                            </Stack>
                        </Paper>

                        <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight={700}>
                                    Price details
                                </Typography>
                                <IconButton size="small">
                                    <ExpandLessIcon />
                                </IconButton>
                            </Stack>

                            <Box sx={{ bgcolor: "grey.50", borderRadius: 2, p: 2 }}>
                                <Stack spacing={1.5}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography color="text.secondary">Total amount</Typography>
                                        <Typography>{formatCurrency(resolvedOrderDetails.price)}</Typography>
                                    </Stack>

                                    <Divider sx={{ borderStyle: "dashed" }} />

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography fontWeight={700}>Amount paid</Typography>
                                        <Typography fontWeight={700}>
                                            {formatCurrency(resolvedPaymentDetails.amount)}
                                        </Typography>
                                    </Stack>
                                </Stack>

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{
                                        mt: 2,
                                        p: 1.5,
                                        bgcolor: "background.paper",
                                        borderRadius: 2,
                                        border: "1px solid",
                                        borderColor: "divider",
                                    }}
                                >
                                    <Typography color="text.secondary">Paid By</Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <CreditCardIcon fontSize="small" />
                                        <Typography>Credit Card</Typography>
                                    </Stack>
                                </Stack>

                                <Button
                                    fullWidth
                                    startIcon={<FileDownloadOutlinedIcon />}
                                    sx={{
                                        mt: 2,
                                        py: 1.2,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        color: "text.primary",
                                        bgcolor: "background.paper",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        "&:hover": { bgcolor: "grey.100" },
                                    }}
                                >
                                    Download Invoice
                                </Button>
                            </Box>
                        </Paper>

                        <Paper variant="outlined" sx={{ borderRadius: 2, p: 2, mt: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <EmojiEventsOutlinedIcon color="action" />
                                    <Typography fontWeight={600}>Offers earned</Typography>
                                </Stack>
                                <ExpandMoreIcon />
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default UserOrderPaymentPage
