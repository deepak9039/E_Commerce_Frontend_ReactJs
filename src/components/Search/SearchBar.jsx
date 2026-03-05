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
    <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search products..."
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

      {/* NO RESULTS */}
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