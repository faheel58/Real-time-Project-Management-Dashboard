# Real-Time Project Management Dashboard

A production-ready real-time project management application built with React Native (Expo + TypeScript) for the frontend and Node.js + Express + Socket.io + MongoDB for the backend.

## Features

- ✅ **Real-time synchronization** - Changes sync instantly across all connected clients using Socket.io
- ✅ **Drag-and-drop reordering** - Reorder tasks with smooth animations using react-native-draggable-flatlist
- ✅ **Task management** - Create, update, and delete tasks with status tracking (To Do, In Progress, Completed)
- ✅ **RESTful API** - Complete REST API for task operations
- ✅ **Modern UI** - Clean, mobile-friendly interface with smooth animations
- ✅ **TypeScript** - Full TypeScript support for type safety
- ✅ **MongoDB** - Persistent data storage with Mongoose ODM

## Project Structure

```
Real-Time-Project-Management/
├── backend/                 # Backend server
│   ├── config/             # Configuration files
│   │   └── database.js     # MongoDB connection
│   ├── models/             # Database models
│   │   └── Task.js         # Task model
│   ├── routes/             # API routes
│   │   └── tasks.js        # Task routes
│   ├── server.js           # Express server + Socket.io
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment variables example
│
├── src/                     # Frontend source code
│   ├── components/         # React components
│   │   ├── TaskCard.tsx    # Task card component
│   │   └── TaskList.tsx    # Draggable task list
│   ├── screens/            # Screen components
│   │   └── Dashboard.tsx   # Main dashboard screen
│   ├── services/           # Services
│   │   ├── api.ts          # REST API client
│   │   └── socket.ts       # Socket.io client
│   └── types/              # TypeScript types
│       └── task.ts         # Task type definitions
│
├── App.tsx                  # Main app entry point
├── package.json            # Frontend dependencies
└── README.md               # This file
```

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Expo CLI** (installed globally: `npm install -g expo-cli`)
- **Expo Go** app on your mobile device (for testing)

## Setup Instructions

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   # Copy the example file
   # On Windows (PowerShell):
   Copy-Item .env.example .env
   
   # On Mac/Linux:
   cp .env.example .env
   ```

4. **Configure environment variables:**
   Edit `.env` and set your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/project-management
   PORT=3001
   NODE_ENV=development
   ```

   **For MongoDB Atlas (cloud):**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management
   ```

5. **Start MongoDB:**
   - **Local MongoDB:** Make sure MongoDB is running on your machine
   - **MongoDB Atlas:** No local setup needed, just use your connection string

6. **Start the backend server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

   The server should start on `http://localhost:3001`

### Frontend Setup

1. **Navigate to the project root:**
   ```bash
   cd ..  # If you're in the backend directory
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API and Socket URLs:**
   
   For **physical device testing**, you'll need to update the API and Socket URLs in:
   - `src/services/api.ts` - Change `API_URL` to your computer's local IP
   - `src/services/socket.ts` - Change `SOCKET_URL` to your computer's local IP
   
   Example:
   ```typescript
   // Find your local IP (e.g., 192.168.1.100)
   const API_URL = 'http://192.168.1.100:3001/api';
   const SOCKET_URL = 'http://192.168.1.100:3001';
   ```
   
   **To find your local IP:**
   - **Windows:** Run `ipconfig` in PowerShell, look for IPv4 Address
   - **Mac/Linux:** Run `ifconfig` or `ip addr`, look for inet address

4. **Start the Expo development server:**
   ```bash
   npm start
   ```

5. **Run on your device:**
   - Scan the QR code with Expo Go app (iOS) or Camera app (Android)
   - Or press `a` for Android emulator, `i` for iOS simulator

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks (optional query: `?status=todo|in-progress|completed`)
- `GET /api/tasks/:id` - Get a single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `PUT /api/tasks/reorder` - Reorder multiple tasks
- `DELETE /api/tasks/:id` - Delete a task

### Health Check

- `GET /health` - Server health check

## Socket.io Events

### Client → Server

- `createTask` - Create a new task
  ```javascript
  { title: string, description?: string, status?: string, order?: number }
  ```

- `updateTask` - Update a task
  ```javascript
  { id: string, title?: string, description?: string, status?: string, order?: number }
  ```

- `reorderTasks` - Reorder tasks
  ```javascript
  { tasks: [{ id: string, order: number }, ...] }
  ```

### Server → Client

- `taskCreated` - New task created
- `taskUpdated` - Task updated
- `tasksReordered` - Tasks reordered
- `error` - Error occurred

## Task Model

```javascript
{
  _id: string,
  title: string,
  description: string,
  status: 'todo' | 'in-progress' | 'completed',
  order: number,
  createdAt: Date,
  updatedAt: Date
}
```

## Development

### Backend Development

- The backend uses `nodemon` for auto-reload during development
- Run `npm run dev` to start with auto-reload
- Check console logs for connection status and errors

### Frontend Development

- Expo provides hot-reload by default
- Changes to code will automatically refresh the app
- Use React Native Debugger or Chrome DevTools for debugging

## Troubleshooting

### Backend Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running locally, or
   - Check your MongoDB Atlas connection string
   - Verify network connectivity

2. **Port Already in Use:**
   - Change `PORT` in `.env` file
   - Or kill the process using port 3001

### Frontend Issues

1. **Cannot Connect to Backend:**
   - Ensure backend server is running
   - Check API/Socket URLs match your backend server
   - For physical devices, use your computer's local IP, not `localhost`
   - Ensure your device and computer are on the same network
   - Check firewall settings

2. **Socket Connection Failed:**
   - Verify Socket.io server is running
   - Check CORS settings in `backend/server.js`
   - Ensure WebSocket connections are allowed

3. **Drag-and-Drop Not Working:**
   - Ensure `react-native-reanimated` and `react-native-gesture-handler` are properly installed
   - For Expo, these should work out of the box

## Production Deployment

### Backend

1. Set `NODE_ENV=production` in `.env`
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Configure proper CORS origins
4. Use a process manager like PM2
5. Set up SSL/HTTPS

### Frontend

1. Update API and Socket URLs to production endpoints
2. Build with `expo build` or EAS Build
3. Deploy to App Store / Google Play Store

## License

This project is open source and available for use.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.

