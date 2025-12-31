# Low Stock & Out of Stock Notification System

## Feature Overview

Admins now receive real-time notifications when products go out of stock or reach low stock levels. This helps maintain inventory and prevent lost sales.

## Notification Types

### 1. Out of Stock Alert 🚨
**Trigger:** When product stock reaches 0
**Notification:** "🚨 OUT OF STOCK: [Product Name] ([Product Code])"
**Color:** Red (Error)
**Duration:** 7 seconds

### 2. Low Stock Warning ⚠️
**Trigger:** When product stock drops to 5 or below (crossing threshold)
**Notification:** "⚠️ Low Stock: [Product Name] - Only [X] left!"
**Color:** Orange (Warning)
**Duration:** 7 seconds

### 3. Visual Indicators in Admin Dashboard
**Products Table:**
- **Out of Stock:** Red background, red text, 🚨 icon, "OUT OF STOCK" label
- **Low Stock (≤5):** Yellow background, orange text, ⚠️ icon, "LOW STOCK (X)" label
- **Normal Stock (>5):** White background, green text, ✓ icon, stock number

## Technical Implementation

### Backend Changes

**orderController.js:**
```javascript
// When processing orders and deducting stock
const LOW_STOCK_THRESHOLD = 5;
const previousStock = product.stock;
product.stock -= item.quantity;
await product.save();

// Out of stock notification
if (product.stock === 0) {
  req.io.emit('product:outOfStock', {
    productId: product._id,
    productName: product.name,
    productCode: product.productId,
    message: `${product.name} is now OUT OF STOCK`
  });
}

// Low stock notification (only when crossing threshold)
else if (product.stock <= LOW_STOCK_THRESHOLD && previousStock > LOW_STOCK_THRESHOLD) {
  req.io.emit('product:lowStock', {
    productId: product._id,
    productName: product.name,
    productCode: product.productId,
    stock: product.stock,
    message: `${product.name} is running low - Only ${product.stock} left!`
  });
}
```

### Frontend Changes

**socket.js:**
```javascript
// Low stock alerts (for admins only)
this.socket.on('product:lowStock', (data) => {
  const state = stateManager.getState();
  if (state.user && ['admin', 'superadmin'].includes(state.user.role)) {
    this.showNotification(
      `⚠️ Low Stock: ${data.productName} - Only ${data.stock} left!`, 
      'warning'
    );
  }
});

// Out of stock alerts (for admins only)
this.socket.on('product:outOfStock', (data) => {
  const state = stateManager.getState();
  if (state.user && ['admin', 'superadmin'].includes(state.user.role)) {
    this.showNotification(
      `🚨 OUT OF STOCK: ${data.productName} (${data.productCode})`, 
      'error'
    );
  }
});
```

**Enhanced Notification System:**
```javascript
showNotification(message, type = 'info') {
  const colors = {
    info: '#3b82f6',      // Blue
    success: '#10b981',   // Green
    warning: '#f59e0b',   // Orange
    error: '#ef4444'      // Red
  };
  
  // Longer duration for warnings and errors (7 seconds vs 4 seconds)
  const duration = type === 'error' || type === 'warning' ? 7000 : 4000;
}
```

**admin-dashboard.html:**
```javascript
function displayProducts(products) {
  ${products.map(p => {
    const stockColor = p.stock === 0 ? '#ef4444' : p.stock <= 5 ? '#f59e0b' : '#10b981';
    const stockIcon = p.stock === 0 ? '🚨' : p.stock <= 5 ? '⚠️' : '✓';
    const stockText = p.stock === 0 ? 'OUT OF STOCK' : p.stock <= 5 ? `LOW STOCK (${p.stock})` : p.stock;
    
    return `
      <tr style="${p.stock === 0 ? 'background: #fee2e2;' : p.stock <= 5 ? 'background: #fef3c7;' : ''}">
        <td style="color: ${stockColor}; font-weight: 600;">
          ${stockIcon} ${stockText}
        </td>
      </tr>
    `;
  })}
}
```

## User Flow

### Scenario 1: Product Goes Out of Stock
1. Customer places order for last 3 units of a product
2. System deducts stock: 3 → 0
3. Backend detects stock = 0
4. Emits `product:outOfStock` event via Socket.IO
5. All connected admins receive notification:
   - "🚨 OUT OF STOCK: LED Bulb 60W (MJE-123456)"
   - Red notification, 7 seconds duration
6. Admin dashboard shows product with:
   - Red background row
   - 🚨 icon
   - "OUT OF STOCK" in red text

