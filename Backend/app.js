const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables; handle potential error
const env = dotenv.config();
if (env.error) {
    throw new Error("Failed to load the .env file");
}

const port = process.env.PORT || 3000; // Fallback to default port if not specified
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('Connected to DB'))
    .catch(err => console.error("Could not connect to DB", err));

// Define a route
app.get('/', (req, res) => {
    res.send('Hello, world!!!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
