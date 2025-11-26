# Backend Server

Express + Socket.io + MongoDB backend for Real-Time Project Management Dashboard.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   ```

3. **Edit `.env` file:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/project-management
   PORT=3001
   NODE_ENV=development
   ```

4. **Start MongoDB** (if using local MongoDB)

5. **Run the server:**
   ```bash
   # Development (with auto-reload)
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string (required)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - CORS allowed origin (optional, defaults to *)

## API Documentation

See main README.md for complete API documentation.

