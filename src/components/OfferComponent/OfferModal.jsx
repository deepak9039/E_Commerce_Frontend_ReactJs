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
                    borderRadius: 4,
                    overflow: "visible",
                    position: "relative",
                    bgcolor: "#fff",
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
                        top: 15,
                        right: 15,
                        zIndex: 20,
                        bgcolor: "#fff",
                        "&:hover": {
                            bgcolor: "#f5f5f5",
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Top Decoration */}

                <Box
                    sx={{
                        borderRadius: 4,
                        position: "relative",
                        height: 180,
                        background:
                            "linear-gradient(180deg,#ffffff 0%, #fff7f4 100%)",
                        overflow: "hidden",
                    }}
                >
                    {/* Confetti */}

                    {Array.from({ length: 25 }).map((_, i) => (
                        <Box
                            key={i}
                            sx={{
                                position: "absolute",
                                width: i % 2 === 0 ? 10 : 18,
                                height: i % 2 === 0 ? 10 : 4,
                                borderRadius: i % 2 === 0 ? "50%" : "16px",
                                bgcolor:
                                    i % 3 === 0
                                        ? "#FF6B4A"
                                        : i % 3 === 1
                                            ? "#FDBA2D"
                                            : "#E53935",
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                            }}
                        />
                    ))}

                    {/* Floating Card */}

                    <Box
                    >
                        {/* Illustration */}

                        <Box
                        >
                            <Box

                            />

                            <Box
                            />

                            {[10, 25, 40].map((top) => (
                                <Box
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
                            fontSize: 20,
                        }}
                    >
                        Special Signup Code
                    </Typography>

                    <Typography
                        sx={{
                            mt: 3,
                            fontWeight: 800,
                            fontSize: {
                                xs: 42,
                                md: 54,
                            },
                            lineHeight: 1.1,
                        }}
                    >
                        Get Additional
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 900,
                            fontSize: {
                                xs: 52,
                                md: 64,
                            },
                            color: "#6755F4",
                            lineHeight: 1,
                        }}
                    >
                        10% Off*
                    </Typography>

                    <Typography
                        sx={{
                            mt: 3,
                            fontSize: 30,
                            fontWeight: 700,
                        }}
                    >
                        Sign-up Today
                    </Typography>

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 5,
                            py: 2,
                            borderRadius: "50px",
                            bgcolor: "#FF6B4A",
                            fontSize: 24,
                            fontWeight: 700,
                            textTransform: "none",
                            boxShadow: "0px 10px 30px rgba(255,107,74,.4)",
                            "&:hover": {
                                bgcolor: "#f55b38",
                            },
                        }}
                    >
                        Claim 10% OFF
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default OfferModal;