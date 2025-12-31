# Implementation Plan for Requested Features

## Completed:
1. ✅ Fixed admin stats access (admins can now see dashboard stats)
2. ✅ Added discount field to Product model (0-100%)
3. ✅ Added image field to Category model
4. ✅ Created currency formatting utility (Ghana Cedis with commas)
5. ✅ Created Banner model for hero banners
6. ✅ Created Newsletter model for subscriptions

## Still Need to Implement:

### Backend:
1. Banner controller and routes (CRUD operations)
2. Newsletter controller and routes (subscribe endpoint)
3. Update category controller to handle image uploads

### Frontend:
1. Add utils.js script to all pages
2. Update all price displays to use formatPrice()
3. Add discount field to product forms (admin/super-admin)
4. Display discounted prices with strikethrough original price
5. Add active section indicators (underline current page)
6. Fix cart display issue
7. Create footer component with newsletter subscription
8. Add banner management in admin dashboard
9. Display banners on homepage
10. Add category image upload in admin
11. Display category images on categories page

### Priority Order:
1. Add utils.js to pages and fix price formatting
2. Add discount to product forms
3. Fix cart issue
4. Add footer with newsletter
5. Add banner management
6. Add category images
7. Add active section indicators

## Notes:
- All prices should show as GH₵ with comma formatting
- Discounts show as percentage off
- Banners are managed by admins
- Categories need image upload capability
