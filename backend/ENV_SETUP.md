# Environment Variables Setup

## Create .env file

Create a `.env` file in the `backend/` directory with the following content:

```env
# MongoDB Connection String
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/project-management

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration (optional - for production)
# CORS_ORIGIN=http://localhost:8081
```

## Instructions

### Windows (PowerShell)
```powershell
cd backend
New-Item -Path .env -ItemType File
# Then open .env in a text editor and paste the content above
```

### Mac/Linux
```bash
cd backend
touch .env
# Then open .env in a text editor and paste the content above
```

## MongoDB Setup Options

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/project-management`

### Option 2: MongoDB Atlas (Cloud)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Replace username, password, and cluster URL in connection string
5. Add your IP to whitelist in Atlas dashboard

## Notes

- Never commit `.env` file to git (it's in .gitignore)
- Use `.env.example` as a template for team members
- For production, use secure environment variable management

