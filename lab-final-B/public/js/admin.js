// Admin Panel JavaScript

// Handle form submissions with PUT method
document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.querySelector('.product-form');
    
    if (productForm) {
        const methodInput = productForm.querySelector('input[name="_method"]');
        
        if (methodInput && methodInput.value === 'PUT') {
            productForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(productForm);
                const data = Object.fromEntries(formData.entries());
                
                fetch(productForm.action, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                .then(response => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    } else if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Update failed');
                    }
                })
                .then(data => {
                    if (data && data.message) {
                        window.location.href = '/admin/products?success=' + encodeURIComponent(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                });
            });
        }
    }
    
    // Highlight active nav item
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && currentPath.startsWith(href)) {
            item.classList.add('active');
        }
    });
});

// Auto-dismiss alerts
setTimeout(function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        alert.style.transition = 'opacity 0.5s';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
    });
}, 5000);

