# 🔧 URGENT: Fix Google OAuth on Render

## Problem Fixed in Code ✅
- Login form now works with email/password
- Google OAuth button now dynamically points to correct backend URL

## Action Required: Update Render Environment Variable

### Step 1: Update GOOGLE_CALLBACK_URL on Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your backend service: **mj-electricals**
3. Click **Environment** in the left sidebar
4. Find the variable: `GOOGLE_CALLBACK_URL`
5. Change it from:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
   To:
   ```
   https://mj-electricals.onrender.com/api/auth/google/callback
   ```
6. Click **Save Changes**
7. Your service will automatically redeploy

### Step 2: Update Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, add:
   ```
   https://mj-electricals.onrender.com/api/auth/google/callback
   ```
4. Click **Save**

## What's Fixed Now:

✅ **Normal Login Form**: Works with email/password
✅ **Google OAuth Button**: Points to correct backend URL
✅ **Dynamic URL Detection**: Automatically uses localhost for dev, Render for production

## Test After Fixing:

1. **Test Normal Login**:
   - Email: superadmin@mje.com
   - Password: SuperAdmin@123

2. **Test Google OAuth**:
   - Click "Sign in with Google"
   - Should redirect to Google login
   - After login, should redirect back to your site

## Current Status:

- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on Render
- ⏳ Waiting for you to update GOOGLE_CALLBACK_URL
- ⏳ Waiting for you to update Google Console

Once you update these two settings, everything will work perfectly!
