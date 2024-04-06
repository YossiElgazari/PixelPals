import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/posts', (req: Request, res: Response) => {
    // Handle the post request here
    // You can access the request body using req.body
    // You can send a response using res.send() or res.json()

    // Example: Create a new post
    const { title, content } = req.body;
    const newPost = {
        title,
        content,
        createdAt: new Date(),
    };

    // Send a response with the new post
    res.json(newPost);
});

export default router;