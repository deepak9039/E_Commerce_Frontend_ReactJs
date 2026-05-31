import * as React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  AppBar,
  Toolbar,
  TextField,
  IconButton,
  Avatar,
} from "@mui/material";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import BarChartIcon from "@mui/icons-material/BarChart";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";

// Pages
import AdminDashboard1 from "./AdminDashboard1";
import AddCategory from "../Category/AddCategory";
import ViewProduct from "../Product/ViewProduct";
import AddProduct from "../Product/AddProduct";
import AdminOrders from "./AdminOrders";
import UsersTable from "../UserDetails/UsersTable";

const drawerWidth = 260;
const topBarHeight = 64;

/* ---------------- TAB PANEL ---------------- */
function TabPanel({ value, index, children }) {
  return (
    <Box hidden={value !== index} sx={{ height: "100%" }}>
      {value === index && children}
    </Box>
  );
}

TabPanel.propTypes = {
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.node,
};

/* ---------------- MAIN LAYOUT ---------------- */
export default function AdminLayout({ user, signOut }) {
  const [value, setValue] = React.useState(0);
  const [editProductId, setEditProductId] = React.useState(null);

  const isSuperAdmin = user?.role === "ROLE_SUPER_ADMIN";

  // Dynamic indexes
  const INDEX = {
    DASHBOARD: 0,
    CATEGORY: isSuperAdmin ? 1 : null,
    PRODUCTS: isSuperAdmin ? 2 : 1,
    ADD_PRODUCT: isSuperAdmin ? 3 : 2,
    ORDERS: isSuperAdmin ? 4 : 3,
    USERS: isSuperAdmin ? 5 : null,
    SETTINGS: isSuperAdmin ? 6 : 4,
    REPORTS: isSuperAdmin ? 7 : 5,
  };

  const handleEditProduct = (productId) => {
    setEditProductId(productId);
    setValue(INDEX.ADD_PRODUCT);
  };

  const handleProductSaved = () => {
    setEditProductId(null);
    setValue(INDEX.PRODUCTS);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "#f4f6f8",
        overflow: "hidden",
      }}
    >
      {/* ================= TOP BAR ================= */}
      <AppBar
        position="fixed"
        sx={{
          height: topBarHeight,
          zIndex: 1300,
          bgcolor: "#ffffff",
          color: "#000",
          boxShadow: 1,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={700}>
            Admin Panel
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search…"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              }}
            />

            <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
              {user?.email?.[0] || "A"}
            </Avatar>

            <Typography fontWeight={600}>
              {user?.email || "Admin"}
            </Typography>

            <IconButton color="error" onClick={signOut}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ================= SIDEBAR ================= */}
      <Box
        sx={{
          width: drawerWidth,
          bgcolor: "#fff",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <Tabs
          orientation="vertical"
          value={value}
          onChange={(e, v) => {
            setValue(v);

            if (v === INDEX.ADD_PRODUCT) {
              setEditProductId(null);
            }
          }}
          sx={{
            height: "100%",
            "& .MuiTab-root": {
              justifyContent: "flex-start",
              flexDirection: "row",
              gap: 1.5,
              textAlign: "left",
              minHeight: 56,
              fontWeight: 600,
              textTransform: "none",
            },
            "& .Mui-selected": {
              bgcolor: "rgba(25,118,210,0.08)",
              color: "primary.main",
              borderLeft: "4px solid",
              borderColor: "primary.main",
            },
          }}
        >
          <Tab
            icon={<DashboardIcon />}
            iconPosition="start"
            label="Dashboard"
          />

          {isSuperAdmin && (
            <Tab
              icon={<CategoryIcon />}
              iconPosition="start"
              label="Categories"
            />
          )}

          <Tab
            icon={<InventoryIcon />}
            iconPosition="start"
            label="Products"
          />

          <Tab
            icon={<AddBoxIcon />}
            iconPosition="start"
            label="Add Product"
          />

          <Tab
            icon={<ShoppingCartIcon />}
            iconPosition="start"
            label="Orders"
          />

          {isSuperAdmin && (
            <Tab
              icon={<PeopleIcon />}
              iconPosition="start"
              label="Users"
            />
          )}

          <Tab
            icon={<SettingsIcon />}
            iconPosition="start"
            label="Settings"
          />

          <Tab
            icon={<BarChartIcon />}
            iconPosition="start"
            label="Reports"
          />
        </Tabs>
      </Box>

      {/* ================= RIGHT CONTENT ================= */}
      <Box
        sx={{
          height: `calc(100vh - ${topBarHeight}px)`,
          overflowY: "auto",
          flexGrow: 1,
        }}
      >
        <TabPanel value={value} index={INDEX.DASHBOARD}>
          <AdminDashboard1 user={user} />
        </TabPanel>

        {isSuperAdmin && (
          <TabPanel value={value} index={INDEX.CATEGORY}>
            <AddCategory />
          </TabPanel>
        )}

        <TabPanel value={value} index={INDEX.PRODUCTS}>
          <ViewProduct
            onEditProduct={handleEditProduct}
            user={user}
          />
        </TabPanel>

        <TabPanel value={value} index={INDEX.ADD_PRODUCT}>
          <AddProduct
            editProductId={editProductId}
            onProductSaved={handleProductSaved}
          />
        </TabPanel>

        <TabPanel value={value} index={INDEX.ORDERS}>
          <AdminOrders user={user} />
        </TabPanel>

        {isSuperAdmin && (
          <TabPanel value={value} index={INDEX.USERS}>
            <UsersTable />
          </TabPanel>
        )}

        <TabPanel value={value} index={INDEX.SETTINGS}>
          <Typography variant="h5" textAlign="center" justifyContent="center" sx={{mt:5}}>Setting Coming Soon</Typography>
        </TabPanel>

        <TabPanel value={value} index={INDEX.REPORTS}>
          <Typography variant="h5" textAlign="center" justifyContent="center" sx={{mt:5}}>
            Report Coming Soon
          </Typography>
        </TabPanel>
      </Box>
    </Box>
  );
}