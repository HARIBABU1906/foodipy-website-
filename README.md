# Foodipy - Food Order Website

A comprehensive and user-friendly online food order website built with React.js and Tailwind CSS.

## Features

- **User Management**: Registration, login, and profile management
- **Product Catalog**: Browse, search, and filter food items
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Management**: Checkout process with order confirmation
- **Admin Panel**: Manage products, inventory, and orders
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on all devices

## Tech Stack

- React 18
- React Router DOM
- Tailwind CSS
- Vite
- React Icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── index.jsx              # Entry point
├── App.jsx                # Main app component with routing
├── index.css              # Global styles
├── components/            # Reusable components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   └── ProtectedRoute.jsx
├── pages/                 # Page components
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── Cart.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Profile.jsx
│   ├── Admin.jsx
│   └── OrderConfirmation.jsx
├── context/               # React Context providers
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── ThemeContext.jsx
├── data/                  # Data management
│   └── products.js
├── utils/                 # Utility functions
│   └── orders.js
└── styles/                # Custom CSS files
    ├── cart.css
    └── Product.css
```

## Default Admin Account

To access the admin panel, register with:
- Email: `admin@foodipy.com`
- Any password (minimum 6 characters)

## Features in Detail

### User Management
- Secure registration and login
- Profile management with editable information
- Order history tracking

### Product Catalog
- Browse all available food items
- Search by name or description
- Filter by category (Pizza, Burger, Pasta, Salad, Dessert)
- Responsive product cards

### Shopping Cart
- Add items to cart
- Update quantities
- Remove items
- View order summary with tax and delivery charges

### Order Management
- Secure checkout process
- Order confirmation page
- Order status tracking

### Admin Panel
- Add, edit, and delete products
- Manage order statuses
- View all orders
- Product inventory management

### Theme Toggle
- Light mode (default)
- Dark mode
- Persistent theme preference

## Color Scheme

### Light Mode
- Background: White
- Accents: Blue (#3B82F6) and Gray

### Dark Mode
- Background: Dark Gray (#111827)
- Accents: Light Blue (#60A5FA) and Light Gray

## Notes

- Data is stored in localStorage for demo purposes
- In a production environment, replace localStorage with a backend API
- Payment processing is simulated for demonstration
- Images use placeholder URLs from Unsplash

## License

This project is open source and available under the MIT License.

