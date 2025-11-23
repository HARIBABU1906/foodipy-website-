import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrders } from '../utils/orders'
import { FiCheckCircle, FiHome } from 'react-icons/fi'

const OrderConfirmation = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const orders = getOrders()
    const foundOrder = orders.find((o) => o.id === orderId)
    setOrder(foundOrder)
  }, [orderId])

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Order not found
          </h2>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Thank you for your order. We've received it and will process it shortly.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Order Details
            </h2>
            <div className="space-y-2 mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Order ID:</span> #{order.id.slice(-6)}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Date:</span>{' '}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Status:</span>{' '}
                <span className="capitalize">{order.status}</span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Payment Method:</span>{' '}
                <span className="capitalize">
                  {order.paymentInfo?.method === 'cod' ? 'Cash on Delivery' :
                   order.paymentInfo?.method === 'upi' ? 'UPI' :
                   order.paymentInfo?.method === 'card' ? 'Debit/Credit Card' :
                   order.paymentInfo?.method || 'N/A'}
                </span>
              </p>
              {order.paymentInfo?.transactionId && (
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Transaction ID:</span>{' '}
                  {order.paymentInfo.transactionId}
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mb-4">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                Items Ordered:
              </h3>
              <ul className="space-y-2">
                {order.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between text-gray-700 dark:text-gray-300"
                  >
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                <span>Total:</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <FiHome />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation

