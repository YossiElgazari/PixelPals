import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    content: string;
    photo: string;
    owner: string;
    likes: number; // Number of likes
}

const PostSchema: Schema = new Schema({
    content: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0, // Default value of likes is 0
    },
});

export default mongoose.model<IPost>("Post", PostSchema);
