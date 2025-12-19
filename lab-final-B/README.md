# Lab Final B - E-commerce Order Management System

This project is based on Lab_Task_4 and extends it with a complete order management system including cart functionality, order preview, discount system, order history, and admin order management.

## Features Implemented

### Cart Functionality
- ✅ Add to Cart button on products page
- ✅ View cart page showing all items
- ✅ Remove items from cart
- ✅ Session-based cart storage

### Task 1: Order Preview & Finalize Order
- ✅ Route: `/order/preview` - Displays cart items, prices, quantities, and grand total
- ✅ Two buttons: "Confirm Order" and "Go Back to Cart"
- ✅ On confirmation: Saves order to MongoDB with status "Placed", clears cart session, redirects to success page with order summary

### Task 2: Coupon / Discount Middleware
- ✅ Middleware: `applyDiscount` in `middleware/discount.js`
- ✅ Applies 10% discount when coupon code "SAVE10" is provided (query or form input)
- ✅ Discount runs before order is saved
- ✅ Shows discounted total on preview page

### Task 3: Customer Order History
- ✅ Route: `/my-orders`
- ✅ Allows users to enter email address
- ✅ Displays all orders for that email with:
  - Order ID
  - Date
  - Total
  - Status

### Task 4: Order Status Lifecycle
- ✅ Order statuses: Placed → Processing → Delivered
- ✅ Admin routes to update order status step-by-step
- ✅ Prevents skipping states (cannot go from Placed → Delivered directly)

## Setup Instructions

1. **Install dependencies:**
```bash
cd WEB-TECH/lab-final-b
npm install
```

2. **Make sure MongoDB is running:**
   - Default connection: `mongodb://localhost:27017/bepizza`
   - Or set `MONGODB_URI` environment variable

3. **Seed the database with sample products:**
```bash
npm run seed
```

4. **Start the server:**
```bash
npm start
```
   Or for development with auto-reload:
```bash
npm run dev
```

5. **Access the application:**
   - Main app: `http://localhost:3005`
   - Products: `http://localhost:3005/products`
   - Cart: `http://localhost:3005/cart`
   - Order History: `http://localhost:3005/my-orders`
   - Admin Orders: `http://localhost:3005/admin/orders`

## Routes

### Customer Routes
- `GET /` - Home page
- `GET /products` - Browse products with filters and pagination
- `POST /cart/add` - Add item to cart
- `GET /cart` - View shopping cart
- `POST /cart/remove/:index` - Remove item from cart
- `GET /order/preview` - Order preview page (Task 1)
- `POST /order/apply-coupon` - Apply coupon code (Task 2)
- `POST /order/confirm` - Confirm and place order (Task 1)
- `GET /order/success/:orderId` - Order success page (Task 1)
- `GET /my-orders` - Order history form (Task 3)
- `POST /my-orders` - View orders by email (Task 3)

### Admin Routes
- `GET /admin/orders` - List all orders (Task 4)
- `GET /admin/orders/:orderId` - View order details (Task 4)
- `POST /admin/orders/:orderId/status` - Update order status (Task 4)

## Testing the Features

### Test Cart Functionality
1. Go to `/products`
2. Click "Add to Cart" on any product
3. Go to `/cart` to view items
4. Remove items if needed

### Test Order Preview
1. Add items to cart from `/products`
2. Go to `/cart` and click "Proceed to Order Preview"
3. Review order details
4. Optionally apply coupon code "SAVE10"
5. Enter email and confirm order

### Test Discount (Task 2)
1. Go to `/order/preview?coupon=SAVE10` or apply coupon on preview page
2. Verify 10% discount is applied to the total

### Test Order History (Task 3)
1. Place an order with an email
2. Go to `/my-orders`
3. Enter the same email
4. View order history with all order details

### Test Order Status Management (Task 4)
1. Go to `/admin/orders`
2. Click "Update to Processing" on a "Placed" order
3. Try to skip from "Placed" to "Delivered" (should fail with error)
4. Update step-by-step: Placed → Processing → Delivered

## Project Structure

```
lab-final-b/
├── config/
│   └── database.js
├── middleware/
│   └── discount.js          # Task 2: Discount middleware
├── models/
│   ├── Order.js              # Order model with status field
│   └── Product.js
├── routes/
│   ├── index.js              # Customer routes (cart, orders)
│   └── admin.js             # Admin routes (order management)
├── views/
│   ├── cart.ejs             # Cart view
│   ├── order-preview.ejs    # Task 1: Order preview
│   ├── order-success.ejs    # Task 1: Success page
│   ├── order-history-form.ejs # Task 3: Order history
│   ├── products.ejs         # Products with Add to Cart
│   ├── admin/
│   │   ├── orders.ejs       # Task 4: Admin order list
│   │   └── order-details.ejs # Task 4: Order details
│   └── error.ejs
├── public/
│   ├── css/
│   ├── js/
│   └── images/
└── server.js
```

## Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose
- EJS templating
- Express Session for cart management
- Bootstrap 5 (via CDN in some views)

## Key Implementation Details

### Cart Management
- Uses Express Session to store cart in `req.session.cart`
- Cart is an array of items with `productId`, `name`, `price`, `image`, and `quantity`
- Cart persists across page refreshes until order is placed

### Order Model
- Unique `orderId` generated automatically
- Stores email, items, subtotal, discount, total, coupon code, and status
- Status can be: "Placed", "Processing", or "Delivered"

### Discount Middleware
- Checks for coupon code in query params or form body
- Applies 10% discount if code is "SAVE10"
- Reusable across multiple routes

### Status Lifecycle
- Enforced status flow: Placed → Processing → Delivered
- Cannot skip states (validated in admin route)
- Admin can only update to the next state in sequence

## Notes
- All images from Lab_Task_4 are preserved
- All existing functionality from Lab_Task_4 is maintained
- New features are integrated seamlessly with existing code
