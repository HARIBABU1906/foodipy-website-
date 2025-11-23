import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../utils/orders'
import { FiTrash2, FiPlus, FiMinus, FiCreditCard, FiSmartphone, FiDollarSign } from 'react-icons/fi'
import '../styles/cart.css'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty!')
      return
    }

    // Note: In a real app, you would validate payment details here
    // For demo purposes, we'll proceed with the selected payment method

    setIsProcessing(true)

    // Simulate payment processing based on method
    let paymentInfo = {
      method: paymentMethod,
      status: paymentMethod === 'cod' ? 'pending' : 'completed',
    }

    if (paymentMethod === 'cod') {
      paymentInfo.transactionId = null
      paymentInfo.note = 'Payment on delivery'
    } else if (paymentMethod === 'upi') {
      paymentInfo.transactionId = `UPI${Date.now()}`
      paymentInfo.note = 'UPI payment processed'
    } else if (paymentMethod === 'card') {
      paymentInfo.transactionId = `CARD${Date.now()}`
      paymentInfo.note = 'Card payment processed'
    }

    // Simulate processing delay for online payments
    if (paymentMethod !== 'cod') {
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    try {
      const order = createOrder(cartItems, user, paymentInfo)
      clearCart()
      navigate(`/order-confirmation/${order.id}`)
    } catch (error) {
      console.error('Checkout error:', error)
      alert('There was an error processing your order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            Your Cart
          </h1>
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              Your cart is empty
            </p>
            <a
              href="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Products
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x200?text=Food+Image'
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          <FiMinus />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value) || 1)
                          }
                          className="quantity-input"
                          min="1"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          <FiTrash2 className="text-xl" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="cart-summary">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Tax</span>
                  <span>₹{(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Delivery</span>
                  <span>₹249</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{(getTotalPrice() * 1.1 + 249).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Payment Method
                </h3>
                <div className="space-y-2">
                  {/* Cash on Delivery */}
                  <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
                    style={{
                      borderColor: paymentMethod === 'cod' ? '#3B82F6' : '#E5E7EB',
                      backgroundColor: paymentMethod === 'cod' ? '#EFF6FF' : 'transparent'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value)
                        setShowPaymentDetails(false)
                      }}
                      className="mr-3"
                    />
                    <FiDollarSign className="text-2xl mr-3 text-gray-700 dark:text-gray-300" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">Cash on Delivery</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Pay when you receive</div>
                    </div>
                  </label>

                  {/* UPI */}
                  <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
                    style={{
                      borderColor: paymentMethod === 'upi' ? '#3B82F6' : '#E5E7EB',
                      backgroundColor: paymentMethod === 'upi' ? '#EFF6FF' : 'transparent'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value)
                        setShowPaymentDetails(true)
                      }}
                      className="mr-3"
                    />
                    <FiSmartphone className="text-2xl mr-3 text-gray-700 dark:text-gray-300" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">UPI</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Google Pay, PhonePe, Paytm</div>
                    </div>
                  </label>

                  {/* Debit/Credit Card */}
                  <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
                    style={{
                      borderColor: paymentMethod === 'card' ? '#3B82F6' : '#E5E7EB',
                      backgroundColor: paymentMethod === 'card' ? '#EFF6FF' : 'transparent'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value)
                        setShowPaymentDetails(true)
                      }}
                      className="mr-3"
                    />
                    <FiCreditCard className="text-2xl mr-3 text-gray-700 dark:text-gray-300" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">Debit/Credit Card</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Visa, Mastercard, RuPay</div>
                    </div>
                  </label>
                </div>

                {/* Payment Details Form (for UPI and Card) */}
                {showPaymentDetails && (paymentMethod === 'upi' || paymentMethod === 'card') && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {paymentMethod === 'upi' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          placeholder="yourname@upi"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Enter your UPI ID (e.g., yourname@paytm)
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Expiry
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              maxLength="5"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              maxLength="3"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isProcessing ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Pay & Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

