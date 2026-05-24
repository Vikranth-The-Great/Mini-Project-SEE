# Food Waste Management System

## Overview

Food Waste Management System is a full-stack MERN monorepo for coordinating surplus food donations between three operational roles:

- Donors/User
- NGO Partner/Admin
- Delivery Partner/Volunteer

The current codebase is not browser-only. It contains:

- A React + Vite frontend in `client/`
- A Node.js + Express + MongoDB backend in `server/`
- Shared constants, utilities, and types in `packages/shared/`
- Jest + Supertest backend tests in `server/tests/`

The platform supports donation posting, NGO claiming, volunteer pickup, delivery completion, analytics, notifications, food-availability discovery, and a public system-admin monitoring dashboard.

## Current Tech Stack

### Frontend

- React 19
- React Router DOM 6
- Vite 5
- Axios
- i18next
- Chart.js with `react-chartjs-2`
- Leaflet
- Socket.IO client
- Tailwind/PostCSS configured, with most UI styled through `client/src/index.css`

### Backend

- Node.js
- Express 4
- MongoDB with Mongoose 7
- JWT authentication
- bcryptjs password hashing
- Socket.IO

### Testing

- Jest
- Supertest
- mongodb-memory-server

## Monorepo Structure

- `client/` React web frontend
- `server/` Express API, MongoDB models, auth middleware, Socket.IO, tests
- `packages/shared/` reusable constants, helpers, and TypeScript types
- `apps/server/` legacy env example only, not the active backend

## Runtime Architecture

### Frontend runtime

- `client/src/main.jsx` mounts the app.
- `client/src/App.jsx` defines all public and protected routes.
- `client/src/context/AuthContext.jsx` stores role-based auth state in `localStorage`.
- Vite proxies `/api` requests to `http://localhost:5000`.

### Backend runtime

- `server/index.js` loads env vars, connects MongoDB, creates the HTTP server, and initializes Socket.IO.
- `server/app.js` configures CORS, JSON parsing, and all API route groups.
- `server/socket.js` authenticates socket connections and joins users to role- and identity-specific rooms.

### Data flow

1. A role signs in and receives a JWT.
2. The frontend stores the token in `localStorage`.
3. Protected API calls send `Authorization: Bearer <token>`.
4. Express middleware validates the token and role.
5. MongoDB stores users, admins, delivery partners, donations, notifications, feedback, and admin activity events.
6. Important lifecycle events also emit realtime Socket.IO notifications.

## Roles and Capabilities

### 1. Donor / User

The donor can:

- Sign up and sign in
- Submit food donations
- Attach phone number, address, location, latitude, and longitude
- View personal donation history
- Track lifecycle state of each donation
- Read notifications when an NGO claims, a volunteer picks up, and a delivery is completed

Main client pages:

- `client/src/pages/user/UserSignup.jsx`
- `client/src/pages/user/UserLogin.jsx`
- `client/src/pages/user/DonateForm.jsx`
- `client/src/pages/user/UserProfile.jsx`
- `client/src/pages/user/DeliveryConfirm.jsx`

