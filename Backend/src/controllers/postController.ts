import { Response } from "express";
import BaseController from "./baseController";
import { AuthRequest } from "./userController";
import Post, { IPost } from "../models/postModel";

class PostController extends BaseController<IPost> {
    constructor() {
        super(Post);
    }

    async createPost(req: AuthRequest, res: Response) {
        try {
            const { user } = req;
            const { content, photo } = req.body;

            // Validate request body
            if (!content || !photo) {
                return res.status(400).json({ message: "Content and photo are required." });
            }

            // Create new post with user ID
            const newPost = await this.model.create({
                content,
                photo,
                owner: user._id,
                likes: 0, // Initialize likes to 0
            });

            res.status(201).json(newPost);
        } catch (error) {
            console.error("Error creating post:", error);
            res.status(500).json({ message: "An error occurred while creating the post." });
        }
    }

    async likePost(req: AuthRequest, res: Response) {
        try {
            const { postId } = req.params;

            // Find the post by ID and increment likes
            const updatedPost = await this.model.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true });

            if (!updatedPost) {
                return res.status(404).json({ message: "Post not found." });
            }

            res.status(200).json({ likes: updatedPost.likes });
        } catch (error) {
            console.error("Error liking post:", error);
            res.status(500).json({ message: "An error occurred while liking the post." });
        }
    }
}

export default new PostController();
