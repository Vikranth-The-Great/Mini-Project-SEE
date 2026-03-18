# Food Waste Management System (MERN)

A modern full-stack web application for managing food donations and waste reduction.

## Stack

- MongoDB
- Express.js
- React.js (Vite)
- Node.js

## Project Structure

- `server/` - Express API, MongoDB models, JWT auth, role-based routes
- `client/` - React frontend for User, Admin, and Delivery roles

## Prerequisites

Before running the project, ensure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

## Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/Magalachetankumar/Waste-food-management-system.git
cd Waste-food-management-system
```

### Step 2: Install Root Dependencies
```bash
npm install
npm run install:all
```
This installs dependencies for both the root, server, and client folders.

### Step 3: Configure Environment Variables

#### Server Configuration
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and configure your settings:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/food_waste_management
   PORT=5000
   JWT_SECRET=your_secret_key_here
   ```

4. Return to root:
   ```bash
   cd ..
   ```

### Step 4: Start MongoDB
Start MongoDB locally (ensure it's running):
```bash
# On Windows:
mongod

# On macOS (if installed via Homebrew):
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

Verify MongoDB is running on `mongodb://127.0.0.1:27017/`

## Running the Project

### Option 1: Run Frontend + Backend Together
From the root directory:
```bash
npm run dev
```

This will:
- Start the backend API on `http://localhost:5000`
- Start the frontend on `http://localhost:5173`

### Option 2: Run Separately (for debugging)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

## Accessing the Application

Once both servers are running:

1. **Frontend:** Open your browser and go to:
   ```
   http://localhost:5173
   ```

2. **Backend API:** Available at:
   ```
   http://localhost:5000
   ```

## Testing the Features

### User Features
1. Sign up as a regular user
2. Browse food donations
3. Post a food donation
4. Track delivery status

### Admin Features
1. Sign up as admin
2. Access admin dashboard
3. View all donations and analytics
4. Manage users and feedback

### Delivery Person Features
1. Sign up as delivery person
2. View available orders
3. Accept and track orders
4. Update delivery status
5. Open map for directions

## Building for Production

To create a production build of the frontend:
```bash
cd client
npm run build
# Creates optimized build in dist/ folder
```

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run test` - Run backend tests
- `cd server && npm run dev` - Start backend only
- `cd client && npm run dev` - Start frontend only
- `cd client && npm run build` - Build frontend for production

## API Highlights

- User auth: `/api/auth/*`
- Admin auth: `/api/admin/auth/*`
- Delivery auth: `/api/delivery/auth/*`
- Donations: `/api/donations/*`
- Feedback: `/api/feedback/*`
- Analytics: `/api/analytics`

## Features

- User authentication and profile management
- Food donation listing and tracking
- Admin dashboard with analytics
- Delivery person management and order tracking
- Real-time notifications
- Multi-language support (English, Hindi, Kannada)
- Role-based access control (User, Admin, Delivery)

