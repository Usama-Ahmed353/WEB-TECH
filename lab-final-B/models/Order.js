const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  couponCode: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Placed', 'Processing', 'Delivered'],
    default: 'Placed',
    required: true
  }
}, {
  timestamps: true
});

// Generate unique order ID before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    try {
      const Order = mongoose.model('Order');
      const count = await Order.countDocuments();
      this.orderId = `ORD-${Date.now()}-${count + 1}`;
    } catch (error) {
      // Fallback if count fails
      this.orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);

