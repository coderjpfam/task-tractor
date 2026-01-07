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

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   └── taskController.js  # Task business logic
│   ├── middleware/
│   │   └── errorHandler.js    # Error handling middleware
│   ├── models/
│   │   └── Task.js            # Task Mongoose model
│   ├── routes/
│   │   ├── index.js           # Main router
│   │   └── taskRoutes.js      # Task routes
│   ├── app.js                 # Express app configuration
│   └── server.js              # Server entry point
├── .env                       # Environment variables (create this)
├── .gitignore
├── package.json
└── README.md
```

## Example Task Object

```json
{
  "title": "Complete project",
  "description": "Finish the task tractor project",
  "completed": false,
  "priority": "high"
}
```

