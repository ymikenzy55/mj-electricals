# Quick Start Guide: New Features

## 🚀 Testing the New Features

### Prerequisites
1. Server must be running: `start-servers.bat`
2. Database must be connected
3. Admin account created

---

## 1️⃣ Testing Delivery Charges

### Step 1: Create Delivery Charges (Admin)

Open your API testing tool (Postman, Thunder Client, or browser console) and create some cities:

```javascript
// In browser console or use Postman
const token = localStorage.getItem('token'); // Get admin token

// Create Accra
fetch('http://localhost:5000/api/delivery-charges', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    city: 'Accra',
    charge: 50,
    estimatedDays: 2,
    active: true
  })
}).then(r => r.json()).then(console.log);

// Create Kumasi
fetch('http://localhost:5000/api/delivery-charges', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    city: 'Kumasi',
    charge: 55,
    estimatedDays: 3,
    active: true
  })
}).then(r => r.json()).then(console.log);

// Create Takoradi
fetch('http://localhost:5000/api/delivery-charges', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    city: 'Takoradi',
    charge: 60,
    estimatedDays: 3,
    active: true
  })
}).then(r => r.json()).then(console.log);

// Create Tamale
fetch('http://localhost:5000/api/delivery-charges', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    city: 'Tamale',
    charge: 75,
    estimatedDays: 4,
    active: true
  })
}).then(r => r.json()).then(console.log);
```

### Step 2: Test Checkout with Delivery Charges

1. **Add products to cart** as a regular user
2. **Go to checkout**: `http://localhost:3000/pages/checkout.html`
3. **Fill shipping form**
4. **Select a city** from the dropdown
5. **Watch the delivery charge** update automatically
6. **See the total** = Subtotal + Delivery Charge
7. **Complete the order**

### Expected Result:
```
Order Summary:
├─ Subtotal: GH₵ 450.00
├─ Delivery (Kumasi): GH₵ 55.00
└─ Total: GH₵ 505.00
```

---

## 2️⃣ Testing Product Reviews

### Step 1: Create a Review (User)

```javascript
// In browser console (logged in as user)
const reviewData = {
  productId: 'YOUR_PRODUCT_ID_HERE', // Get from products page
  rating: 5,
  title: 'Excellent Product!',
  comment: 'This product exceeded my expectations. The quality is outstanding and delivery was fast. Highly recommend!'
};

api.createReview(reviewData)
  .then(response => {
    console.log('Review created:', response);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Step 2: Get Product Reviews

```javascript
// Get reviews for a product
const productId = 'YOUR_PRODUCT_ID_HERE';

api.getProductReviews(productId)
  .then(response => {
    console.log('Reviews:', response.reviews);
    console.log('Rating Stats:', response.ratingStats);
  });
```

### Step 3: Admin Moderation

```javascript
// Get all pending reviews (Admin)
api.getAllReviews({ status: 'pending' })
  .then(response => {
    console.log('Pending reviews:', response.reviews);
  });

// Approve a review (Admin)
const reviewId = 'REVIEW_ID_HERE';
api.updateReviewStatus(reviewId, 'approved')
  .then(response => {
    console.log('Review approved:', response);
  });
```

---

## 3️⃣ Testing Multiple Product Images

### Step 1: Create Product with Multiple Images (Admin)

```javascript
// In admin dashboard or console
const productData = {
  name: 'LED Bulb 60W',
  category: 'Bulbs',
  wattage: 60,
  price: 45.00,
  stock: 100,
  description: 'High-quality LED bulb with multiple viewing angles',
  images: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
    'https://example.com/image4.jpg'
  ]
};

api.createProduct(productData)
  .then(response => {
    console.log('Product created:', response);
  });
```

### Step 2: View Product Details

1. Go to product details page
2. See main image displayed
3. See thumbnails below (up to 4)
4. Click thumbnails to change main image
5. Active thumbnail is highlighted

### Expected Result:
```
┌─────────────────────────┐
│   [Main Image]          │
│   (Large Display)       │
├─────────────────────────┤
│ [Img1] [Img2] [Img3] [Img4]
│  ✓      ○      ○      ○
└─────────────────────────┘
```

---

## 🧪 Complete Testing Workflow

### Scenario: Complete Order with Delivery Charge

1. **Setup (Admin)**
   ```javascript
   // Create delivery charges for cities
   await api.createDeliveryCharge({
     city: 'Accra',
     charge: 50,
     estimatedDays: 2,
     active: true
   });
   ```

2. **Shopping (User)**
   - Browse products
   - Add items to cart
   - View cart

3. **Checkout (User)**
   - Go to checkout
   - Fill shipping address
   - Select city: "Accra"
   - See delivery charge: GH₵ 50
   - See total updated
   - Complete order

4. **Verify Order**
   - Check user dashboard
   - Order should show:
     - Subtotal
     - Delivery Charge
     - Total Amount

---

## 📝 Sample Data for Testing

### Delivery Charges
```javascript
const cities = [
  { city: 'Accra', charge: 50, estimatedDays: 2 },
  { city: 'Kumasi', charge: 55, estimatedDays: 3 },
  { city: 'Takoradi', charge: 60, estimatedDays: 3 },
  { city: 'Tamale', charge: 75, estimatedDays: 4 },
  { city: 'Cape Coast', charge: 55, estimatedDays: 3 },
  { city: 'Sunyani', charge: 65, estimatedDays: 4 },
  { city: 'Ho', charge: 60, estimatedDays: 3 },
  { city: 'Koforidua', charge: 55, estimatedDays: 3 }
];

