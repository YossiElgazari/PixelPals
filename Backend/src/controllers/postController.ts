import { Response } from "express";
import BaseController from "./baseController";
import { AuthRequest } from "../middleware/authMiddleware";
import Post, { IPost } from "../models/postModel";

class PostController extends BaseController<IPost> {
  constructor() {
    super(Post); // Pass the Post model to the BaseController
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const postId = req.params.id;
      await this.itemModel.findByIdAndUpdate(postId, req.body, {
        new: true,
      });
      res.status(200).json({ message: "Post updated successfully" });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Error updating post", error: error.message });
    }
  
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const post = new this.itemModel({
        ...req.body,
        owner: req.user._id,
      });
      const result = await post.save();
      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Error creating post", error: error.message });
    }
  }


  async likePost(req: AuthRequest, res: Response): Promise<void> {
    try {
      const postId = req.params.id;
      const result = await this.itemModel.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      );

      if (!result) {
        res.status(404).json({ message: "Post not found" });
      }
      console.log("RESULLTTTTTTTTTTTTTTTTTTTTT\n", result)

      res.status(200).json({ message: "Post liked successfully", post: result });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ message: "Error liking post", error: error.message });
    }
  }

  async unlikePost(req: AuthRequest, res: Response): Promise<void> {
    try {
      const postId = req.params.id;
      const result = await this.itemModel.findByIdAndUpdate(
        postId,
        { $pull: { likes: req.user._id } },
        { new: true }
      );

      if (!result) {
        res.status(404).json({ message: "Post not found" });
      }

      res.status(200).json({ message: "Post unliked successfully", post: result });
    } catch (error) {
      console.error("Error unliking post:", error);
      res.status(500).json({ message: "Error unliking post", error: error.message });
    }
  }

  async getAllUserPosts(req: AuthRequest, res: Response): Promise<void> {
    try {
      const posts = await this.itemModel.find({ owner: req.user._id });
      res.status(200).json(posts);
    } catch (error) {
      console.error("Error getting user posts:", error);
      res
        .status(500)
        .json({ message: "Error getting user posts", error: error.message });
    }
  }
}

export default new PostController();