Main backend endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/donations`
- `POST /api/donations/recommendations/preview`
- `GET /api/donations/my`
- `GET /api/notifications/my`
- `PUT /api/notifications/read-all`

### 2. NGO Partner / Admin

The NGO/Admin role can:

- Register and sign in
- View nearby and urgent available donations
- Claim donations
- Track all donations assigned to that NGO
- Search donations by area/location
- View analytics dashboards
- View role notifications
- Review user feedback

Important note:

- The UI now uses NGO naming as the primary experience.
- Admin naming is still supported as a compatibility alias in both frontend routes and backend APIs.

Main client pages:

- `client/src/pages/admin/AdminSignup.jsx`
- `client/src/pages/admin/AdminLogin.jsx`
- `client/src/pages/admin/AdminDashboard.jsx`
- `client/src/pages/admin/AdminProfile.jsx`
- `client/src/pages/admin/DonatePage.jsx`
- `client/src/pages/admin/Analytics.jsx`
- `client/src/pages/admin/AdminNotifications.jsx`
- `client/src/pages/admin/AdminFeedback.jsx`

Main backend endpoints:

- `POST /api/ngo/auth/register`
- `POST /api/ngo/auth/login`
- `GET /api/ngo/auth/me`
- `POST /api/admin/auth/register` alias
- `POST /api/admin/auth/login` alias
- `GET /api/admin/auth/me` alias
- `GET /api/donations/available-ngo`
- `GET /api/donations/available-admin` alias
- `GET /api/donations/by-location`
- `GET /api/donations/ngo-assigned`
- `GET /api/donations/admin-assigned` alias
- `GET /api/donations/ngo-tracking`
- `GET /api/donations/admin-tracking` alias
- `PUT /api/donations/:id/assign`
- `GET /api/analytics`
- `GET /api/analytics/environment-impact`
- `GET /api/feedback`
- `GET /api/notifications/my`
- `PUT /api/notifications/read-all`

### 3. Delivery Partner / Volunteer

The delivery role can:

- Register and sign in
- View claimed donations waiting for pickup
- Accept a pickup
- See assigned orders
- Mark an order as placed/delivered
- View an optimized route map for active deliveries
- View delivery notifications

Main client pages:

- `client/src/pages/delivery/DeliverySignup.jsx`
- `client/src/pages/delivery/DeliveryLogin.jsx`
- `client/src/pages/delivery/DeliveryDashboard.jsx`
- `client/src/pages/delivery/MyOrders.jsx`
- `client/src/pages/delivery/OpenMap.jsx`
- `client/src/pages/delivery/DeliveryNotifications.jsx`

Main backend endpoints:

- `POST /api/delivery/auth/register`
- `POST /api/delivery/auth/login`
- `GET /api/delivery/auth/me`
- `GET /api/donations/available-delivery`
- `GET /api/donations/my-deliveries`
- `GET /api/donations/my-deliveries/optimized-route`
- `PUT /api/donations/:id/take`
- `PUT /api/donations/:id/place`
- `GET /api/notifications/my`
- `PUT /api/notifications/read-all`

### 4. Public / System Admin Monitor

There is also a public read-only monitoring experience.

It provides:

- Total active, claimed, in-transit, delivered, and expired counts
- A live activity feed
- A live food tracking table

Main client page:

- `client/src/pages/systemAdmin/SystemAdminDashboard.jsx`

Main backend endpoint:

- `GET /api/system-admin/dashboard`

This endpoint is intentionally public in the current implementation.

## Frontend Route Map

### Public routes

- `/` landing page with role selection
- `/preview/user-home` public preview of user home
- `/about`
- `/contact`
- `/find-food`
- `/system-admin`

### Donor routes

- `/signin`
- `/signup`
- `/home`
- `/profile`
- `/donate`
- `/delivery-confirm`

### NGO routes

- `/ngo/signin`
- `/ngo/signup`
- `/ngo`
- `/ngo/profile`
- `/ngo/analytics`
- `/ngo/donate`
- `/ngo/feedback`
- `/ngo/notifications`

### Compatibility admin aliases

- `/admin/signin` -> redirects to `/ngo/signin`
- `/admin/signup` -> redirects to `/ngo/signup`
- `/admin` -> redirects to `/ngo`
- `/admin/profile` -> redirects to `/ngo/profile`
- `/admin/analytics` -> redirects to `/ngo/analytics`
- `/admin/donate` -> redirects to `/ngo/donate`
- `/admin/feedback` -> redirects to `/ngo/feedback`
- `/admin/notifications` -> redirects to `/ngo/notifications`

### Delivery routes

- `/delivery/login`
- `/delivery/signup`
- `/delivery`
- `/delivery/my-orders`
- `/delivery/map`
- `/delivery/notifications`

## Backend Route Map

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/ngo/auth/register`
- `POST /api/ngo/auth/login`
- `GET /api/ngo/auth/me`
- `POST /api/admin/auth/register`
- `POST /api/admin/auth/login`
- `GET /api/admin/auth/me`
- `POST /api/delivery/auth/register`
- `POST /api/delivery/auth/login`
- `GET /api/delivery/auth/me`

### Donations

- `POST /api/donations`
- `POST /api/donations/recommendations/preview`
- `GET /api/donations/my`
- `GET /api/donations/available-ngo`
- `GET /api/donations/available-admin`
- `GET /api/donations/by-location?location=<area>`
- `GET /api/donations/ngo-assigned`
- `GET /api/donations/admin-assigned`
- `GET /api/donations/ngo-tracking`
- `GET /api/donations/admin-tracking`
- `PUT /api/donations/:id/assign`
- `GET /api/donations/available-delivery`
- `GET /api/donations/my-deliveries`
- `GET /api/donations/my-deliveries/optimized-route`
- `PUT /api/donations/:id/take`
- `PUT /api/donations/:id/place`

### Notifications

- `GET /api/notifications/my`
- `PUT /api/notifications/:id/read`
- `PUT /api/notifications/read-all`

### Feedback

- `POST /api/feedback`
- `GET /api/feedback`

### Analytics

- `GET /api/analytics`
- `GET /api/analytics/environment-impact`

