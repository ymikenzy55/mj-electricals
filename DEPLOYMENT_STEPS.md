# 🚀 DEPLOYMENT GUIDE - Let's Go Live!

## ✅ PHASE 1: RAILWAY (Backend API) - 15 minutes

### Step 1: Create Railway Account
1. Open browser and go to: **https://railway.app**
2. Click **"Login"** button (top right)
3. Click **"Login with GitHub"**
4. Click **"Authorize Railway"** when GitHub asks
5. ✅ You're now logged into Railway!

### Step 2: Create New Project
1. Click **"New Project"** button (big purple button)
2. Click **"Deploy from GitHub repo"**
3. You'll see your repository: **mj-electricals**
4. Click on it to select it
5. Railway will start deploying automatically
6. ⏳ Wait 2-3 minutes for initial build...

### Step 3: Check Deployment Status
1. You'll see a deployment screen with logs
2. Wait until you see: ✅ **"Build successful"** or **"Deployed"**
3. If you see errors, don't worry - we need to add environment variables first

### Step 4: Add Environment Variables
1. Click on your service (should show your repo name)
2. Click **"Variables"** tab at the top
3. Click **"+ New Variable"** button

**Now add these variables ONE BY ONE:**

#### Variable 1: NODE_ENV
```
Variable: NODE_ENV
Value: production
```
Click "Add" ✅

#### Variable 2: PORT
```
Variable: PORT
Value: 5000
```
Click "Add" ✅

