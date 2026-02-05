import React, { useState } from "react";
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
import { findAllProduct } from "../../services/apiService";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (value) => {
    setSearchQuery(value);

    if (value.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const products = await findAllProduct();
      const filtered = products.filter(
        (product) =>
          product.productName.toLowerCase().includes(value.toLowerCase()) ||
          product.productDescription.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    }
  };

  const handleSelectProduct = (productId) => {
    navigate(`/product/${productId}`);
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => searchQuery && setShowResults(true)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  if (searchResults.length > 0) {
                    handleSelectProduct(searchResults[0].productId);
                  }
                }}
                edge="end"
                sx={{ cursor: "pointer" }}
              >
                <SearchIcon sx={{ color: "#666" }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          width: 400,
          backgroundColor: "white",
          borderRadius: 1,
          "& .MuiOutlinedInput-root": {
            color: "#333",
            "& fieldset": {
              borderColor: "gray",
            },
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
          },
        }}
      />

      {/* SEARCH RESULTS DROPDOWN */}
      {showResults && searchResults.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: 300,
            overflowY: "auto",
            zIndex: 10,
            mt: 1,
          }}
        >
          <List>
            {searchResults.map((product) => (
              <ListItem
                key={product.productId}
                button
                onClick={() => handleSelectProduct(product.productId)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                  cursor: "pointer",
                }}
              >
                <ListItemText
                  primary={product.productName}
                  secondary={`₹${product.productPrice}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {showResults && searchResults.length === 0 && searchQuery && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            mt: 1,
            p: 2,
            textAlign: "center",
          }}
        >
          No products found
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;
