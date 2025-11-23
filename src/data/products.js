export const initialProducts = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh tomatoes, mozzarella, and basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500',
    category: 'Pizza',
    inStock: true,
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Delicious pepperoni pizza with cheese and herbs',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500',
    category: 'Pizza',
    inStock: true,
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing and croutons',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500',
    category: 'Salad',
    inStock: true,
  },
  {
    id: '4',
    name: 'Grilled Chicken Burger',
    description: 'Juicy grilled chicken with lettuce, tomato, and special sauce',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500',
    category: 'Burger',
    inStock: true,
  },

  {
    id: '5',
    name: 'Chicken Pasta',
    description: 'Creamy pasta with grilled chicken and vegetables',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500',
    category: 'Pasta',
    inStock: true,
  },
  {
    id: '6',
    name: 'Spaghetti Carbonara',
    description: 'Traditional Italian pasta with bacon and creamy sauce',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500',
    category: 'Pasta',
    inStock: true,
  },
  {
    id: '7',
    name: 'Greek Salad',
    description: 'Fresh vegetables with feta cheese and olives',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500',
    category: 'Salad',
    inStock: true,
  },
  {
    id: '8',
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with frosting',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
    category: 'Dessert',
    inStock: true,
  },
  {
    id: '9',
    name: 'Ice Cream Sundae',
    description: 'Vanilla ice cream with chocolate sauce and toppings',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500',
    category: 'Dessert',
    inStock: true,
  },
]

export const getProducts = () => {
  const stored = localStorage.getItem('foodipy_products')
  return stored ? JSON.parse(stored) : initialProducts
}

export const saveProducts = (products) => {
  localStorage.setItem('foodipy_products', JSON.stringify(products))
}

