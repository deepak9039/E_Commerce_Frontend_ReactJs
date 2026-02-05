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
import { logoutUser } from "../../services/apiService";

// Pages
import AdminDashboard from "./AdminDashboard";
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

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "#f4f6f8",
        overflow: "hidden", // ✅ VERY IMPORTANT
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
              {user?.name?.[0] || "A"}
            </Avatar>

            <Typography fontWeight={600}>
              {user?.name || "Admin"}
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
          position: "fixed",
          top: topBarHeight,
          bottom: 0,
          bgcolor: "#fff",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <Tabs
          orientation="vertical"
          value={value}
          onChange={(e, v) => setValue(v)}
          sx={{
            height: "100%",
            "& .MuiTab-root": {
              justifyContent: "flex-start",
              flexDirection: "row",
              gap: 1.5,
              textAlign: "left",
              minHeight: 56,
              px: 3,
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
          <Tab icon={<DashboardIcon />} iconPosition="start" label="Dashboard" />
          <Tab icon={<CategoryIcon />} iconPosition="start" label="Categories" />
          <Tab icon={<InventoryIcon />} iconPosition="start" label="Products" />
          <Tab icon={<AddBoxIcon />} iconPosition="start" label="Add Product" />
          <Tab icon={<ShoppingCartIcon />} iconPosition="start" label="Orders" />
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Users" />
          <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" />
          <Tab icon={<BarChartIcon />} iconPosition="start" label="Reports" />
        </Tabs>
      </Box>

      {/* ================= RIGHT CONTENT ================= */}
      <Box
        sx={{
          marginLeft: `${drawerWidth}px`,
        //   marginTop: `${topBarHeight}px`,
          height: `calc(100vh - ${topBarHeight}px)`,
          overflowY: "auto",
          flexGrow: 1,
        //   p: 3,
        }}
      >
        <TabPanel value={value} index={0}>
          <AdminDashboard1 />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AddCategory />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ViewProduct />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <AddProduct />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <AdminOrders />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <UsersTable />
        </TabPanel>
        <TabPanel value={value} index={6}>
          <Typography>Settings</Typography>
        </TabPanel>
        <TabPanel value={value} index={7}>
          <Typography>Reports</Typography>
        </TabPanel>
      </Box>
    </Box>
  );
}
