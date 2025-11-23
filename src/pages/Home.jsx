import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[400px] md:min-h-[450px] flex items-center justify-center text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop&q=80')`,
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Fallback background with triple color gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800"></div>
        </div>
        
        {/* Triple color overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/75 to-pink-900/80 dark:from-gray-900/85 dark:via-purple-900/80 dark:to-pink-900/85"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-2xl animate-fade-in">
            Welcome to Foodipy
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 text-blue-100 dark:text-blue-200 drop-shadow-lg max-w-3xl mx-auto">
            Order your favorite meals with just a few clicks
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl"
          >
            <span>Browse Menu</span>
            <FiArrowRight />
          </Link>
        </div>
        
        {/* Decorative elements with triple colors */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-48 h-48 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-pink-400 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Choose Foodipy?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Fast Delivery
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get your food delivered quickly and safely
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-4xl mb-4">🍕</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Fresh Ingredients
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We use only the freshest ingredients for our dishes
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Easy Payment
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Secure and convenient payment options
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Ready to Order?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Browse our delicious menu and place your order today!
          </p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View Menu
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home

