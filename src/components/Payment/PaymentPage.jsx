import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  IconButton,
  Paper,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowBack,
  AccountBalanceWalletOutlined,
  CreditCardOutlined,
  CurrencyRupee,
  LockOutlined,
  HelpOutline,
  QrCode2Outlined,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { processPayment } from "../../services/paymentService";

const PaymentPage = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const orderState = location.state || {};

  const [selectedMethod, setSelectedMethod] = useState(() => {
    const initialMethod = orderState.paymentMethod;

    if (initialMethod === "UPI" || initialMethod === "CASH_ON_DELIVERY") {
      return initialMethod;
    }

    return "CREDIT_CARD";
  });
  const [selectedCard, setSelectedCard] = useState("credit");
  const [cvv, setCvv] = useState("");

  // Extract all data from Order page
  const { 
    totalAmount = 0, 
    cartItems = [], 
    totalOrderDiscount = 0,
    orderId,
    selectedAddress,
    paymentMethod,
    res
  } = orderState;

  console.log("PaymentPage - Received Order Data:", {
    res: res,
    totalAmount,
    cartItems,
    totalOrderDiscount,
    orderId,
    selectedAddress,
    paymentMethod,
    fullState: orderState
  });

  const mrp = totalAmount;
  const delivery = mrp < 1000 ? 50 : 0;
  const discount = totalOrderDiscount;
  const paymentFee = 0; // Set to 0 or calculate as needed
  const finalTotal = (mrp + delivery - discount) + paymentFee;

  const handlePayment = async () => {
    console.log("Initiating payment with the following details:");
    const orders = res?.orders?.length
      ? res.orders
      : [{ orderId, amount: finalTotal }];

    const paymentResults = await Promise.all(
      orders.map((order) => {
        const orderAmount = order.amount ?? (
          Number(order.price || 0) * Number(order.quantity || 1)
        );
        const paymentPayload = {
          userId: user?.userId,
          orderId: order.orderId,
          amount: orderAmount,
          paymentMethod: selectedMethod,
          paymentStatus: "SUCCESS"
        };

        return processPayment(paymentPayload);
      })
    );

    const allPaymentsSucceeded = paymentResults.every(
      (paymentResult) => paymentResult.status === "SUCCESS"
    );

    if (allPaymentsSucceeded) {
      // OrderSuccess expects the order response fields at the top level.
      navigate("/order-success", { 
        state: {
          ...res,
          totalAmount,
          cartItems,
          totalOrderDiscount,
          selectedAddress,
          paymentMethod: selectedMethod
        }
      });
    }

    console.log("Payment Results:", paymentResults);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f6f8",
        p: { xs: 1, sm: 2 },
      }}
    >
      <Box
        sx={{
          maxWidth: "1550px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "16px",
          minHeight: "calc(100vh - 32px)",
          p: { xs: 2, md: 3 },
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              sx={{
                color: "#222",
                p: 0.5,
              }}
            >
              <ArrowBack />
            </IconButton>

            <Typography
              sx={{
                fontSize: { xs: "20px", md: "24px" },
                fontWeight: 700,
                color: "#212121",
              }}
            >
              Complete Payment
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              backgroundColor: "#f5f5f5",
              borderRadius: "6px",
              px: 1.2,
              py: 0.5,
            }}
          >
            <LockOutlined sx={{ fontSize: 17, color: "#555" }} />

            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#555",
              }}
            >
              100% Secure
            </Typography>
          </Box>
        </Box>

        {/* ORDER INFO SECTION */}
        {orderId && (
          <Card sx={{ mb: 3, p: 2, backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Order Summary
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>Order ID</Typography>
                <Typography fontWeight="600">{orderId}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>Total Items</Typography>
                <Typography fontWeight="600">{cartItems?.length || 0} items</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>Order Amount</Typography>
                <Typography fontWeight="600">₹{totalAmount?.toFixed(2) || "0.00"}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>Discount</Typography>
                <Typography fontWeight="600" sx={{ color: "#16a34a" }}>₹{totalOrderDiscount?.toFixed(2) || "0.00"}</Typography>
              </Box>
              {selectedAddress && (
                <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>Delivery Address</Typography>
                  <Typography fontWeight="600">
                    {selectedAddress?.firstName} {selectedAddress?.lastName}
                  </Typography>
                  <Typography variant="body2">
                    {selectedAddress?.address}, {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pinCode}
                  </Typography>
                </Box>
              )}
              {paymentMethod && (
                <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>Selected Payment Method</Typography>
                  <Typography fontWeight="600">
                    {paymentMethod === "CASH_ON_DELIVERY" ? "Cash on Delivery" : paymentMethod === "UPI" ? "UPI" : "Credit Card"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        )}

        {/* Main Layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(650px, 2.1fr) minmax(350px, 1fr)",
            },
            gap: 3,
          }}
        >
          {/* LEFT PAYMENT AREA */}
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              minHeight: { lg: "775px" },
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "310px 1fr",
              },
            }}
          >
            {/* PAYMENT METHODS */}
            <Box
              sx={{
                borderRight: {
                  xs: "none",
                  md: "1px solid #ddd",
                },
                borderBottom: {
                  xs: "1px solid #ddd",
                  md: "none",
                },
              }}
            >
              {/* UPI */}
              <PaymentMethod
                icon={<AccountBalanceWalletOutlined />}
                title="UPI"
                subtitle="Pay by any UPI app"
                selected={selectedMethod === "UPI"}
                onClick={() => setSelectedMethod("UPI")}
              />

              {/* Credit/Debit/ATM Card */}
              <PaymentMethod
                icon={<CreditCardOutlined />}
                title="Credit / Debit / ATM Card"
                subtitle="Add and secure cards as per RBI guidelines"
                selected={selectedMethod === "CREDIT_CARD"}
                onClick={() => setSelectedMethod("CREDIT_CARD")}
              />

              {/* COD */}
              <PaymentMethod
                icon={<CurrencyRupee />}
                title="Cash on Delivery"
                selected={selectedMethod === "CASH_ON_DELIVERY"}
                onClick={() => setSelectedMethod("CASH_ON_DELIVERY")}
              />
            </Box>

            {/* PAYMENT CONTENT */}
            <Box
              sx={{
                backgroundColor: "#f8f8f8",
                p: { xs: 2, md: 3 },
              }}
            >
              {selectedMethod === "CREDIT_CARD" ? (
                <CardPayment
                  selectedCard={selectedCard}
                  setSelectedCard={setSelectedCard}
                  cvv={cvv}
                  setCvv={setCvv}
                  handlePayment={handlePayment}
                  totalAmount={finalTotal}
                />
              ) : selectedMethod === "UPI" ? (
                <UpiPayment handlePayment={handlePayment} totalAmount={finalTotal} />
              ) : selectedMethod === "CASH_ON_DELIVERY" ? (
                <CodPayment />
              ) : (
                <CardPayment
                  selectedCard={selectedCard}
                  setSelectedCard={setSelectedCard}
                  cvv={cvv}
                  setCvv={setCvv}
                  handlePayment={handlePayment}
                  totalAmount={finalTotal}
                />
              )}
            </Box>
          </Paper>

          {/* RIGHT SUMMARY */}
          <Box>
            <OrderSummary
              mrp={mrp}
              discount={discount}
              paymentFee={paymentFee}
              totalAmount={finalTotal}
            />

            <DiscountOffer />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

/* =========================================================
   PAYMENT METHOD COMPONENT
========================================================= */

const PaymentMethod = ({
  icon,
  title,
  subtitle,
  extra,
  selected,
  onClick,
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 2.5,
        py: 2,
        borderBottom: "1px solid #ddd",
        cursor: "pointer",
        backgroundColor: selected ? "#fff" : "#fff",
        transition: "0.2s",

        "&:hover": {
          backgroundColor: "#fafafa",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            mt: 0.2,
            color: "#333",
            display: "flex",
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: "17px",
              fontWeight: 600,
              color: "#222",
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              sx={{
                fontSize: "14px",
                color: "#666",
                mt: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          )}

          {extra}
        </Box>
      </Box>
    </Box>
  );
};

/* =========================================================
   CARD PAYMENT
========================================================= */

const CardPayment = ({
  selectedCard,
  setSelectedCard,
  cvv,
  setCvv,
  handlePayment,
  totalAmount = 0,
}) => {
  return (
    <Box
      sx={{
        maxWidth: "600px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        p: 3,
      }}
    >
      {/* CREDIT CARD FORM */}
      <Box>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            mb: 3,
            color: "#212121",
          }}
        >
          Enter Card Details
        </Typography>

        {/* Card Number */}
        <TextField
          fullWidth
          label="Card Number"
          placeholder="Enter 16-digit card number"
          size="small"
          sx={{
            mb: 2.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />

        {/* Expiry and CVV */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2.5 }}>
          <TextField
            label="Expiry Date"
            placeholder="MM/YY"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
          <TextField
            label="CVV"
            placeholder="3-digit code"
            type="password"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
            InputProps={{
              endAdornment: (
                <HelpOutline
                  sx={{
                    fontSize: 18,
                    color: "#999",
                    cursor: "pointer",
                  }}
                />
              ),
            }}
          />
        </Box>

        {/* Card Holder Name */}
        <TextField
          fullWidth
          label="Card Holder Name"
          placeholder="Name as shown on card"
          size="small"
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />

        {/* Pay Button - Large and Prominent */}
        <Button
          fullWidth
          variant="contained"
          onClick={handlePayment}
          sx={{
            height: "56px",
            backgroundColor: "#facc15",
            color: "#000",
            fontSize: "16px",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(250, 204, 21, 0.3)",
            mb: 2,
            transition: "all 0.3s ease",

            "&:hover": {
              backgroundColor: "#eab308",
              boxShadow: "0 6px 16px rgba(250, 204, 21, 0.4)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Pay ₹{typeof totalAmount === 'number' ? totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : totalAmount}
        </Button>

        {/* Payment Fee Info */}
        <Typography
          sx={{
            textAlign: "center",
            color: "#666",
            fontSize: "13px",
            mb: 3,
          }}
        >
          ₹0.00 Payment Handling Fee
        </Typography>

        {/* Divider */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            my: 3,
          }}
        >
          <Divider sx={{ flex: 1 }} />
          <Typography sx={{ color: "#999", fontSize: "14px", fontWeight: 600 }}>
            OR
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        {/* SAVED CARD OPTION */}
        <Box
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            p: 2,
            cursor: "pointer",
            transition: "all 0.3s ease",
            backgroundColor: selectedCard === "debit" ? "#f0f9ff" : "#fff",
            borderColor: selectedCard === "debit" ? "#0284c7" : "#e5e7eb",

            "&:hover": {
              borderColor: "#0284c7",
              backgroundColor: "#f0f9ff",
            },
          }}
          onClick={() => setSelectedCard("debit")}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Radio
                checked={selectedCard === "debit"}
                onChange={() => setSelectedCard("debit")}
              />
              <Box>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#212121",
                  }}
                >
                  HDFC Bank Debit Card
                </Typography>
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "#666",
                    mt: 0.5,
                  }}
                >
                  •••• •••• •••• 3405
                </Typography>
              </Box>
            </Box>
            <QrCode2Outlined
              sx={{
                color: "#dc2626",
                fontSize: 40,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

/* =========================================================
   UPI PAYMENT
========================================================= */

const UpiPayment = ({ handlePayment, totalAmount = 0 }) => {
  return (
    <Box
      sx={{
        maxWidth: "520px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        p: 3,
      }}
    >
      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: 600,
          mb: 2,
        }}
      >
        Pay using UPI
      </Typography>

      <TextField
        fullWidth
        placeholder="Enter UPI ID"
        size="small"
        sx={{ mb: 2 }}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handlePayment}
        sx={{
          backgroundColor: "#ffc400",
          color: "#111",
          fontWeight: 700,
          textTransform: "none",
          height: "48px",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#f5b800",
            boxShadow: "none",
          },
        }}
      >
        Pay ₹{typeof totalAmount === 'number' ? totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : totalAmount}
      </Button>
    </Box>
  );
};

