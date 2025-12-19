const { Router } = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const applyDiscount = require('../middleware/discount');

const router = Router();

const pages = [
  { path: '/', view: 'index' },
  { path: '/restaurant', view: 'restaurant' },
  { path: '/menu', view: 'menu' },
  { path: '/join', view: 'join' },
  { path: '/locations', view: 'locations' },
  { path: '/buy', view: 'buy' },
  { path: '/checkout', view: 'checkout' },
  { path: '/thankyou', view: 'thankyou' },
  { path: '/api-page', view: 'api-page' }
];

pages.forEach(({ path, view }) => {
  router.get(path, (req, res) => res.render(view));
});

// Products listing page with pagination and filtering
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = parseFloat(req.query.maxPrice);
      }
    }
    
    // Check if mongoose is connected before querying
    if (mongoose.connection.readyState !== 1) {
      // Not connected - show helpful message
      return res.render('products', {
        products: [],
        currentPage: 1,
        totalPages: 0,
        totalProducts: 0,
        limit: 10,
        categories: [],
        selectedCategory: 'all',
        minPrice: '',
        maxPrice: '',
        dbError: 'MongoDB is not running. Please start MongoDB and refresh the page.'
      });
    }
    
    // Get products with filters, pagination, and sorting
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .maxTimeMS(3000); // 3 second timeout
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter).maxTimeMS(3000);
    const totalPages = Math.ceil(totalProducts / limit);
    
    // Get unique categories for filter dropdown
    const categories = await Product.distinct('category').maxTimeMS(3000);
    
    res.render('products', {
      products,
      currentPage: page,
      totalPages,
      totalProducts,
      limit,
      categories,
      selectedCategory: req.query.category || 'all',
      minPrice: req.query.minPrice || '',
      maxPrice: req.query.maxPrice || ''
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    // Check if it's a connection error
    if (error.name === 'MongooseError' && (error.message.includes('buffering') || error.message.includes('timeout'))) {
      // Show empty products page with helpful message instead of error
      res.render('products', {
        products: [],
        currentPage: 1,
        totalPages: 0,
        totalProducts: 0,
        limit: 10,
        categories: [],
        selectedCategory: 'all',
        minPrice: '',
        maxPrice: '',
        dbError: 'MongoDB is not running. Please start MongoDB and refresh the page.'
      });
    } else {
      res.status(500).render('error', { 
        title: 'Error',
        message: 'Error loading products' 
      });
    }
  }
});

// API endpoint for products (JSON response)
router.get('/api/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = parseFloat(req.query.maxPrice);
      }
    }
    
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    
    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error loading products' });
  }
});

router.get('/health', (req, res) => res.json({ status: 'ok' }));

// ========== CART ROUTES ==========

// Add to cart
router.post('/cart/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Ensure cart exists
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    // Check if product already in cart (compare as strings)
    const productIdStr = productId.toString();
    const cartItem = req.session.cart.find(item => {
      const itemId = item.productId && item.productId.toString ? item.productId.toString() : item.productId;
      return itemId === productIdStr;
    });
    
    const qty = parseInt(quantity) || 1;
    
    if (cartItem) {
      cartItem.quantity += qty;
    } else {
      req.session.cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: qty
      });
    }
    
    res.json({ success: true, cart: req.session.cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Error adding to cart: ' + error.message });
  }
});

// View cart
router.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  let subtotal = 0;
  
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  res.render('cart', { 
    cart, 
    subtotal,
    title: 'Shopping Cart' 
  });
});

// Remove from cart
router.post('/cart/remove/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < req.session.cart.length) {
    req.session.cart.splice(index, 1);
  }
  res.redirect('/cart');
});

// ========== ORDER ROUTES ==========

// Order Preview - Task 1
router.get('/order/preview', applyDiscount, (req, res) => {
  const cart = req.session.cart || [];
  
  if (cart.length === 0) {
    return res.redirect('/cart');
  }
  
  // Calculate subtotal
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  // Apply discount if coupon code is provided
  const couponCode = req.query.coupon || req.body.coupon;
  let discount = 0;
  let total = subtotal;
  
  // Ensure req.discount is initialized
  if (req.discount && req.discount.applied) {
    discount = (subtotal * req.discount.percentage) / 100;
    total = subtotal - discount;
  }
  
  res.render('order-preview', {
    cart,
    subtotal,
    discount,
    total,
    couponCode: couponCode || null,
    title: 'Order Preview'
  });
});

// Apply coupon code
router.post('/order/apply-coupon', applyDiscount, (req, res) => {
  const { coupon } = req.body;
  res.redirect(`/order/preview?coupon=${coupon}`);
});

// Finalize Order - Task 1
router.post('/order/confirm', applyDiscount, async (req, res) => {
  try {
    const cart = req.session.cart || [];
    const { email } = req.body;
    
    if (cart.length === 0) {
      return res.status(400).render('error', {
        title: 'Error',
        message: 'Cart is empty'
      });
    }
    
    if (!email) {
      return res.status(400).render('error', {
        title: 'Error',
        message: 'Email is required'
      });
    }
    
    // Calculate totals
    let subtotal = 0;
    const items = [];
    
    for (const item of cart) {
      // Handle both string and ObjectId productId
      const productId = item.productId && item.productId.toString ? item.productId.toString() : item.productId;
      const product = await Product.findById(productId);
      if (!product) {
        console.warn(`Product not found: ${productId}`);
        continue;
      }
      
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }
    
    if (items.length === 0) {
      return res.status(400).render('error', {
        title: 'Error',
        message: 'No valid products found in cart. Please add items to your cart.'
      });
    }
    
    // Apply discount
    const couponCode = req.query.coupon || req.body.coupon;
    let discount = 0;
    let total = subtotal;
    
    // Ensure req.discount is initialized
    if (req.discount && req.discount.applied) {
      discount = (subtotal * req.discount.percentage) / 100;
      total = subtotal - discount;
    }
    
    // Create order
    const order = new Order({
      email: email.trim(),
      items: items,
      subtotal: subtotal,
      discount: discount,
      total: total,
      couponCode: couponCode || null,
      status: 'Placed'
    });
    
    await order.save();
    
    // Clear cart
    req.session.cart = [];
    
    // Redirect to success page
    res.redirect(`/order/success/${order._id}`);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error placing order. Please try again.'
    });
  }
});

// Order Success Page - Task 1
router.get('/order/success/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Order not found'
      });
    }
    
    res.render('order-success', {
      order,
      title: 'Order Confirmed'
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error loading order details'
    });
  }
});

// Customer Order History - Task 3
router.get('/my-orders', (req, res) => {
  res.render('order-history-form', {
    title: 'Order History',
    orders: null,
    email: null
  });
});

router.post('/my-orders', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.render('order-history-form', {
        title: 'Order History',
        orders: null,
        email: null,
        error: 'Email is required'
      });
    }
    
    const orders = await Order.find({ email: email.trim() })
      .sort({ createdAt: -1 });
    
    res.render('order-history-form', {
      title: 'Order History',
      orders,
      email: email.trim()
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error loading order history'
    });
  }
});

module.exports = router;

