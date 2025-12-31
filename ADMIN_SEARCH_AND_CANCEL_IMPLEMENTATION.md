# 🔍 Admin Search & Order Cancellation - Implementation Guide

## Features to Implement

1. ✅ Fix shipping address display ([object Object] → proper address)
2. 🔍 Add search for products in admin panel
3. 🔍 Add search for orders in admin panel  
4. ❌ Add order cancellation for users (pending orders only)

## Implementation Steps

### 1. Fix Shipping Address Display ✅ DONE

**File:** `frontend/pages/admin-dashboard.html`

**Added function:**
```javascript
const formatAddress = (addr) => {
  if (!addr) return 'N/A';
  if (typeof addr === 'string') return addr;
  return `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.zipCode || ''}, ${addr.country || ''}`.replace(/,\s*,/g, ',').trim();
};
```

**Updated display:**
```javascript
<p><strong>Shipping Address:</strong><br>${formatAddress(order.shippingAddress)}</p>
```

---

### 2. Add Search Functionality for Products

**Add search box in products section:**

After line 166 (`<h2>Manage Products</h2>`), add:
```html
<div style="margin: 1rem 0;">
  <input 
    type="text" 
    id="product-search" 
    placeholder="🔍 Search products by name or ID..." 
    style="width: 100%; max-width: 500px; padding: 10px; border: 2px solid #ddd; border-radius: 5px;"
    onkeyup="searchProducts()"
  >
</div>
```

**Add search function:**
```javascript
let allProducts = []; // Store all products

async function loadProducts() {
  try {
    const response = await api.getProducts();
    allProducts = response.products || [];
    displayProducts(allProducts);
  } catch (error) {
    console.error('Failed to load products:', error);
  }
}

function searchProducts() {
  const searchTerm = document.getElementById('product-search').value.toLowerCase();
  
  if (!searchTerm) {
    displayProducts(allProducts);
    return;
  }
  
  const filtered = allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.productId.toLowerCase().includes(searchTerm) ||
    (product.category && product.category.toLowerCase().includes(searchTerm))
  );
  
  displayProducts(filtered);
}

function displayProducts(products) {
  const container = document.getElementById('products-list');
  
  if (products.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #666;">No products found</p>';
    return;
  }
  
  // Existing display logic...
}
```

---

### 3. Add Search Functionality for Orders

**Add search box in orders section:**

After line 226 (`<h2>Manage Orders</h2>`), add:
```html
<div style="margin: 1rem 0;">
  <input 
    type="text" 
    id="order-search" 
    placeholder="🔍 Search orders by ID, customer name, or email..." 
    style="width: 100%; max-width: 500px; padding: 10px; border: 2px solid #ddd; border-radius: 5px;"
    onkeyup="searchOrders()"
  >
  <select 
    id="order-status-filter" 
    style="margin-left: 10px; padding: 10px; border: 2px solid #ddd; border-radius: 5px;"
    onchange="searchOrders()"
  >
    <option value="">All Statuses</option>
    <option value="pending">Pending</option>
    <option value="processing">Processing</option>
    <option value="shipped">Shipped</option>
    <option value="completed">Completed</option>
    <option value="cancelled">Cancelled</option>
  </select>
</div>
```

**Add search function:**
```javascript
let allOrders = []; // Store all orders

async function loadOrders() {
  try {
    const response = await api.getAllOrders();
    allOrders = response.orders || [];
    displayOrders(allOrders);
  } catch (error) {
    console.error('Failed to load orders:', error);
  }
}

function searchOrders() {
  const searchTerm = document.getElementById('order-search').value.toLowerCase();
  const statusFilter = document.getElementById('order-status-filter').value;
  
  let filtered = allOrders;
  
  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(order => 
      order._id.toLowerCase().includes(searchTerm) ||
      (order.user && order.user.name && order.user.name.toLowerCase().includes(searchTerm)) ||
      (order.user && order.user.email && order.user.email.toLowerCase().includes(searchTerm))
    );
  }
  
  // Filter by status
  if (statusFilter) {
    filtered = filtered.filter(order => order.status === statusFilter);
  }
  
  displayOrders(filtered);
}

function displayOrders(orders) {
  const container = document.getElementById('orders-list');
  
  if (orders.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #666;">No orders found</p>';
    return;
  }
  
  // Existing display logic...
}
```

---

### 4. Add Order Cancellation for Users

**Backend: Add cancel order endpoint**

**File:** `backend/controllers/orderController.js`

Add new function:
```javascript
// Cancel order (User only for pending orders)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}. Only pending orders can be cancelled.`
      });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Update order status
    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

**File:** `backend/routes/orderRoutes.js`

Add route:
```javascript
router.put('/:id/cancel', protect, cancelOrder);
```

**Frontend: Add cancel button in user dashboard**

**File:** `frontend/js/api.js`

Add method:
```javascript
async cancelOrder(orderId) {
  return this.request(`/orders/${orderId}/cancel`, {
    method: 'PUT'
  });
}
```

**File:** `frontend/pages/user-dashboard.html`

Update order display to include cancel button:
```javascript
${order.status === 'pending' ? `
  <button 
    onclick="cancelOrder('${order._id}')" 
    class="btn btn-secondary" 
    style="background: #dc3545; margin-top: 10px;"
  >
    <i class="fas fa-times"></i> Cancel Order
  </button>
` : ''}
```

Add cancel function:
```javascript
async function cancelOrder(orderId) {
  if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
    return;
  }

  try {
    const loadingToast = toast.loading('Cancelling order...');
    await api.cancelOrder(orderId);
    loadingToast.remove();
    
    toast.success('Order cancelled successfully');
    
    // Reload orders
    await loadOrders();
  } catch (error) {
    console.error('Cancel order error:', error);
    toast.error(error.message || 'Failed to cancel order');
  }
}
```

---

## Summary of Changes

### Files to Modify:

1. ✅ `frontend/pages/admin-dashboard.html`
   - Fix shipping address display
   - Add product search box and function
   - Add order search box and function
   - Add status filter for orders

2. ⏳ `backend/controllers/orderController.js`
   - Add `cancelOrder` function

3. ⏳ `backend/routes/orderRoutes.js`
   - Add cancel order route

4. ⏳ `frontend/js/api.js`
   - Add `cancelOrder` method

5. ⏳ `frontend/pages/user-dashboard.html`
   - Add cancel button for pending orders
   - Add `cancelOrder` function

---

## Testing Checklist

### Shipping Address Fix:
- [ ] Admin views order details
- [ ] Shipping address shows properly formatted
- [ ] No [object Object] displayed

### Product Search:
- [ ] Search by product name works
- [ ] Search by product ID works
- [ ] Search by category works
- [ ] Clear search shows all products

### Order Search:
- [ ] Search by order ID works
- [ ] Search by customer name works
- [ ] Search by customer email works
- [ ] Status filter works
- [ ] Combined search and filter works

### Order Cancellation:
- [ ] Cancel button shows only for pending orders
- [ ] Cancel button works
- [ ] Confirmation dialog appears
- [ ] Order status changes to cancelled
- [ ] Product stock restored
- [ ] Cannot cancel non-pending orders

---

## Next Steps

1. Apply remaining changes to backend files
2. Apply changes to user dashboard
3. Test all functionality
4. Deploy updates

