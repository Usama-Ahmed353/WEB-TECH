const { Router } = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');

const router = Router();

// Order status lifecycle mapping - Task 4
const statusFlow = {
  'Placed': 'Processing',
  'Processing': 'Delivered',
  'Delivered': null // Final state
};

// Admin Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const products = await Product.find().sort({ createdAt: -1 }).limit(5);
    const categories = await Product.distinct('category');
    
    // Calculate statistics
    const categoryStats = {};
    for (const cat of categories) {
      categoryStats[cat] = await Product.countDocuments({ category: cat });
    }
    
    res.render('admin/dashboard', {
      totalProducts,
      recentProducts: products,
      categoryStats,
      categories: categories.length
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).render('admin/error', { message: 'Error loading dashboard' });
  }
});

// Product List Page
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);
    
    res.render('admin/products-list', {
      products,
      currentPage: page,
      totalPages,
      totalProducts,
      limit,
      success: req.query.success || null
    });
  } catch (error) {
    console.error('Error loading products:', error);
    res.status(500).render('admin/error', { message: 'Error loading products' });
  }
});

// Add Product Page (GET)
router.get('/products/add', (req, res) => {
  const categories = ['Meat', 'Vegetarian', 'Seafood', 'Fruits', 'Salads', 'Classic', 'Specialty'];
  res.render('admin/product-form', { 
    product: null, 
    categories,
    formTitle: 'Add New Product',
    formAction: '/admin/products',
    formMethod: 'POST'
  });
});

// Edit Product Page (GET)
router.get('/products/edit/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).render('admin/error', { message: 'Product not found' });
    }
    const categories = ['Meat', 'Vegetarian', 'Seafood', 'Fruits', 'Salads', 'Classic', 'Specialty'];
    res.render('admin/product-form', {
      product,
      categories,
      formTitle: 'Edit Product',
      formAction: `/admin/products/${product._id}`,
      formMethod: 'PUT'
    });
  } catch (error) {
    console.error('Error loading product:', error);
    res.status(500).render('admin/error', { message: 'Error loading product' });
  }
});

// CREATE - Add Product (POST)
router.post('/products', async (req, res) => {
  try {
    const { name, price, category, image, description } = req.body;
    
    // Validation
    if (!name || !price || !category || !image || !description) {
      const categories = ['Meat', 'Vegetarian', 'Seafood', 'Fruits', 'Salads', 'Classic', 'Specialty'];
      return res.render('admin/product-form', {
        product: null,
        categories,
        formTitle: 'Add New Product',
        formAction: '/admin/products',
        formMethod: 'POST',
        error: 'All fields are required'
      });
    }
    
    const product = new Product({
      name: name.trim(),
      price: parseFloat(price),
      category: category.trim(),
      image: image.trim(),
      description: description.trim()
    });
    
    await product.save();
    res.redirect('/admin/products?success=Product created successfully');
  } catch (error) {
    console.error('Error creating product:', error);
    const categories = ['Meat', 'Vegetarian', 'Seafood', 'Fruits', 'Salads', 'Classic', 'Specialty'];
    res.render('admin/product-form', {
      product: null,
      categories,
      formTitle: 'Add New Product',
      formAction: '/admin/products',
      formMethod: 'POST',
      error: error.message || 'Error creating product'
    });
  }
});

// UPDATE - Update Product (PUT via fetch or POST with _method)
const updateProductHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, image, description } = req.body;
    
    // Validation
    if (!name || !price || !category || !image || !description) {
      const product = await Product.findById(id);
      const categories = ['Meat', 'Vegetarian', 'Seafood', 'Fruits', 'Salads', 'Classic', 'Specialty'];
      return res.render('admin/product-form', {
        product,
        categories,
        formTitle: 'Edit Product',
        formMethod: 'PUT',
        formAction: `/admin/products/${id}`,
        error: 'All fields are required'
      });
    }
    
    const updateData = {
      name: name.trim(),
      price: parseFloat(price),
      category: category.trim(),
      image: image.trim(),
      description: description.trim()
    };
    
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).render('admin/error', { message: 'Product not found' });
    }
    
    // If request is JSON (from fetch), return JSON, otherwise redirect
    if (req.headers['content-type']?.includes('application/json')) {
      return res.json({ message: 'Product updated successfully', product });
    }
    
    res.redirect('/admin/products?success=Product updated successfully');
  } catch (error) {
    console.error('Error updating product:', error);
    const product = await Product.findById(req.params.id);
    const categories = ['Meat', 'Vegetarian', 'Seafood', 'Fruits', 'Salads', 'Classic', 'Specialty'];
    res.render('admin/product-form', {
      product,
      categories,
      formTitle: 'Edit Product',
      formMethod: 'PUT',
      formAction: `/admin/products/${req.params.id}`,
      error: error.message || 'Error updating product'
    });
  }
};

router.put('/products/:id', updateProductHandler);
router.post('/products/:id', async (req, res) => {
  // Handle POST with _method=PUT
  if (req.body._method === 'PUT') {
    return updateProductHandler(req, res);
  }
  res.status(405).send('Method not allowed');
});

// DELETE - Delete Product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully', product });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting product' });
  }
});

// ========== ORDER MANAGEMENT ROUTES - Task 4 ==========

// Admin Dashboard - List all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });
    
    res.render('admin/orders', {
      orders,
      statusFlow,
      title: 'Admin - Orders'
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).render('admin/error', {
      title: 'Error',
      message: 'Error loading orders'
    });
  }
});

// Update Order Status - Task 4
router.post('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Validate status transition - Task 4: Prevent skipping states
    const currentStatus = order.status;
    const nextStatus = statusFlow[currentStatus];
    
    if (!nextStatus) {
      return res.status(400).json({ 
        error: `Order is already in final state: ${currentStatus}` 
      });
    }
    
    if (newStatus !== nextStatus) {
      return res.status(400).json({ 
        error: `Invalid status transition. Current: ${currentStatus}, Expected next: ${nextStatus}, Received: ${newStatus}` 
      });
    }
    
    // Update status
    order.status = newStatus;
    await order.save();
    
    res.json({ 
      success: true, 
      message: `Order status updated to ${newStatus}`,
      order 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
});

// View single order details
router.get('/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).render('admin/error', {
        title: 'Error',
        message: 'Order not found'
      });
    }
    
    res.render('admin/order-details', {
      order,
      statusFlow,
      title: `Admin - Order ${order.orderId}`
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).render('admin/error', {
      title: 'Error',
      message: 'Error loading order details'
    });
  }
});

module.exports = router;

