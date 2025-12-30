# E-Commerce Frontend - React + Material-UI

A modern e-commerce frontend built with React, Material-UI (MUI), and Vite. Integrated with Spring Boot backend APIs for products, categories, orders, and cart management.

## Features

✨ **Key Features:**
- 🎯 **Product Listing**: Display all products with filtering by category
- 🔍 **Search Functionality**: Real-time product search
- 🛒 **Shopping Cart**: Add/remove items, update quantities
- 📦 **Order Management**: Direct ordering and checkout
- 🏷️ **Categories**: Sidebar category navigation with filtering
- 📱 **Responsive Design**: Mobile-friendly UI using Material-UI
- 🎨 **Modern Theme**: Customized Material-UI theme

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation bar with search and cart
│   ├── CategorySidebar.jsx # Left sidebar for category filtering
│   ├── ProductCard.jsx     # Individual product card component
│   ├── HomePage.jsx        # Main home page with product grid
│   └── CartPage.jsx        # Shopping cart page
├── services/
│   └── apiService.js       # Axios API client and endpoints
├── App.jsx                 # Main App component with routing
├── main.jsx                # Entry point
├── App.css                 # Global styles
└── index.css               # CSS reset and base styles
```

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure API Base URL:**
   - Edit `.env` file and set your Spring Boot API URL:
   ```
   REACT_APP_API_URL=http://localhost:8080/api
   ```
   - Or modify the default in `src/services/apiService.js`

## Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

## Spring Boot API Integration

### Required API Endpoints

Your Spring Boot backend should provide these endpoints:

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{categoryId}` - Get products by category
- `GET /api/products/search?q={query}` - Search products

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID

#### Orders
- `POST /api/orders/create` - Create a new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders/checkout` - Checkout with cart items

#### Cart (Optional - currently using localStorage)
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add to cart
- `DELETE /api/cart/remove/{productId}` - Remove from cart
- `PUT /api/cart/update/{productId}` - Update cart item
- `DELETE /api/cart/clear` - Clear cart

### API Response Format

The API should return responses in this format:

**Success Response:**
```json
{
  "status": "success",
  "data": [...]
}
```

**Product Object:**
```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "originalPrice": 129.99,
  "imageUrl": "https://...",
  "stock": 10,
  "rating": 4.5,
  "categoryId": 1
}
```

**Category Object:**
```json
{
  "id": 1,
  "name": "Electronics"
}
```

**Order Object:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 99.99
    }
  ],
  "totalAmount": 199.98
}
```

## Component Details

### Navbar
- Search bar for real-time product search
- Shopping cart badge with item count
- Click cart to navigate to cart page

### CategorySidebar
- List of all categories
- "All Products" option for viewing all items
- Active category highlighting
- Sticky positioning for easy access

### ProductCard
- Product image, name, description
- Price display (with original price if available)
- Rating display
- Quantity selector
- Add to Cart and Order buttons
- Stock status indicator
- Hover effects for better UX

### HomePage
- Grid layout of products
- Integrates CategorySidebar and ProductCard
- Real-time filtering by category/search
- Loading states and error handling

### CartPage
- Product table with image thumbnails
- Quantity adjustment with +/- buttons
- Item removal functionality
- Order summary with totals and tax calculation
- Checkout button
- Persistent cart using localStorage

## Material-UI Components Used

- AppBar & Toolbar
- Container & Grid
- Card & CardActions
- TextField & Button
- Badge & IconButton
- Rating & Typography
- Table components
- Alert & CircularProgress

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

## Authentication (Optional)

To add authentication:

1. Implement login/register pages
2. Store JWT token in localStorage
3. The apiService already includes a request interceptor for auth tokens
4. Uncomment auth endpoints in apiService.js

## Styling Customization

Edit the theme in `src/App.jsx`:

```jsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
```

## Performance Optimization

- Images use lazy loading via placeholder
- Sticky category sidebar for better UX
- Debounced search (can be added)
- Responsive grid layout
- Card elevation on hover

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For API integration issues, ensure:
1. Spring Boot server is running on `http://localhost:8080`
2. CORS is enabled in your Spring Boot application
3. API responses follow the expected format
4. All required endpoints are implemented

---

**Happy Coding! 🚀**