### Scenario 2: Product Reaches Low Stock
1. Customer places order reducing stock from 7 to 4
2. System deducts stock: 7 → 4
3. Backend detects stock ≤ 5 AND previous stock > 5
4. Emits `product:lowStock` event via Socket.IO
5. All connected admins receive notification:
   - "⚠️ Low Stock: LED Bulb 60W - Only 4 left!"
   - Orange notification, 7 seconds duration
6. Admin dashboard shows product with:
   - Yellow background row
   - ⚠️ icon
   - "LOW STOCK (4)" in orange text

### Scenario 3: Stock Stays Low
1. Customer places order reducing stock from 4 to 2
2. System deducts stock: 4 → 2
3. Backend detects stock ≤ 5 BUT previous stock was also ≤ 5
4. **No notification sent** (prevents spam)
5. Dashboard still shows low stock indicator

## Configuration

### Stock Thresholds
```javascript
const LOW_STOCK_THRESHOLD = 5;  // Configurable in orderController.js
```

To change the threshold:
1. Open `backend/controllers/orderController.js`
2. Find `const LOW_STOCK_THRESHOLD = 5;`
3. Change to desired number (e.g., 10 for earlier warnings)

### Notification Duration
```javascript
// In socket.js showNotification()
const duration = type === 'error' || type === 'warning' ? 7000 : 4000;
```

## Benefits

### For Admins:
- **Immediate Awareness:** Know instantly when products need restocking
- **Prevent Lost Sales:** Restock before running out completely
- **Visual Dashboard:** Quickly identify problem products at a glance
- **Prioritization:** Red alerts (out of stock) vs orange warnings (low stock)

### For Business:
- **Inventory Management:** Proactive rather than reactive restocking
- **Customer Satisfaction:** Fewer "out of stock" disappointments
- **Sales Optimization:** Maintain availability of popular items
- **Efficiency:** No need to manually check stock levels

### For Customers:
- **Better Availability:** Products more likely to be in stock
- **Faster Fulfillment:** Orders ship without delays
- **Trust:** Reliable inventory information

## Visual Examples

### Admin Dashboard Product List:

```
┌─────────────┬──────────────┬──────────┬─────────┬──────────────────┬────────┬─────────┐
│ Product ID  │ Name         │ Category │ Price   │ Stock            │ Status │ Actions │
├─────────────┼──────────────┼──────────┼─────────┼──────────────────┼────────┼─────────┤
│ MJE-123456  │ LED Bulb 60W │ Lighting │ GH₵ 50  │ ✓ 25             │ Active │ Edit    │
│ MJE-123457  │ LED Bulb 40W │ Lighting │ GH₵ 40  │ ⚠️ LOW STOCK (3) │ Active │ Edit    │ ← Yellow row
│ MJE-123458  │ LED Bulb 20W │ Lighting │ GH₵ 30  │ 🚨 OUT OF STOCK  │ Active │ Edit    │ ← Red row
└─────────────┴──────────────┴──────────┴─────────┴──────────────────┴────────┴─────────┘
```

### Notification Popup:

```
┌────────────────────────────────────────────┐
│ 🚨 OUT OF STOCK: LED Bulb 60W (MJE-123456) │  ← Red background
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ ⚠️ Low Stock: LED Bulb 40W - Only 3 left!  │  ← Orange background
└────────────────────────────────────────────┘
```

## Testing Checklist

### Real-time Notifications:
- [ ] Admin logged in and connected to socket
- [ ] Place order that reduces stock to 5 or below
- [ ] Admin receives low stock notification
- [ ] Place order that reduces stock to 0
- [ ] Admin receives out of stock notification
- [ ] Multiple admins all receive notifications
- [ ] Notifications show correct product name and code

### Dashboard Visual Indicators:
- [ ] Products with stock > 5 show green with ✓
- [ ] Products with stock ≤ 5 show orange with ⚠️
- [ ] Products with stock = 0 show red with 🚨
- [ ] Row backgrounds color-coded correctly
- [ ] Stock text displays properly

### Threshold Logic:
- [ ] Notification only sent when crossing threshold
- [ ] No spam when stock stays low
- [ ] Works correctly for multiple products in one order

### Edge Cases:
- [ ] Admin not logged in → no notifications
- [ ] Regular user → no notifications
- [ ] Socket disconnected → reconnects and works
- [ ] Multiple tabs open → all receive notifications

## Future Enhancements

Potential additions:
- Email notifications for out of stock
- SMS alerts for critical items
- Automatic reorder suggestions
- Stock history tracking
- Predictive low stock warnings
- Customizable thresholds per product
- Bulk restock interface
- Supplier integration
