# Patient Portal for Booking & Viewing Lab Tests

## Overview
This project is a full-stack web application for patients to register, log in, book lab tests, and view their bookings and reports. It features a modern React frontend and a Node.js/Express backend with MongoDB for data storage.

### Features
- User registration and login (with JWT authentication)  
- Browse and search lab tests  
- Book lab tests with date and time selection  
- View and manage bookings  
- Responsive, modern UI  

## Approach  
- **Frontend:** Built with React and React Router for SPA navigation. Uses environment variables for backend URL configuration. All navigation is handled with React Router's `useNavigate` for a seamless experience.  
- **Backend:** Node.js/Express REST API with MongoDB. Authentication is handled with JWT and cookies. API endpoints are RESTful and return JSON.  
- **Styling:** Clean, modern CSS with custom styles for forms, modals, and icons.  

## Setup Instructions

### Prerequisites  
- Node.js and npm installed  
- MongoDB running locally or a connection string for Atlas  

### Backend Setup  
1. Navigate to the `Backend` folder:  
   ```
   cd Backend
   ```
2. Install dependencies:  
   ```
   npm install
   ```
3. Create a `.env` file in the `Backend` folder with:  
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```
4. Start the backend server:  
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the `Frontend` folder:  
   ```
   cd Frontend
   ```
2. Install dependencies:  
   ```
   npm install
   ```
3. Create a `.env` file in the `Frontend` folder with:  
   ```
   VITE_BACKEND_URL=http://localhost:3000
   ```
4. Start the frontend dev server:
   ```
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) in your browser (or the port shown in your terminal).  

## API Endpoints

### Auth
- `POST /api/auth/signup` — Register a new user  
- `POST /api/auth/login` — Login and receive JWT token  
- `POST /api/auth/logout` — Logout user  
- `GET /api/auth/profile` — Get current user profile (requires auth)  

### Lab Tests  
- `GET /api/tests` — Get all available lab tests  

### Bookings  
- `POST /api/bookings` — Book a test (requires auth)  
- `GET /api/bookings` — Get all bookings for the logged-in user  

### Reports  
- `GET /api/reports/:bookingId` — Get report for a specific booking (if available)  

## Notes  
- All protected routes require the JWT token (sent via cookies or Authorization header).  
- The frontend uses the backend URL from the `.env` file for all API requests.  
- For custom icon colors in date/time pickers, see the CSS in `LabTestCatalog.css`.  

---
**Developed by:** Mannat Garg  
**Deployed Frontend Link:** [Click here](https://mannat-skvap-assignment.netlify.app/)  
**Deployed Backend Link:** [Click here](https://patient-portal-for-booking-viewing-lab.onrender.com)
