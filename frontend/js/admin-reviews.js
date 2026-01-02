// Admin Reviews Management Functions
// This file contains all review management functions for the admin dashboard

// Global variables
let allReviews = [];
let currentReviewFilter = 'pending';

// Load reviews with filter
async function loadReviews() {
  try {
    await filterReviews('pending');
    await updatePendingReviewsBadge();
  } catch (error) {
    logger.error('Failed to load reviews:', error);
    const container = document.getElementById('reviews-list');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <p style="color: var(--error); margin-bottom: 1rem;">Failed to load reviews</p>
          <p style="color: var(--gray-600); font-size: 0.9rem;">${error.message || 'Unknown error'}</p>
          <button onclick="loadReviews()" class="btn" style="margin-top: 1rem;">
            <i class="fas fa-redo"></i> Retry
          </button>
        </div>
      `;
    }
  }
}

// Filter reviews by status
async function filterReviews(status) {
  currentReviewFilter = status;
  
  // Update button states
  document.querySelectorAll('[id^="filter-"][id$="-reviews"]').forEach(btn => {
    btn.classList.remove('btn');
    btn.classList.add('btn-secondary');
  });
  const activeBtn = document.getElementById(`filter-${status}-reviews`);
  if (activeBtn) {
    activeBtn.classList.remove('btn-secondary');
    activeBtn.classList.add('btn');
  }

  const container = document.getElementById('reviews-list');
  if (!container) return;

  try {
    container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading reviews...</p></div>';
    
    const params = status === 'all' ? {} : { status };
    const response = await api.getAllReviews(params);
    allReviews = response.reviews || [];
    displayReviews(allReviews);
  } catch (error) {
    logger.error('Failed to filter reviews:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <p style="color: var(--error); margin-bottom: 1rem;">Failed to load reviews</p>
        <p style="color: var(--gray-600); font-size: 0.9rem;">${error.message || 'Unknown error'}</p>
        <button onclick="filterReviews('${status}')" class="btn" style="margin-top: 1rem;">
          <i class="fas fa-redo"></i> Retry
        </button>
      </div>
    `;
  }
}

// Display reviews in the list
function displayReviews(reviews) {
  const container = document.getElementById('reviews-list');
  if (!container) return;

  if (reviews.length === 0) {
    container.innerHTML = `<p style="text-align: center; padding: 2rem; color: var(--gray-600);">No ${currentReviewFilter === 'all' ? '' : currentReviewFilter} reviews found.</p>`;
    return;
  }

  container.innerHTML = reviews.map(review => `
    <div style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: var(--shadow-md); margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
        <div style="flex: 1; min-width: 200px;">
          <h4 style="margin: 0;">${review.title || 'No title'}</h4>
          <p style="margin: 0.5rem 0; color: var(--gray-600);">
            <strong>${review.user?.name || 'Unknown User'}</strong> (${review.user?.email || 'No email'})
          </p>
          <div style="color: #ffa500; margin: 0.5rem 0;">
            ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
          </div>
        </div>
        <span class="status-badge ${review.status}">${review.status}</span>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <p style="margin: 0; line-height: 1.6;">${review.comment || 'No comment'}</p>
      </div>
      
      <div style="border-top: 1px solid var(--gray-200); padding-top: 1rem; margin-top: 1rem;">
        <p style="margin: 0; color: var(--gray-600); font-size: 0.9rem;">
          <strong>Product:</strong> ${review.product?.name || 'Unknown'} (${review.product?.productId || 'N/A'})
        </p>
        <p style="margin: 0.5rem 0 0 0; color: var(--gray-600); font-size: 0.9rem;">
          <strong>Submitted:</strong> ${new Date(review.createdAt).toLocaleString()}
          ${review.verified ? '<span style="color: #10b981; margin-left: 1rem;"><i class="fas fa-check-circle"></i> Verified Purchase</span>' : ''}
        </p>
      </div>
      
      ${review.status === 'pending' ? `
        <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
          <button class="btn" style="background: #10b981;" onclick="updateReviewStatus('${review._id}', 'approved')">
            <i class="fas fa-check"></i> Approve
          </button>
          <button class="btn" style="background: #ef4444;" onclick="updateReviewStatus('${review._id}', 'rejected')">
            <i class="fas fa-times"></i> Reject
          </button>
          <button class="btn btn-secondary" onclick="deleteAdminReview('${review._id}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      ` : `
        <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
          ${review.status === 'approved' ? `
            <button class="btn" style="background: #f59e0b;" onclick="updateReviewStatus('${review._id}', 'rejected')">
              <i class="fas fa-ban"></i> Reject
            </button>
          ` : `
            <button class="btn" style="background: #10b981;" onclick="updateReviewStatus('${review._id}', 'approved')">
              <i class="fas fa-check"></i> Approve
            </button>
          `}
          <button class="btn btn-secondary" onclick="deleteAdminReview('${review._id}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      `}
    </div>
  `).join('');
}

// Update review status
async function updateReviewStatus(reviewId, status) {
  try {
    await api.updateReviewStatus(reviewId, status);
    toast.success(`Review ${status} successfully`);
    
    // Reload current filter
    await filterReviews(currentReviewFilter);
    await updatePendingReviewsBadge();
  } catch (error) {
    logger.error('Failed to update review status:', error);
    toast.error(error.message || 'Failed to update review status');
  }
}

// Delete review
async function deleteAdminReview(reviewId) {
  Modal.confirm('Are you sure you want to delete this review? This action cannot be undone.', async () => {
    try {
      await api.deleteReview(reviewId);
      toast.success('Review deleted successfully');
      
      // Reload current filter
      await filterReviews(currentReviewFilter);
      await updatePendingReviewsBadge();
    } catch (error) {
      logger.error('Failed to delete review:', error);
      toast.error(error.message || 'Failed to delete review');
    }
  });
}

// Update pending reviews badge
async function updatePendingReviewsBadge() {
  try {
    const response = await api.getAllReviews({ status: 'pending' });
    const pendingCount = response.total || 0;
    
    const badge = document.getElementById('pending-reviews-badge');
    if (badge) {
      if (pendingCount > 0) {
        badge.textContent = pendingCount;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    }
  } catch (error) {
    logger.error('Failed to update pending reviews badge:', error);
  }
}

// Make functions globally available
window.loadReviews = loadReviews;
window.filterReviews = filterReviews;
window.updateReviewStatus = updateReviewStatus;
window.deleteAdminReview = deleteAdminReview;
window.updatePendingReviewsBadge = updatePendingReviewsBadge;
