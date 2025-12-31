# 🚀 Ngrok Quick Start Guide

## What You Need

1. **Ngrok Account** (Free): https://dashboard.ngrok.com/signup
2. **Ngrok Installed**: Download from https://ngrok.com/download

## 🎯 Fastest Setup (Recommended)

### Step 1: Install Ngrok

**Option A: Download Directly**
1. Go to https://ngrok.com/download
2. Download Windows version
3. Extract `ngrok.exe` to this project folder

**Option B: Using npm**
```bash
npm install -g ngrok
```

### Step 2: Get Your Auth Token
1. Sign up at https://dashboard.ngrok.com/signup
2. Copy your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken
3. Run this command (one time only):
```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

### Step 3: Start Everything
```bash
start-with-ngrok-simple.bat
```

### Step 4: Get Your Public URL
1. Look at the "Ngrok" window that opened
2. Find the line with "Forwarding"
3. Copy the `https://xxxx.ngrok-free.app` URL
4. Add `/pages/index.html` to the end
5. Share with others!

**Example:**
```
Forwarding: https://a1b2-123-45-67-89.ngrok-free.app -> http://localhost:8000

Share this: https://a1b2-123-45-67-89.ngrok-free.app/pages/index.html
```

## 📋 Available Scripts

### 1. Simple Setup (Free Tier) ⭐ RECOMMENDED
```bash
start-with-ngrok-simple.bat
```
- Tunnels frontend only
- Backend stays on localhost
- Works with free ngrok account
- Perfect for demos and testing

### 2. Full Setup (Paid Plan Required)
```bash
start-with-ngrok-full.bat
```
- Tunnels both frontend and backend
- Requires ngrok paid plan
- Best for production-like testing

### 3. Original Local Setup
```bash
start-servers.bat
```
- No ngrok, local only
- Fastest for development

## ⚠️ Important Notes

### Free Tier Limitations
- ✅ One tunnel at a time
- ✅ Random URL each restart
- ✅ 2-hour session limit
- ✅ Warning page (users click "Visit Site")
- ❌ Cannot tunnel multiple ports simultaneously

### Sharing Your Site
When you share the ngrok URL:
1. Users will see an ngrok warning page first
2. They click "Visit Site" button
3. Then they can access your site normally
4. This is normal for free ngrok accounts

### URL Changes
- The ngrok URL changes every time you restart
- To get a permanent URL, upgrade to ngrok paid plan
- Or use a service like localtunnel as alternative

## 🔧 Troubleshooting

### "ngrok not found"
- Make sure ngrok.exe is in this folder OR
- Install globally: `npm install -g ngrok`

### "authtoken required"
```bash
ngrok config add-authtoken YOUR_TOKEN
```

### "tunnel session failed"
- You might have another ngrok running
- Close all ngrok windows and try again
- Check: `tasklist | findstr ngrok`
- Kill if needed: `taskkill /F /IM ngrok.exe`

### "ERR_NGROK_108"
- Free tier limit reached (1 tunnel only)
- Close other ngrok instances
- Or upgrade to paid plan

### Backend Connection Issues
With simple setup, backend is on localhost:
- This is normal for free tier
- Users can access frontend via ngrok
- Backend API calls work through the frontend
- For full remote access, use paid plan + full setup

## 🎓 How It Works

```
Your Computer:
├── Backend Server (localhost:5000)
├── Frontend Server (localhost:8000)
└── Ngrok Tunnel
    └── Creates: https://xxxx.ngrok-free.app
        └── Points to: localhost:8000

Internet Users:
└── Access: https://xxxx.ngrok-free.app
    └── Sees your frontend
        └── Frontend connects to your localhost:5000
```

## 🌟 Pro Tips

1. **Keep Terminal Windows Open**
   - Don't close the Backend, Frontend, or Ngrok windows
   - Closing them stops the servers

2. **Share the Full URL**
   - Include `/pages/index.html` at the end
   - Example: `https://xxxx.ngrok-free.app/pages/index.html`

3. **Test Locally First**
   - Always test on localhost before sharing
   - Make sure everything works locally

4. **Monitor the Ngrok Window**
   - Shows all incoming requests
   - Useful for debugging

5. **Restart When Needed**
   - If URL stops working, restart the batch file
   - You'll get a new URL

## 🔗 Useful Links

- Ngrok Dashboard: https://dashboard.ngrok.com
- Ngrok Documentation: https://ngrok.com/docs
- Get Auth Token: https://dashboard.ngrok.com/get-started/your-authtoken
- Pricing Plans: https://ngrok.com/pricing

## 🆘 Need Help?

1. Check the Ngrok window for error messages
2. Visit https://ngrok.com/docs
3. Check ngrok status: https://status.ngrok.com
4. Review NGROK_SETUP.md for detailed instructions

## 🎉 Success Checklist

- [ ] Ngrok installed
- [ ] Auth token configured
- [ ] Ran start-with-ngrok-simple.bat
- [ ] Got public URL from Ngrok window
- [ ] Tested URL in browser
- [ ] Shared URL with others
- [ ] Others can access the site

Enjoy sharing your e-commerce platform! 🛍️