/* =========================================================
   CASH ON DELIVERY PAYMENT
========================================================= */

const CodPayment = () => {
  return (
    <Box
      sx={{
        maxWidth: "520px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        p: 3,
      }}
    >
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: 600,
          mb: 2,
        }}
      >
        Cash on Delivery
      </Typography>

      <Typography
        sx={{
          color: "#555",
          fontSize: "15px",
          mb: 2,
        }}
      >
        Please pay the amount in cash when you receive the order.
      </Typography>

      <Box
        sx={{
          backgroundColor: "#e8f5e9",
          border: "1px solid #c8e6c9",
          borderRadius: "6px",
          p: 2,
        }}
      >
        <Typography
          sx={{
            color: "#2e7d32",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          ✓ Safe and secure
        </Typography>
        <Typography
          sx={{
            color: "#2e7d32",
            fontSize: "14px",
            mt: 1,
          }}
        >
          You will receive this order with payment options
        </Typography>
      </Box>
    </Box>
  );
};

/* =========================================================
   ORDER SUMMARY
========================================================= */

const OrderSummary = ({
  mrp,
  discount,
  paymentFee,
  totalAmount,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "#eef4ff",
        borderRadius: "10px",
        p: 2,
      }}
    >
      {/* MRP */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography fontSize="17px">
          MRP (incl. of all taxes)
        </Typography>

        <Typography fontSize="17px">
          ₹{mrp.toLocaleString("en-IN")}
        </Typography>
      </Box>


      {/* Discount */}
      <Box>
        <Typography fontSize="17px">
          Discounts <KeyboardArrowUp sx={{ verticalAlign: "middle" }} />
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            pb: 2,
            borderBottom: "1px solid #ddd",
          }}
        >
          <Typography color="#666">MRP Discount</Typography>

          <Typography color="#188038">
            -₹{discount.toLocaleString("en-IN")}
          </Typography>
        </Box>
      </Box>

      {/* Total */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
        }}
      >
        <Typography
          sx={{
            color: "#2457e6",
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          Total Amount
        </Typography>

        <Typography
          sx={{
            color: "#2457e6",
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          ₹{typeof totalAmount === 'number' ? totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : totalAmount}
        </Typography>
      </Box>
    </Box>
  );
};

/* =========================================================
   DISCOUNT OFFER
========================================================= */

const DiscountOffer = () => {
  return (
    <Box
      sx={{
        mt: 2.5,
        backgroundColor: "#e5f8e9",
        borderRadius: "10px",
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography
          sx={{
            color: "#188038",
            fontWeight: 700,
            fontSize: "17px",
          }}
        >
          10% instant discount
        </Typography>

        <Typography
          sx={{
            color: "#188038",
            fontSize: "14px",
          }}
        >
          Claim now with payment offers
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          ml: 1,
        }}
      >
        <OfferCircle>HDFC</OfferCircle>
        <OfferCircle>▶</OfferCircle>

        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "14px",
            ml: -0.5,
            border: "2px solid #e5f8e9",
          }}
        >
          +3
        </Box>
      </Box>
    </Box>
  );
};

const OfferCircle = ({ children }) => {
  return (
    <Box
      sx={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "9px",
        fontWeight: 700,
        border: "2px solid #e5f8e9",
        ml: -0.5,
      }}
    >
      {children}
    </Box>
  );
};

export default PaymentPage;