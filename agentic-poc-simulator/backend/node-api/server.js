const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// const connectDB = require('./config/db'); // Will be enabled later

// Load env vars
dotenv.config({ path: './config/config.env' });

// Initialize express app
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Connect to database
// connectDB(); // Will be enabled later

// Mount routers
// app.use('/api/v1/poc', require('./routes/poc')); // Placeholder for future routes

app.get('/', (req, res) => {
    res.send('Agentic PoC Simulator API is running...');
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
}); 