### Public food availability

- `GET /api/ngos/food-availability`

### System admin

- `GET /api/system-admin/dashboard`

## Core Donation Lifecycle

The central workflow currently implemented is:

1. Donor registers or logs in.
2. Donor creates a donation.
3. Donation is stored with status `Posted`.
4. Nearby/relevant NGOs receive notifications.
5. NGO claims the donation.
6. Donation status becomes `Assigned`.
7. Delivery partners are notified that a pickup is available.
8. A delivery partner accepts the pickup.
9. Donation status becomes `In Transit`.
10. Delivery partner marks the order as placed.
11. Donation status becomes `Delivered`.
12. Distribution metadata is created for public food-availability discovery.

The schema still allows `Completed`, but the current main UI/API flow stops at `Delivered`.

## Current Business Logic and Rules

### Authentication and authorization

- JWT payload includes `id` and `role`
- `protect` validates any authenticated token
- `protectAdmin` restricts NGO/Admin-only routes
- `protectDelivery` restricts volunteer-only routes
- Donor notification routes currently use `protect`, which works because donor tokens use role `user`

### Registration validation

- Name minimum length: 3
- Password minimum length: 6
- Phone number must be exactly 10 digits
- User requires gender and location
- NGO requires address and location
- Delivery partner requires city
- Duplicate email is rejected per role collection

### Donation validation

- Required: `food`, `type`, `category`, `quantity`, `expiryDate`, `expiryTime`, `location`, `address`, `phoneno`
- `type` must be `veg` or `non-veg`
- `category` must be one of:
  - `raw-food`
  - `cooked-food`
  - `packed-food`
- Phone must be 10 digits
- Quantity must be numeric and greater than 0
- Quantity cannot exceed 10 kg in the current implementation
- Latitude must be between `-90` and `90`
- Longitude must be between `-180` and `180`
- Expiry date/time must be in the future
- Duplicate submissions within a 2-minute window are blocked

### Claim and delivery protections

- NGOs can only claim donations that are:
  - still unassigned
  - not taken by a delivery partner
  - not already delivered
  - not expired
- Delivery partners cannot take unassigned food
- Delivery partners cannot take expired food
- Delivery partners can only pick donations in `Assigned` state
- Delivery partners can only deliver donations they personally accepted
- Delivery partners can only mark `In Transit` orders as delivered

### Priority logic for NGOs

Available NGO donations are enriched with dynamic urgency:

- `High` priority: less than 2 hours to expiry
- `Medium` priority: less than 6 hours to expiry
- `Low` priority: otherwise

NGO dashboards display urgent donations first.

### NGO recommendation logic

When a donor creates a donation, the backend ranks NGOs using:

- same-city or nearby eligibility
- donor/NGO coordinate distance
- NGO active donation load
- urgency based on time remaining before expiry

The API returns:

- `recommendedNgo` on successful donation creation
- top ranked NGO recommendations on preview
- `score`
- `scoreBreakdown`
- `distanceKm`
- `activeDonations`
- `hoursToExpiry`

### Delivery route optimization

The backend exposes optimized route sequencing for active delivery orders:

- accepts optional live start coordinates
- orders coordinate-valid stops using nearest-next logic
- returns unroutable orders separately when coordinates are missing
- returns `mapPath` and `totalDistanceKm`

## Public Food Availability Flow

The public `Find Food` page uses `GET /api/ngos/food-availability`.

An NGO appears on the map only when:

- the donation status is `Delivered`
- `assignedTo` exists
- `remainingMeals` is greater than 0
- coordinates exist
- current time is inside the donation distribution window

This is derived from delivered donations, not a separate NGO availability table.

## Realtime Notifications

Realtime notifications are active through Socket.IO.

### Socket behavior

- Server runs Socket.IO on the same server as Express
- Client connects to `http://localhost:5000`
- Socket auth uses the same JWT token used for HTTP requests

### Socket rooms

- `role:<role>`
- `<role>:<id>`
- `admin-location:<normalized location>`
- `delivery-city:<normalized city>`

### Notification triggers currently implemented

- New donation created -> nearby NGOs
- Donation claimed -> donor + delivery partners
- Delivery accepted -> assigned NGO + donor
- Donation delivered -> donor

### Notification persistence

Notifications are also stored in MongoDB, not just emitted live.

Roles can:

- fetch notifications
- mark one as read
- mark all as read

## Analytics

The NGO analytics dashboard currently exposes:

- total users
- total feedbacks
- total donations
- total delivered orders
- total pending orders
- most donated food category
- gender stats for users
- donations by location
- donations per day
- category distribution
- delivery success rate over time
- environmental impact

