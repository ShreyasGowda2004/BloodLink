# Blood Donation Platform

This is a full-stack blood donation platform with separate frontend and backend directories.

## Project Structure

The project is organized into two main directories:

### Frontend (React)
- `/frontend` - Contains all frontend React code
  - `/src` - React application source code
    - `/components` - Reusable UI components
    - `/pages` - Page components
    - `/context` - React context providers
    - `/hooks` - Custom React hooks
    - `/services` - API service functions
    - `/styles` - CSS and styling files
    - `/utils` - Utility functions
  - `/public` - Static assets
  - Configuration files (vite.config.js, tailwind.config.js, etc.)

### Backend (Node.js/Express)
- `/backend` - Contains all backend server code
  - `/controllers` - Route controllers
  - `/models` - Database models
  - `/routes` - API route definitions
  - `/middleware` - Express middleware
  - `/config` - Configuration files
  - `/services` - Backend services
  - `index.js` - Main server entry point

## Setup Instructions

### Installing Dependencies

```bash
# Install all dependencies (root, frontend, and backend)
npm run install:all

# Or install individually
npm run install:frontend
npm run install:backend
```

### Running the Application

```bash
# Start both frontend and backend
npm start

# Start frontend only
npm run start:frontend

# Start backend only
npm run start:backend
```

### Building for Production

```bash
# Build the frontend
npm run build
```

## Environment Variables

Make sure to set up the following environment variables in your `.env` file:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
``` 