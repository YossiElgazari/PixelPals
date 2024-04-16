import { Response } from "express";
import BaseController from "./baseController";
import { AuthRequest } from "../middleware/authMiddleware";
import Post, { IPost } from "../models/postModel";

class PostController extends BaseController<IPost> {
  constructor() {
    super(Post);
  }


  async getAllPosts(req: AuthRequest, res: Response) {
    try {
      const posts = await this.itemModel.find().populate("owner", "username");

      res.json(posts);
    } catch (error) {
      console.error("Error getting posts:", error);
      res.status(500).json({ message: "An error occurred while getting posts." });
    }
  }

  async getAllUserPosts(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      const posts = await this.itemModel.find({ owner: user._id });

      res.json(posts);
    } catch (error) {
      console.error("Error getting user posts:", error);
      res
        .status(500)
        .json({ message: "An error occurred while getting user posts." });
    }
  }

  async createPost(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      const { content, photo } = req.body;

      // Validate request body
      if (!content) {
        return res.status(400).json({ message: "Content is required." });
      }

      // Create new post with user ID
      const newPost = await this.itemModel.create({
        content,
        photo,
        owner: user._id,
        likes: 0, // Initialize likes to 0
      });

      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      res
        .status(500)
        .json({ message: "An error occurred while creating the post." });
    }
  }

  async deletePost(req: AuthRequest, res: Response) {
    try {
      const { postId } = req.body;

      // Check if post exists
      const post = await this.itemModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }

      // Check if user is authorized to delete post
      if (post.owner.toString() !== req.user._id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Delete post
      await this.itemModel.findByIdAndDelete(postId);
      res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
      console.error("Error deleting post:", error);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the post." });
    }
  }

  async updatePost(req: AuthRequest, res: Response) {
    try {
      const { postId, content, photo } = req.body;

      // Check if post exists
      const post = await this.itemModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }

      // Check if user is authorized to update post
      if (post.owner.toString() !== req.user._id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Update post
      await this.itemModel.findByIdAndUpdate(postId, { content, photo });
      res.status(200).json({ message: "Post updated successfully." });
    } catch (error) {
      console.error("Error updating post:", error);
      res
        .status(500)
        .json({ message: "An error occurred while updating the post." });
    }
  }


  
}

export default new PostController();
