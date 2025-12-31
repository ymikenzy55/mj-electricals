# Admin Review Management System

## Overview

Admins can now manage product reviews with a dedicated Reviews section in the admin dashboard. They can view, approve, or reject pending reviews before they appear on product pages.

## Features Implemented

### 1. Reviews Menu in Admin Sidebar
- New "Reviews" menu item with star icon
- Badge showing count of pending reviews
- Badge updates automatically when reviews are approved/rejected

### 2. Review Management Interface
- **Filter Tabs:**
  - Pending (default) - Reviews awaiting approval
  - Approved - Reviews visible to customers
  - Rejected - Reviews that were declined
  - All Reviews - Complete list

- **Review Display:**
  - Review title and rating (stars)
  - User name and email
  - Review comment/text
  - Product name and ID
  - Submission date
  - Verified purchase badge (if applicable)
  - Current status badge

### 3. Review Actions
- **Approve Button** (green) - Makes review visible on product page
- **Reject Button** (red) - Hides review from public view
- Actions only available for pending reviews
- Instant feedback with success/error messages

### 4. Automatic Badge Updates
- Pending reviews badge shows count
- Updates when:
  - Dashboard loads
  - Reviews are approved/rejected
  - New reviews are submitted
- Hidden when no pending reviews

## User Flow

### Customer Submits Review:
1. Customer fills out review form on product page
2. Clicks "Submit Review"
3. Review saved with status: 'pending'
4. Customer sees: "Review submitted! Pending admin approval"
5. Review NOT visible on product page yet

### Admin Reviews Submission:
1. Admin logs into dashboard
2. Sees "Reviews" menu with badge (e.g., "3")
3. Clicks "Reviews" menu
4. Sees list of pending reviews
5. Reads review content
6. Clicks "Approve" or "Reject"
7. Review status updates
8. Badge count decreases

### After Approval:
1. Review status changes to 'approved'
2. Review appears on product page
3. Product rating recalculates
4. Customer can see their published review

## Technical Implementation

### Backend (Already Exists)
- `POST /api/reviews` - Create review (status: pending)
- `GET /api/reviews/admin/all?status=pending` - Get reviews by status
- `PUT /api/reviews/admin/:reviewId/status` - Update review status

### Frontend Changes

**admin-dashboard.html:**
```html
<!-- Sidebar Menu Item -->
<li>
  <a href="#" onclick="showSection('reviews', event)">
    <i class="fas fa-star"></i>
    <span>Reviews</span>
    <span class="menu-badge" id="pending-reviews-badge">0</span>
  </a>
</li>

<!-- Reviews Section -->
<section id="reviews-section" style="display:none;">
  <h2>Manage Reviews</h2>
  
  <!-- Filter Tabs -->
  <div>
    <button onclick="filterReviews('pending')">Pending</button>
    <button onclick="filterReviews('approved')">Approved</button>
    <button onclick="filterReviews('rejected')">Rejected</button>
    <button onclick="filterReviews('all')">All Reviews</button>
  </div>

  <div id="reviews-list"></div>
</section>
```

**JavaScript Functions:**
```javascript
// Load reviews (defaults to pending)
async function loadReviews() {
  await filterReviews('pending');
  await updatePendingReviewsBadge();
}

// Filter reviews by status
async function filterReviews(status) {
  const params = status === 'all' ? {} : { status };
  const response = await api.getAllReviews(params);
  displayReviews(response.reviews);
}

// Display reviews in UI
function displayReviews(reviews) {
  // Shows review cards with approve/reject buttons
}

// Update review status
async function updateReviewStatus(reviewId, status) {
  await api.updateReviewStatus(reviewId, status);
  toast.success(`Review ${status} successfully`);
  await filterReviews(currentReviewFilter);
  await updatePendingReviewsBadge();
}

// Update badge count
async function updatePendingReviewsBadge() {
  const response = await api.getAllReviews({ status: 'pending' });
  const pendingCount = response.total || 0;
  // Update badge display
}
```

**api.js:**
```javascript
// Get all reviews (admin only)
async getAllReviews(params = {}) {
  const query = new URLSearchParams(params).toString();
  return this.request(`/reviews/admin/all?${query}`);
}

// Update review status (admin only)
async updateReviewStatus(reviewId, status) {
  return this.request(`/reviews/admin/${reviewId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
}
```

## Review Card Display

```
┌─────────────────────────────────────────────────────────┐
│ Great Product!                              [pending]   │
│ John Doe (john@example.com)                             │
│ ★★★★★                                                   │
├─────────────────────────────────────────────────────────┤
│ This product works perfectly! Highly recommend it.      │
│ Very satisfied with my purchase.                        │
├─────────────────────────────────────────────────────────┤
│ Product: LED Bulb 60W (MJE-123456)                      │
│ Submitted: 12/27/2025, 3:45 PM ✓ Verified Purchase     │
├─────────────────────────────────────────────────────────┤
│ [✓ Approve]  [✗ Reject]                                 │
└─────────────────────────────────────────────────────────┘
```

## Benefits

### For Admins:
- **Quality Control:** Review content before publishing
- **Spam Prevention:** Block fake or inappropriate reviews
- **Brand Protection:** Maintain professional image
- **Easy Management:** Simple approve/reject workflow
- **Clear Overview:** See all pending reviews at once

### For Business:
- **Trust Building:** Only quality reviews published
- **Customer Confidence:** Moderated review system
- **Legal Protection:** Control over published content
- **Better Ratings:** Accurate product ratings
- **Professional Image:** Curated customer feedback

### For Customers:
- **Quality Reviews:** Only helpful reviews visible
- **Trust:** Know reviews are verified
- **Transparency:** Clear submission process
- **Feedback:** Know their review is being reviewed

## Testing Checklist

### Review Submission:
- [ ] Customer submits review on product page
- [ ] Review saved with status 'pending'
- [ ] Success message shows approval requirement
- [ ] Review NOT visible on product page yet

### Admin Dashboard:
- [ ] "Reviews" menu item visible
- [ ] Badge shows pending count
- [ ] Clicking menu loads reviews section
- [ ] Pending reviews displayed by default
- [ ] Filter tabs work correctly

### Review Approval:
- [ ] Click "Approve" button
- [ ] Success message appears
- [ ] Review status changes to 'approved'
- [ ] Review appears on product page
- [ ] Product rating updates
- [ ] Badge count decreases

### Review Rejection:
- [ ] Click "Reject" button
- [ ] Success message appears
- [ ] Review status changes to 'rejected'
- [ ] Review NOT visible on product page
- [ ] Badge count decreases

### Badge Updates:
- [ ] Badge shows correct count on load
- [ ] Badge updates after approval
- [ ] Badge updates after rejection
- [ ] Badge hides when count is 0

## Future Enhancements

Potential additions:
- Bulk approve/reject
- Review editing by admin
- Response to reviews
- Review analytics
- Email notifications to customers
- Review flagging by users
- Automated spam detection
- Review templates
- Export reviews to CSV
