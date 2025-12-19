const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/database');

const sampleProducts = [
  {
    name: 'Margherita',
    price: 7.99,
    category: 'Classic',
    image: '/images/home_pizza_menu_1.png',
    description: 'Fresh mozzarella cheese, oregano, parmesan, tomato sauce, and basil'
  },
  {
    name: 'Farm House',
    price: 11.99,
    category: 'Vegetarian',
    image: '/images/home_pizza_menu_2.png',
    description: 'Mozzarella cheese, oregano, parmesan, salami, tomatoes, mushrooms, bell peppers, and olives'
  },
  {
    name: 'Double Pepperoni',
    price: 12.99,
    category: 'Meat',
    image: '/images/home_pizza_menu_3.png',
    description: 'Double portion of pepperoni, mozzarella cheese, oregano, parmesan, and tomato sauce'
  },
  {
    name: 'Chicken & Mushroom',
    price: 13.99,
    category: 'Meat',
    image: '/images/home_pizza_menu_4.png',
    description: 'Grilled chicken, fresh mushrooms, mozzarella cheese, oregano, and creamy sauce'
  },
  {
    name: 'Spicy Italia',
    price: 14.99,
    category: 'Specialty',
    image: '/images/home_pizza_menu_5.png',
    description: 'Spicy Italian sausage, jalapeños, mozzarella cheese, oregano, and parmesan'
  },
  {
    name: 'Tropicana',
    price: 15.99,
    category: 'Fruits',
    image: '/images/home_pizza_menu_6.png',
    description: 'Pineapple, ham, mozzarella cheese, oregano, and sweet sauce'
  },
  {
    name: 'Pizza La Racooli',
    price: 16.99,
    category: 'Specialty',
    image: '/images/pizzaLaRassoli.png',
    description: 'Premium ingredients with a special blend of Italian herbs and spices'
  },
  {
    name: 'Pizza Picante',
    price: 17.99,
    category: 'Specialty',
    image: '/images/pizzaPicanto.png',
    description: 'Hot and spicy with chili peppers, spicy sausage, and jalapeños'
  },
  {
    name: 'Pizza Italiana',
    price: 18.99,
    category: 'Classic',
    image: '/images/pizzaItaliano.png',
    description: 'Authentic Italian style with traditional ingredients and flavors'
  },
  {
    name: 'Seafood Delight',
    price: 19.99,
    category: 'Seafood',
    image: '/images/home_pizza_menu_1.png',
    description: 'Fresh shrimp, calamari, and mussels with mozzarella and garlic sauce'
  },
  {
    name: 'Garden Fresh',
    price: 10.99,
    category: 'Vegetarian',
    image: '/images/home_pizza_menu_2.png',
    description: 'Fresh vegetables including bell peppers, onions, mushrooms, olives, and tomatoes'
  },
  {
    name: 'BBQ Chicken',
    price: 14.99,
    category: 'Meat',
    image: '/images/home_pizza_menu_3.png',
    description: 'Grilled chicken with BBQ sauce, red onions, and mozzarella cheese'
  },
  {
    name: 'Hawaiian Paradise',
    price: 13.99,
    category: 'Fruits',
    image: '/images/home_pizza_menu_4.png',
    description: 'Ham, pineapple, mozzarella cheese, and sweet sauce'
  },
  {
    name: 'Mediterranean',
    price: 15.99,
    category: 'Vegetarian',
    image: '/images/home_pizza_menu_5.png',
    description: 'Feta cheese, olives, sun-dried tomatoes, artichokes, and oregano'
  },
  {
    name: 'Meat Lovers',
    price: 18.99,
    category: 'Meat',
    image: '/images/home_pizza_menu_6.png',
    description: 'Pepperoni, sausage, ham, bacon, and ground beef with mozzarella'
  },
  {
    name: 'Four Cheese',
    price: 16.99,
    category: 'Vegetarian',
    image: '/images/pizzaLaRassoli.png',
    description: 'Mozzarella, cheddar, parmesan, and gorgonzola cheese blend'
  },
  {
    name: 'Veggie Supreme',
    price: 12.99,
    category: 'Vegetarian',
    image: '/images/pizzaPicanto.png',
    description: 'Loaded with mushrooms, bell peppers, onions, olives, and tomatoes'
  },
  {
    name: 'Buffalo Chicken',
    price: 15.99,
    category: 'Meat',
    image: '/images/pizzaItaliano.png',
    description: 'Spicy buffalo chicken with blue cheese and celery'
  },
  {
    name: 'Tuna Supreme',
    price: 17.99,
    category: 'Seafood',
    image: '/images/home_pizza_menu_1.png',
    description: 'Fresh tuna, capers, red onions, and mozzarella cheese'
  },
  {
    name: 'Fruit Salad Pizza',
    price: 11.99,
    category: 'Fruits',
    image: '/images/home_pizza_menu_2.png',
    description: 'Sweet pizza with seasonal fruits and cream cheese base'
  },
  {
    name: 'Caesar Salad Pizza',
    price: 12.99,
    category: 'Salads',
    image: '/images/home_pizza_menu_3.png',
    description: 'Caesar salad ingredients on a crispy pizza base'
  },
  {
    name: 'Greek Salad Pizza',
    price: 13.99,
    category: 'Salads',
    image: '/images/home_pizza_menu_4.png',
    description: 'Traditional Greek salad with feta cheese and olives'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`Inserted ${sampleProducts.length} products`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

