/**
 * Discount Middleware
 * Applies discount if coupon code SAVE10 is provided
 * Can be passed as query parameter or form input
 */
const applyDiscount = (req, res, next) => {
  // Check for coupon code in query params or body
  const couponCode = req.query.coupon || req.body.coupon || req.body.couponCode;
  
  // Initialize discount if not already set
  if (!req.discount) {
    req.discount = {
      applied: false,
      code: null,
      percentage: 0,
      amount: 0
    };
  }
  
  // Apply 10% discount if SAVE10 coupon is provided
  if (couponCode && couponCode.toUpperCase() === 'SAVE10') {
    req.discount = {
      applied: true,
      code: 'SAVE10',
      percentage: 10,
      amount: 0 // Will be calculated based on total
    };
  }
  
  // Helper function to calculate discounted total
  req.calculateDiscountedTotal = (subtotal) => {
    if (req.discount.applied) {
      const discountAmount = (subtotal * req.discount.percentage) / 100;
      req.discount.amount = discountAmount;
      return subtotal - discountAmount;
    }
    return subtotal;
  };
  
  next();
};

module.exports = applyDiscount;

