# MongoDB Setup Instructions

## The application requires MongoDB to be running for full functionality.

### Error Message:
If you see errors like:
- `Error connecting to MongoDB: connect ECONNREFUSED`
- `Operation buffering timed out after 10000ms`

This means MongoDB is not running.

## How to Start MongoDB:

### Option 1: If MongoDB is installed as a Windows Service
1. Open Services (Win + R, type `services.msc`)
2. Find "MongoDB" service
3. Right-click and select "Start"

### Option 2: Start MongoDB manually
1. Open Command Prompt or PowerShell as Administrator
2. Navigate to MongoDB bin directory (usually `C:\Program Files\MongoDB\Server\<version>\bin`)
3. Run: `mongod`

### Option 3: Using MongoDB Compass
- If you have MongoDB Compass installed, it usually starts MongoDB automatically

### Option 4: Check if MongoDB is already running
```powershell
# Check if MongoDB is running on default port
netstat -an | findstr 27017
```

## After Starting MongoDB:

1. Restart your Node.js server:
   ```powershell
   npm run dev
   ```

2. You should see: `MongoDB Connected: localhost`

3. Seed the database with sample products:
   ```powershell
   npm run seed
   ```

## Verify MongoDB is Working:

Visit: `http://localhost:3005/products`

You should see products listed (after seeding) instead of error messages.

## Troubleshooting:

- **Port 27017 already in use**: Another MongoDB instance might be running
- **Permission denied**: Run Command Prompt as Administrator
- **MongoDB not installed**: Download from https://www.mongodb.com/try/download/community

