import React from 'react'
import { useCart } from '../context/CartContext'
import { FiShoppingCart } from 'react-icons/fi'
import '../styles/Product.css'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/500x300?text=Food+Image'
        }}
      />
      <div className="product-info">
        {product.inStock && <span className="product-badge">In Stock</span>}
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">₹{product.price.toFixed(2)}</p>
        <div className="product-actions">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="add-to-cart-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiShoppingCart />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

