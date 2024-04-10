import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    content: string;
    photo: string;
    owner: string;
    likes: number;
}

const PostSchema: Schema = new Schema({
    content: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: false,
        default: "",
    },
    owner: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
},{ timestamps: true });

export default mongoose.model<IPost>("Post", PostSchema, 'posts');
