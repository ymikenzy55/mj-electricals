# Critical Branding & UX Fixes Required

## IMMEDIATE ISSUES:

### 1. Mobile Menu User Data Not Loading ⚠️ CRITICAL
**Status:** User info shows "User" and "user@example.com" instead of actual data
**Root Cause:** stateManager not loaded when navbar component initializes
**Fix Required:** Ensure proper timing and data fetching

### 2. Login Page Missing Branding & Features ⚠️ HIGH PRIORITY
**Issues:**
- No MJ Electricals logo
- No password visibility toggle
- Poor form design
**Fix Required:** 
- Add logo at top
- Add eye icon to toggle password visibility
- Improve form styling

### 3. Register Page Missing Branding ⚠️ HIGH PRIORITY
**Issues:**
- No MJ Electricals logo
- Inconsistent with login page
**Fix Required:**
- Add logo
- Match login page design

### 4. Admin Panel Missing Branding ⚠️ MEDIUM PRIORITY
**Issues:**
- No MJ Electricals logo in header
- Looks generic
**Fix Required:**
- Add logo to admin header
- Add company name/tagline

## IMPLEMENTATION ORDER:
1. Fix mobile menu user data loading (CRITICAL - affects all pages)
2. Add logo and password toggle to login page (HIGH - first impression)
3. Add logo to register page (HIGH - consistency)
4. Add logo to admin panel (MEDIUM - internal tool)

## FILES TO MODIFY:
- frontend/components/navbar.html (mobile menu fix)
- frontend/pages/login.html (logo + password toggle)
- frontend/pages/register.html (logo)
- frontend/pages/admin-dashboard.html (logo)
- frontend/pages/super-admin-dashboard.html (logo)
