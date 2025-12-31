# Review Submission Test Guide

## Quick Test Steps

### 1. Check if Backend is Running
Open browser console and run:
```javascript
fetch('http://localhost:5000/api/reviews/product/test123')
  .then(r => r.json())
  .then(d => console.log('Reviews endpoint working:', d))
  .catch(e => console.error('Reviews endpoint error:', e));
```

### 2. Check Authentication
```javascript
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
console.log('Token value:', token);
```

### 3. Test Review Submission Manually
```javascript
const testReview = {
  productId: '507f1f77bcf86cd799439011', // Replace with real product ID
  rating: 5,
  title: 'Test Review',
  comment: 'This is a test review to check if the system works.'
};

fetch('http://localhost:5000/api/reviews', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(testReview)
})
.then(r => r.json())
.then(d => console.log('Review submission result:', d))
.catch(e => console.error('Review submission error:', e));
```

## Common Issues & Solutions

### Issue 1: "Not authorized to access this route"
**Cause:** User not logged in or token expired
**Solution:**
1. Check if user is logged in
2. Try logging out and logging back in
3. Check token in localStorage

### Issue 2: "All fields are required"
**Cause:** Missing productId, rating, title, or comment
**Solution:**
1. Check console log for submitted data
2. Verify all form fields are filled
3. Check if productId is being passed correctly

### Issue 3: "Product not found"
**Cause:** Invalid productId
**Solution:**
1. Verify you're on a real product page
2. Check the URL for product ID
3. Verify product exists in database

### Issue 4: "You have already reviewed this product"
**Cause:** User already submitted a review for this product
**Solution:**
1. Try a different product
2. Or delete existing review first
3. Check database for existing reviews

### Issue 5: Network Error / CORS
**Cause:** Backend not running or CORS issue
**Solution:**
1. Verify backend is running on port 5000
2. Check backend console for errors
3. Verify CORS is enabled in server.js

## Debug Checklist

- [ ] Backend server is running (http://localhost:5000)
- [ ] User is logged in (check localStorage.getItem('token'))
- [ ] On a valid product details page
- [ ] Product ID is visible in URL
- [ ] All form fields are filled (rating, title, comment)
- [ ] Browser console shows no errors
- [ ] Network tab shows POST request to /api/reviews
- [ ] Request includes Authorization header
- [ ] Request body includes all required fields

## Expected Console Output

**Successful Submission:**
```
Submitting review: {
  productId: "507f1f77bcf86cd799439011",
  rating: 5,
  title: "Great product!",
  comment: "Works perfectly"
}

Review response: {
  message: "Review submitted successfully and is pending approval",
  review: { ... }
}
```

**Failed Submission:**
```
Review submission error: Error: All fields are required
```

or

```
Review submission error: Error: Not authorized to access this route
```

## Manual Database Check

If you have access to MongoDB, check if review was saved:

```javascript
// In MongoDB shell or Compass
db.reviews.find().sort({createdAt: -1}).limit(1)
```

Should show the most recent review with:
- product: ObjectId
- user: ObjectId
- rating: 1-5
- title: string
- comment: string
- status: 'pending'
- createdAt: timestamp
