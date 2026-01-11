# Task Tractor Server

A Node.js backend server built with Express, MongoDB, and Mongoose.

## Features

- Express.js web framework
- MongoDB database with Mongoose ODM
- CORS enabled for cross-origin requests
- Nodemon for development hot-reloading
- RESTful API structure
- Error handling middleware

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/task-tractor
USER_PROFILE_UPLOAD_PATH=uploads/user_profile
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (for sending welcome emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@taskmanager.com
```

## Running the Server

### Development mode (with nodemon):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get a single department
- `POST /api/departments` - Create a new department
- `PUT /api/departments/:id` - Update a department
- `DELETE /api/departments/:id` - Delete a department (soft delete)

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a single user
- `POST /api/users` - Create a new user (requires auth, sends welcome email)
  - Body: `{ email, fullName, departmentId }`
  - Auth: Required (Bearer token)
  - Created by: Extracted from JWT token
- `PUT /api/users/:id` - Update a user (with profile image upload)
- `DELETE /api/users/:id` - Delete a user (soft delete)

### Authentication
- `POST /api/auth/login` - User login (returns access_token and refresh_token)
- `POST /api/auth/logout` - Logout user (invalidate tokens)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `PUT /api/auth/change-password` - Change password (requires auth)

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── db.js           # MongoDB connection
│   │   └── multer.js       # Multer configuration for file uploads
│   ├── controllers/
│   │   ├── authController.js        # Authentication business logic
│   │   ├── departmentController.js  # Department business logic
│   │   └── userController.js        # User business logic
│   ├── middleware/
│   │   ├── auth.js          # Authentication middleware
│   │   └── errorHandler.js  # Error handling middleware
│   ├── models/
│   │   ├── Department.js    # Department Mongoose model
│   │   └── User.js          # User Mongoose model
│   ├── routes/
│   │   ├── index.js           # Main router
│   │   ├── authRoutes.js      # Authentication routes
│   │   ├── departmentRoutes.js # Department routes
│   │   └── userRoutes.js      # User routes
│   ├── utils/
│   │   ├── email.js         # Email utility
│   │   ├── idGenerator.js   # ID generation utility
│   │   └── jwt.js           # JWT utility
│   ├── app.js                 # Express app configuration
│   └── server.js              # Server entry point
├── uploads/
│   └── user_profile/          # User profile images (created automatically)
├── .env                       # Environment variables (create this)
├── .gitignore
├── package.json
└── README.md
```

