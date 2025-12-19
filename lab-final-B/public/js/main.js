document.addEventListener('DOMContentLoaded', () => {
  console.info('BePizza application loaded.');
  
  // Handle add to cart forms
  const addToCartForms = document.querySelectorAll('.add-to-cart-form');
  
  addToCartForms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const response = await fetch('/cart/add', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Item added to cart successfully!');
        // Optionally update cart count or redirect
      } else {
        alert('Error: ' + (data.error || 'Failed to add item to cart'));
      }
    });
  });
});


