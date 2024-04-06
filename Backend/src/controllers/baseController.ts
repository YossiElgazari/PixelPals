import { Request, Response } from "express";
import mongoose, { Document } from "mongoose";

interface ModelInterface extends Document {}

class BaseController<ModelType extends ModelInterface> {
  model: mongoose.Model<ModelType>;

  constructor(model: mongoose.Model<ModelType>) {
    this.model = model;
  }

  async get(req: Request, res: Response) {
    try {
      let query = {};
      if (req.params.id) {
        query = { _id: req.params.id };
      } else if (req.query.userId) {
        query = { userId: req.query.userId };
      }
      const result = await this.model.find(query).populate('userId');
      res.status(200).json(result);
    } catch (err) {
      this.handleServerError(res, err);
    }
  }

  async post(req: Request, res: Response) {
    try {
      const newDocument = new this.model({ ...req.body, userId: req.user._id });
      const savedDocument = await newDocument.save();
      res.status(201).json(savedDocument);
    } catch (err) {
      this.handleServerError(res, err);
    }
  }

  async put(req: Request, res: Response) {
    try {
      const updatedDocument = await this.model.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true }
      );
      if (!updatedDocument) {
        return res.status(404).json({ message: "Post not found or unauthorized" });
      }
      res.status(200).json(updatedDocument);
    } catch (err) {
      this.handleServerError(res, err);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deletedDocument = await this.model.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
      if (!deletedDocument) {
        return res.status(404).json({ message: "Post not found or unauthorized" });
      }
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      this.handleServerError(res, err);
    }
  }

  private handleServerError(res: Response, err: Error) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default BaseController;
