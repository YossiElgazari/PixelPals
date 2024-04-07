import express from 'express';
import connectDB from './config/db'; 
import userRoutes from './routes/userRoutes'; 
import postRoutes from './routes/postRoutes';

connectDB();

const app = express();
const port: number | string = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', userRoutes);

app.use('/post', postRoutes)

app.listen(port, (): void => {
  console.log(`Server is running on port ${port}`);
});

export default app;