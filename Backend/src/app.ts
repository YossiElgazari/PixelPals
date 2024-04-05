import express, { Request, Response } from 'express';
import connectDB from './config/db'; // Assuming db.ts exports connectDB as default
import userRoutes from './routes/userRoutes'; // Ensure userRoutes.ts exports default router

connectDB();

const app = express();
const port: number | string = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', userRoutes);

app.get('/', (req: Request, res: Response): void => {
    res.send('Hello, PixelPals!');
});

app.listen(port, (): void => {
  console.log(`Server is running on port ${port}`);
});