### Environmental impact calculations

The backend estimates:

- `totalFoodSavedKg`
- `totalCo2PreventedKg`
- `mealsServedEquivalent`

The logic converts quantities heuristically from values such as:

- kg
- grams
- mg
- tons
- plates
- meals
- packs
- packets
- boxes
- pieces

## Data Models

### `User`

File: `server/models/User.js`

Fields:

- `name`
- `email`
- `password`
- `gender`
- `phoneno`
- `location`

Notes:

- Password is hashed with bcrypt before save.
- Email is unique.

### `Admin`

File: `server/models/Admin.js`

Fields:

- `name`
- `email`
- `password`
- `phoneno`
- `address`
- `location`

Notes:

- This model represents NGO partners.
- Password is hashed with bcrypt before save.

### `DeliveryPerson`

File: `server/models/DeliveryPerson.js`

Fields:

- `name`
- `email`
- `password`
- `phoneno`
- `city`

Notes:

- Password is hashed with bcrypt before save.

### `FoodDonation`

File: `server/models/FoodDonation.js`

Fields:

- `donorName`
- `donorEmail`
- `phoneno`
- `food`
- `type`
- `category`
- `quantity`
- `expiryDate`
- `expiryTime`
- `location`
- `address`
- `latitude`
- `longitude`
- `assignedTo`
- `deliveryBy`
- `deliveredAt`
- `remainingMeals`
- `distributedMeals`
- `distributionStartTime`
- `distributionEndTime`
- `status`
- timestamps

Status enum:

- `Posted`
- `Assigned`
- `In Transit`
- `Delivered`
- `Completed`

### `Notification`

File: `server/models/Notification.js`

Purpose:

- persistent role-based notifications for donors, NGOs, and delivery partners

Important fields:

- `recipientRole`
- `recipientId`
- `donationId`
- `type`
- `message`
- `isRead`
- `createdAt`

### `Feedback`

File: `server/models/Feedback.js`

Purpose:

- stores public contact/feedback form submissions

### `AdminActivityEvent`

File: `server/models/AdminActivityEvent.js`

Purpose:

- powers the public system-admin activity feed

Event types:

- `FOOD_POSTED`
- `FOOD_CLAIMED`
- `VOLUNTEER_ASSIGNED`
- `FOOD_PICKED`
- `FOOD_DELIVERED`
- `FOOD_EXPIRED`

## Major Frontend Features

### Landing experience

- Role-based landing page
- Direct entry for User, NGO Partner, Volunteer
- Quick access link to system-admin dashboard
- CTA to public food-availability map

### Internationalization

Languages currently present:

- English
- Hindi
- Kannada

Files:

- `client/src/i18n/en.json`
- `client/src/i18n/hi.json`
- `client/src/i18n/kn.json`

### Location-assisted flows

`LocationAssistant` is reused in:

- donor food donation form
- NGO signup
- NGO location search
- delivery signup

It supports:

- browser geolocation
- Leaflet map click selection
- reverse geocoding using OpenStreetMap Nominatim
- auto-filling area/address fields

### Maps

Leaflet is used in:

- `FindFood` public map of active NGO distribution spots
- `OpenMap` optimized route map for delivery partners
- `LocationAssistant` location capture widget

### Chatbot

`client/src/components/Chatbot.jsx` provides:

- a simple rule-based FAQ assistant
- canned responses for common platform questions
- speech synthesis text-to-speech for bot replies

It is currently used on:

- `HomePage`
- `ContactPage`

### Realtime toast panel

`client/src/components/RealTimeNotificationPanel.jsx` displays live toast notifications for the currently authenticated role.

## Shared Package

`packages/shared/` still exists and contains reusable constants/types:

### Constants

- `apiRoutes.ts`
- `roles.ts`
- `donationStatus.ts`
- `fieldNames.ts`
- `errors.ts`

### Utilities

- `validation.ts`
- `formatters.ts`
- `errorParsing.ts`

### Types

- `auth.ts`
- `donation.ts`
- `notification.ts`

The shared package is not the main source of runtime behavior, but it remains part of the repo and workspace layout.

## Scripts

Root `package.json` scripts:

- `npm run install:all`
- `npm run dev`
- `npm run dev:web`
- `npm run dev:server`
- `npm run dev:all`
- `npm run build:web`
- `npm run test:server`
- `npm run test`

Client scripts:

- `npm run dev --prefix client`
- `npm run build --prefix client`
- `npm run preview --prefix client`

Server scripts:

- `npm run start --prefix server`
- `npm run dev --prefix server`
- `npm run test --prefix server`

## Environment Setup

### Active backend env file

