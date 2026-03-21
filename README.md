# Food Waste Management System (MERN Monorepo)

A full-stack food donation platform with web, mobile, and backend services.

## Tech Stack

- MongoDB
- Express.js
- React (Vite)
- React Native (Expo)
- Node.js

## Repository Structure

- `server/` - Express API, MongoDB models, auth, role-based routes
- `client/` - Web frontend (React + Vite)
- `apps/mobile/` - Mobile frontend (React Native + Expo)
- `packages/shared/` - Shared constants, types, and utilities

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB 4.4+
- Git

## Installation

1. Clone and enter the project:

```bash
git clone https://github.com/Magalachetankumar/Waste-food-management-system.git
cd Waste-food-management-system
```

2. Install all dependencies:

```bash
npm install
npm run install:all
```

## Environment Setup

1. Create server environment file:

- Windows PowerShell:

```powershell
Copy-Item server/.env.example server/.env
```

- macOS/Linux:

```bash
cp server/.env.example server/.env
```

2. Update values in `server/.env` (minimum required):

```env
MONGODB_URI=mongodb://127.0.0.1:27017/food_waste_management
PORT=5000
JWT_SECRET=change_this_to_a_secure_secret
JWT_EXPIRES_IN=7d
```

3. For mobile app backend URL, update `apps/mobile/src/config/env.ts` with your local machine IP when testing on a real device.

## Run MongoDB

- Windows:

```bash
mongod
```

- macOS (Homebrew):

```bash
brew services start mongodb-community
```

- Linux:

```bash
sudo systemctl start mongod
```

## Run the Project

From the root folder:

- Web + Server:

```bash
npm run dev
```

- Web only:

```bash
npm run dev:web
```

- Server only:

```bash
npm run dev:server
```

- Mobile (Expo):

```bash
npm run dev:mobile
```

- Server + Web + Mobile together:

```bash
npm run dev:all
```

## Default Local URLs

- Web app: http://localhost:5173
- API server: http://localhost:5000

## Tests

Run backend tests:

```bash
npm run test
```

## Build

- Build web app:

```bash
npm run build:web
```

- Build Android app (Expo EAS):

```bash
npm run build:mobile
```

## Main API Groups

- User auth: `/api/auth/*`
- Admin auth: `/api/admin/auth/*`
- Delivery auth: `/api/delivery/auth/*`
- Donations: `/api/donations/*`
- Feedback: `/api/feedback/*`
- Notifications: `/api/notifications/*`
- Analytics: `/api/analytics`

## Core Features

- User, Admin, and Delivery role workflows
- Food donation creation and tracking lifecycle
- Admin dashboard analytics
- Real-time notifications
- Multilingual web interface (English, Hindi, Kannada)
- Shared types/constants for cross-app consistency

