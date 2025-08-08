
# Book Review Platform

A full-stack MERN application for managing books and user reviews, featuring secure authentication, filtering, pagination, and a responsive UI.
Features

JWT-based authentication for secure login and registration.
CRUD operations for books and reviews with protected routes.
Filter books by author, genre, or minimum rating.
Server-side pagination using totalCount for efficiency.
Material UI for a modern, mobile-friendly interface.
Automatic average rating calculation for books.
Rating validation (1–5 stars).
Supports local MongoDB or MongoDB Atlas.

Project Structure
book-review-platform/
├── backend/                    # Server-side code
│   ├── config/                 # Database and env setup
│   ├── middleware/             # Authentication middleware
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API endpoints
│   ├── server.js               # Express server
│   └── package.json            # Backend dependencies
│
├── frontend/                   # React frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── pages/              # Page components
│   │   ├── config.js           # API URL config
│   │   ├── App.js              # Main React app
│   │   └── index.js            # React entry
│   └── package.json            # Frontend dependencies
│
├── package.json                # Root package for scripts
├── README.md                   # Documentation
└── .env.example                # Env variable template

Setup Instructions
1. Clone the Repository
git clone https://github.com/<your-username>/book-review-platform.git
cd book-review-platform

2. Install Dependencies
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install

3. Create .env Files
Backend (backend/.env):
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bookReviewDB
JWT_SECRET=your-secret-key

Frontend (frontend/.env):
REACT_APP_API_BASE_URL=http://localhost:5000/api

4. Run the Application
npm run dev

This starts:

Backend: http://localhost:5000
Frontend: http://localhost:3000

Design Decisions
Tech Stack

MERN: JavaScript-based for streamlined development.
MongoDB/Mongoose: Flexible schema-based data modeling.
Express.js: Lightweight API framework.
React/Material UI: Responsive, accessible UI.
Node.js: Unified backend runtime.

Authentication

JWT: Stored in localStorage for stateless authentication.

State Management

React state with Axios: Simple for this scope; Redux possible for future.

Pagination & Filtering

Backend pagination: Uses totalCount for performance.
Query-based filtering: Server-side processing of author, genre, and rating.

Styling

Material UI: Customizable, accessible components.

Why These Choices?

MERN enables fast, scalable development.
JWT simplifies secure API authentication.
Material UI ensures a polished UI.
Backend pagination/filtering optimizes performance.

Current Limitations

No role-based access (e.g., admin roles).
Basic error handling; needs advanced logging.
Integer-only ratings (1–5 stars).
No book cover image uploads.
Local React state may need Redux for scaling.
Security: Restrict MongoDB access in production.