#### Variable 3: MONGODB_URI
```
Variable: MONGODB_URI
Value: [YOUR MONGODB ATLAS CONNECTION STRING]
```
**Get this from your .env file or MongoDB Atlas dashboard**
Should look like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority`
Click "Add" ✅

#### Variable 4: JWT_SECRET
```
Variable: JWT_SECRET
Value: mje_production_jwt_secret_2024_change_this_to_something_random
```
Click "Add" ✅

#### Variable 5: JWT_EXPIRE
```
Variable: JWT_EXPIRE
Value: 7d
```
Click "Add" ✅

#### Variable 6: SUPER_ADMIN_EMAIL
```
Variable: SUPER_ADMIN_EMAIL
Value: admin@mje.com
```
Click "Add" ✅

#### Variable 7: SUPER_ADMIN_PASSWORD
```
Variable: SUPER_ADMIN_PASSWORD
Value: MJE@Admin2024!Secure
```
**IMPORTANT: Change this to your own secure password!**
Click "Add" ✅

#### Variable 8: PAYSTACK_SECRET_KEY
```
Variable: PAYSTACK_SECRET_KEY
Value: [YOUR PAYSTACK SECRET KEY]
```
**Get this from your .env file**
Should start with `sk_test_` or `sk_live_`
Click "Add" ✅

#### Variable 9: PAYSTACK_PUBLIC_KEY
```
Variable: PAYSTACK_PUBLIC_KEY
Value: [YOUR PAYSTACK PUBLIC KEY]
```
**Get this from your .env file**
Should start with `pk_test_` or `pk_live_`
Click "Add" ✅

#### Variable 10: FRONTEND_URL (Add this AFTER deploying frontend)
```
Variable: FRONTEND_URL
Value: [LEAVE EMPTY FOR NOW - we'll add this later]
```
Click "Add" ✅

### Step 5: Get Your Railway URL
1. Click **"Settings"** tab
2. Scroll down to **"Networking"** section
3. Under **"Public Networking"**, click **"Generate Domain"**
4. You'll get a URL like: `your-app-name.up.railway.app`
5. **COPY THIS URL** and save it in Notepad!

### Step 6: Test Your Backend
1. Open a new browser tab
2. Go to: `https://your-railway-url.up.railway.app/api/health`
3. You should see: `{"status":"ok","timestamp":"..."}`
4. ✅ If you see this, your backend is LIVE!

---

## ✅ PHASE 2: UPDATE FRONTEND CODE - 5 minutes

### Step 7: Update API URL in Frontend
Open your code editor and follow these steps:

1. Open file: `frontend/js/api.js`
2. Find the `getApiUrl` function (around line 12)
3. Replace the return statement in production section with YOUR Railway URL:

```javascript
const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
    return 'http://localhost:5000/api';
  }
  
  // Production - REPLACE WITH YOUR RAILWAY URL
  return 'https://YOUR-RAILWAY-URL.up.railway.app/api';
};
```

4. Replace `YOUR-RAILWAY-URL.up.railway.app` with your actual Railway URL
5. **Save the file**

### Step 8: Commit and Push Changes
Open terminal in your project folder:

```bash
git add .
git commit -m "Updated API URL for production"
git push origin main
```

---

## ✅ PHASE 3: VERCEL (Frontend) - 10 minutes

### Step 9: Create Vercel Account
1. Go to: **https://vercel.com**
2. Click **"Sign Up"** button
3. Click **"Continue with GitHub"**
4. Click **"Authorize Vercel"**
5. ✅ You're now logged into Vercel!

### Step 10: Deploy Frontend
1. Click **"Add New..."** button (top right)
2. Click **"Project"**
3. You'll see **"Import Git Repository"**
4. Find your **mj-electricals** repository
5. Click **"Import"**

### Step 11: Configure Project
1. **Project Name:** `mje-ecommerce` (or your choice)
2. **Framework Preset:** Leave as "Other"
3. **Root Directory:** Click "Edit" and select **"frontend"** folder
4. **Build Command:** Leave empty
5. **Output Directory:** Leave as default
6. **Install Command:** Leave empty
7. Click **"Deploy"** button

### Step 12: Wait for Deployment
1. Vercel will build and deploy your site
2. ⏳ Wait 1-2 minutes...
3. You'll see: ✅ **"Congratulations! Your project has been deployed"**
4. You'll get a URL like: `mje-ecommerce.vercel.app`
5. **COPY THIS URL!**

### Step 13: Test Your Frontend
1. Click on the URL or open it in browser
2. You should see your homepage!
3. Try browsing products
4. Try adding to cart
5. ✅ Everything should work!

---

## ✅ PHASE 4: FINAL CONFIGURATION - 5 minutes

### Step 14: Update FRONTEND_URL in Railway
1. Go back to Railway dashboard
2. Click on your backend service
3. Click **"Variables"** tab
4. Find the `FRONTEND_URL` variable
5. Click on it to edit
6. Update value to: `https://your-vercel-url.vercel.app`
7. Save (Railway will redeploy automatically)

### Step 15: Test Everything Together
1. Open your Vercel URL
2. Try to register a new account
3. Try to login
4. Add products to cart
5. Go to checkout
6. Try placing an order
7. ✅ Everything should work!

---

## 🎉 YOU'RE LIVE!

### Your Live URLs:
- **Frontend:** https://your-vercel-url.vercel.app
- **Backend API:** https://your-railway-url.up.railway.app
- **Admin Dashboard:** https://your-vercel-url.vercel.app/pages/admin-dashboard.html

### Admin Login:
- **Email:** admin@mje.com
- **Password:** [Your SUPER_ADMIN_PASSWORD from Railway]

---

## 🐛 TROUBLESHOOTING

### Problem: "Cannot connect to backend"
**Solution:**
1. Check if Railway backend is running (check Railway dashboard)
2. Verify API URL in `frontend/js/api.js` is correct
3. Make sure Railway URL doesn't have trailing slash

### Problem: "CORS Error"
**Solution:**
1. Make sure FRONTEND_URL in Railway matches your Vercel URL exactly
2. No trailing slashes in URLs
3. Use HTTPS (not HTTP)

### Problem: "Payment not working"
**Solution:**
1. Check PAYSTACK keys in Railway variables
2. Make sure you're using correct keys (test or live)
3. Verify Paystack account is active

---

## 📞 NEED HELP?

If you get stuck:
1. Check Railway logs (Deployments tab → View logs)
2. Check browser console (F12)
3. Verify all environment variables are set correctly
4. Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

---

**Ready to go live? Follow the steps above!** 🚀
