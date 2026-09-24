import React from "react";
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Button,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const OfferModal = ({ open, handleClose }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            PaperProps={{
                sx: {
                    borderRadius: "24px",
                    overflow: "visible",
                    position: "relative",
                    bgcolor: "#fff",
                    boxShadow: "0 30px 70px rgba(15,23,42,0.35)",
                },
            }}
        >
            <DialogContent
                sx={{
                    p: 0,
                    overflow: "hidden",
                }}
            >
                {/* Close Button */}

                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        zIndex: 20,
                        bgcolor: "rgba(255,255,255,0.9)",
                        width: 34,
                        height: 34,
                        boxShadow: "0 4px 12px rgba(15,23,42,0.15)",
                        "&:hover": {
                            bgcolor: "#fff",
                        },
                    }}
                >
                    <CloseIcon sx={{ fontSize: 20 }} />
                </IconButton>

                {/* Top Decoration */}

                <Box
                    sx={{
                        position: "relative",
                        height: 190,
                        background:
                            "linear-gradient(160deg,#6755F4 0%, #8b6ff8 55%, #FF6B4A 100%)",
                        overflow: "hidden",
                    }}
                >
                    {/* Confetti */}

                    {Array.from({ length: 25 }).map((_, i) => (
                        <Box
                            key={i}
                            sx={{
                                position: "absolute",
                                width: i % 2 === 0 ? 9 : 16,
                                height: i % 2 === 0 ? 9 : 4,
                                borderRadius: i % 2 === 0 ? "50%" : "16px",
                                bgcolor:
                                    i % 3 === 0
                                        ? "#FDBA2D"
                                        : i % 3 === 1
                                            ? "#ffffff"
                                            : "#FF9B7B",
                                opacity: i % 4 === 0 ? 0.55 : 0.9,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                            }}
                        />
                    ))}

                    {/* Floating Card */}

                    <Box
                        sx={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 108,
                            height: 108,
                            borderRadius: "50%",
                            bgcolor: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 18px 40px rgba(15,23,42,0.3)",
                        }}
                    >
                        {/* Illustration */}

                        <Box
                            sx={{
                                width: 82,
                                height: 82,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #FF6B4A 0%, #FDBA2D 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "#fff",
                                    fontWeight: 900,
                                    fontSize: 30,
                                    lineHeight: 1,
                                }}
                            >
                                %
                            </Typography>

                            {[10, 25, 40].map((top) => (
                                <Box
                                    key={top}
                                    sx={{
                                        position: "absolute",
                                        top: `${top}%`,
                                        right: -3,
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        bgcolor: "#fff",
                                        opacity: 0.85,
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* Content */}

                <Box
                    sx={{
                        px: 5,
                        pb: 5,
                        pt: 3,
                        textAlign: "center",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#FF724B",
                            fontWeight: 700,
                            fontSize: 15,
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                        }}
                    >
                        Special Signup Code
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.5,
                            fontWeight: 800,
                            fontSize: {
                                xs: 30,
                                md: 34,
                            },
                            lineHeight: 1.15,
                            color: "#0f172a",
                        }}
                    >
                        Get Additional
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 900,
                            fontSize: {
                                xs: 46,
                                md: 54,
                            },
                            color: "#6755F4",
                            lineHeight: 1.05,
                        }}
                    >
                        10% Off*
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.5,
                            fontSize: 16,
                            fontWeight: 500,
                            color: "#64748b",
                        }}
                    >
                        Sign-up Today
                    </Typography>

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3.5,
                            py: 1.6,
                            borderRadius: "999px",
                            bgcolor: "#FF6B4A",
                            fontSize: 16,
                            fontWeight: 700,
                            textTransform: "none",
                            boxShadow: "0px 14px 30px rgba(255,107,74,.4)",
                            "&:hover": {
                                bgcolor: "#f55b38",
                                boxShadow: "0px 16px 34px rgba(255,107,74,.5)",
                            },
                        }}
                    >
                        Claim 10% OFF
                    </Button>

                    <Typography
                        sx={{
                            mt: 2,
                            fontSize: 11,
                            color: "#94a3b8",
                        }}
                    >
                        *Valid on your first order only
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default OfferModal;
