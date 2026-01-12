import app from './app.js';
import connectDB from './config/db.js';
import { initDefaultData } from './utils/initDefaultData.js';

const PORT = process.env.PORT || 5000;

// Connect to database and initialize default data
const startServer = async () => {
  try {
    await connectDB();
    
    // Initialize default department and user
    await initDefaultData();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