The active backend expects `server/.env`.

Current example file:

- `server/.env.example`

Expected variables used by the active backend:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `NODE_ENV`

### Important note

There is also `apps/server/.env.example`, but it is legacy/misaligned with the active server code.

Differences:

- active backend code reads `MONGO_URI`
- legacy example file uses `MONGODB_URI`

For the current running backend, `MONGO_URI` is the correct key.

### Local development defaults

- Frontend: `http://localhost:5173`
- Backend/API: `http://localhost:5000`
- Socket.IO: same backend server on port `5000`

## Testing Status in Repo

Backend automated tests currently cover:

- full donation lifecycle
- notification creation across roles
- NGO recommendation preview scoring
- NGO donation priority ordering
- delivery optimized routing
- analytics dashboard metrics
- environment impact calculations
- role authorization rules
- NGO/admin auth alias compatibility

Test files:

- `server/tests/donation.lifecycle.test.js`
- `server/tests/analytics.dashboard.test.js`
- `server/tests/authorization.roles.test.js`

## Important Files

### Root

- `package.json`
- `README.md`
- `PROJECT.md`

### Frontend core

- `client/src/App.jsx`
- `client/src/context/AuthContext.jsx`
- `client/src/index.css`
- `client/vite.config.js`

### Frontend donor flow

- `client/src/pages/user/UserSignup.jsx`
- `client/src/pages/user/UserLogin.jsx`
- `client/src/pages/user/DonateForm.jsx`
- `client/src/pages/user/UserProfile.jsx`

### Frontend NGO flow

- `client/src/pages/admin/AdminSignup.jsx`
- `client/src/pages/admin/AdminLogin.jsx`
- `client/src/pages/admin/AdminDashboard.jsx`
- `client/src/pages/admin/AdminProfile.jsx`
- `client/src/pages/admin/DonatePage.jsx`
- `client/src/pages/admin/Analytics.jsx`
- `client/src/pages/admin/AdminNotifications.jsx`
- `client/src/pages/admin/AdminFeedback.jsx`

### Frontend delivery flow

- `client/src/pages/delivery/DeliverySignup.jsx`
- `client/src/pages/delivery/DeliveryLogin.jsx`
- `client/src/pages/delivery/DeliveryDashboard.jsx`
- `client/src/pages/delivery/MyOrders.jsx`
- `client/src/pages/delivery/OpenMap.jsx`
- `client/src/pages/delivery/DeliveryNotifications.jsx`

### Frontend public/admin monitoring

- `client/src/pages/IndexPage.jsx`
- `client/src/pages/FindFood.jsx`
- `client/src/pages/systemAdmin/SystemAdminDashboard.jsx`
- `client/src/components/LocationAssistant.jsx`
- `client/src/components/RealTimeNotificationPanel.jsx`
- `client/src/components/Chatbot.jsx`
- `client/src/components/LanguageSwitcher.jsx`

### Backend core

- `server/index.js`
- `server/app.js`
- `server/config/db.js`
- `server/socket.js`
- `server/middleware/auth.js`

### Backend routes

- `server/routes/auth.js`
- `server/routes/adminAuth.js`
- `server/routes/deliveryAuth.js`
- `server/routes/donations.js`
- `server/routes/notifications.js`
- `server/routes/feedback.js`
- `server/routes/analytics.js`
- `server/routes/ngos.js`
- `server/routes/systemAdmin.js`

### Backend models

- `server/models/User.js`
- `server/models/Admin.js`
- `server/models/DeliveryPerson.js`
- `server/models/FoodDonation.js`
- `server/models/Notification.js`
- `server/models/Feedback.js`
- `server/models/AdminActivityEvent.js`

## Current Project State

As of the current codebase:

- Admin login is implemented and active through the NGO-auth flow.
- NGO naming is primary, with admin aliases preserved for compatibility.
- The backend is active and required for normal operation.
- MongoDB is required for persistent data.
- Socket.IO notifications are implemented.
- Public food discovery is implemented through active NGO distribution windows.
- Public system-admin monitoring is implemented.
- Delivery route optimization is implemented.
- Backend tests exist and cover the main lifecycle and analytics behavior.

## Summary

This repository currently represents a working full-stack food donation platform with:

- donor registration and food posting
- NGO/admin claiming and tracking
- volunteer pickup and delivery completion
- realtime and persistent notifications
- analytics and environmental impact reporting
- public free-food discovery
- a read-only live system-admin dashboard
- location-aware workflows with maps and reverse geocoding

This document reflects the code currently present in the repository as of now, including the newer admin login / NGO auth flow and the public system-admin monitoring features.
