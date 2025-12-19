const { Router } = require('express');
const Product = require('../models/Product');

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
    
    // Get products with filters, pagination, and sorting
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    
    // Get unique categories for filter dropdown
    const categories = await Product.distinct('category');
    
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
    res.status(500).render('error', { message: 'Error loading products' });
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

module.exports = router;

