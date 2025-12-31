# 📝 Step-by-Step: Update Google Cloud Console for OAuth

## What You're Doing:
Adding your Render backend URL to Google's list of allowed redirect URLs so Google OAuth works in production.

---

## Step 1: Go to Google Cloud Console

1. Open your browser and go to: **https://console.cloud.google.com**
2. Sign in with your Google account (the one you used to create the OAuth credentials)

---

## Step 2: Navigate to Credentials

1. In the top-left corner, click the **hamburger menu** (three horizontal lines)
2. Hover over **APIs & Services**
3. Click **Credentials**

**OR** use this direct link: https://console.cloud.google.com/apis/credentials

---

## Step 3: Find Your OAuth 2.0 Client ID

1. You'll see a list of credentials
2. Look for **OAuth 2.0 Client IDs** section
3. Find the one that starts with: `112485981778-slfol3nk50chhpjth00nj1r4jkc8r1rq`
4. Click on its **name** (not the pencil icon, just click the name itself)

---

## Step 4: Add Render Callback URL

1. You'll see a page with your OAuth client details
2. Scroll down to **Authorized redirect URIs** section
3. You should see this existing URL:
   ```
   http://localhost:5000/api/auth/google/callback
   ```

4. Click **+ ADD URI** button
5. In the new text box that appears, paste this EXACT URL:
   ```
   https://mj-electricals.onrender.com/api/auth/google/callback
   ```

6. Make sure there are NO spaces before or after the URL
7. Make sure it starts with `https://` (not `http://`)

---

## Step 5: Save Changes

1. Scroll to the bottom of the page
2. Click the **SAVE** button
3. Wait for the confirmation message: "OAuth client updated"

---

## Step 6: Verify Your URLs

After saving, you should see **TWO** redirect URIs:

✅ `http://localhost:5000/api/auth/google/callback` (for local development)
✅ `https://mj-electricals.onrender.com/api/auth/google/callback` (for production)

---

## Common Issues & Solutions:

### Issue: "Invalid redirect URI"
**Solution**: Make sure the URL is EXACTLY:
```
https://mj-electricals.onrender.com/api/auth/google/callback
```
- No trailing slash
- Must be `https://` not `http://`
- Must match your Render service name exactly

### Issue: "Can't find OAuth credentials"
**Solution**: 
1. Make sure you're signed in with the correct Google account
2. Check if you have multiple Google Cloud projects
3. Switch to the correct project using the dropdown at the top

### Issue: "Save button is grayed out"
**Solution**: 
1. Make sure you actually added a new URI
2. Check if there are any error messages in red
3. Try refreshing the page and adding again

---

## After You Save:

1. **Wait 1-2 minutes** for Google to propagate the changes
2. Go back to your Render dashboard and update the `GOOGLE_CALLBACK_URL` environment variable
3. Test Google OAuth on your live site

---

## Quick Test:

1. Go to your Vercel site: https://mj-electricals-nine.vercel.app/pages/login.html
2. Click **"Sign in with Google"**
3. You should be redirected to Google's login page
4. After logging in, you should be redirected back to your site (not localhost)

---

## Need Help?

If you get stuck, take a screenshot of what you see and I can guide you through it!

Your OAuth Client ID: `112485981778-slfol3nk50chhpjth00nj1r4jkc8r1rq`
