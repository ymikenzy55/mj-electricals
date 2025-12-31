# Ngrok Setup Guide

## What is Ngrok?
Ngrok creates a secure tunnel to your localhost, allowing others to access your local server via a public URL.

## Installation Steps

### Option 1: Download Ngrok (Recommended)
1. Visit https://ngrok.com/download
2. Download the Windows version
3. Extract the `ngrok.exe` file to this project folder
4. Sign up for a free account at https://dashboard.ngrok.com/signup
5. Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken
6. Run: `ngrok config add-authtoken YOUR_AUTH_TOKEN`

### Option 2: Using Chocolatey
```bash
choco install ngrok
```

### Option 3: Using npm (Global)
```bash
npm install -g ngrok
```

## Quick Start

### Step 1: Start Your Servers
Run the batch file:
```bash
start-servers-ngrok.bat
```

This will:
- Start the backend server on port 5000
- Start the frontend server on port 8000
- Create an ngrok tunnel for the frontend (port 8000)
- Display the public URL

### Step 2: Share the URL
The script will display a public URL like:
```
https://abc123.ngrok-free.app
```

Share this URL with others to let them access your site!

## Important Notes

1. **Free Tier Limitations:**
   - URL changes each time you restart ngrok
   - Session timeout after 2 hours
   - Limited to 1 online ngrok process
   - Warning page before accessing site (users click "Visit Site")

2. **Update API URL:**
   - The frontend needs to know the backend URL
   - We'll use environment detection to handle this automatically

3. **Firewall:**
   - Ngrok handles all firewall/router issues
   - No port forwarding needed

## Manual Commands

If you want to run ngrok manually:

```bash
# For frontend only
ngrok http 8000

# For backend only
ngrok http 5000

# For both (requires paid plan or two terminals)
ngrok http 8000
ngrok http 5000
```

## Troubleshooting

**Error: "command not found"**
- Ngrok is not installed or not in PATH
- Try placing ngrok.exe in this project folder

**Error: "authtoken required"**
- Run: `ngrok config add-authtoken YOUR_TOKEN`
- Get token from: https://dashboard.ngrok.com/get-started/your-authtoken

**Error: "tunnel already running"**
- Only one ngrok tunnel allowed on free tier
- Stop other ngrok processes first

**Site shows warning page:**
- This is normal for free ngrok
- Users just click "Visit Site" to continue
