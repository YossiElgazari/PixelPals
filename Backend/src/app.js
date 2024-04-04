const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');


connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); 


app.use('/users', userRoutes);


app.get('/', (req, res) => {
    res.send('Hello, PixelPals!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