// Create all cities
for (const city of cities) {
  await api.createDeliveryCharge(city);
}
```

### Sample Reviews
```javascript
const reviews = [
  {
    rating: 5,
    title: 'Excellent Quality!',
    comment: 'This product is amazing. Highly recommend!'
  },
  {
    rating: 4,
    title: 'Good Product',
    comment: 'Works well, but delivery took a bit longer than expected.'
  },
  {
    rating: 5,
    title: 'Perfect!',
    comment: 'Exactly what I needed. Great value for money.'
  }
];

// Create reviews for a product
const productId = 'YOUR_PRODUCT_ID';
for (const review of reviews) {
  await api.createReview({ ...review, productId });
}
```

---

## 🔍 Verification Checklist

### Delivery Charges
- [ ] Cities created successfully
- [ ] Cities appear in checkout dropdown
- [ ] Delivery charge calculates correctly
- [ ] Order summary updates
- [ ] Order placed with correct total
- [ ] Order shows delivery charge in database

### Reviews
- [ ] Review created successfully
- [ ] Review appears in product reviews
- [ ] Product rating updated
- [ ] Admin can see pending reviews
- [ ] Admin can approve/reject reviews
- [ ] Helpful count works

### Multiple Images
- [ ] Product created with 4 images
- [ ] All images display on product page
- [ ] Thumbnails clickable
- [ ] Main image changes on click
- [ ] Active thumbnail highlighted
- [ ] Cannot add more than 4 images

---

## 🐛 Troubleshooting

### Delivery Charges Not Showing
```javascript
// Check if charges exist
api.getDeliveryCharges()
  .then(response => console.log('Charges:', response.charges));

// Check if city is active
api.getDeliveryChargeByCity('Accra')
  .then(response => console.log('Accra charge:', response.charge));
```

### Reviews Not Creating
```javascript
// Check if user is authenticated
const state = stateManager.getState();
console.log('User:', state.user);
console.log('Token:', localStorage.getItem('token'));

// Check if product exists
api.getProduct(productId)
  .then(response => console.log('Product:', response.product));
```

### Images Not Displaying
```javascript
// Check product images
api.getProduct(productId)
  .then(response => {
    console.log('Images:', response.product.images);
    console.log('Image count:', response.product.images.length);
  });
```

---

## 🎯 Quick Commands

### Create All Sample Data
```javascript
// Run this in browser console as admin
async function setupSampleData() {
  // Create delivery charges
  const cities = [
    { city: 'Accra', charge: 50, estimatedDays: 2 },
    { city: 'Kumasi', charge: 55, estimatedDays: 3 },
    { city: 'Takoradi', charge: 60, estimatedDays: 3 },
    { city: 'Tamale', charge: 75, estimatedDays: 4 }
  ];

  for (const city of cities) {
    try {
      await api.createDeliveryCharge(city);
      console.log(`✓ Created ${city.city}`);
    } catch (error) {
      console.error(`✗ Failed to create ${city.city}:`, error.message);
    }
  }

  console.log('✅ Sample data setup complete!');
}

setupSampleData();
```

### Verify All Features
```javascript
async function verifyFeatures() {
  console.log('🔍 Verifying features...\n');

  // Check delivery charges
  const charges = await api.getDeliveryCharges();
  console.log(`✓ Delivery Charges: ${charges.charges.length} cities`);

  // Check reviews endpoint
  try {
    const reviews = await api.getAllReviews();
    console.log(`✓ Reviews: ${reviews.total} total reviews`);
  } catch (error) {
    console.log('✗ Reviews: Not accessible (may need admin)');
  }

  console.log('\n✅ Verification complete!');
}

verifyFeatures();
```

---

## 📞 Need Help?

### Common Issues

1. **"City not found"**
   - Make sure delivery charges are created
   - Check city name spelling
   - Verify city is active

2. **"Already reviewed this product"**
   - Each user can only review once per product
   - Update existing review instead

3. **"Maximum 4 images allowed"**
   - Product can only have 4 images
   - Remove some images before adding new ones

### Check Server Logs
```bash
# Server should show:
Server running on port 5000
MongoDB connected
```

### Check Browser Console
```javascript
// Should see no errors
// Check network tab for API calls
```

---

**Quick Start Guide Created**: December 25, 2024
**Features**: Delivery Charges, Reviews, Multiple Images
**Status**: ✅ Ready for Testing
