# Quick Setup Guide

## Prerequisites Checklist

- [ ] Node.js (v16+) installed
- [ ] MongoDB installed locally OR MongoDB Atlas account
- [ ] Expo CLI installed globally (`npm install -g expo-cli`)
- [ ] Expo Go app installed on your mobile device

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy the content below)
# Windows PowerShell:
New-Item -Path .env -ItemType File
# Then edit .env with the content below

# Mac/Linux:
touch .env
# Then edit .env with the content below
```

**Backend .env file content:**
```env
MONGODB_URI=mongodb://localhost:27017/project-management
PORT=3001
NODE_ENV=development
```

**Start MongoDB:**
- **Windows:** Open MongoDB Compass or start MongoDB service
- **Mac:** `brew services start mongodb-community` (if installed via Homebrew)
- **Linux:** `sudo systemctl start mongod`
- **MongoDB Atlas:** No local setup needed, just use your connection string

**Start backend server:**
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 3001
📡 Socket.io server ready
```

### 2. Frontend Setup

```bash
# Navigate to project root (if you're in backend, go up one level)
cd ..

# Install dependencies
npm install

# Find your local IP address (for physical device testing)
# Windows: Run `ipconfig` in PowerShell, look for "IPv4 Address"
# Mac/Linux: Run `ifconfig` or `ip addr`, look for "inet"
```

**Update API URLs for physical device:**

Edit `src/services/api.ts`:
```typescript
const API_URL = 'http://YOUR_LOCAL_IP:3001/api';
// Example: 'http://192.168.1.100:3001/api'
```

Edit `src/services/socket.ts`:
```typescript
const SOCKET_URL = 'http://YOUR_LOCAL_IP:3001';
// Example: 'http://192.168.1.100:3001'
```

**Start Expo:**
```bash
npm start
```

**Run on device:**
- Scan QR code with Expo Go (iOS) or Camera (Android)
- Or press `a` for Android emulator, `i` for iOS simulator

## Testing the Connection

1. **Backend health check:**
   - Open browser: `http://localhost:3001/health`
   - Should return: `{"success":true,"message":"Server is running",...}`

2. **Frontend connection:**
   - Open app on device/emulator
   - Check console for: `✅ Socket connected: [socket-id]`
   - Try creating a task - it should appear in real-time

## Common Issues

### "Cannot connect to backend"
- ✅ Ensure backend is running on port 3001
- ✅ For physical devices, use your computer's local IP (not localhost)
- ✅ Ensure device and computer are on the same WiFi network
- ✅ Check firewall settings

### "MongoDB connection error"
- ✅ Ensure MongoDB is running
- ✅ Check connection string in `.env`
- ✅ For MongoDB Atlas, ensure IP whitelist includes your IP

### "Socket connection failed"
- ✅ Backend must be running before starting frontend
- ✅ Check CORS settings in `backend/server.js`
- ✅ Verify Socket.io server is initialized

## Next Steps

- Create your first task using the + button
- Try drag-and-drop reordering
- Open the app on multiple devices to see real-time sync
- Check the main README.md for API documentation

