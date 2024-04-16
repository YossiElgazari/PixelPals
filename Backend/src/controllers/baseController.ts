import { Request, Response } from "express";
import mongoose from "mongoose";

class BaseController<ModelType extends mongoose.Document> {
    protected itemModel: mongoose.Model<ModelType>;
    private modelName: string;  

    constructor(model: mongoose.Model<ModelType>) {
        this.itemModel = model;
        this.modelName = model.modelName;  
    }
    // Get all items
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const items = await this.itemModel.find();
            res.status(200).json(items);
        } catch (error) {
            console.error(`Error getting ${this.modelName}s:`, error);
            res.status(500).json({ message: `Error getting ${this.modelName}s`, error: error.message });
        }
    }

    // Get single item by id
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const item = await this.itemModel.findById(req.params.id);
            if (!item) {
                res.status(404).json({ message: `${this.modelName} not found` });
            } else {
                res.status(200).json(item);
            }
        } catch (error) {
            console.error(`Error getting ${this.modelName} by ID:`, error);
            res.status(500).json({ message: `Error getting ${this.modelName}`, error: error.message });
        }
    }

    // Create a new item
    async create(req: Request, res: Response): Promise<void> {
        try {
            const newItem = await this.itemModel.create(req.body);
            res.status(201).json(newItem);
        } catch (error) {
            console.error(`Error creating ${this.modelName}:`, error);
            res.status(400).json({ message: `Error creating ${this.modelName}`, error: error.message });
        }
    }

    // Update an existing item
    async update(req: Request, res: Response): Promise<void> {
        try {
            const updatedItem = await this.itemModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedItem) {
                res.status(404).json({ message: `${this.modelName} not found` });
            } else {
                res.status(200).json({ message: `${this.modelName} updated successfully`, item: updatedItem });
            }
        } catch (error) {
            console.error(`Error updating ${this.modelName}:`, error);
            res.status(400).json({ message: `Error updating ${this.modelName}`, error: error.message });
        }
    }

    // Delete an item
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const deletedItem = await this.itemModel.findByIdAndDelete(req.params.id);
            if (!deletedItem) {
                res.status(404).json({ message: `${this.modelName} not found` });
            } else {
                res.status(200).json({ message: `${this.modelName} deleted successfully` });
            }
        } catch (error) {
            console.error(`Error deleting ${this.modelName}:`, error);
            res.status(500).json({ message: `Error deleting ${this.modelName}`, error: error.message });
        }
    }
}

export default BaseController;