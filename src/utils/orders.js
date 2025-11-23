export const createOrder = (cartItems, user, paymentInfo) => {
  const order = {
    id: Date.now().toString(),
    userId: user.id,
    items: cartItems,
    total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: 'pending',
    paymentInfo,
    createdAt: new Date().toISOString(),
  }

  const orders = JSON.parse(localStorage.getItem('foodipy_orders') || '[]')
  orders.push(order)
  localStorage.setItem('foodipy_orders', JSON.stringify(orders))

  return order
}

export const getOrders = (userId = null) => {
  const orders = JSON.parse(localStorage.getItem('foodipy_orders') || '[]')
  if (userId) {
    return orders.filter((order) => order.userId === userId)
  }
  return orders
}

export const updateOrderStatus = (orderId, status) => {
  const orders = JSON.parse(localStorage.getItem('foodipy_orders') || '[]')
  const updatedOrders = orders.map((order) =>
    order.id === orderId ? { ...order, status } : order
  )
  localStorage.setItem('foodipy_orders', JSON.stringify(updatedOrders))
  return updatedOrders.find((order) => order.id === orderId)
}

