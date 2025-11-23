import React, { useState, useEffect } from 'react'
import { getProducts, saveProducts, initialProducts } from '../data/products'
import { getOrders, updateOrderStatus } from '../utils/orders'
import { getUsers, createUser, updateUser, deleteUser } from '../utils/users'
import { useAuth } from '../context/AuthContext'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiUser, FiFilter, FiEye, FiEyeOff } from 'react-icons/fi'

const Admin = () => {
  const { user: currentUser } = useAuth()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [userFilter, setUserFilter] = useState('all') // 'all', 'admin', 'user'
  const [activeTab, setActiveTab] = useState('products')
  const [isEditing, setIsEditing] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(null)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Pizza',
    image: '',
    inStock: true,
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'user',
  })

  useEffect(() => {
    loadProducts()
    loadOrders()
    loadUsers()
  }, [])

  useEffect(() => {
    if (users.length > 0) {
      applyUserFilter(users, userFilter)
    } else {
      setFilteredUsers([])
    }
  }, [userFilter, users])

  const loadProducts = () => {
    const loadedProducts = getProducts()
    setProducts(loadedProducts)
  }

  const loadOrders = () => {
    const loadedOrders = getOrders()
    setOrders(loadedOrders)
  }

  const loadUsers = () => {
    let loadedUsers = getUsers()
    
    // Include current logged-in user if they're not in the list
    if (currentUser) {
      const userExists = loadedUsers.find(u => u.id === currentUser.id || u.email === currentUser.email)
      if (!userExists) {
        // Add current user to the list if not present
        const userToAdd = {
          ...currentUser,
          password: '', // Don't store password
        }
        loadedUsers.push(userToAdd)
        // Save back to localStorage
        localStorage.setItem('foodipy_users', JSON.stringify(loadedUsers))
      }
    }
    
    setUsers(loadedUsers)
    applyUserFilter(loadedUsers, userFilter)
  }

  const applyUserFilter = (userList, filter) => {
    let filtered = userList
    if (filter === 'admin') {
      filtered = userList.filter(u => u.role === 'admin')
    } else if (filter === 'user') {
      filtered = userList.filter(u => u.role !== 'admin')
    }
    setFilteredUsers(filtered)
  }

  useEffect(() => {
    if (users.length > 0 || userFilter !== 'all') {
      applyUserFilter(users, userFilter)
    }
  }, [userFilter, users])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      setImageFile(file)
      
      // Create preview and convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData({
          ...formData,
          image: reader.result, // Store as base64 data URL
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData({
      ...formData,
      image: '',
    })
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleAdd = () => {
    const newProduct = {
      id: Date.now().toString(),
      ...formData,
      price: parseFloat(formData.price),
    }
    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    saveProducts(updatedProducts)
    setIsAdding(false)
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Pizza',
      image: '',
      inStock: true,
    })
    setImageFile(null)
    setImagePreview(null)
  }

  const handleEdit = (product) => {
    setIsEditing(product.id)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      inStock: product.inStock,
    })
    // Set preview if image exists
    if (product.image) {
      setImagePreview(product.image)
    } else {
      setImagePreview(null)
    }
    setImageFile(null)
  }

  const handleUpdate = () => {
    const updatedProducts = products.map((p) =>
      p.id === isEditing
        ? {
            ...p,
            ...formData,
            price: parseFloat(formData.price),
          }
        : p
    )
    setProducts(updatedProducts)
    saveProducts(updatedProducts)
    setIsEditing(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Pizza',
      image: '',
      inStock: true,
    })
    setImageFile(null)
    setImagePreview(null)
  }

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter((p) => p.id !== productId)
      setProducts(updatedProducts)
      saveProducts(updatedProducts)
    }
  }

  const handleCancel = () => {
    setIsEditing(null)
    setIsAdding(false)
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Pizza',
      image: '',
      inStock: true,
    })
    setImageFile(null)
    setImagePreview(null)
  }

  const handleOrderStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
    loadOrders()
  }

  const handleUserChange = (e) => {
    const { name, value } = e.target
    setUserFormData({
      ...userFormData,
      [name]: value,
    })
  }

  const handleAddUser = () => {
    if (!userFormData.password || userFormData.password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }
    const result = createUser(userFormData)
    if (result.success) {
      loadUsers()
      setIsAddingUser(false)
      setUserFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: 'user',
      })
      alert('User created successfully!')
    } else {
      alert(result.error || 'Failed to create user')
    }
  }

  const handleEditUser = (user) => {
    setIsEditingUser(user.id)
    setUserFormData({
      name: user.name || '',
      email: user.email || '',
      password: '', // Don't show password when editing
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'user',
    })
  }

  const handleUpdateUser = () => {
    const updateData = { ...userFormData }
    // Only update password if it's provided
    if (!updateData.password) {
      delete updateData.password
    } else if (updateData.password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }
    
    const result = updateUser(isEditingUser, updateData)
    if (result.success) {
      loadUsers()
      setIsEditingUser(null)
      setUserFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: 'user',
      })
      alert('User updated successfully!')
    } else {
      alert(result.error || 'Failed to update user')
    }
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const result = deleteUser(userId)
      if (result.success) {
        loadUsers()
        alert('User deleted successfully!')
      }
    }
  }

  const handleCancelUser = () => {
    setIsEditingUser(null)
    setIsAddingUser(false)
    setShowPassword(false)
    setUserFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      role: 'user',
    })
  }

  const categories = ['Pizza', 'Burger', 'Pasta', 'Salad', 'Dessert']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Admin Panel
        </h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'products'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'orders'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'users'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Users
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Product Management
              </h2>
              {!isAdding && !isEditing && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <FiPlus />
                  <span>Add Product</span>
                </button>
              )}
            </div>

            {/* Add/Edit Form */}
            {(isAdding || isEditing) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {isAdding ? 'Add New Product' : 'Edit Product'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Image
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200"
                      />
                      {imagePreview && (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg"
                          >
                            <FiX />
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Upload an image file (JPG, PNG, etc.) - Max 5MB
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={formData.inStock}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        In Stock
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={isAdding ? handleAdd : handleUpdate}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    <FiSave />
                    <span>{isAdding ? 'Add' : 'Update'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    <FiX />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/500x300?text=Food+Image'
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {product.description}
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                      ₹{product.price.toFixed(2)}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        <FiEdit2 />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        <FiTrash2 />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Order Management
            </h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Order #{order.id.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        User ID: {order.userId}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleOrderStatusChange(order.id, e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ₹{order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">
                      Items:
                    </p>
                    <ul className="space-y-1">
                      {order.items.map((item, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600 dark:text-gray-400"
                        >
                          {item.name} x{item.quantity} - ₹
                          {(item.price * item.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No orders yet.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  User Management
                </h2>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Total: {users.length}</span>
                  <span>Admins: {users.filter(u => u.role === 'admin').length}</span>
                  <span>Users: {users.filter(u => u.role !== 'admin').length}</span>
                </div>
              </div>
              {!isAddingUser && !isEditingUser && (
                <button
                  onClick={() => setIsAddingUser(true)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <FiPlus />
                  <span>Add User</span>
                </button>
              )}
            </div>

            {/* Filter */}
            {!isAddingUser && !isEditingUser && (
              <div className="mb-4 flex items-center space-x-2">
                <FiFilter className="text-gray-600 dark:text-gray-400" />
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="admin">Admins Only</option>
                  <option value="user">Regular Users Only</option>
                </select>
              </div>
            )}

            {/* Add/Edit User Form */}
            {(isAddingUser || isEditingUser) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {isAddingUser ? 'Add New User' : 'Edit User'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userFormData.name}
                      onChange={handleUserChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userFormData.email}
                      onChange={handleUserChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password {isAddingUser ? '*' : '(leave blank to keep current)'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={userFormData.password}
                        onChange={handleUserChange}
                        required={isAddingUser}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={isAddingUser ? 'Minimum 6 characters' : 'Leave blank to keep current'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {isAddingUser && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Password must be at least 6 characters long
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={userFormData.phone}
                      onChange={handleUserChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={userFormData.address}
                      onChange={handleUserChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      value={userFormData.role}
                      onChange={handleUserChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={isAddingUser ? handleAddUser : handleUpdateUser}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    <FiSave />
                    <span>{isAddingUser ? 'Add' : 'Update'}</span>
                  </button>
                  <button
                    onClick={handleCancelUser}
                    className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    <FiX />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            {/* Users List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          user.role === 'admin' ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiUser className={`mr-2 ${user.role === 'admin' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name || 'N/A'}
                              {currentUser && (user.id === currentUser.id || user.email === currentUser.email) && (
                                <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(You)</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {user.phone || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}
                          >
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1"
                            >
                              <FiEdit2 />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center space-x-1"
                            >
                              <FiTrash2 />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    {users.length === 0 
                      ? 'No users found. Create your first user!'
                      : `No ${userFilter === 'admin' ? 'admin' : 'regular'} users found.`}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin

