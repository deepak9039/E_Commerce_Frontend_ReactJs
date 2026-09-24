import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../../services/apiService";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Only update input value (NO API CALL)
  const handleSearch = (value) => {
    setSearchQuery(value);

    if (value.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // API call happens ONLY here
  const performSearch = () => {
  if (searchQuery.trim() === "") return;

  navigate(`/search?q=${searchQuery.trim()}`);

  setShowResults(false);
  // setSearchQuery("");
};

  const handleSelectProduct = (productId) => {
    navigate(`/product/${productId}`);
    setSearchQuery("");
    setShowResults(false);
  };

  // ✅ Sync input with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryFromUrl = params.get("q");

    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
    }
  }, [location.search]);

  return (
    <Box sx={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search for products, brands and more"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            performSearch();
          }
        }}
        onFocus={() => searchQuery && setShowResults(true)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={performSearch}
                edge="end"
                sx={{
                  cursor: "pointer",
                  color: "#0f766e",
                  "&:hover": { backgroundColor: "#f0fdfa" },
                }}
              >
                <SearchIcon sx={{ fontSize: 21 }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          width: "1000px",
          backgroundColor: "transparent",
          "& .MuiOutlinedInput-root": {
            color: "#0f172a",
            fontSize: 14,
            borderRadius: "8px",
            "& fieldset": {
              borderColor: "transparent",
            },
            "&:hover fieldset": {
              borderColor: "#ccfbf1",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0f766e",
              borderWidth: "1.5px",
            },
          },
          "& .MuiOutlinedInput-input::placeholder": {
            color: "#94a3b8",
            opacity: 1,
          },
        }}
      />

      {/* SEARCH RESULTS DROPDOWN */}
      {showResults && searchResults.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: 320,
            overflowY: "auto",
            zIndex: 10,
            mt: 1,
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 16px 36px rgba(15,23,42,0.16)",
          }}
        >
          <List sx={{ py: 0.5 }}>
            {searchResults.map((product) => (
              <ListItem
                key={product.productId}
                onClick={() => handleSelectProduct(product.productId)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f0fdfa",
                  },
                  cursor: "pointer",
                  px: 2,
                  py: 1,
                }}
              >
                <ListItemText
                  primary={product.productName}
                  secondary={`₹${product.productPrice}`}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}
                  secondaryTypographyProps={{ fontSize: 13, color: "#0f766e", fontWeight: 700 }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* NO RESULTS */}
      {showResults && searchResults.length === 0 && searchQuery && (
        <Paper
          elevation={0}
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            mt: 1,
            p: 2.5,
            textAlign: "center",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 16px 36px rgba(15,23,42,0.16)",
            color: "#64748b",
            fontSize: 14,
          }}
        >
          No products found
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;