# User Cancel Button & Admin Dashboard Fix

## Issues Fixed

### 1. Admin Dashboard - getStatusColor Error
**Problem:** `Uncaught ReferenceError: getStatusColor is not defined` when clicking View button on orders

**Root Cause:** The `getStatusColor` function was defined AFTER the `viewAdminOrderDetails` function that uses it, causing a reference error.

**Solution:** Moved the `getStatusColor` and `formatAddress` helper functions BEFORE the `viewAdminOrderDetails` function so they're available when needed.

### 2. User Dashboard - Missing Cancel Button
**Problem:** Users couldn't cancel pending orders to request refunds

**Solution:** 
- Added a "Cancel Order & Request Refund" button that appears only for orders with `status === 'pending'`
- Button is styled in red (#ef4444) to indicate a destructive action
- Includes an info message that admin will be notified
- Implemented `cancelUserOrder()` function with confirmation dialog
- Uses existing `api.cancelOrder()` backend endpoint
- Refreshes dashboard stats and orders after cancellation

## Changes Made

### frontend/pages/admin-dashboard.html
- Moved `getStatusColor()` function definition before `viewAdminOrderDetails()`
- Moved `formatAddress()` helper function to be reusable
- Fixed function ordering to prevent reference errors

### frontend/pages/user-dashboard.html
- Added conditional cancel button in order display (only for pending orders)
- Added `cancelUserOrder()` function with Modal.confirm dialog
- Button triggers order cancellation and notifies admin for refund processing
- Updates dashboard after successful cancellation

## User Experience

**For Users:**
1. View "My Orders" section in dashboard
2. Pending orders now show a red "Cancel Order & Request Refund" button
3. Click button → confirmation dialog appears
4. Confirm → order cancelled, admin notified
5. Dashboard refreshes with updated stats

**For Admins:**
1. View button in orders section now works without errors
2. Can see full order details including status with proper color coding
3. Will see cancelled orders and can process refunds accordingly

## Testing

1. **Admin Dashboard:**
   - Go to admin dashboard → Orders section
   - Click "View" button on any order
   - Should see order details modal without errors
   - Status should be color-coded properly

2. **User Dashboard:**
   - Go to user dashboard → My Orders
   - Find a pending order
   - Should see red "Cancel Order & Request Refund" button
   - Click it → confirmation dialog appears
   - Confirm → order status changes to "cancelled"
   - Admin can see the cancellation and process refund
