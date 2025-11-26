# Project Structure

Complete file structure of the Real-Time Project Management Dashboard.

```
Real-Time-Project-Management/
│
├── backend/                          # Backend Server (Node.js + Express + Socket.io)
│   ├── config/
│   │   └── database.js               # MongoDB connection configuration
│   ├── models/
│   │   └── Task.js                   # Task Mongoose model/schema
│   ├── routes/
│   │   └── tasks.js                  # REST API routes for tasks
│   ├── server.js                     # Main Express server + Socket.io setup
│   ├── package.json                  # Backend dependencies
│   ├── .gitignore                    # Backend git ignore rules
│   ├── .env.example                  # Environment variables template
│   └── README.md                     # Backend-specific documentation
│
├── src/                              # Frontend Source Code (React Native + TypeScript)
│   ├── components/                   # Reusable React components
│   │   ├── TaskCard.tsx              # Individual task card component
│   │   └── TaskList.tsx              # Draggable task list component
│   ├── screens/                      # Screen components
│   │   └── Dashboard.tsx             # Main dashboard screen
│   ├── services/                     # Service layer
│   │   ├── api.ts                    # REST API client
│   │   └── socket.ts                 # Socket.io client service
│   └── types/                        # TypeScript type definitions
│       └── task.ts                   # Task interface and types
│
├── assets/                           # Static assets (images, icons)
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
│
├── App.tsx                           # Main app entry point
├── index.ts                          # Expo entry point with gesture handler
├── package.json                      # Frontend dependencies
├── tsconfig.json                     # TypeScript configuration
├── babel.config.js                   # Babel configuration (for reanimated)
├── app.json                          # Expo configuration
├── .gitignore                        # Git ignore rules
├── README.md                         # Main project documentation
├── SETUP.md                          # Quick setup guide
└── PROJECT_STRUCTURE.md              # This file
```

## Key Files Explained

### Backend

- **server.js**: Main server file that sets up Express, Socket.io, and connects to MongoDB
- **models/Task.js**: Mongoose schema defining the Task model with validation
- **routes/tasks.js**: REST API endpoints for CRUD operations on tasks
- **config/database.js**: MongoDB connection utility

### Frontend

- **App.tsx**: Root component that renders the Dashboard
- **src/screens/Dashboard.tsx**: Main screen with task management UI
- **src/components/TaskList.tsx**: Draggable list using react-native-draggable-flatlist
- **src/components/TaskCard.tsx**: Individual task display component
- **src/services/socket.ts**: Socket.io client for real-time communication
- **src/services/api.ts**: REST API client for HTTP requests
- **src/types/task.ts**: TypeScript type definitions

## Data Flow

1. **Task Creation:**
   - User creates task in Dashboard → Socket emit `createTask` → Backend saves to MongoDB → Socket broadcast `taskCreated` → All clients update

2. **Task Update:**
   - User changes status → Socket emit `updateTask` → Backend updates MongoDB → Socket broadcast `taskUpdated` → All clients update

3. **Task Reorder:**
   - User drags task → Local state updates → Socket emit `reorderTasks` → Backend updates MongoDB → Socket broadcast `tasksReordered` → All clients update

4. **Initial Load:**
   - App starts → REST API `GET /api/tasks` → Display tasks → Connect to Socket.io → Listen for real-time updates

## Technology Stack

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB
- Mongoose

### Frontend
- React Native
- Expo
- TypeScript
- Socket.io Client
- react-native-draggable-flatlist
- react-native-reanimated
- react-native-gesture-handler

