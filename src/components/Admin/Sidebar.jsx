import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box
} from "@mui/material";

import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";

import { NavLink } from "react-router-dom";

const menuItems = [
  { text: "Dashboard", path: "/", icon: <BarChartIcon /> },
  { text: "Add Category", path: "/add-category", icon: <CategoryIcon /> },
  { text: "Add Product", path: "/add-product", icon: <InventoryIcon /> },
  { text: "View Products", path: "/view-products", icon: <ListAltIcon /> },
  { text: "Orders", path: "/admin-orders", icon: <ShoppingCartIcon /> },
  { text: "Users", path: "/users", icon: <PeopleIcon /> },
  { text: "Reports", path: "/reports", icon: <BarChartIcon /> },
  { text: "Settings", path: "/settings", icon: <SettingsIcon /> }
];

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        "& .MuiDrawer-paper": {
          width: 240,
          bgcolor: "#0f172a",
          color: "#fff"
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography fontWeight={700}>Admin Panel</Typography>
        <Typography fontSize={12} color="gray">
          E-Commerce
        </Typography>
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            sx={{
              "&.active": { bgcolor: "#1e293b" }
            }}
          >
            <ListItemIcon sx={{ color: "#cbd5f5" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
