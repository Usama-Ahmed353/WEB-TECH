# Assignment 4 - E-commerce with MongoDB Integration

This project extends the Express-based e-commerce application with MongoDB integration using Mongoose.

## Features

- ✅ MongoDB connection using Mongoose
- ✅ Product model with fields: name, price, category, image, description
- ✅ Sample product data seeding
- ✅ Product listing page with dynamic data from MongoDB
- ✅ Pagination (page=1, limit=10)
- ✅ Filtering by category and price range
- ✅ RESTful API endpoint for products

## Project Structure

```
Assignment 4/
├── config/
│   └── database.js          - MongoDB connection configuration
├── models/
│   └── Product.js            - Product Mongoose model
├── routes/
│   └── index.js              - Express routes (includes products routes)
├── scripts/
│   └── seed.js               - Database seeding script
├── views/
│   ├── products.ejs          - Products listing page
│   └── ...                   - Other EJS templates
├── public/
│   ├── css/
│   ├── images/
│   └── js/
└── server.js                 - Express server entry point
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas connection string)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running on your system, or set up a MongoDB Atlas connection string.

3. Seed the database with sample products:
```bash
npm run seed
```

## Configuration

The application connects to MongoDB using the connection string from the environment variable `MONGODB_URI`, or defaults to `mongodb://localhost:27017/bepizza`.

To use MongoDB Atlas or a custom connection string, set the environment variable:
```bash
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/bepizza"
```

Or create a `.env` file (you'll need to install `dotenv` package):
```
MONGODB_URI=mongodb://localhost:27017/bepizza
```

## Running the Application

Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Products Listing Page
- **GET** `/products` - Renders the products listing page with pagination and filters
  - Query parameters:
    - `page` - Page number (default: 1)
    - `limit` - Items per page (default: 10)
    - `category` - Filter by category (e.g., "Meat", "Vegetarian", "all")
    - `minPrice` - Minimum price filter
    - `maxPrice` - Maximum price filter

### Products API (JSON)
- **GET** `/api/products` - Returns products as JSON with pagination info
  - Same query parameters as above
  - Returns:
    ```json
    {
      "products": [...],
      "pagination": {
        "currentPage": 1,
        "totalPages": 3,
        "totalProducts": 22,
        "limit": 10,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
    ```

## Product Model

The Product model includes:
- `name` (String, required) - Product name
- `price` (Number, required, min: 0) - Product price
- `category` (String, required, enum) - Product category: 'Meat', 'Vegetarian', 'Seafood', 'Fruits', 'Salads', 'Classic', 'Specialty'
- `image` (String, required) - Image URL path
- `description` (String, required) - Product description
- `createdAt` (Date) - Auto-generated timestamp
- `updatedAt` (Date) - Auto-generated timestamp

## Features in Detail

### Pagination
- Default: 10 items per page
- Configurable via query parameter: `?limit=20`
- Navigation buttons: Previous/Next
- Shows current page, total pages, and total products

### Filtering
- **Category Filter**: Dropdown to filter by product category
- **Price Range Filter**: Min and max price inputs
- **Combined Filters**: All filters work together
- **Reset Button**: Clears all filters

### Product Display
- Responsive grid layout
- Product cards with image, name, category, description, and price
- Hover effects and smooth transitions
- Fallback images for missing product images

## Database Seeding

The seed script (`scripts/seed.js`) creates 22 sample products across different categories:
- Classic pizzas (Margherita, Pizza Italiana)
- Meat pizzas (Double Pepperoni, Chicken & Mushroom, BBQ Chicken, Meat Lovers, Buffalo Chicken)
- Vegetarian pizzas (Farm House, Garden Fresh, Mediterranean, Four Cheese, Veggie Supreme)
- Specialty pizzas (Spicy Italia, Pizza La Racooli, Pizza Picante)
- Seafood pizzas (Seafood Delight, Tuna Supreme)
- Fruit pizzas (Tropicana, Hawaiian Paradise, Fruit Salad Pizza)
- Salad pizzas (Caesar Salad Pizza, Greek Salad Pizza)

To re-seed the database:
```bash
npm run seed
```

## Notes

- Make sure MongoDB is running before starting the server
- The seed script will clear existing products before inserting new ones
- All product images should be placed in the `public/images/` directory
- The application uses EJS templating for server-side rendering

